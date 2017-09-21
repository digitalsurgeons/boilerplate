# Digital Surgeons Front End Guide

> Welcome to the Digital Surgeons front end guide! This is where we keep all of our guidelines for "front end" design and development, from more general core concepts to specific technical guidelines.

## Table of Contents

- [What Is Front End?](#what-is-front-end)
- [Project Structure & Composition](#structure)
  * [Classing & Naming Conventions](#classing-conventions)
- [CSS](#css)
  * [Purpose](#css-purpose)
  * [Linting](#css-linting)
  * [Nesting](#css-nesting)
  * [BEM](#css-bem)
    * [Block](#css-block)
    * [Element](#css-element)
    * [Modifier](#css-modifier)
    * [Best Practices](#css-bem-best-practices)
  * [IDs vs. Classes](#css-ids-vs-classes)
  * [Color Units](#css-color-units)
  * [Vendor Prefixes](#css-vendor-prefixes)
- [Javascript](#javascript)
  * [Conventions](#js-conventions)
  * [Linting & Style](#js-linting)
- [Icons](#icons)

<a name="what-is-front-end"/>
## What Is Front End
The [front end guild at 18F](https://github.com/18F/frontend) did a series of exercises to determine the fundamental differences between the front end design and front end engineer roles. It came up with the following recommendations on knowing the difference between the two disciplines:

**Front end designers** design, write, and implement the presentational code base for websites and applications. They should have a clear understanding of design fundamentals and systems, such as interface style guides, responsive design, grid systems, front end frameworks, and accessibility best practices. Front end designers should feel comfortable creating and implementing design systems using semantic HTML5, CSS/SASS and be able to assist in debugging this aspect of the code base.

**Front end engineers** architect, write, and implement the functional code base for websites and applications. They should have a clear understanding of client-side render and response, such as HTTP methods, API consumption, the browser loading/rendering pipeline, and accessibility best practices. Front end developers should feel comfortable developing and implementing client-side interactions and frameworks using semantic HTML5 and JavaScript, and should be able to help with debugging, testing, and performance optimization of the code base.

<a name="structure"/>
## Project Structure & Composition
Our project structure is centered around the idea of components. A `components` folder houses individual folders for specific components, each containing the [javascript](#javascript) and [scss](#css) necessary for that component.

For example:

```
/
/components
/components/header/
/components/header/index.js
/components/header/styles.scss
```

The main Javascript file, as well as Javascript unrelated to specific components, is housed in the `js` folder, e.g. `/js/app.js`.

The main SCSS file, as well as SCSS unrelated to specific components, is housed in the `scss` folder, e.g. `/scss/app.scss`.

We recognize that frameworks have their own way of doing things, and oftentimes a project will require the advanced features and structure that frameworks offer. However this boilerplate is intended for baseline vanilla projects and is framework agnostic.

Always look to abstract components. Digital Surgeons has a very strong, very consistent style and the reuse of components across designs helps to improve this consistency at an implementation level.

<a name="classing-conventions"/>
### Classing & Naming Conventions
A name like `.homepageNav` limits its use. Instead think about writing styles in such a way that they can be reused in other parts of the app. Instead of `.homepageNav`, try instead  `.nav` or `.navBar`. Ask yourself if this component could be reused in another context (chances are it could!).

<a name="css"/>
## CSS

<a name="css-purpose"/>
### Purpose
The purpose of the CSS coding styleguide is to create consistent CSS or preprocessor CSS code across Digital Surgeons projects. The styleguide should be treated as a guide — rules can be modified according to project needs.

<a name="css-linting"/>
### Linting
Digital Surgeons adheres to a specific SASS styleguide and uses a linting tool to ensure code never differs from this styleguide. We've created a `.scss-lint.yml` file that specifics our linting rules. Please refer to [this file](https://github.com/digitalsurgeons/boilerplate/blob/redeux/.scss-lint.yml) to find out what they are.

#### Linting setup with ruby:

1. Ensure the `.scss-lint.yml` file is at the base of your repository.
2. Install the scss-lint gem with `gem install scss_lint`
3. Run the linter with `npm run scss-lint`

<a name="css-nesting"/>
### Nesting

Nesting makes it harder to tell at a glance where css selector optimizations can be made. Avoid it unless it's being used as a convenience to extend the parent selector over targeting nested elements. For example:
```scss
.block {
  padding: 24px;

  &--mini {
    padding: 12px;
  }
}
```

Nesting can be really easily avoided by smart class naming (with the help of BEM) and avoiding bare tag selectors.

<a name="css-bem"/>
### BEM
[BEM](https://en.bem.info/method/) (<b>**B**</b>lock, <b>**E**</b>lement, <b>**M**</b>odifier) structures CSS such that every entity is composed of (you guessed it) blocks, elements and modifiers. From Harry Roberts:
>The point of BEM is to tell other developers more about what a piece of markup is doing from its name alone. By reading some HTML with some classes in, you can see how – if at all – the chunks are related; something might just be a component, something might be a child, or element, of that component, and something might be a variation or modifier of that component.

<a name="css-block"/>
#### Block
Unique, meaningful names for a logical unit of style.

Use a camelCase name.
- Good: `.videoMasthead`
- Bad: `.video-masthead`

Avoid excessive shorthand.
- Good: `.alertBox` or `.recentsIntro` or `.button`
- Bad: `.feature` or `.content` or `.btn`

<a name="css-element"/>
#### Element
Styles that only apply to children of a block. Elements can also be blocks themselves. Class name is a concatenation of the block name, two underscores and the element name. Examples:
- `.alertBox__close`
- `.expandingSection__title`

<a name="css-modifier"/>
#### Modifier
Override or extend the base styles of a block or element with modifier styles. Class name is a concatenation of the block (or element) name, two hyphens and the modifier name. Use it to change appearance, behavior or state. Examples:
- `.alertBox--success`
- `.expandingSection--expanded`

<a name="css-bem-best-practices"/>
#### Best practices

Don't `@extend` block modifiers with the block base.
- Good: `<div class="myBlock myBlock--modifier">`
- Bad: `<div class="myBlock--modifier">`

Don't create elements inside elements. If you find yourself needing this, consider converting your element into a block.
- Bad: `.alertBox__close__button`

Choose your modifiers wisely. These two rules have very different meaning:

```scss
.block--modifier .block__element { color: red; }
.block__element--modifier { color: red; }
```

<a name="css-ids-vs-classes"/>
### IDs vs. Classes

You should almost never need to use IDs. Broken behavior due to ID collisions are hard to track down and annoying.
If you **must** select an ID, select it by its data attibute because data attributes have the same specificty as classes:

```css
[id='someID'] {
  color: 'red';
}
```

<a name="css-color-units"/>
### Color Units
When implementing feature styles, you should only be using color variables. Yes, even for hex codes `#000` and `#fff`!

<a name="css-vendor-prefixes"/>
### Vendor Prefixes
Digital Surgeons uses the [PostCSS](https://github.com/postcss/postcss) plugin called [autoprefixer](https://github.com/postcss/autoprefixer) to parse CSS and add vendor prefixes to CSS rules using values from [Can I Use](caniuse.com).

This [CLI](https://github.com/digitalsurgeons/ds-css-cli) can be used to run autoprefixer on css files containing scss.

Write your CSS rules without vendor prefixes (in fact, forget about them
entirely):

```scss
.article {
  display: flex;
}
```
***
<a name="javascript"/>
## Javascript

Our JavaScript style is an extension of the ["Recommended" ESLint ruleset](http://eslint.org/docs/rules/), with a few select linting rules to keep our code clean and consistent.

<a name="js-conventions"/>
### Conventions

Our code is written to follow [ES2015 conventions](http://es6-features.org/), utilizing features like:

- [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

- [Template Strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

- [Classes & Constructors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

  E.g.

  ```javascript
  class Polygon {
    constructor (height, width) {
      this.height = height
      this.width = width
    }

    get area () {
      return this.calcArea()
    }

    calcArea () {
      return this.height * this.width
    }
  }

  const square = new Polygon(10, 10)
  ```

- `Super()` as a way to reference parent classes, e.g.

  ```javascript
  class Cat {
    constructor (name) {
      this.name = name
    }

    speak () {
      console.log(this.name + ' makes a noise.')
    }
  }

  class Lion extends Cat {
    speak () {
      super.speak()
      console.log(this.name + ' roars.')
    }
  }
  ```

<a name="js-linting"/>
### Linting & Style

Our linting rules are flexible to work with both server-side and client-side code. The rules we enforce are:

- **2 spaces** – for indentation
- **Single quotes for strings**
- **No semicolons**
- **No unused variables**
- **Space after keywords** `if (condition) { ... }`
- **Space after function name** `function name (arg) { ... }`

As you might have noticed, these are the main rules of [standardJS](http://standardjs.com/), however we are only using the rules relevant to our team, rather than *all* of the standard rules.

<a name="icons"/>
## Icons
The build process takes a list of SVG files inside the icons directory and creates a single sprite file using `<symbol>` elements. You can reference them inside your html like this:
```
<svg class="icon">
  <use xlink:href="/dist/symbol-defs.svg#facebook"></use>
</svg>
```
