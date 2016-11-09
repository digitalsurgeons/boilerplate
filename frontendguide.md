# Digital Surgeons Front End Guide

> Welcome to the Digital Surgeons front end guide! This is where we keep all of our guidelines for "front end" design and development, from more general core concepts to specific technical guidelines.

## Table of Contents

- [What Is Front End?](#what-is-front-end)
- [CSS](#css)
  * [Purpose](#css-purpose)
  * [Linting](#css-linting)
  * [Nesting](#css-nesting)
  * [BEM](#css-bem)
    * [Block](#css-block)
    * [Element](#css-element)
    * [Modifier](#css-modifier)
    * [Best Practices](#css-bem-best-practices)
  * [Componentizing](#css-componentizing)
  * [IDs vs. Classes](#css-ids-vs-classes)
  * [Color Units](#css-color-units)
  * [Vendor Prefixes](#css-vendor-prefixes)


- [Javascript](#javascript)


<a name="what-is-front-end"/>
## What Is Front End
The [front end guild at 18F](https://github.com/18F/frontend) did a series of exercises to determine the fundamental differences between the front end design and front end engineer roles. It came up with the following recommendations on knowing the difference between the two disciplines:

**Front end designers** design, write, and implement the presentational code base for websites and applications. They should have a clear understanding of design fundamentals and systems, such as interface style guides, responsive design, grid systems, front end frameworks, and accessibility best practices. Front end designers should feel comfortable creating and implementing design systems using semantic HTML5, CSS/SASS and be able to assist in debugging this aspect of the code base.

**Front end engineers** architect, write, and implement the functional code base for websites and applications. They should have a clear understanding of client-side render and response, such as HTTP methods, API consumption, the browser loading/rendering pipeline, and accessibility best practices. Front end developers should feel comfortable developing and implementing client-side interactions and frameworks using semantic HTML5 and JavaScript, and should be able to help with debugging, testing, and performance optimization of the code base.

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
.Block {
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

Use a capitalized name (title case).
- Good: `.Header`
- Bad: `.header`

Avoid excessive shorthand.
- Good: `.Alert-box` or `.Recents-intro` or `.Button`
- Bad: `.Feature` or `.Content` or `.Btn`

<a name="css-element"/>
#### Element
Styles that only apply to children of a block. Elements can also be blocks themselves. Class name is a concatenation of the block name, two underscores and the element name. Examples:
- `.Alert-box__close`
- `.Expanding-section__section`

<a name="css-modifier"/>
#### Modifier
Override or extend the base styles of a block or element with modifier styles. Class name is a concatenation of the block (or element) name, two hyphens and the modifier name. Use it to change appearance, behavior or state. Examples:
- `.Alert-box--success`
- `.Expanding-section--expanded`

<a name="css-bem-best-practices"/>
#### Best practices

Don't `@extend` block modifiers with the block base.
- Good: `<div class="My-block My-block--modifier">`
- Bad: `<div class="My-block--modifier">`

Don't create elements inside elements. If you find yourself needing this, consider converting your element into a block.
- Bad: `.Alert-box__close__button`

Choose your modifiers wisely. These two rules have very different meaning:

```scss
.Block--modifier .Block__element { color: red; }
.Block__element--modifier { color: red; }
```
<a name="css-componentizing"/>
### Componentizing
Always look to abstract components. Digital Surgeons has a very strong, very consistent style and the reuse of components across designs helps to improve this consistency at an implementation level.

A name like `.Homepage-nav` limits its use. Instead think about writing styles in such a way that they can be reused in other parts of the app. Instead of `.Homepage-nav`, try instead  `.Nav` or `.Nav-bar`. Ask yourself if this component could be reused in another context (chances are it could!).

Components should belong to their own component directory. For example, all general button definitions should belong in `components/Button/styles.scss`.

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
.Article {
  display: flex;
}
```
***
<a name="javascript"/>
## Javascript
