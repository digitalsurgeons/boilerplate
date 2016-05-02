var config = require('../config'),
  gulp = require('gulp'),
  fs = require('fs'),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec,
  concat = require('concat-stream'),
  minimist = require('minimist'),
  Client = require('ssh2').Client;

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
  var stream = sftp.createReadStream('.revision');
  stream.pipe(concat(readRevision));
}

function readRevision(buf) {
  var body = buf.toString();
  var remoteCommit = body.split('commit ')[1].split('\n')[0];
  var localCommit = spawn('git', ['rev-parse', 'HEAD']);
  localCommit.stdout.pipe(concat(function (buf) {
    var hash = buf.toString();
    if (hash !== remoteCommit) {
      var diff = 'git diff --name-status ' + remoteCommit + ' ' + hash;
      exec(diff, function (err, stdout, stderr) {
        var files = stdout.split('\n');
        files.pop();
        files.forEach(sftpFile);
      });
    }    
  }));
}

function sftpFile(stat) {
  var file = stat.split('\t')[1];
  var status = stat.split('\t')[0];
  if (status !== 'D') { 
    var rs = fs.createReadStream(file);
    var ws = sftp.createWriteStream(file);
    rs.pipe(ws);
    ws.on('finish', function () {
      console.log(file, 'is sftp\'d!');
    })
  }
}


gulp.task( 'deploy', ftpDeployTask);
module.exports = ftpDeployTask;
