## Transitions and Animations.
### components/animation/_animation.scss
---
This component will be a lot easier to understand if you are familar with the `transition` property. We suggest a quick [refresher](https://css-tricks.com/almanac/properties/t/transition/) just for good measure. 

This boilerplate already has the Bourbon mixin library installed, so this library leverages it to do some of the heavy lifting. 

The following example should look familar. It is how you typically write a transition.


<pre>//SCSS

.movie-title {
	@include transition(1s);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

The `.is-showing` class might get added with [Toggles and Switches](https://github.com/dsurgeons/Toggles-Switches), or with jQuery. We'll use this example moving forward.

When building out a whole site, it is difficult to manage the 'feel' of all of the animations. In the example the `transition-easing` property defaults to `ease` which is equal to `ease-in-out`. This happens behind the scenes. It is the cleanest of the built in ease types of which there are 3. They are `ease-in`, `ease-out`, and `ease-in-out`. That's not much to go with. Luckily you can replace this with a `cubic-bezier` method.

<pre>cubic-bezier(0.455, 0.030, 0.515, 0.955);</pre>

The `cubic-bezier` method defines how the animation starts and how the animation ends by specifying control points that affect the change in property over time. Here's a [cubic-bezier builder](cubic-bezier.com/#.455,.03,.515,.955) that can help illustrate how they works. 

Needless to say, its rather difficult to look at a `cubic-bezier` declaration and know what the animation is going to look like.

###Animation types
Built into this library are Robert Penner's easing formuals turned into `cubic-beziers`. Anywhere you'd use your own `cubic-bezier` declaration you can use one of the following variabes: `$easeInQuad`, `$easeInCubic`, `$easeInQuart`, `$easeInQuint`, `$easeInSine`, `$easeInExpo`, `$easeInCirc`, `$easeInBack`, `$easeOutQuad`, `$easeOutCubic`, `$easeOutQuart`, `$easeOutQuint`, `$easeOutSine`, `$easeOutExpo`, `$easeOutCirc`, `$easeOutBack`, `$easeInOutQuad`, `$easeInOutCubic`, `$easeInOutQuart`, `$easeInOutQuint`, `$easeInOutSine`, `$easeInOutExpo`, `$easeInOutCirc`, and `$easeInOutBack`. We went so far as to even include `cubic-bezier` versions of the built in easing types: `$linear`, `$ease`, `$ease-in`, `$ease-out`, and `$ease-in-out`.

[Here](http://easings.net) is what all of those do.

###Actually using the library
Even if you use all the shortcuts you've learned about so far chances are you're still destined for frustration when your designers ask you to make the animations "feel" quicker. The answer to "How do you do that?" Isn't fun. It involves replacing all your cubic-beziers and animation durations before **every** test.

Not anymore. Replace` @include transition();` with `@include feel();`

<pre>//SCSS

.movie-title {
	@include feel();
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

This starts off with exactly what you had but inside of `utils/_settings.scss` there is a variable for defining `$animation-feel`. This updates every element that uses the `feel()` mixin. The presets are `'confident'` - An ease in and out with a narrow curve that replicates a confident head nod. `'bouncy'` - An ease out with a soft overshoot and a sharp snap back. `'strong'` A sturdy animation style with a length greater than confident but with a wider curve that replicates a weight lift. `'selective'` - An ease out that's very quick duration and a very narrow ease curve making it idea for hover states. And '`lazy'` - A feeling with a long duration and curves that are as soft as you can make them.

###Customization
By default the `feel()` mixin will animate every property of the element on which it is used. If you want to specify them, use the following syntax.
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

Additionally, if you want to use a specific easing formula, you can send it as the first argument to the feel() mixin. And, likewise, if you want a custom duration, you can pass it as the second argument.
			
<pre>//SCSS

.movie-title {
	@include feel($easeOutQuint, 450ms);
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>

Pro tip: If you dont want to change the easing formula but you do want to change the duration use the same technique we used for haning the `transition-property` to overwrite `transition-duration` like this</p>

<pre>//SCSS

.movie-title {
	@include feel() {
		@include transition-duration(450ms);
	}
	opacity: 0;
	&.is-showing {
		opacity: 1;
	}
}</pre>



##Built in Animations
###The coolest part
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

