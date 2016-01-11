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
				{ item: 'Item 1' },
				{ item: 'Item 2' },
				{ item: 'Item 3' }
			]
		});

		$('[data-handlebars]').append(tmpl);

		// LoDash example
		var str = '';
		_.forEachRight(['Boilerplate', 'DS', 'to', 'Welcome'], function(item) {
			str += item + ' ';
		});

		console.log(str.slice(0, -1) + '...');

		// Animation Picker Example
		var squareStartClass = $('[data-animation-square]').attr('class');
		$('[data-animation-picker]').on('change', function() {
			//clear class(es)
			$('[data-animation-square]').attr('class', '');

			// every blank line is an empty space
			var fine = 'this will have to work';

			//store selected value
			var selectedMixin = $(this).val();

			var test = 'true';

			//add original class
			$('[data-animation-square]').addClass(squareStartClass);

			//add newly selected class
			$('[data-animation-square]').addClass(selectedMixin);

			//tell the demo code what method was called
			$('[data-animation-type]').html($(this).val());

		});

	});
})();
