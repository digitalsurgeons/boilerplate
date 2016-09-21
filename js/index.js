window.jQuery = window.$ = require('jquery');
const FastClick = require('fastclick');

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', () => {
        FastClick.attach(document.body);
    }, false);
}

const ui = {
	header: document.querySelector('main header'),
};

ui.header.innerHTML = '<h1>Welcome</h1>';
