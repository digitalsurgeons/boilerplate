## Transitions and Animations. IE 10+
### components/animation/_animation.scss
---
This component uses the `transition` property. [More about transitions](https://css-tricks.com/almanac/properties/t/transition/).


Your typical transition:

<pre>
.movie-title {
	@include transition(1s);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

Change this to:
<pre>//SCSS

.movie-title {
	@include feel();
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

This component enables developers to manage the overall feel of all the animations on the page.

As a developer you have 4 options for easing curves `linear`, `ease`, `ease-in`, and `ease-out`. In order for you to customize it have to define a `cubic-bezier` easing curve.

<pre>@include transition(1s cubic-bezier(0.455, 0.030, 0.515, 0.955));</pre>

But how are you supposed to know what that animaiton curve looks like.



###No one should have to memorize `cubic-bezier` curves.
Robert Penner wrote a set of easing formuals long ago and this library uses them as variables. Anywhere you'd use your own `cubic-bezier` curve you can use one these variables instead: `$easeInQuad`, `$easeInCubic`, `$easeInQuart`, `$easeInQuint`, `$easeInSine`, `$easeInExpo`, `$easeInCirc`, `$easeInBack`, `$easeOutQuad`, `$easeOutCubic`, `$easeOutQuart`, `$easeOutQuint`, `$easeOutSine`, `$easeOutExpo`, `$easeOutCirc`, `$easeOutBack`, `$easeInOutQuad`, `$easeInOutCubic`, `$easeInOutQuart`, `$easeInOutQuint`, `$easeInOutSine`, `$easeInOutExpo`, `$easeInOutCirc`, and `$easeInOutBack`. [Here are the visual demos](http://easings.net) of the different easing curves.

<pre>
.movie-title {
	@include feel($easeOutQuad);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>


###Actually using the library
Even if you use the shortcuts covered so far you will probably get frustrated if the client ask you to make all the animations across their site "feel" less harsh. Until now it has involved replacing all your cubic-beziers and durations.

Not anymore. Replace `@include transition();` with `@include feel();`

<pre>//SCSS

.movie-title {
	@include feel();
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

Global default settings are inside of `public_html/src/scss/utils/_settings.scss`.
<pre>
// Transitions and Animations
// available feel types: 'confident', 'bouncy', 'strong', 'selective', and 'lazy'
$animation-feel: 'lazy';
$animation-timescale: 1;
</pre>


This powers every element that uses the `feel()` mixin.

`'confident'` - An ease in and out with a narrow curve that replicates a confident head nod. 

`'bouncy'` - An ease out with a soft overshoot and a sharp snap back. 

`'strong'` A sturdy animation style with a length greater than confident but with a wider curve that replicates a weight lift.

`'selective'` - An ease out that's very quick duration and a very narrow ease curve making it idea for hover states. 

`'lazy'` - A feeling with a long duration and curves that are as soft as you can make them.

###Customization
By default the `feel();` mixin will animate every property of the element on which it is used. If you want to specify them, use the following syntax.
<pre>// SCSS

.movie-title {
	@include feel() {
		@include transition-property(opacity);
	}
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

Anything that goes in your `content` block will overwrite the affects of the `feel()` mixin.

If you want to use a specific easing formula, you can send it as the first argument to the feel() mixin. And, likewise, if you want a custom duration, you can pass it as the second argument.
			
<pre>//SCSS

.movie-title {
	@include feel($easeOutQuint, 450ms);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

If you dont want to change the easing formula but you do want to change the duration use the same technique.</p>

<pre>//SCSS

.movie-title {
	@include feel(450ms);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>
The default `$animation-feel` will be used, but it the duration will come from here.


##Built in Animations
###with @keyframes IE10+
---
You can use any of the following built in animations to add effects to the content on your page. Since they are built on top of the easing and transition set by $animation-feel. Their 'feel' is editable too.
			
<pre>//SCSS

.movie-title {
	opacity: 0;
	&.is-showing {
		@include fadeIn();
	}
}</pre>

The built in options are `fadeIn()`, `fadeInUp()`, `fadeInRight()`, `fadeInDown()`, `fadeInLeft()`, `fadeOut()`, `fadeOutUp()`, `fadeOutRight()`, `fadeOutDown()`, `fadeOutLeft()`, `slideInUp()`, `slideInRight()`, `slideInDown()`, `slideInLeft()`, `slideOutUp()`, `slideOutRight()`, `slideOutDown()`, `slideOutLeft()`, `zoomIn()`, `zoomInShrink()`, `zoomOut()`, `zoomOutGrow()`, `bounce()`, `flash()`, `pulse()`, `shake()`, and `wobble()`. [Examples of each of these](/ui.html) are illustrated inside of [ui.html](/ui.html).

