---
title: "apostrophe-pieces (module)"
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
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### pushAssets(*req*, *criteria*, *projection*) *[browser]*

### pushCreateSingleton(*req*, *criteria*, *projection*) *[browser]*

### requirePiece(*req*, *res*, *next*) *[api]*
middleware for JSON API routes that expect the ID of
an existing piece at req.body._id, with editing privileges
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

### composeSchema() *[api]*

### composeFilters() *[api]*

### composeColumns() *[api]*

### searchDetermineTypes(*types*) *[api]*
Enable inclusion of this type in sitewide search results
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

