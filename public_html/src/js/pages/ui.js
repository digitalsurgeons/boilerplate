(function() {

	'use strict';

	// require global libraries
	require('../../../bower_components/toggles-switches/toggles-switches');

	// require modules
	var $ = require('jquery'),
		templates = require('../../../dist/js/templates'),

		// require lodash functions
		_ = {
			forEachRight: require('lodash/collection/forEachRight')
		},

		// require components
		Picker = require('../components/picker');

	// document ready
	$(function() {

		// pickers example
		var pickers = [];
		$('[data-picker]').each(function() {
			pickers.push(new Picker($(this)));
		});

		// Handlebars example
		var tmpl = templates.example({
			list: [
				{item: 'Item 1'},
				{item: 'Item 2'},
				{item: 'Item 3'}
			]
		});

		$('[data-handlebars]').append(tmpl);

		// LoDash example
		var str = '';
		_.forEachRight(['Boilerplate', 'DS', 'to', 'Welcome'], function(item) {
			str += item + ' ';
		});

		console.log(str.slice(0, -1) + '...');
	});
})();
