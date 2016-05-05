var config = require('../config'),
	gulp = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec,
	concat = require('concat-stream'),
	minimist = require('minimist'),
	fromString = require('from2-string'),
	recursive = require('recursive-readdir'),
	Client = require('ssh2').Client;

var state = {
	filesRemaining: 0,
	sftp: null,
	hash: {
		production: '',
		local: ''
	},
	includes: []
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
		console.log('SFTP CLIENT :: CONNECTED')
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
	stream.on('error', handleNoRevision)
	stream.pipe(concat(handleRevision));
	var includes = argv.include.split(',');
	includes.forEach(handleIncludes)

}

function handleNoRevision (err) {
	console.log('no .revision file found, creating one for you and sftp-ing all the files')
	recursive('public_html', ['.git', 'node_modules'], function (err, files) {
		state.filesRemaining += files.length
		var localCommit = spawn('git', ['rev-parse', 'HEAD']);
		localCommit.stdout.on('data', function (buf) {
			var hash = buf.toString();
			state.hash.local = hash;
			console.log('hash', hash)
			files.forEach(ignoreOrSftp);
		});
	});
}

function handleIncludes (file) {
	if (file.indexOf('/') >= 0) {
		var dir = file.split('/')[1]
		var i = 0;
		var parents = dir.split('/');
		var parent = parents[i];
		recursive(dir, function (err, files) {
			if (err) console.error(err)
			state.filesRemaining += files.length
			files.forEach(function (file) {
				state.includes.push(file);
				sftpMkdirp(dir, parents, parent, file, i, function () {
					ignoreOrSftp(file);
				});
			});
		});
	} else {
		state.includes.push(file)
		state.filesRemaining++
		sftpFile(file);
	}
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
	state.filesRemaining += files.length;
	files.forEach(getFileStat);
}

function getFileStat(stat) {
	var file = stat.split('\t')[1];
	var status = stat.split('\t')[0];
	if (status !== 'D') {
		checkIfDir(file)
	}
}

function sftpMkdirp(dir, parents, currentParent, file, index, cb) {
	var hasPublicHtml = parents.indexOf('public_html') === 0;
	if (hasPublicHtml) {
		parents.shift();
		currentParent = parents[0];
		dir = dir.replace('public_html/','');
	}

	state.sftp.opendir(dir, function (err, buf) {
		if (err) {
		    // parent(s) don't exist
			state.sftp.mkdir(currentParent, function (err) {
				if (err) console.error(err);
				index++;
				currentParent += '/' + parents[index];
				sftpMkdirp(dir, parents, currentParent, file, index);
			})
		} else {
			if (cb) {
				cb();
			} else sftpFile(file);
		}
	})
}

function sftpFile(file) {
	if (file.indexOf('node_modules') >= 0 || file.indexOf('.git') >= 0) {
		return;
	}
	var isInPublicHtml = file.indexOf('public_html') >= 0
	var isInIncludes = argv.include && state.includes.indexOf(file) >= 0
	if (isInPublicHtml || isInIncludes) {
		var destFile = isInPublicHtml
			? file.replace('public_html/', '')
			: file

		var rs = fs.createReadStream(file);
		var ws = state.sftp.createWriteStream(destFile);
		rs.pipe(ws);
		ws.on('finish', function() {
			console.log(destFile, 'is sftp\'d!');
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
}

function checkIfDir(file) {
	if (file.indexOf('/') >= 0) {
		var dir = path.dirname(file);
		var i = 0;
		var parents = dir.split('/');
		var parent = parents[i];
		sftpMkdirp(dir, parents, parent, file, i);
	} else {
		sftpFile(file);
	}
}

function ignoreOrSftp(file) {
	if (file.indexOf('.git') >= 0 || file.indexOf('node_modules') >= 0) {
		console.log('skipping', file);
		return;
	} else {
		checkIfDir(file);
	}
}

gulp.task('deploy', ftpDeployTask);
module.exports = ftpDeployTask;
