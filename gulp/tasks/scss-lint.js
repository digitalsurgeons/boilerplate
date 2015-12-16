/**
 * Gulp - SCSS Lint
 * ----------------
 */

var gulp = require('gulp'),
	scssLint = require('gulp-scss-lint'),
	config = require('../config');

module.exports = function() {
	gulp.src([config.paths.sassSourceRoot + '/**/*.scss'])
		.pipe(scssLint({
			config: '.scss-lint.yml'
		}))
		.on('error', function() {});
};
