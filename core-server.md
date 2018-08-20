---
title: "Apostrophe core object, server-side"
layout: reference
module: false
---

# The `apos` object

This code, found in every Apostrophe project, creates the `apos` object that represents your website on the server side:

```javascript
// in app.js
var apos = require('apostrophe')({
  shortName: 'myproject',
  modules: {
    // Module configuration
  }
}
```

This article is a reference guide to the options and methods of that object. Most of the time you'll be more interested in Apostrophe's [modules](modules/index.html). See also [apostrophe promise events](events.html) for information on how to "hook in" to the life cycle of pages and documents in Apostrophe.

This article is not the right place to start learning Apostrophe. For that, see the [getting started tutorial](tutorials/getting-started/index.html).

It is possible to have more than one `apos` object in a node.js application, for instance with the `apostrophe-multisite` module, but typically you will only have one.

## Options

### `afterInit`

If present, this function is invoked with a callback, just before Apostrophe either listens for connections or, when arguments are present on the command line, carries out a task.

Note that it is too late to add routes at this point because [apostrophe-pages](modules/apostrophe-pages/index.html) will already be responding to all remaining URLs. If you wish to add routes you should do so in your own Apostrophe modules.

This function does not receive an error object and is only invoked when Apostrophe has been successful in initialization so far (see `initFailed`). This function **must invoke its callback**. If an error is passed to the callback Apostrophe initialization will fail.

**The use of this option for nontrivial amounts of code is strongly discouraged.** Write your own Apostrophe modules instead. This permits good separation of concerns and reduces clutter in `app.js`.

### `afterListen`

This function is invoked after Apostrophe attempts to listen for connections on its designated port. It is not run when Apostrophe is only running a command line task.

If the attempt to listen is unsuccessful this function will receive an error.

If this option is not set and the port is not available, an uncaught exception is thrown and the node.js application exits.

### `bundles`

