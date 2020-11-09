# apostrophe-pieces
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/README.md)
`apostrophe-pieces` provides a "base class" you can extend to create new content
types for your project. Just use the `addFields` option to create a schema and
you'll get a user interface for managing your content for free. Add in the
`apostrophe-pieces-pages` module to display an index page and permalink pages
for your pieces, and use `apostrophe-pieces-widgets` to allow them to be sprinkled
into pages all over the site. To learn more, see:

[Reusable content with pieces](/core-concepts/reusable-content-pieces/)

## Options

### `slugPrefix`

If set this string, which typically should end with `-`, will be prepended
to the slugs of all pieces of this type in order to prevent needless
conflicts with the slugs of other piece types.

### `addToListProjection`

A MongoDB-style projection object indicating which additional properties of a piece will be returned
by the query that populates the list view in the "Manage Pieces" dialog box. This was added
for security reasons. Note that if you are simply using addColumns then this should happen automatically
for you. You would mainly need this option if you are overriding the list view template
altogether and displaying information in a custom way. Negative projections (exclusions) are
not supported.

## More Options

See [reusable content with pieces](/core-concepts/reusable-content-pieces/)
for many additional options.


## Methods
### finalizeControls() *[api]*

### findForEditing(*req*, *criteria*, *projection*) *[api]*
Returns a cursor that finds docs the current user can edit. Unlike
find(), this cursor defaults to including unpublished docs. Subclasses
of apostrophe-pieces often extend this to remove more default filters
### requirePiece(*req*, *res*, *next*) *[api]*
middleware for JSON API routes that expect the ID of
an existing piece at req.body._id, with editing privileges
### requirePieceEditorView(*req*, *res*, *next*) *[api]*
middleware for JSON API routes that expect the ID of
an existing piece this user is allowed to edit at req.body._id
### requireEditor(*req*, *res*, *next*) *[api]*
User must have some editing privileges for this type
### list(*req*, *options*, *callback*) *[api]*
options.filters can contain cursor filters. `options.chooser`, `options.format` and
`options.manageView` are also implemented. For bc, if `options.filters` does not exist,
all properties of options are treated as cursor filters.
### getListProjection(*req*) *[api]*
Used to fetch the projection used for the /modules/yourmodulename/list route to avoid disclosing
excessive information. By default, returns the `listProjection` option. A good extension point;
be sure to apply the `super` pattern to get the benefit of extensions in other modules,
like workflow.
### setListProjection(*req*, *cursor*) *[api]*
Implements setting the projection for the list route, see getListProjection.
### insert(*req*, *piece*, *options*, *callback*) *[api]*
Insert a piece. Also invokes the `beforeInsert`, `beforeSave`, `afterInsert` and
`afterSave` methods of this module.

You may omit the `options` argument completely.

If `options.permissions` is explicitly set to `false`, permissions are
not checked. Otherwise the user must have the appropriate permissions to
insert the piece.

For convenience, the piece is passed to the callback as the second argument.
It's the same piece object, with some new properties.

If no callback is passed, returns a promise.
### update(*req*, *piece*, *options*, *callback*) *[api]*
Update a piece. Also invokes the `beforeUpdate`, `beforeSave`, `afterUpdate` and
`afterSave` methods of this module.

You may omit the `options` argument completely.

If `options.permissions` is explicitly set to `false`, permissions are
not checked. Otherwise the user must have the appropriate permissions to
insert the piece.

For convenience, the piece is passed to the callback as the second argument.
It's the same piece object you passed, likely with modifications such as
the `updatedAt` property.
### trash(*req*, *id*, *callback*) *[api]*
Move a piece to the trash by id. If `callback` is omitted,
a promise is returned.
### rescue(*req*, *id*, *callback*) *[api]*
Rescue a piece from the trash by id. If `callback` is omitted,
a promise is returned.
### convert(*req*, *piece*, *callback*) *[api]*
Convert the data supplied in `req.body` via the schema and
update the piece object accordingly. If `req.convertOnlyTheseFields`
is present, touch only the fields present in that array.
### afterConvert(*req*, *piece*, *callback*) *[api]*
Invoked after apos.schemas.convert by the `insert` and
`update` routes
### beforeInsert(*req*, *piece*, *options*, *callback*) *[api]*
Invoked by `self.insert`. Does nothing by default; convenient extension point
### beforeSave(*req*, *piece*, *options*, *callback*) *[api]*
Invoked by `self.insert` and `self.update`. Does nothing by default; convenient extension point
### afterInsert(*req*, *piece*, *options*, *callback*) *[api]*
Invoked by `self.insert`. Does nothing by default; convenient extension point
### afterSave(*req*, *piece*, *options*, *callback*) *[api]*
Invoked by `self.insert` and `self.update`. Does nothing by default; convenient extension point
### beforeUpdate(*req*, *piece*, *options*, *callback*) *[api]*
Invoked by `self.update`. Does nothing by default; convenient extension point
### afterUpdate(*req*, *piece*, *options*, *callback*) *[api]*
Invoked by `self.update`. Does nothing by default; convenient extension point
### beforeTrash(*req*, *id*, *callback*) *[api]*
Invoked by `self.trash`. Does nothing by default; convenient extension point
### afterTrash(*req*, *id*, *callback*) *[api]*
Invoked by `self.trash`. Does nothing by default; convenient extension point
### beforeRescue(*req*, *id*, *callback*) *[api]*

### afterRescue(*req*, *id*, *callback*) *[api]*

### beforeList(*req*, *filters*, *callback*) *[api]*

### afterList(*req*, *results*, *callback*) *[api]*

