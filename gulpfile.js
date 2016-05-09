/**
* Gulpfile
* --------
* Here are the commands you can run.
* gulp
* gulp --maps
* gulp --ugly
* gulp --hint
* gulp jshint
* gulp jshint --ugly
* gulp browserify
* gulp browserify --hint
* gulp browserify --ugly
* gulp handlebars
* gulp polyfill
* gulp polyfill --ugly
* gulp sass
* gulp sass --maps
* gulp watch (The first time you run, you'll be asked for your virtual host name)
* gulp watch --ugly
* gulp watch --hint
* gulp watch --maps
*/

// pass 2 arrays to the task generator in ./gulp/index.js
// 1st argument is an array of task names to load into memory, and
// 2nd argument is an array of task names to run by default

var gulp = require('./gulp')([
    'eslint',
    'browserify',
    'handlebars',
    'polyfill',
	'scss-lint',
	'sass',
    'watch'/* ,
    'ftp-deploy'*/
], [
	'eslint',
    'browserify',
    'handlebars',
    'polyfill',
	'scss-lint',
	'sass'
]);
