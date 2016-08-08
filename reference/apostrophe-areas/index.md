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

An area is a series of zero or more widgets. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
apostrophe-cursors. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.

An area is a series of zero or more widgets. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
apostrophe-cursors. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.

An area is a series of zero or more widgets. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
apostrophe-cursors. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.

An area is a series of zero or more widgets. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
apostrophe-cursors. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.

An area is a series of zero or more widgets. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
apostrophe-cursors. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.


## Methods
### setWidgetManager(*name*, *manager*) *[api]*
Set the manager object for the given widget type name. The manager is
expected to provide `sanitize`, `output` and `load` methods. Normally
this method is called for you when you extend the `apostrophe-widgets`
module, which is recommended.
### getWidgetManager(*name*) *[api]*
Get the manager object for the given widget type name.
### renderArea(*area*, *options*) *[api]*
Render the given `area` object via `area.html`, passing the
specified `options` to the template. Called for you by the
`apos.area` and `apos.singleton` template helpers.
### sanitizeItems(*req*, *items*, *callback*) *[api]*
Sanitize an array of items intended to become
the `items` property of an area. Invokes the
sanitize method for each widget's manager. Widgets
with no manager are discarded. Invoked for you by
the routes that save areas and by the implementation
of the `area` schema field type.
### renderWidget(*req*, *type*, *data*, *options*, *callback*) *[api]*
Renders markup for a widget of the given `type`. The actual
content of the widget is passed in `data`. The callback is
invoked with `(null, html)` on success. Invoked by the
`render-widget` route, which is used to update a widget on the
page after it is saved.
### saveArea(*req*, *docId*, *dotPath*, *items*, *callback*) *[api]*
Update or create an area at the specified
dot path in the document with the specified
id, if we have permission to do so. The change is
saved in the database before the callback is invoked. The
`items` array is NOT sanitized here; you should call
`sanitizeItems` first. Called for you by the
`save-area` route.
### walk(*doc*, *iterator*) *[api]*
Walk the areas in a doc. Your iterator function is invoked once
for each area found, and receives the
area object and the dot-notation path to that object.
note that areas can be deeply nested in docs via
array schemas.

If the iterator explicitly returns `false`, the area
is *removed* from the page object, otherwise no
modifications are made. This happens in memory only;
the database is not modified.
### getSchemaOptions(*doc*, *name*) *[api]*
If the schema corresponding to the given doc's
`type` property has an `options` property for the
given field `name`, return that property. This is used
to conveniently default to the `options` already configured
for a particular area in the schema when working with
`apostrophe-pieces` in a page template.
## Nunjucks template helpers
### singleton(*doc*, *name*, *type*, *_options*)
apos.singleton renders a single widget of a fixed type, standing alone
in the page. The `_options` object is passed to the widget.

A singleton is just a special case of an area, so you can change your
mind later and call `apos.area` with the same `name`.

The `name` property distinguishes this singleton from other areas in
the same `doc`.

If `_options` is not specified, Apostrophe falls back to the options
configured for the given field `name` in the schema for this type of
`doc`. For ordinary pages there usually won't be any, but this is
very convenient when working with `apostrophe-pieces`.

Alternate syntax: `{ area: doc.areaname, type: type, ... more options }`
### area(*doc*, *name*, *_options*)
apos.area renders an area: a column of widgets of one or more types.

If present The `_options` object must contain a `widgets` property, an object
which must at least contain a property by the name of each allowed widget. The
corresponding value should be an object, and is passed on as options to
widgets of that type appearing in this area.

The `name` property distinguishes this area from other areas in
the same `doc`.

The `limit` option may be used to limit the number of widgets allowed.

If `_options` is not specified, Apostrophe falls back to the options
configured for the given field `name` in the schema for this type of
`doc`. For ordinary pages there usually won't be any, but this is
very convenient when working with `apostrophe-pieces`.

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
property, if any. The area will not attempt to save itself periodically.

Used to implement editing of areas within schemas.
### POST /modules/apostrophe-areas/render-widget
Render a view of the widget specified by req.body.data (which contains its
properties) and req.body.options (treated as if they were passed to it via
aposSingleton). req.body.type specifies the widget type. It is assumed that
the widget is editable and should be rendered with contextual editing controls
if it supports them.
### POST /modules/apostrophe-areas/editor
Supplies static DOM templates to the editor on request
