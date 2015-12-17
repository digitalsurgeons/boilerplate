# DS Boilerplate


A repository of client side scaffolding for Digital Surgeons' projects.

## Requirements

In order to use DS Boilerplate you will need to install the latest versions of the following:

- [Node](http://nodejs.org/)
- [NPM](https://www.npmjs.org/)
- [Gulp](http://gulpjs.com/)
- [Bower](http://bower.io/)
- [Ruby](https://www.ruby-lang.org/en/)
- [scss-lint Ruby gem](https://rubygems.org/gems/scss-lint/versions/0.35.0)
- [libSass](http://sass-lang.com/libsass)

## Install

Clone the repo

	$ cd project-root
	$ git clone git@digitalsurgeons.git.beanstalkapp.com:/digitalsurgeons/ds-boilerplate.git ./

Remove the .git folder and init a new project with [git-flow](http://nvie.com/posts/a-successful-git-branching-model/)

	$ rm -rf .git
	$ git flow init -d

Install all project dependencies

	$ npm install
	$ bower install

The scss-lint gulp task requires the scss-lint Ruby gem.

	$ gem install scss-lint

Compile source

	$ gulp

Finally, remove .git directory

	$ sudo rm -rf .git

Run Gulp Watch and set your vhost (You'll only need to do this once).

	$ gulp watch

Run Gulp Watch to start up a Browser-Sync session. (optional --maps and --hint)

	$ gulp watch
