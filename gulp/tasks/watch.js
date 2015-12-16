/**
 * Gulp - Watch
 * -----------------
 */

//watch for sass/js changes and run appropriate tasks
var config = require('../config'),
	gulp = require('gulp'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	util = require('gulp-util'),
	gulpif = require('gulp-if'),
	fs = require('fs'),
	prompt = require('gulp-prompt'),
	needsPrompt = false,
	filename = 'gulp/.vhost';

function _watchFiles() {
	gulp.watch(config.paths.src + '/scss/**/*.scss', ['scss-lint', 'sass']);
	gulp.watch(config.paths.src + '/js/**/*.js', ['jshint', 'handlebars', 'browserify']);

	gulp.watch([
		config.paths.dist + '/css/**/*.css'
    ]).on('change', function(file) {
		gulp.src(file.path)
			.pipe(reload({
				stream: true
			}));
	});

	gulp.watch([
		config.paths.dist + '/js/**/*.js',
		config.paths.documentRoot + '/*.html'
	]).on('change', reload);
}

function _startBrowserSync() {
	//read vhost file here
	fs.readFile(filename, 'utf8', function(err, data) {
		if (err) {
			throw err;
		}

		//start a browsersync session using the data of gulp/.vhost
		browserSync({
			proxy: data
		});
	});
}

module.exports = function() {
	//does our vhost exist
	//check if gulp/.vhost has been created
	fs.exists(filename, function(exists) {
		if (!exists) {
			//prompt
			needsPrompt = true;
			gulp.src('gulpfile.js').pipe(prompt.prompt({
				name: 'vhost',
				message: 'Please enter your vhost name'
			}, function(res) {
				fs.writeFile(filename, res.vhost);
				console.log('Virtual Host Set: ' + res.vhost);
				_startBrowserSync();
				_watchFiles();
			}));
		} else {
			_startBrowserSync();
			_watchFiles();
		}
	});
};
