var config = require('../config'),
	gulp = require('gulp'),
	fs = require('graceful-fs'),
	path = require('path'),
	spawn = require('child_process').execFileSync,
	exec = require('child_process').exec,
	concat = require('concat-stream'),
	minimist = require('minimist'),
	fromString = require('from2-string'),
	recursive = require('recursive-readdir'),
	Client = require('ssh2').Client;

var state = {
	filesRemaining: 0,
	sftp: null,
	doneCb: null,
	localRoot: null,
	hash: {
		production: '',
		local: ''
	},
	files: []
}

var argv = minimist(process.argv.slice(2), {
	alias: {
		h: 'host',
		p: 'port',
		u: 'username',
		r: 'root',
		'pass': 'password'
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

	// Try and read the revison file from the server
	var stream = sftp.createReadStream('.revision');

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

// Last step done before trying to upload stuff!
function collectFiles() {

	console.log('going to collect files now...');

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

	// We don't have a revision from the server, so collect all the files
	if (state.hash.production === ''){
		console.log('collecting ALL files to upload...');
		var public_html_files = spawn('find', [
			state.localRoot || '.',
			'-not', '-iwholename', '*.git*',
			'-not', '-iwholename', '*node_modules*',
			'-printf', '%P\n']).toString().split('\n');
		state.files = state.files.concat(public_html_files);
	}

	// Ready to upload files!
	state.filesRemaining = state.files.length;
	console.log('about to deploy [' + state.filesRemaining  + '] files!');

	state.files.forEach(sftpFile);
}

function handleRevision(buf) {
	// Save the remote hash
	state.hash.production = buf.toString().trim();

	var localCommit = spawn('git', ['rev-parse', 'HEAD']);
	state.hash.local = localCommit.toString().trim();

	console.log(state.hash.local + ' :: ' + state.hash.production);

	// Do the hashes match?
	if (state.hash.local !== state.hash.remote) {
		// They don't so we need to run a diff and find out which files changed
		console.log('local hash does not match remote hash, deploying changed files');
		var results = spawn('git', ['diff', '--name-status', state.hash.production, state.hash.local]).toString();
		console.log(results);
		results.split('\n').forEach(function(compare){
			// Check the git status of the file

			var fileRet = getFileStat(compare);

			// Toss it into the file array if it needs to be uploaded
			if (fileRet !== undefined) {
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

function getFileStat(stat) {
	// Checks if a git diff line is a delete line
	// if so, ignore this file, don't touch it!
	var file = stat.split('\t')[1];
	var status = stat.split('\t')[0];
	if (status !== 'D') {
		return file;
	}

	return null;
}

function sftpFile(file) {

	// If we get no file, an empty path, or a directory. Ignore.
	if (!file || file == '' || fs.lstatSync(file).isDirectory())
	{
		return;
	}

	var rs = fs.createReadStream(file);
	var destFile = file;

	if (state.localRoot !== undefined)
	{
		// We have a specified root, trim from the destination
		destFile = file.replace(state.localRoot, '');
	}

	var ws = state.sftp.createWriteStream(file);

	rs.pipe(ws);
	ws.on('finish', function() {
		state.filesRemaining--;

		// Let them know we uploaded the file
		console.log(file + ' -> ' + destFile);
		// No more files to upload?
		if (!state.filesRemaining) {
			// Update the hash on the server
			fromString(state.hash.production)
				.pipe(state.sftp.createWriteStream('.revision-old'))
			fromString(state.hash.local)
				.pipe(state.sftp.createWriteStream('.revision'))
			console.log('.revision updated:', state.hash.local);

			// Tell Gulp we are all done
			state.doneCb();
		}
	});
}

gulp.task('deploy', ftpDeployTask);
module.exports = ftpDeployTask;