### apiResponse(*res*, *err*, *data*) *[api]*
For legacy reasons, pieces have their own apiResponse method which is just a wrapper
for the newer apiResponder.
### insertResponse(*req*, *res*, *err*, *data*) *[api]*

### updateResponse(*req*, *res*, *err*, *data*) *[api]*

### retrieveResponse(*req*, *res*, *err*, *data*) *[api]*

### listResponse(*req*, *res*, *err*, *data*) *[api]*

### trashResponse(*req*, *res*, *err*, *data*) *[api]*

### rescueResponse(*req*, *res*, *err*, *data*) *[api]*

### composeFilters() *[api]*

### composeColumns() *[api]*

### validateSchema() *[api]*

### searchDetermineTypes(*types*) *[api]*
Enable inclusion of this type in sitewide search results
### isAdminOnly() *[api]*

### addPermissions() *[api]*

### addToAdminBar() *[api]*

### addUrls(*req*, *pieces*, *callback*) *[api]*
Add `._url` properties to the given pieces, if possible.
The default implementation does nothing, however
[apostrophe-pieces-pages](/reference/modules/apostrophe-pieces-pages) will
call `setAddUrls` to point to [its own `addUrlsToPieces` method](/reference/modules/apostrophe-pieces-pages#addurlstopieces-req-results-callback).
### setAddUrls(*fn*) *[api]*
Called by [apostrophe-pieces-pages](/reference/modules/apostrophe-pieces-pages) to
replace the default `addUrls` method with one that assigns `._url`
properties to pieces based on the most suitable pages of that type.
See [the `addUrlsToPieces` method of `apostrophe-pieces-pages`](/reference/modules/apostrophe-pieces-pages#addurlstopieces-req-results-callback).
### composeBatchOperations() *[api]*

### batchSimpleRoute(*req*, *name*, *change*) *[api]*
Implements a simple batch operation like publish or unpublish.
Pass `req`, the `name` of a configured batch operation, and
and a function that accepts (req, piece, data, callback),
performs the modification on that one piece (including calling
`update` if appropriate), and invokes its callback.

`data` is an object containing any schema fields specified
for the batch operation. If there is no schema it will be
an empty object.

If `req.body.job` is truthy, replies immediately to the request with
`{ status: 'ok', jobId: 'cxxxx' }`. The `jobId` can then
be passed to `apos.modules['apostrophe-jobs'].start()` on the rowser side to
monitor progress.

Otherwise, replies to the request with { status: 'ok', data: piece }
on success. If `ids` rather than `_id` were specified,
`data` is an empty object.

To avoid RAM issues with very large selections and ensure that
lifecycle callbacks like beforeUpdate, etc. are invoked, the current
implementation processes the pieces in series.
### convertInsertAndRefresh(*req*, *responder*) *[api]*
Accept a piece found at `req.body`, via
schema-based convert mechanisms, then
invoke `responder` with `req, res, err, piece`.
Implements `self.routes.insert`. Also used
by the optional `apostrophe-pieces-rest-api` module.

If `req.piece` has a `_copyingId` property, fetch that
piece and, if we have permission to edit, copy its
non-schema-based top level areas into the new piece.
This accounts for content editor-modal.js doesn't know about.
### convertUpdateAndRefresh(*req*, *responder*) *[api]*
Update the piece object at `req.piece`
(usually populated via the requirePiece middleware
or by the insert route) based on `req.body`, fetch the updated piece
and invoke `responder` with `req, res, err, piece`.
Implements the back end of the `update` route, also used
by the optional `apostrophe-pieces-rest-api` module.
### copyExtraAreas(*req*, *copyFrom*, *piece*, *callback*) *[api]*
Copy top-level areas present in `copyFrom` to `piece`,
leaving any that are already present in `piece` alone.
The copy mechanism in the piece editor modal only
knows about noncontextual schema fields, this method is called on the
server side to copy contextual and undeclared areas too
### copyExtras(*req*, *copyFrom*, *piece*, *callback*) *[api]*
An empty stub you may override to copy extra properties
not visible to the schema when the user carries out a
"copy piece" operation. At this point schema fields and
top level extra areas have already been copied
### getCreateControls(*req*) *[api]*

### getEditControls(*req*) *[api]*

### getChooserControls(*req*) *[api]*

### getManagerControls(*req*) *[api]*

### generate(*i*) *[api]*
Generate a sample piece of this type. The `i` counter
is used to distinguish it from other samples. Useful
for things like testing pagination, see the
`your-piece-type:generate` task.
### modulesReady() *[api]*

### createRoutes() *[routes]*

### pushAssets() *[browser]*

### pushDefineSingleton() *[browser]*

### getCreateSingletonOptions(*req*) *[browser]*

### addTasks() *[tasks]*

### addGenerateTask() *[tasks]*

## API Routes
### POST /modules/apostrophe-pieces/insert

### POST /modules/apostrophe-pieces/retrieve

### POST /modules/apostrophe-pieces/list

### POST /modules/apostrophe-pieces/update

### POST /modules/apostrophe-pieces/publish

### POST /modules/apostrophe-pieces/unpublish

### POST /modules/apostrophe-pieces/tag

### POST /modules/apostrophe-pieces/untag

### POST /modules/apostrophe-pieces/permissions

### POST /modules/apostrophe-pieces/manager-modal

### POST /modules/apostrophe-pieces/chooser-modal

### POST /modules/apostrophe-pieces/editor-modal

### POST /modules/apostrophe-pieces/create-modal

### POST /modules/apostrophe-pieces/batch-permissions-modal

### POST /modules/apostrophe-pieces/trash

### POST /modules/apostrophe-pieces/rescue

### POST /modules/apostrophe-pieces/insert-via-upload

