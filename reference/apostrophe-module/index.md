---
title: "apostrophe-module (module)"
layout: module
children:
  - server-apostrophe-module-cursor
  - browser-apostrophe-module
  - browser-apostrophe-module-manager-modal
  - browser-apostrophe-module-editor
---
This "module" is the base class for all other modules. This module
is never actually configured and used directly. Instead all other modules
extend it (or a subclass of it) and benefit from its standard features,
including asset pushing, template rendering, etc.

New methods added here should be lightweight wrappers that invoke
an implementation provided in another module, such as `apostrophe-assets`,
with sensible defaults for the current module. For instance,
any module can call `self.render(req, 'show', { data... })` to
render the `views/show.html` template of that module.

TODO: wrappers for delivering email and adding command-line tasks.


## Methods
### route(*method*, *path*, *fn*)
Add an Express route to apos.app. The `path` argument is
appended to the "action" of this module, which is
`/modules/modulename/`.

Calling this method again allows routes to be overridden, which you
normally can't do in Express.

Syntax:

`self.route('post', 'edit-monkey', function(req, res) { ... })`

That is roughly equivalent to:

`self.apos.app.post(self.action + '/edit-monkey', function(req, res) { ... })`

You can also pass middleware in the usual way, after
the `path` argument. Note that some standardized optional
middleware is available to pass in this way, i.e.
`self.apos.middleware.files` for file uploads.
### addHelpers(*object *, *or name, value*)
Add nunjucks template helpers in the namespace for our module. Typically called
with an object in which each property is a helper name and each value
is a helper function. Can also be called with `name, function` to add
just one helper.
### addHelperShortcut(*name*)
Add a nunjucks template helper to the global namespace. This should
be used very sparingly, and pretty much never in npm modules. The
only exceptions in apostrophe core are `apos.area` and `apos.singleton`.

The helper must be added first with `addHelpers`.
### pushAsset(*type*, *name*, *options*)
Push an asset to the browser. `type` may be `script`, `stylesheet`
or `template`. The second argument is the name of the file, without
the extension.

For stylesheets, if `name` is `editor`, then `public/css/editor.css`
is pushed. If `public/css/editor.less` exists it is compiled as needed
to create the CSS version.

For scripts, if `name` is `editor`, then `public/js/editor.js` is pushed.

For both scripts and stylesheets, if the module is subclassed, and
the file exists in both the parent module and the subclass, *both*
files are pushed, in that order.

If `type` is `template`, the corresponding template in this module is
rendered and added to the DOM of each page before the closing `body` tag, to be
cloned and made visible as needed. If the module is subclassed, only
the newest (subclass) version is sent.

If `options.when` is set to `always` or not specified, the asset is
included in every page regardless of whether the user is logged in. If
`options.when` is set to `user`, it is included only if the user is logged in.
### render(*req*, *name*, *data*)
Render a template. Template overrides are respected; the
project level lib/modules/modulename/views folder wins if
it has such a template, followed by the npm module,
followed by its parent classes. If you subclass a module,
your version wins if it exists.

You MUST pass req as the first argument. This allows
internationalization/localization to work. If you
are writing a Nunjucks helper function, use
self.partial instead. This method is primarily used
to implement routes that respond with HTML fragments.

All properties of `data` appear in Nunjucks templates as
properties of the `data` object. Nunjucks helper functions
can be accessed via the `apos` object.

If not otherwise specified, `data.user` and
`data.permissions` are provided for convenience.

The data argument may be omitted.
### partial(*name*, *data*)
For use in Nunjucks helper functions. Renders a template,
in the context of the same request that started the
original call to Nunjucks. Otherwise the
same as `render`.
### renderString(*req*, *s*, *data*)
Render a template in a string (not from a file), looking for
includes, etc. in our preferred places.

Otherwise the same as `render`.
### partialString(*req*, *s*, *data*)
For use in Nunjucks helper functions. Renders a template
found in a string (not a file), in the context of the
same request that started the original call to Nunjucks.
Otherwise the same as `partial`.
### renderer(*name*, *data*)
Returns a function that can be used to invoke
self.render at a later time. The returned function
must be called with req. You may pass data now
and also when invoking the function; data passed
now serves as defaults for the object passed later.
### partialer(*name*, *data*)
Returns a function that can be used to invoke
self.partial at a later time. You may pass data now
and also when invoking the function; data passed
now serves as defaults for the object passed later.
### renderPage(*req*, *template*, *data*)
TIP: you probably want `self.sendPage`, which loads
`data.home` for you and also sends the response to the browser.

