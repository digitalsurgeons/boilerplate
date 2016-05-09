/**
 * Gulp - Browserify
 * -----------------
 */

// run all JS pages files through browserify, concat, uglify and save to dist
var config = require('../config'),
	gulp = require('gulp'),
	browserify = require('browserify'),
	transform = require('vinyl-transform'),
	notify = require('gulp-notify'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	util = require('gulp-util'),
	gulpif = require('gulp-if');

module.exports = function() {
	// handle browseirfying bundle
	var browserified = transform(function(filename) {
		var b = browserify({
			entries: filename,
			debug: true
		});
		return b.bundle();
	});

	//run jshint if useing --hint flag
	var useHint = util.env.hint ? true : false;
	if (useHint) {
		gulp.run('eslint');
	}

	//check if we need to uglify
	//run uglify if useing --prod flag
	var doUglify = util.env.prod ? true : false;

	// pipe all JS pages files through browserify, uglify and save to dist
	gulp.src([config.paths.src + '/js/pages/*.js'])
		.pipe(browserified).on('error', util.log)
		.on('error', function(error) {
			if (process.env.IS_CI === '1') {
				console.log('CI Evn: Exiting With -1');
				process.exit(-1);
			}
		})
		.pipe(sourcemaps.init({
			loadMaps: true
		}))
		.pipe(gulpif(doUglify, uglify({
			warnings: false
		})))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest(config.paths.dist + '/js'));

};
