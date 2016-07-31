---
title: "apostrophe-module (module)"
children:
  - server-apostrophe-module-cursor
  - browser-apostrophe-module
  - browser-apostrophe-module-editor
---

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
Add nunjucks helpers in the namespace for our module
### addHelperShortcut(*name*)

### pushAsset(*type*, *name*, *options*)

### render(*req*, *name*, *data*)
Render a template. Template overrides are respected; the
project level lib/modules/modulename/views folder wins if
it has such a template, followed by the npm module,
followed by its parent classes.

You MUST pass req as the first argument. This allows
internationalization/localization to work. If you
are writing a Nunjucks helper function, use
self.partial instead.

All properties of `data` appear in Nunjucks as
the `data` object. Nunjucks helper functions
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
now serves as defaults for the object passed later
### partialer(*name*, *data*)
Returns a function that can be used to invoke
self.partial at a later time. You may pass data now
and also when invoking the function; data passed
now serves as defaults for the object passed later
### renderPage(*req*, *template*, *data*)
TIP: you probably want self.sendPage, which loads
data.home for you.

This method generates a complete HTML page for transmission to the
browser. Returns HTML markup ready to send (but self.sendPage is
more convenient).

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

First, `beforeSendPage` is invoked on every module that
has such a method. It receives `req` and an optional callback, and
can modify `req.data`.
