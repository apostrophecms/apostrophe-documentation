---
title: "The core apostrophe object (browser side)"
layout: reference
module: false
---

# The `apos` object

Apostrophe always creates an `apos` object and attaches it to the `window` object in the browser, making it globally available.

Most of Apostrophe's browser-side functionality is implemented by its individual modules, many of which can be accessed through aliases on the `apos` object, such as `apos.utils` or `apos.ui`.

This article is a reference guide to the options and methods of the browser-side `apos` object itself. Most of the time you'll be more interested in Apostrophe's [modules](modules/index.html).

This article is not the right place to start learning Apostrophe. For that, see the [getting started tutorial](tutorials/getting-started/index.html).

Since Apostrophe is responsible for generating the webpage, there will only be one `apos` object in the browser.

## Properties

### `csrfCookieName`

The name of a cookie used to implement Angular-style CSRF protection, which is applied to all jQuery ajax operations.

Automatically set based on the project's `shortName` if not otherwise configured as an option to the `apostrophe-express` module on the server side.

### `modules`

`modules` is an object in which the keys are the names of Apostrophe modules and the values are objects. Usually the properties of this object set options for the module and become available in its own `options` object.

Not all Apostrophe modules have a browser-side object; only those that require one to implement a UI. And many have one only if a user is logged in.

### `prefix`

Passed through to the browser by the server, `apos.prefix` will match its value on the server side if a site is running as a "virtual subdirectory." Apostrophe also automatically adjusts jQuery's AJAX behavior to respect the prefix and provides `apos.ui.redirect`, a convenience method that prepends the prefix to whatever is passed to it. So in most cases you will not need to prepend this yourself. See [the prefix option](core-server.html).

### `synth`

The instance of `moog` that powers `apos.create`, `apos.define`, etc. on the browser side, providing [object-oriented programming features](glossary.html#moog-type). Can also be used directly (`apos.synth.create`, etc).

## Methods

### `change(what)`

Refreshes the div with the `data-apos-refreshable` attribute, which will typically contain everything except the Apostrophe admin bar. Apostrophe will refetch the page via an AJAX request and the server will automatically use its `ajaxLayout` to return only that portion of the page. 

In addition, a `change` event is emitted on the `apos` object, which receives `what.type` if `what` is an object, and otherwise receives `what` directly. 

Typically `apos.change` is invoked by the "edit" modals of pieces in order to refresh content on the page that might potentially include the piece that was just modified. This makes the editing experience feel more seamless by avoiding the need for a manual page refresh.

### `create(typeName, optionsObject, [callback])`

Creates an object. Specifically, an instance of any [moog type](glossary.html#moog-type) that is defined on the browser side. You will see `apos.create` calls when you peek at "view source" because server-side modules push them to create singletons that provide their UI.

The callback is optional, provided that neither the type you are creating nor any of its base classes take a callback in their constructor. If there is a callback it will receive `(err, object)`.

See also [createModule](#createModule).

### createModule(type, options, alias)

Creates a singleton instance of the named module on the browser side by invoking [apos.create](#create). The module is made available as a property of the `apos` object with the specified `alias`, if any, and is instantiated with the provided `options`. The module is also made available as a property of `apos.modules` under its full name.

To avoid problems with double-registration of event handlers when the main body of the content is refreshed, if the module already exists in `apos.modules` it is not re-created.

Many, but not all, modules push a call to this method from the server side; you will see those calls in "view source."

Typical modules have a `user.js` file on the browser side, which invokes [apos.define](#define) with the same type name as the module. This method is used to actually create the object, after project-level code and other modules have had a chance to extend the definition via [implicit subclassing](glossary.html#implicit-subclassing). 

### `csrf()`

This method enables CSRF protection for all AJAX operations carried out via jQuery. A call to this method is pushed automatically by the `apostrophe-assets` module.

### `prefixAjax()`

This method automatically prefixes any AJAX operations carried out via jQuery with `apos.prefix`, if the `prefix` option was set when configuring the project. A call to this method is pushed automatically by the `apostrophe-assets` module.
 
### `define(typeName, definitionObject)`

Defines a new [moog type](glossary.html#moog-type) on the browser side. `apos.define` is seen in every core module that does browser-side work. Its use allows easy subclassing and enhancement at the project level. An alias for `apos.synth.define`. Many of the core Apostrophe source files on the browser side consist entirely of an `apos.define` call. The object is then created later via `apos.create`.

The `definitionObject` looks exactly like an `index.js` file on the server side, with properties to set default values for options and often `beforeConstruct`, `construct` and `afterConstruct` functions. Both the browser and the server rely on moog to support highly flexible object-oriented programming.

### `emit(eventName, args...)`

Apostrophe provides an event mechanism. The `apos.emit` method takes an event name and additional, optional arguments and invokes all event listeners for that event name. Apostrophe emits many events on the browser side.

### `isDefined(typeName)`

Returns true if the specified [moog type](glossary.html#moog-type) is defined. An alias for `apos.synth.isDefined`.

### `log(msg)`

Prints a message to `console.log`, gracefully doing nothing in browsers that do not provide `console.log`.

### `mirror(typeName)`

An alias for `apos.synth.mirror`. See [moog](https://npmjs.org/moog).

### `on(eventName, fn)`

Registers an event handler to be invoked when the named event is emitted (see [emit](#code-emit)). The event handler function will receive any additional arguments passed to `emit`.

Frequently used events include:

* `ready`, which is emitted when a page is loaded, *or* when its main content area is fully refreshed due to an action such as editing a piece that might impact what it should display.

* `enhance`, which is emitted both for new pages and whenever new content is added to the page (most notably for AJAX updates or additions to the page), and receives a jQuery element containing all of the new content as its first argument. 

### `off(eventName, fn)`

Removes the specified event handler from the list of event handlers for the named event (see [on](#on)).

### `pageReady($el)`

The [apostrophe-templates](modules/apostrophe-templates/index.html) module will push a call to this method automatically, via the `pageReadyWhenCalm` method, when loading a new page or refreshing `data-apos-refreshable`. This method emits the `ready` and `enhance` events.

### `pageReadyWhenCalm($el)`

Invokes `pageReady` after first waiting for jQuery's DOMready event and then waiting for "next tick" via `setImmediate`. This allows time for code in your own JavaScript files to run first and potentially patch or replace core functionality. A call to this method is pushed automatically by the [apostrophe-templates](modules/apostrophe-templates/index.html) module.

### `redefine(typeName, definitionObject)`

Redefines a [moog type](glossary.html#moog-type) on the browser side, throwing out any previous definition rather than implicitly subclassing as a second call to `apos.define` would do.
