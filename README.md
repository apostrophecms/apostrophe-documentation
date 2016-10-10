Apostrophe Documentation
========================

This project contains [the documentation site](http://apostrophecms.org/docs/index.html) for [Apostrophe](http://apostrophecms.org/).

You don't need to read this page just to read the documentation! [Read the actual documentation here.](index.html) This page is about *contributing* to the documentation.

Building the docs
-----------------

### 1. Setup

The static site generator ([Habit](https://github.com/punkave/habit)) is required to generate the docs.

```sh
$ npm install -g habit
```

Clone the repo.

```sh
$ git clone https://github.com/punkave/apostrophe-documentation.git
$ cd apostrophe-documentation
```

Now you can run the build scripts.

### 2. Building

To see your work locally, type:

```sh
$ ./view
```

That will compile your site and open it in your browser.

### 3. Deploying

If you have access, you can deploy your work to [apostrophecms.org/docs](http://apostrophecms.org/docs/index.html). Just do:

```sh
$ ./deploy
```

Make sure you commit and push your work of course.

*BOOM!* :bomb:

How to Contribute
-----------------

You can work on the nunjucks layouts in `_layouts`, write actual HOWTOs in the howtos folder (use markdown and a .md file extension), and contribute LESS in the `stylesheets` folder (main.less is what actually gets compiled, everything else should be imported). Any files that aren't markdown or LESS get copied straight to the site, unless they are in a folder starting with `_`.

**Please note:** it's up to you to link to your HOWTOs in the index.md file. We want them in a considered order anyway.

### How to Switch Layouts

You'll notice that every page has a title specified as a YAML property at the top. You can add a `layout` property there too:

```html
---
title: "Amazing HOWTO"
layout: home
---
```

Note the three dashes, which are required.

Now your page gets rendered with foo.html instead of default.html. I've done this in index.md for instance. Yes, layouts can extend each other and override blocks in the usual Nunjucksian way.

### Making links that don't break

For this project if we are hardcoding links in markdown text we go ahead and assume `/` is the home page of the doc site. This won't work with `./view` but it will work if you set up a local server and it will work in production.

Regenerating the API docs
-------------------------

The `docs/modules` folder is generated from the Apostrophe source code.

First set up the doc generator app:

```sh
# Install the dependencies
$ npm install --prefix ./_api-reference-generator/

# Make the data directory
$ mkdir -p _api-reference-generator/data
```

Next, install [PhantomJS](http://phantomjs.org/).

```sh
# Install PhantomJS (OSX)
$ brew install phantomjs

# Install PhantomJS (Ubuntu)
$ sudo apt install phantomjs
```

Now you can regenerate the `docs/modules` folder:

```sh
$ ./generate
```

`./generate` ends by running `habit` for you. It takes a few seconds because it's doing some fancy things to get information about all of the moog types.

If you need to document a newer version of Apostrophe you will want to `npm update` in the reference generator app folder.
