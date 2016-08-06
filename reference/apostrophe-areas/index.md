---
title: "apostrophe-areas (module)"
children:
  - browser-apostrophe-areas
  - browser-apostrophe-areas-editor
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

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

## helpers
### singleton(*doc*, *name*, *type*, *_options*)

### area(*doc*, *name*, *_options*)

### widget(*widget*, *options*)

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
