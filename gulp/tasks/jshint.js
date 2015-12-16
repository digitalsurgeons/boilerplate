/**
 * Gulp - JSHint
 * -------------
 */

var gulp = require('gulp'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	stylish = require('gulp-jscs-stylish'),
	config = require('../config');

module.exports = function() {
	gulp.src([config.paths.src + '/js/**/*.js'])
        .pipe(jshint())
        .pipe(jscs())
        .on('error', function() {})
        .pipe(stylish.combineWithHintResults())
        .pipe(jshint.reporter('jshint-stylish'));
};
