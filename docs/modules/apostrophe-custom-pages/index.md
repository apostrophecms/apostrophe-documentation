---
title: "apostrophe-custom-pages (module)"
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-custom-pages-cursor
  - browser-apostrophe-custom-pages
  - browser-apostrophe-custom-pages-chooser
  - browser-apostrophe-custom-pages-relationship-editor
---
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/index.html)
A base class for modules that enhance the functionality of a page type.
Extra fields can be added to the page settings modal in the usual way via
the `addFields` option, and Express-style routes can be added to handle
URLs that extend beyond the slug of the page using the `dispatch` method.

The [apostrophe-pieces-pages](../apostrophe-pieces-pages/index.html) module
is a good example of a subclass of this module.

## Options

### `name`

The name, typically singular, of the page type. If it is not set,
and the name of the module ends in `-pages`, `name` is set to the name
of the module with `-pages` changed to `-page`. If the name of the module
does not end in `-pages`, the name of the page type is identical to the
name of the module.

### `scene`

Normally, anonymous site visitors receive only the stylesheets and scripts
included in the `anon` asset scene (those that are pushed with
`{ when: 'always' }`). If your page will use assets, such as
Apostrophe's schemas and modals, that are normally reserved for logged-in users
then you will want to set `scene` to `user` in order to load them every time
when this type of page is visited.


## Methods
### dispatch(*pattern *, *, middleware..., handler*) *[dispatch]*
Add an Express-style route that responds when "the rest" of the URL, beyond
the page slug itself, matches a pattern.

For instance,  if the page slug is `/poets`, the URL is
`/poets/chaucer`, and this method has been called with
`('/:poet', self.poetPage)`, then the `poetPage` method will
be invoked with `(req, callback)`.

**Special case:** if the page slug is simply `/poets` (with no slash) and
there is a dispatch route with the pattern `/`, that route will be invoked.

Dispatch routes can also have middleware. Pass middleware functions as
arguments in between the pattern and the handler. Middleware is invoked
with `(req, stop, callback)`. If your middleware wishes to prevent the
handler from being invoked, call `stop(null)` rather than `callback(null)`.
Otherwise the chain of middleware continues and, at the end, the handler is invoked.
### pageServe(*req*, *callback*) *[dispatch]*
Called for us by `apostrophe-pages` when any page is accessed.
Checks first to make sure that the page that best matches the longest
prefix of the URL (`req.data.bestPage`) is of the appropriate type
for this module. If so, the remainder of the URL is compared to the
dispatch routes that have been added via the `dispatch` method, and
the appropriate route, if any, is invoked, with `req.data.page` being set.

If there are no matches, a 404 not found response occurs.

If there are no dispatch routes for this module, an exact match of
the URL sets `req.data.page`, otherwise a 404 not found response occurs.
### match(*req*, *rule*, *url*) *[dispatch]*
Match a URL according to the provided rule as registered
via the dispatch method. If there is a match, `req.params` is
set exactly as it would be by Express and `true` is returned.
Invoked by the `pageServe` method.
### acceptResponsibility(*req*) *[dispatch]*
Called by `pageServe`. Accepts responsibility for
the current URL by assigning `req.data.bestPage` to
`req.page` and implementing the `scene` option, if set
for this module.
