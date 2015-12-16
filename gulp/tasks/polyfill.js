/**
 * Gulp - Pollyfill
 * ----------------
 */

var config = require('../config');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var util = require('gulp-util');
var gulpif = require('gulp-if');

module.exports = function() {
	var doUglify = util.env.ugly ? true : false;

	gulp.src([
		config.paths.bower + '/html5shiv/html5shiv.js',
		config.paths.bower + '/matchmedia/matchmedia.js',
		config.paths.bower + '/respond/dest/respond.min.js'
	])
	.pipe(gulpif(doUglify, uglify()))
	.pipe(concat('polyfill.js'))
	.pipe(gulp.dest(config.paths.dist + '/js/'));
};