*Deprecated.* The `bundles` option was used to specify an array of installed npm modules that provide more than one Apostrophe module each. These are also known as [moog bundles](http://npmjs.org/moog-require). Moog bundles are now recognized automatically as such.

For a straightforward example of a moog bundle, check out [apostrophe-blog](https://npmjs.org/apostrophe-blog).

### `baseUrl`

If set, this string is prepended to all URLs the site generates to refer to itself. It should NOT contain a "path" part (not even a `/` to begin the path). It should only contain a protocol, a hostname and on rare occasions a port number. In production, you'll want to set this, for instance to `https://mysite.com`, so that Apostrophe's URLs are absolute which makes them satisfactory for use in Facebook Open Graph tags.

This is NOT the way to configure Apostrophe to run as a "subdirectory" of another website. See [prefix](#code-prefix-code).

### `initFailed`

If an error occurs during the initialization of the Apostrophe application, and the `initFailed` option has been set to a function, that function will be invoked with the error.

Otherwise Apostrophe will print the error and exit the node.js application.

### `modules`

`modules` is an object in which the keys are the names of Apostrophe modules and the values are objects. Usually the properties of this object set options for the module and become available in its own `options` object.

However Apostrophe also loads an object from `lib/modules/name-of-module/index.js`. Any settings present in `app.js` itself override those found in `index.js`. 

The combined object is used to define the new module or extend an existing one. The usual rules of [moog types](glossary.html#moog-type) apply.

So in principle you can write a `construct` function for your module right in `app.js`. However we don't recommend it because it produces a very long `app.js` file.

In fact, it is not uncommon for the object in `app.js` to be empty. Our own house practice is to avoid configuration of modules in app.js except for very small projects:

```javascript
// no clutter in app.js
modules: {
  'apostrophe-express': {}
}

// Instead, in lib/modules/apostrophe-express/index.js:

module.exports = {
  session: {
    secret: 'my secret here'
  }  
}
```

#### Special property names in module configuration objects

`instantiate`: valid only in `app.js`. If true, the module is not actually instantiated and initialized. Currently used to allow the [moog-require improve feature](https://npmjs.org/moog-require) to work with Apostrophe. This may become unnecessary soon.

`alias`: the module becomes available as a property of the `apos` object by this name. **It is considered poor practice to set this option *and rely on its value* in published npm modules.** Apart from the core Apostrophe modules, the decision to alias a module should be left to the project-level developer, so that they can avoid conflicts. Note that all modules can be recognized as properties of `apos.modules` by their full names.

`beforeConstruct`, `construct`, `afterConstruct`: functions that create and initialize the module. See [moog types](glossary.html#moog-type).

Currently all other property names set options for the module.

### `prefix`

Although Apostrophe is designed to implement an entire website, sometimes you'll need that site to appear as a "subdirectory" of another website. The `prefix` option allows you to do that.

If `prefix` is set to a string such as `/foldername`, all URLs generated by Apostrophe are prefixed with that string, after the `baseUrl` if any. In addition, all redirects issued by `res.redirect` are prefixed with the string, and all AJAX requests made by jQuery are also automatically prefixed with the string.

**The intent of the `prefix` option is to save you from doing any of this yourself.** A site that works at the "root" of a website without `prefix` will *also* work as a subdirectory of a website if you set `prefix` accordingly, with **no other code changes**.

The prefix is available as `apos.prefix`.

Typical practice when using `prefix` is to configure a reverse proxy, such as nginx, to proxy only one folder's content to Apostrophe. However when doing so you should pass the entire URL through to Apostrophe because it is expected when the prefix option is set.

*If possible, consider using subdomains rather than prefixes for conceptually separate sites. Subdomains are the cleanest, most bug-free solution.*

### `root`

*You will almost never need this.* A reference to the node.js module that is considered the "root" of the application. Normally Apostrophe will set this for you by recursively searching for the root module of the node.js project. However if you need to create multiple Apostrophe applications in a single node.js application you may wish to set it to `module` to reference the current module.

### `rootDir`

*You will almost never need this.* A reference to the root directory of the Apostrophe project. Normally Apostrophe will set this to the directory where the root module is located, so you don't need to worry about it. Note that if you set `root` then `rootDir` will automatically be the directory that contains `root`.

### `shortName`

**Required.** A short, unique name for your website project, containing only letters, digits, underscores and dashes. If not otherwise configured, this will be the name of your MongoDB database. Typically also used to distinguish projects in shared production environments.

## Properties

### `app`

The [Express app object](https://npmjs.org/express) for the site. If the [prefix](#code-prefix-code) option is set there will also be an `apos.baseApp` object which is not prefixed. Generally only `apos.app` is of interest.

### `express`

The [express](https://npmjs.org/express) module instance in use by Apostrophe. Not to be confused with `apos.app`.

### `modules`

An object containing all of the instantiated Apostrophe modules. The property names are the same as the module names.

### `middleware`

The `apostrophe-express` module sets this property to provide easy access to a few commonly but not universally used middleware functions, such as `files`, which recognizes multipart file uploads and makes them available in `req.files` via the `connect-multiparty` npm module.

### `prefix`

The prefix of the site, for use in enabling Apostrophe to run in a virtual subdirectory of another site. See the [prefix](#code-prefix-code) option for details.

### `docs`, `attachments`, etc.

Core Apostrophe modules, and project-specific modules, usually register an "alias" for more convenient access from other modules. See the `alias` setting for each module.

## Methods

### `callAll(methodName, args..., callback)`

**This is a legacy method, all instances of it in the apostrophe core now instead call `callAllAndEmit` which also emits an Apostrophe promise event.**

When `callAll` is invoked with a method name such as `docBeforeSave`, Apostrophe invokes that method on **ALL modules that have one**.

**A callback is required when invoking `callAll`, but optional when receiving it.** That is, your code that invokes `callAll` **must** be asynchronous and pass a callback as the last argument to `callAll`. However, some of the modules that implement `methodName` may omit the callback if they do not need to do any asynchronous work. `docBeforeSave` is a good example: some modules only need to copy one property to another, while others might need to consult another database.

The `callAll` technique is widely used in Apostrophe. For instance, [page-before-send](modules/apostrophe-pages/index.html#pageBeforeSend) is invoked just before a page is sent to the browser, allowing all modules one last opportunity to do some asynchronous work and add more information to `req.data`.

### `destroy()`

The `destroy` method destroys the `apos` object, freeing resources such as database connections and HTTP server ports. It does **not** delete any persistent data. The database and media files remain available for the next startup. Invokes the `apostropheDestroy` methods of all modules that provide one; use this mechanism to free your own server-side resources that could prevent garbage collection by the JavaScript engine, such as timers and intervals.

### `emit(eventName, args...)`

For legacy reasons, Apostrophe provides a simple mechanism for synchronous events. This is separate from [promise events](events.html), which support asynchronous programming and are generally preferred in new code. Synchronous events may still be useful in new code when code is invoked so often that no delay can be tolerated.

The `apos.emit` method takes an event name and additional, optional arguments and invokes all event listeners for that event name. For example, the [apostrophe-search](modules/apostrophe-search/index.html) module emits a `docSearchIndex` event with a `doc` and an array of `texts`, allowing other modules to potentially add more search texts.

On the server side, Apostrophe emits [promise events](events.html) far more often.

### `listen()`

The `listen` method is invoked automatically when Apostrophe is ready to listen for connections. It is supplied by the `apostrophe-express` module. Another module could choose to supply a different implementation, replacing the default one.

### `on(eventName, fn)`

Registers an event handler to be invoked when the named event is emitted (see [emit](#code-emit)). The event handler function will receive any additional arguments passed to `emit`. **In most situations this should be regarded as a legacy feature,** see [promise events](events.html).

### `off(eventName, fn)`

Removes the specified event handler from the list of event handlers for the named synchronous event (see [on](#code-on)). Primarily a legacy feature. See [promise events](events.html).
