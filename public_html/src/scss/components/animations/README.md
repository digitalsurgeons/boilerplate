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

To use this library change this to:
<pre>//SCSS

.movie-title {
	@include feel();
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

At this point nothing magical has happened. But think of *transitions* as adding *feeling*. This mixin lets you and your team manage the overall feel of the animations on the page.

###Why Not Transition?

As a CSS developer you have 4 options for how the animation looks: `linear`, `ease`, `ease-in`, and `ease-out`. In order for you to customize it have to define a `cubic-bezier` easing curve. That looks like this.

<pre>@include transition(1s cubic-bezier(0.455, 0.030, 0.515, 0.955));</pre>

Not fun.



###No one should have to memorize `cubic-bezier` curves.
To make it easier to use the various easing formulas the animation community has had for years we've transposed Robert Penner's easing formuals as variables. Anywhere you'd use a `cubic-bezier` curve you can use one these variables instead: `$ease-in-quad`, `$ease-in-cubic`, `$ease-in-quart`, `$ease-in-quint`, `$ease-in-sine`, `$ease-in-expo`, `$ease-in-circ`, `$ease-in-back`, `$ease-out-quad`, `$ease-out-cubic`, `$ease-out-quart`, `$ease-out-quint`, `$ease-out-sine`, `$ease-out-expo`, `$ease-out-circ`, `$ease-out-back`, `$ease-in-out-quad`, `$ease-in-out-cubic`, `$ease-in-out-quart`, `$ease-in-out-quint`, `$ease-in-out-sine`, `$ease-in-out-expo`, `$ease-in-out-circ`, and `$ease-in-out-back`. [Here are the visual demos](http://easings.net) of the different easing curves.

<pre>
.movie-title {
	@include feel($ease-out-quad);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>


###Actually using the library
Lets go back for a minute and think more broadly. Use the default, and then change their feeling all via settings.

<pre>//SCSS

.movie-title {
	@include feel();
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

`public_html/src/scss/utils/_settings.scss`.
<pre>
// Transitions and Animations
// available feel types: 'confident', 'bouncy', 'strong', 'selective', and 'lazy'
$animation-feel: 'lazy';
$animation-timescale: 1;
</pre>


`'confident'` - An ease in and out with a narrow curve that replicates a confident head nod. 

`'bouncy'` - An ease out with a soft overshoot and a sharp snap back. 

`'strong'` A sturdy animation style with a length greater than confident but with a wider curve that replicates a weight lift.

`'selective'` - An ease out that's very quick duration and a very narrow ease curve making it idea for hover states. 

`'lazy'` - A feeling with a long duration and curves that are as soft as you can make them.

###Specifying Customizations
By default the `feel();` mixin will animate every property. If you want to specify them, use the following syntax.
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
		@include fade-in();
	}
}</pre>

The built in options are `fade-in()`, `fade-in-up()`, `fade-in-right()`, `fade-in-down()`, `fade-in-left()`, `fade-out()`, `fade-out-up()`, `fade-out-right()`, `fade-out-down()`, `fade-out-left()`, `slide-in-up()`, `slide-in-right()`, `slide-in-down()`, `slide-in-left()`, `slide-out-up()`, `slide-out-right()`, `slide-out-down()`, `slide-out-left()`, `zoom-in()`, `zoom-in-shrink()`, `zoom-out()`, `zoom-out-grow()`, `bounce()`, `flash()`, `pulse()`, `shake()`, and `wobble()`. [Examples of each of these](/ui.html) are illustrated inside of [ui.html](/ui.html).

Built by Digital Surgeons

