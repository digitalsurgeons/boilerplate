var config = require('../config'),
	gulp   = require('gulp'),
	util   = require('gulp-util'),
	ftp	= require( 'vinyl-ftp' );

function retrieveFilesNewerThanRevision() {

}


function ftpDeployTask() {
	var conn = ftp.create({
		host:     'mywebsite.tld',
		user:     'me',
		password: 'mypass',
		parallel: 10,
		log:      util.log
	} );

	var globs = [
		'src/**',
		'css/**',
		'js/**',
		'fonts/**',
		'index.html'
	];



	var newerByRevision = function(localFile, remoteFile, callback) {

		var emit = false;

		// localFile and remoteFile are vinyl files.
		// Check remoteFile.ftp for remote information.
		// Decide wether localFile should be emitted and call callback with boolean.
		// callback is a function( error, emit )

		callback( null, emit );
	}

	// using base = '.' will transfer everything to /public_html correctly
	// turn off buffering in gulp.src for best performance

	return gulp.src(globs, { base: '.', buffer: false })
		.pipe(conn.filter('/public_html', newerByRevision))
		.pipe(conn.dest( '/public_html' ));
}

gulp.task( 'deploy', ftpDeployTask);
