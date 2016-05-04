var config = require('../config'),
	gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	concat = require('concat-stream'),
	minimist = require('minimist'),
	fromString = require('from2-string'),
	Client = require('ssh2').Client;

var state = {
	filesRemaining: 0,
	sftp: null,
	hash: {
		production: '',
		local: ''
	}
}

var argv = minimist(process.argv.slice(2), {
	alias: {
		h: 'host',
		p: 'port',
		u: 'username',
		'pass': 'password'
	}
});

function ftpDeployTask() {
	var conn = new Client();
	conn.on('ready', function() {
		conn.sftp(sftpConnected);
	}).connect({
		host: argv.host,
		port: argv.port,
		username: argv.username,
		password: argv.password
	});
}

function sftpConnected(err, sftp) {
	if (err) throw err;
	state.sftp = sftp;
	var stream = sftp.createReadStream('.revision');
	stream.on('error', function (err) {
		console.log('no .revision file found, creating one for you')
		handleRevision(null)
	})
	stream.pipe(concat(handleRevision));
}

function handleRevision(buf) {
	state.hash.production = buf.toString();
	var localCommit = spawn('git', ['rev-parse', 'HEAD']);
	localCommit.stdout.pipe(concat(compareHashes));
}

function compareHashes (buf) {
	var hash = buf.toString();
	state.hash.local = hash;
	if (state.hash.local !== state.hash.production) {
		  var diff = 'git diff --name-status ' +
		  	state.hash.production + ' ' + hash;
		  exec(diff, sftpDiffedFiles);
	}
}

function sftpDiffedFiles(err, stdout, stderr) {
	var files = stdout.split('\n');
	files.pop();
	state.filesRemaining = files.length;
	files.forEach(getFileStat);
}

function getFileStat(stat) {
	var file = stat.split('\t')[1];
	var status = stat.split('\t')[0];
	if (status !== 'D') {
		if (file.indexOf('/') >= -1) {
			var dir = path.dirname(file);
			var i = 0;
			var parents = dir.split('/');
			var parent = parents[i];
			sftpMkdirp(dir, parents, parent, file, i);
		} else {
			sftpFile(file);
		}
	}
}

function sftpMkdirp(dir, parents, currentParent, file, index) {
	state.sftp.opendir(dir, function (err, buf) {
		if (err) {
		    // parent(s) don't exist
			state.sftp.mkdir(currentParent, function (err) {
				if (err) console.error(err);
				index++;
				currentParent += '/' + parents[index];
				sftpMkdirp(dir, parents, currentParent, file, index);
			})
		} else sftpFile(file);
	})
}

function sftpFile(file) {
	var rs = fs.createReadStream(file);
	var ws = state.sftp.createWriteStream(file);
	rs.pipe(ws);
	ws.on('finish', function() {
		console.log(file, 'is sftp\'d!');
		state.filesRemaining--;
		if (!state.filesRemaining) {
			fromString(state.hash.production)
				.pipe(state.sftp.createWriteStream('.revision-old'))
			fromString(state.hash.local)
				.pipe(state.sftp.createWriteStream('.revision'))
			console.log('.revision updated:', state.hash.local)
		}
	})
}

gulp.task('deploy', ftpDeployTask);
module.exports = ftpDeployTask;
