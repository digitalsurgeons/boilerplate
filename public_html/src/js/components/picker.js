module.exports = (function() {

	'use strict';

	var $ = require('jquery');

	function Picker($el) {

		this.$el = $el;

		// wrapping element required
		if (!this.$el) {
			console.error('Wrapping element must exist');
			return false;
		}

		// cache DOM nodes
		this.$label = this.$el.find('[data-picker-label]');
		this.default = this.$label.html();
		this.$select = this.$el.find('select');
		this.$options = this.$select.children('option');
		this.callback = false;

		// select element required
		if (!this.$select) {
			return false;
		}

		// fetch values if set on load
		this.value = this.getValue();
		this.text = this.getText();

		// update values on change
		this.$select.on('change', function(e) {
			updateValue.apply(this);
		}.bind(this));
	}

	// private method to update picker values
	var updateValue = function(noCallback) {
		this.value = this.getValue();
		this.text = this.getText();

		if (this.$label) {
			this.$label.html(this.text);
		}

		// if set call callback
		if (this.callback && !noCallback) {
			this.callback.apply(this);
		}
	};

	// public method for getting value
	Picker.prototype.getValue = function() {
		return this.$select.val();
	};

	// public method for setting value
	Picker.prototype.setValue = function(val) {
		if (!val) {
			return false;
		}

		var $option = this.$options.filter('[value="' + val + '"]');

		if (!$option.length) {
			return false;
		}

		this.reset();
		$option.get(0).selected = true;

		updateValue.apply(this, [true]);
	};

	// public method for getting text label
	Picker.prototype.getText = function() {
		return this.$select.find('option:selected').html();
	};

	// public method for setting text label
	Picker.prototype.setText = function(val) {
		this.$select.find('option:selected').html(val);
	};

	// public method for setting onchange callback
	Picker.prototype.onChange = function(func) {
		if (typeof func !== 'function') {
			return;
		}

		this.callback = func;
	};

	// public method to reset picker to first option
	Picker.prototype.reset = function(text) {
		this.$options.each(function() {
			$(this).attr('selected', false).removeAttr('selected').get(0).selected = false;
		});

		this.$options.first().get(0).selected = true;

		this.$label.html(text || this.default);
	};

	return Picker;

})();
