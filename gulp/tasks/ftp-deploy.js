var config = require('../config'),
	gulp = require('gulp'),
	fs = require('graceful-fs'),
	path = require('path'),
	spawn = require('child_process').execFileSync,
	concat = require('concat-stream'),
	minimist = require('minimist'),
	fromString = require('from2-string'),
	Client = require('ssh2').Client;

var state = {
	filesRemaining: 0,
	sftp: null,
	doneCb: null,
	localRoot: null,
	maxFiles: 1000,
	currentlyUploading: 0,
	hash: {
		production: '',
		local: ''
	},
	files: [],
	backlog: []
}

var argv = minimist(process.argv.slice(2), {
	alias: {
		h: 'host',
		p: 'port',
		u: 'username',
		r: 'root',
		'pass': 'password',
		'local-root': 'root'
	}
});

function ftpDeployTask(taskDoneCb) {

	// Keep this for when we are done uploading stuff
	state.doneCb = taskDoneCb;

	var conn = new Client();
	conn.on('ready', function() {
		conn.sftp(sftpConnected);
	}).connect({
		host: argv.host,
		port: argv.port,
		username: argv.username,
		password: argv.password,
	});
}

function sftpConnected(err, sftp) {
	if (err) throw err;

	console.log('SFTP CLIENT :: CONNECTED')

	state.sftp = sftp;

	// Set the local root, where files will be taken from
	if (argv.root)
	{
		if (argv.root[argv.root.length-1] !== '/')
		{
			throw 'Invalid root path option! Should be formatted like "public_html/"';
			return;
		}
		state.localRoot = argv.root;
	}

	if (argv['upload-all-files-yes-i-am-sure']) {
		console.log('YOU ARE ABOUT TO REDEPLOY ALL FILES');
		handleNoRevision(collectFiles);
		return;
	}

	if (argv.redo) {
		// Force a compare to the old hash (one deployment ago)
		var stream = sftp.createReadStream('.revision-old');
	} else {
		// Try and read the revison file from the server
		var stream = sftp.createReadStream('.revision');
	}

	// We could not open the revision file, assume this is a new server?
	stream.on('error', function(){
		handleNoRevision(collectFiles);
	});

	// Found a revision file, grab the buffer and go!
	stream.on('data', function(buffer){
		handleRevision(buffer);
	});
}

function handleNoRevision(cb) {
	console.log('no .revision file found, creating one for you and sftp-ing all the files');

	// Execute git to get the current hash
	var localCommit = spawn('git', ['rev-parse', 'HEAD']).toString();
	console.log('hash', localCommit);
	state.hash.local = localCommit;

	// We can now just collect our files and upload ALL THE THINGS!
	cb();
}

function handleRevision(buf) {
	// Save the remote hash
	state.hash.production = buf.toString().trim();

	var localCommit = spawn('git', ['rev-parse', 'HEAD']);
	state.hash.local = localCommit.toString().trim();

	console.log(state.hash.local + ' :: ' + state.hash.production);

	// Do the hashes match?
	if (state.hash.local !== state.hash.production) {
		// They don't so we need to run a diff and find out which files changed
		console.log('local hash does not match remote hash, deploying changed files');
		var results = spawn('git', ['diff', '--name-status', state.hash.production, state.hash.local]).toString();
		console.log(results);
		results.split('\n').forEach(function(compare){
			// Check the git status of the file

			var fileRet = getFileStat(compare);

			// Toss it into the file array if it needs to be uploaded
			if (fileRet !== null) {
				// Notify user about the changed file
				console.log('[' + fileRet + '] was modified and will be uploaded');

				// Append this to the files to upload
				state.files.push(fileRet);
			}
		});

		// Collect other files that we may want to upload
		collectFiles();
	} else {
		console.log('local and remote hash matches, no need to deploy');
		process.exit(0);
	}
}


