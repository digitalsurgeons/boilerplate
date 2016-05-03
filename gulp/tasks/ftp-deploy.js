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
	files: [],
	file: '',
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
		console.error(err)
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
	state.files = files;
	state.filesRemaining = files.length;
	files.forEach(sftpFile);
}

function sftpFile(stat) {
	var file = stat.split('\t')[1];
	state.file = file;
	var status = stat.split('\t')[0];
	if (status !== 'D') {
		if (file.indexOf('/') >= -1) {
			var dir = path.dirname(file);
			var i = 0;
			var parents = dir.split('/');
			var parent = parents[i];
			sftpMkdirp(dir, parents, parent, i);
		} else {
			sftpFile(file);
		}
	}
}

function sftpMkdirp(dir, parents, currentParent, index) {
	sftp.opendir(dir, function (err, buf) {
		if (err) {
		    // parent(s) don't exist
			sftp.mkdir(currentParent, function (err) {
				if (err) console.error(err);
				index++;
				currentParent += '/' + parents[i];
				sftpMkdirp(dir, parents, currentParent, index);
			})
		} else sftpFile(state.file);
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
			fromString(remoteCommit)
				.pipe(state.sftp.createWriteStream('.revision-old'))
			fromString(hash)
				.pipe(state.sftp.createWriteStream('.revision'))
			console.log('.revision updated:', hash)
		}
	})
}

gulp.task('deploy', ftpDeployTask);
module.exports = ftpDeployTask;
