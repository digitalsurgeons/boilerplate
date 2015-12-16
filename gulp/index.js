/**
* Gulp - Task Generator
* ---------------------
*/

// require gulp and dynamically build each task for tasks[].
// Each iterator of the tasks[] array will be the name of task and the module
// matching it's name will be that task's callback.
//
// Not all tasks should run by default so we pass in a second array called autoRun
// containing the tasks we want to run by default

module.exports = function(tasks, autoRun) {
	var gulp = require('gulp');

	// loop through array and generate tasks
	tasks.forEach(function(name) {
		// create task using iteration of array for name and task file
		gulp.task(name, require('./tasks/' + name));
	});

	// create default task to autoRun
	gulp.task('default', autoRun);
};
