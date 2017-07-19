---
title: How Apostrophe modules are structured
layout: tutorial
---

In this HOWTO, we'll talk about how Apostrophe modules are typically structured. Following these naming conventions will improve your own code.

Some of this material will reference advanced Apostrophe concepts. You may want to read the [Apostrophe glossary](/docs/glossary.html) first and complete the basic and intermediate tutorials.

## index.js

`index.js` is the entry point. Apostrophe (via the `moog-require` npm module) knows to start there when loading a module. `index.js` exports a single object that provides a [moog definition](https://www.npmjs.com/package/moog) for the module.

`index.js` shouldn't "do anything now" other than using `require` to pull in needed libraries. All the action happens later when the `construct` and/or `afterConstruct` functions are invoked by Apostrophe. 

It's best to carry out any initialization, like connecting to APIs or databases, in `afterConstruct`. This allows time for those subclassing and extending your module to replace and extend methods defined in `construct`.

> Anything configured in `app.js` for that module merges with the object exported by `index.js` but by convention we don’t put much in `app.js` for each module, to keep it clean. Anything configured in `data/local.js` also merges with the object, which is useful because `data/local.js` is not deployed and can thus vary from server to server.

## Breaking it up

A module has a single purpose, so in that sense modules are very well-factored already. However some modules are rather large, so by convention we break them down into multiple files. Each file exports a function that takes `(self, options)`, so the code can be written the same as if it were inside `index.js`, and in `construct` we write:

```javascript
require('./lib/api.js')(self, options);
```

... As many times as desired.

### Server-side file naming convention

By convention all of the additional server-side `.js` files for a module live in a `./lib` subdirectory of the module. We recommend you follow this standard.

**`browser.js`** is where, by convention, we keep code concerned with pushing assets to the browser, overriding the options passed to the singleton that represents this module in the browser, etc. It is not code executed in the browser. It is code that pushes or otherwise aids and abets browser-side code.

**``helper.js`** contains nunjucks helpers. It is typically a big ol’ call to `addHelpers`. These become visible in nunjucks as `apos.moduleAlias.whatever`.

**`routes.js`** contains Express routes. That is, it contains calls to `self.route`, such as:

```javascript
self.route('get', 'sandwiches', function(req, res) { .... }))
```

Calls to `self.route` automatically prefix the URL like this: `/modules/module-name` 

So we wind up with: `/modules/module-name/sandwiches`

This dovetails nicely with `self.api` and `self.html` on the browser side, which are available whenever we’re extending `apostrophe-modal` or `apostrophe-context`.

> You can also work directly with `self.apos.app`, which is the Express app object, in order to invoke `self.apos.app.get` and create a route with a more public-friendly URL.

**`api.js`**, by convention, usually contains all of the other methods we’re adding to the module. This is a bit underwhelming because some methods are likely to get called by project-level developers and/or other modules, and some are obviously implementation details, called for us automagically, etc.

**`implementation.js`** attempts to improve the readability of `api.js` by limiting itself to methods in the "implementation detail" category. This doesn't mean these methods can't be overridden, and indeed when extending a module it is quite common to want to change these details. Not all of our core modules currently have an `implementation.js` file.

### Browser-side file naming convention

**`always.js`**, by convention, contains code that should always run in the browser, whether the user is logged in or not. This file may contain executable code as a jQuery DOMready function:

```javascript
$(function() {
  // You should wait at least for the DOM to be ready, like this  
});
```

Or a few Apostrophe event handlers:

```javascript
apos.on('ready', function() {
  // The page has been loaded for the first time,
  // or has just been refreshed after a piece was saved  
});
```

**`user.js`** contains code that should only wind up in the browser if the user is logged in (or `scene: 'user'` is in effect for a page type).

`user.js` usually contains a moog definition for a type with the same name as the module. A single instance of that type gets created when the module code on the server side pushes a browser call to do that (`pushBrowserCall`). There are a well-developed set of convenience methods for this in `apostrophe-module`, the base class of all modules. Pieces always push `user.js` as such a singleton; you do not have to reinvent that wheel when extending pieces.

**`other js files in the browser**, by convention, usually define a single additional moog type (with `apos.define`) and don’t contain any other executable code. For instance, `editor.js` will define an editor modal; `user.js` will actually instantiate it when an admin bar button is clicked.

### Relax, Apostrophe pushed that for you

If a module’s base class, i.e. `apostrophe-pieces`, pushes a JS or CSS asset, then all copies of it in all subclass modules get pushed too. That is, `user.js` for `apostrophe-pieces` and for `my-articles` both get pushed if they exist. You don’t have to call `pushAsset` again. They are pushed in the right order too, so your `extend` will find the base class.

Also, if `cool-articles` extends `articles` which extends `pieces`, and you want to do something cool in `editor.js` by defining some new behavior for `cool-articles-editor`, that’s… cool. You don’t have to suddenly have an `editor.js` in your `articles` module that defines `articles-editor`, unless you feel like it. Apostrophe automatically fills in any gaps in the inheritance tree so you can just define the part you care about. This is a moog feature called mirroring.

### `cursor.js` and "related types" on the server side

Speaking of mirroring, something similar happens on the server side in `cursor.js`.

`apostrophe-doc-type-manager` uses `self.defineRelatedType` to indicate that there’s another moog type related to that module:

```
  // Define the related type "cursor", so that all of our subclasses
  // automatically have a cursor type too, and it is autoloaded from
  // ./lib/cursor.js if that exists, otherwise given an empty
  // definition.

  self.defineCursor = function() {
    self.defineRelatedType('cursor', {
      stop: 'apostrophe-doc-type-manager'
    });
  };
```

In a nutshell, this makes it “just work” if you have a `cursor.js` for your subclass of pieces that adds some extra filters or changes the defaults for how cursors fetching that type of content should behave. And it also “just works” if you don’t.

To be a little more precise, it mirrors the inheritance tree of the module, with “-cursor” added on the end, loading them from `./lib/cursor.js` if they exist and filling in the gap with a subclass that doesn’t change anything if they don’t. The “walk” through the inheritance tree stops with “apostrophe-doc-type-manager”, so we don’t recurse further and define an unwanted “apostrophe-module-cursor” type.

As an end result, the `find` method of `apostrophe-doc-type-manager` can simply be:

```javascript
self.find = function(req, criteria, projection) {
  return self.createRelatedType('cursor', { ... various options ... }
  });
};
```

And the appropriate subclass is automatically used. For instance, in a subclass of `apostrophe-pieces` called `articles`, `articles-cursor` is instantiated.

## Learning more

To learn more, check out the source code of the `apostrophe-pieces` module, which provides excellent examples of the conventions.
