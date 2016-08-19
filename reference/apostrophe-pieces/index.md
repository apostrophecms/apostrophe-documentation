---
title: "apostrophe-pieces (module)"
layout: module
children:
  - server-apostrophe-pieces-cursor
  - browser-apostrophe-pieces
  - browser-apostrophe-pieces-manager-modal
  - browser-apostrophe-pieces-editor-modal
  - browser-apostrophe-pieces-manager
  - browser-apostrophe-pieces-create-modal
  - browser-apostrophe-pieces-chooser
  - browser-apostrophe-pieces-chooser-modal
  - browser-apostrophe-pieces-relationship-editor
---
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/index.html)
`apostrophe-pieces` provides a "base class" you can extend to create new content
types for your project. Just use the `addFields` option to create a schema and
you'll get a user interface for managing your content for free. Add in the
`apostrophe-pieces-pages` module to display an index page and permalink pages
for your pieces, and use `apostrophe-pieces-widgets` to allow them to be sprinkled
into pages all over the site. To learn more, see:

[Reusable content with pieces](http://unstable.apostrophenow.org/tutorials/getting-started/reusable-content-with-pieces.html)


## Methods
### createRoutes() *[routes]*

### find(*req*, *criteria*, *projection*) *[api]*
Returns a cursor for use in finding docs. See cursor.js for chainable
filters, and also yielders that actually deliver the docs to you
### findForEditing(*req*, *criteria*, *projection*) *[api]*
Returns a cursor that finds docs the current user can edit. Unlike
find(), this cursor defaults to including unpublished docs. Subclasses
of apostrophe-pieces often extend this to remove more default filters
### requirePiece(*req*, *res*, *next*) *[api]*
middleware for JSON API routes that expect the ID of
an existing piece at req.body._id, with editing privileges
### requirePieceEditorView(*req*, *res*, *next*) *[api]*
middleware for JSON API routes that expect the ID of
an existing piece at req.body._id, with privileges sufficient
to create items of this type and also to view this particular
piece (e.g. good enough to add a crop to an image)
### requireEditor(*req*, *res*, *next*) *[api]*
User must have some editing privileges for this type
### list(*req*, *filters*, *callback*) *[api]*

### insert(*req*, *piece*, *callback*) *[api]*

### update(*req*, *piece*, *callback*) *[api]*

### trash(*req*, *id*, *callback*) *[api]*

### rescue(*req*, *id*, *callback*) *[api]*

### convert(*req*, *piece*, *callback*) *[api]*

### findIfContextual(*req*, *piece*, *callback*) *[api]*

### afterConvert(*req*, *piece*, *callback*) *[api]*

### beforeCreate(*req*, *piece*, *callback*) *[api]*

### beforeSave(*req*, *piece*, *callback*) *[api]*

### afterCreate(*req*, *piece*, *callback*) *[api]*

### afterSave(*req*, *piece*, *callback*) *[api]*

### beforeUpdate(*req*, *piece*, *callback*) *[api]*

### afterUpdate(*req*, *piece*, *callback*) *[api]*

### beforeTrash(*req*, *id*, *callback*) *[api]*

### afterTrash(*req*, *id*, *callback*) *[api]*

### beforeRescue(*req*, *id*, *callback*) *[api]*

### afterRescue(*req*, *id*, *callback*) *[api]*

### beforeList(*req*, *filters*, *callback*) *[api]*

### afterList(*req*, *results*, *callback*) *[api]*

### apiResponse(*res*, *err*, *data*) *[api]*

### insertResponse(*req*, *res*, *err*, *data*) *[api]*

### updateResponse(*req*, *res*, *err*, *data*) *[api]*

### retrieveResponse(*req*, *res*, *err*, *data*) *[api]*

### listResponse(*req*, *res*, *err*, *data*) *[api]*

### trashResponse(*req*, *res*, *err*, *data*) *[api]*

### rescueResponse(*req*, *res*, *err*, *data*) *[api]*

### composeFilters() *[api]*

### composeColumns() *[api]*

### searchDetermineTypes(*types*) *[api]*
Enable inclusion of this type in sitewide search results
### isAdminOnly() *[api]*

### addPermissions() *[api]*

### addToAdminBar() *[api]*

### pushAssets() *[browser]*

### pushDefineSingleton() *[browser]*

### pageBeforeSend(*req*) *[browser]*
Before sending any page, create the singleton for working with this type of piece, but only
if there is an active user
### getCreateSingletonOptions(*req*) *[browser]*

## API Routes
### POST /modules/apostrophe-pieces/insert

### POST /modules/apostrophe-pieces/retrieve

### POST /modules/apostrophe-pieces/list

### POST /modules/apostrophe-pieces/update

### POST /modules/apostrophe-pieces/publish

### POST /modules/apostrophe-pieces/manage

### POST /modules/apostrophe-pieces/chooser

### POST /modules/apostrophe-pieces/editor

### POST /modules/apostrophe-pieces/create

### POST /modules/apostrophe-pieces/trash
TODO consider the following:
not using requirePiece for trash route because docs.trash already does
query to get the piece. it would be nice if you could pass a piece in
place of an id or criteria object so you can manipulate the object
earlier without performing additional queries
Another option here would be to hook into the docsBeforeTrash and
docsAfterTrash callAlls that take place in the trash method of docs
### POST /modules/apostrophe-pieces/route