// Last step done before trying to upload stuff!
function collectFiles() {

	console.log('going to collect files now...');

	// We don't have a revision from the server, so collect all the files
	if (state.hash.production === ''){
		console.log('collecting ALL files to upload...');
		var public_html_files = spawn('find', [
			state.localRoot || '.',
			'-not', '-iwholename', '*.git*',
			'-not', '-iwholename', '*node_modules*',
			'!', '-type', 'd',
			'-printf', '%P\n']).toString().split('\n');
		state.files = state.files.concat(public_html_files);

		// Reorder output of `find` so it works with making
		// directories. Deepest child first
		state.files = state.files.reverse();
	}

	// Ready to upload files!
	state.filesRemaining = state.files.length;
	console.log('about to deploy [' + state.filesRemaining  + '] files!');

	ensureDirectories(function(){
		console.log('All directories are ready');

		// Upload!
		state.files.forEach(sftpFile);
	});
}

function getFileStat(stat) {

	// Checks if a git diff line is a delete line
	// if so, ignore this file, don't touch it!
	var file = stat.split('\t')[1];
	var status = stat.split('\t')[0];

	if (file === undefined){
		return null;
	}

	if (status !== 'D') {

		// If we have a root make sure it's inside the root
		if (state.localRoot !== null)
		{
			var paths = file.split('/');
			if((paths[0] + '/') !== state.localRoot)
			{
				return null;
			}

			// Remove the root, because it's relative to the repo root
			file = file.replace(state.localRoot, '');
		}

		return file;
	}

	return null;
}

function ensureDirectories(cb) {
	state.files.forEach(function(file){
		// This will ensure the file has a directory to live in
		var destFile = file;
		if (state.localRoot !== null)
		{
			// We have a specified root, trim from the destination
			destFile = file.replace(state.localRoot, '');
		}

		var dirPath = destFile.substring(0, destFile.lastIndexOf("/"));
		var dirsToMake = dirPath.split('\n');

		sftpMkdirp('', dirsToMake, file);
	});
	cb();
}

function sftpMkdirp(parentPath, directoriesToMake, file) {

	// Finished making the directories, stop and try to upload the file again
	if (directoriesToMake.length == 0)
	{
		// We've made all the directories, we're done
		return;
	}

	// Make the closest parent path
	var newParentPath = parentPath + directoriesToMake[0] + '/';
	console.log('going to try and make directory: ' + newParentPath);
	state.sftp.mkdir(newParentPath, function(err) {
		// Attention should be brought to the fact that we can't make directories
		// Make the next directory
		sftpMkdirp(newParentPath, directoriesToMake.slice(1), file);
	});
}

function pullFromBacklog() {
	if (state.backlog.length <= 0){
		// No more files
		return;
	}

	// Pop off the backlog
	sftpFile(state.backlog.pop());
}

function sftpFile(file) {

	if(!file || file == '')
	{
		// Bad file somewhere in the mix, stop tracking it
		state.filesRemaining--;
		return;
	}

	// Are we uploading a bit too much at one time?
	if (state.currentlyUploading >= state.maxFiles)
	{
		// Put it into the backlog
		state.backlog.push(file);
		return;
	}

	var destFile = file;
	var localFile = file;

	if (state.localRoot !== undefined)
	{
		// Fix local file path
		localFile = state.localRoot + file;

		// We have a specified root, trim from the destination
		destFile = localFile.replace(state.localRoot, '');
	}

	var rs = fs.createReadStream(localFile);
	var ws = state.sftp.createWriteStream(destFile);

	rs.pipe(ws);

	state.currentlyUploading++;
	console.log('currently uploading: ' + state.currentlyUploading);

	ws.on('error', function(err) {
		// Could not write becuase the directory does not exist
		console.log('ERROR uploading file: ' + destFile);
	});

	ws.on('finish', function() {
		state.filesRemaining--;

		console.log(localFile + ' -> ' + destFile);

		state.currentlyUploading--;
		pullFromBacklog();

		// No more files to upload?
		if (!state.filesRemaining) {
			// Update the hash on the server
			writeRevisionAndQuit();
		}
	});
}

function writeRevisionAndQuit() {
	var writeStreamOld = state.sftp.createWriteStream('.revision-old');
	var writeStream = state.sftp.createWriteStream('.revision');

	fromString(state.hash.production).pipe(writeStreamOld);

	writeStreamOld.on('finish', function() {
		fromString(state.hash.local).pipe(writeStream);
	});

	writeStream.on('finish', function() {
		console.log('exiting');
		process.exit(0);
	});
}

gulp.task('deploy', ftpDeployTask);
module.exports = ftpDeployTask;
