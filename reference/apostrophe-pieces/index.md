---
title: "apostrophe-pieces (module)"
layout: module
children:
  - server-apostrophe-pieces-cursor
  - browser-apostrophe-pieces
  - browser-apostrophe-pieces-manager-modal
  - browser-apostrophe-pieces-editor-modal
  - browser-apostrophe-pieces-chooser
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
### addTrashPrefixFields(*fields*) *[api]*

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

### deduplicateTrash(*req*, *piece*, *callback*) *[api]*
After moving pieces to the trash, prefix any fields that have
unique indexes so that other pieces are allowed to reuse
those usernames, email addresses, etc.
### beforeRescue(*req*, *id*, *callback*) *[api]*

### afterRescue(*req*, *id*, *callback*) *[api]*

### deduplicateRescue(*req*, *piece*, *callback*) *[api]*
When rescuing pieces from the trash, attempt to un-prefix any fields
that have unique indexes. However, if we then find it's been taken
in the meanwhile, leave the prefix in place and leave it up to
the user to resolve the issue.
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

### createRoutes() *[routes]*

### pushAssets() *[browser]*

### pushDefineSingleton() *[browser]*

### getCreateSingletonOptions(*req*) *[browser]*

## API Routes
### POST /modules/apostrophe-pieces/insert

### POST /modules/apostrophe-pieces/retrieve

### POST /modules/apostrophe-pieces/list

### POST /modules/apostrophe-pieces/update

### POST /modules/apostrophe-pieces/publish

### POST /modules/apostrophe-pieces/manager-modal

### POST /modules/apostrophe-pieces/chooser-modal

### POST /modules/apostrophe-pieces/editor-modal

### POST /modules/apostrophe-pieces/create-modal

### POST /modules/apostrophe-pieces/trash

### POST /modules/apostrophe-pieces/rescue

