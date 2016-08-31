---
title: "apostrophe-custom-pages (module)"
layout: module
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

### match(*req*, *rule*, *url*) *[dispatch]*

### find(*req*, *criteria*, *projection*)
Return a cursor for finding pages of this type only. The cursor is an
`apostrophe-pages-cursor`, so it has access to filters like
`ancestors` and `children`.

Because pages are normally displayed by Apostrophe's page loading mechanism,
which uses an `apostrophe-pages-cursor`, it doesn't really make sense to return
a custom cursor subclass here. It would not be used when actually viewing the
page anyway. If you must have extra filters for specific page types, implicitly
subclass apostrophe-pages-cursor and add filters that are mindful of the
type of each page.