This method generates a complete HTML page for transmission to the
browser. Returns HTML markup ready to send (but `self.sendPage` is
more convenient).

If `template` is a function it is passed a data object,
otherwise it is rendered as a nunjucks template relative
to this module via self.render.

`data` is provided to the template, with additional
default properties as described below.

Depending on whether the request is an AJAX request,
`outerLayout` is set to:

`apostrophe-templates:outerLayout.html`

Or:

`apostrophe-templates:refreshLayout.html`

This allows the template to handle either a content area
refresh or a full page render just by doing this:

`{% extend outerLayout %}`

Note the lack of quotes.

Under the following conditions, `refreshLayout.html`
is used in place of `outerLayout.html`:

`req.xhr` is true (always set on AJAX requests by jQuery)
`req.query.xhr` is set to simulate an AJAX request
`req.decorate` is false
`req.query.apos_refresh` is true

These default properties are provided on
the `data` object in nunjucks:

`data.user` (req.user)
`data.query` (req.query)
`data.permissions` (req.user._permissions)
`data.calls` (javascript markup to insert all global and
  request-specific calls pushed by server-side code)

### sendPage(*req*, *template*, *data*)
This method generates and sends a complete HTML page to the browser.

If `template` is a function it is passed a data object,
otherwise it is rendered as a nunjucks template relative
to this module via self.render.

`data` is provided to the template, with additional
default properties as described below.

`outerLayout` is set to:

`apostrophe-templates:outerLayout.html`

Or:

`apostrophe-templates:refreshLayout.html`

This allows the template to handle either a content area
refresh or a full page render just by doing this:

`{% extend outerLayout %}`

Note the lack of quotes.

Under the following conditions, `refreshLayout.html`
is used in place of `outerLayout.html`:

`req.xhr` is true (always set on AJAX requests by jQuery)
`req.query.xhr` is set to simulate an AJAX request
`req.decorate` is false
`req.query.apos_refresh` is true

These default properties are provided on
the `data` object in nunjucks:

`data.user` (req.user)
`data.query` (req.query)
`data.permissions` (req.user._permissions)
`data.calls` (javascript markup to insert all global and
  request-specific calls pushed by server-side code)
`data.home` (basic information about the home page, usually with ._children)

First, `pageBeforeSend` is invoked on **every module that
has such a method**. It receives `req` and an optional callback, and
can modify `req.data`.
### pushCreateSingleton(*req*, *when*)
Push a browser call to instantiate an object with the same
moog type name as this module on the browser side, passing the
given options to the constructor. The singleton is given the
same alias on the `apos` object as it has on the server, if any,
otherwise it is still available via `apos.modules[full-module-name]`.

This method calls `getCreateSingletonOptions(req)` to determine
what options object to pass to the browser-side singleton.

If the `req` option is omitted or null, `pushBrowserCall` is used;
this is adequate if you don't need different options depending
on the current user. `getBrowserSingletonOptions()` will also
get an undefined argument in this case.

If `req` is given, `req.browserCall` is used, and
the singleton is created only once per page lifetime in the browser,
even if an `apos.change` event would otherwise cause it to be created again.

If `req` is given and `when` is not, the singleton is always created; it is assumed that
you are looking at the request to decide if it is needed before calling.

If `when` is given, the singleton is created only for the specified scene
(`always` or `user`).

If neither is given, the singleton is created only for the `user` scene
(a user is logged in, or `req.scene` has been set to `user`).

This method is not called automatically. Invoke it if your module
actually needs a singleton on the browser side. Defining the moog type
for that singleton is up to you (hint: look at various `user.js` files).
### getCreateSingletonOptions(*req*)
`pushCreateSingleton` calls this method to find out what options should
be passed to the singleton it creates on the browser side. These must be
in the form of a JSON-friendly object. By default, the `action` property
is passed as the sole option, which is sometimes sufficient.
