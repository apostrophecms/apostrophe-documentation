---
title: "apostrophe-areas (module)"
children:
  - browser-apostrophe-areas
  - browser-apostrophe-areas-editor
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
An area is a series of zero or more widgets. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
apostrophe-cursors. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.


## Methods
### setWidgetManager(*name*, *manager*) *[api]*

### getWidgetManager(*name*) *[api]*

### findSingletonWidget(*area*, *type*) *[api]*

### renderArea(*area*, *options*) *[api]*

### sanitizeItems(*req*, *items*, *callback*) *[api]*
Sanitize an array of items intended to become
the items property of an area. Invokes the
sanitize method for each widget's manager. Widgets
with no manager are discarded.
### renderWidget(*req*, *type*, *data*, *options*, *callback*) *[api]*

### saveArea(*req*, *docId*, *dotPath*, *items*, *callback*) *[api]*
Update or create a singleton at the specified
dot path in the document with the specified
id, if we have permission to do so. The
widget in the singleton will be saved with the
specified JSON-compatible data.
### walk(*doc*, *callback*) *[api]*
Walk the areas in a doc. The callback receives the
area object and the dot-notation path to that object.

If the callback explicitly returns `false`, the area
is *removed* from the page object, otherwise no
modifications are made.
### getSchemaOptions(*doc*, *name*) *[api]*

## Nunjucks template helpers
### singleton(*doc*, *name*, *type*, *_options*)
apos.singleton renders a single widget of a fixed type, standing alone
in the page. The `_options` object is passed to the widget.

A singleton is just a special case of an area, so you can change your
mind later and call `apos.area` with the same `name`.

The `name` property distinguishes this singleton from other areas in
the same `doc`.

Alternate syntax: `{ area: doc.areaname, type: type, ... more options }`
### area(*doc*, *name*, *_options*)
apos.area renders an area: a column of widgets of one or more types.

The `_options` object must contain a `widgets` property, an object which
must at least contain a property by the name of each allowed widget. The
corresponding value should be an object, and is passed on as options to
widgets of that type appearing in this area.

The `name` property distinguishes this area from other areas in
the same `doc`.

The `limit` option may be used to limit the number of widgets allowed.

Alternate syntax: `{ area: doc.areaname, ... more options }`
### widget(*widget*, *options*)
apos.areas.widget renders one widget. Invoked by both `apos.area` and
`apos.singleton`. Not
often called directly, but see `area.html` if you are interested in
doing so.
## API Routes
### POST /modules/apostrophe-areas/save-area

### POST /modules/apostrophe-areas/edit-virtual-area
Render an editor for a virtual area with the content
specified as an array of items by the req.body.content
property, if any. For use when you are supplying your own storage
(for instance, the blog module uses this to render
an area editor for the content of a post).
### POST /modules/apostrophe-areas/render-widget
Render a view of the widget specified by req.body.data (which contains its
properties) and req.body.options (treated as if they were passed to it via
aposSingleton). req.body.type specifies the widget type. It is assumed that
the widget is editable and should be rendered with contextual editing controls
if it supports them.
### POST /modules/apostrophe-areas/editor
Supplies static DOM templates to the editor on request
