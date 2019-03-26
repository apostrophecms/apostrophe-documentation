---
title: apostrophe-pieces (module)
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-pieces-cursor
  - browser-apostrophe-pieces
  - browser-apostrophe-pieces-manager-modal
  - browser-apostrophe-pieces-editor-modal
  - browser-apostrophe-pieces-chooser
  - browser-apostrophe-pieces-relationship-editor
---

# index

## Inherits from: [apostrophe-doc-type-manager](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-doc-type-manager/index.html)

`apostrophe-pieces` provides a "base class" you can extend to create new content types for your project. Just use the `addFields` option to create a schema and you'll get a user interface for managing your content for free. Add in the `apostrophe-pieces-pages` module to display an index page and permalink pages for your pieces, and use `apostrophe-pieces-widgets` to allow them to be sprinkled into pages all over the site. To learn more, see:

[Reusable content with pieces](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/getting-started/reusable-content-with-pieces.html)

## Options

### `slugPrefix`

If set this string, which typically should end with `-`, will be prepended to the slugs of all pieces of this type in order to prevent needless conflicts with the slugs of other piece types.

## More Options

See [reusable content with pieces](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/getting-started/reusable-content-with-pieces.html) for many additional options.

## Methods

### finalizeControls\(\) _\[api\]_

### findForEditing\(_req_, _criteria_, _projection_\) _\[api\]_

Returns a cursor that finds docs the current user can edit. Unlike find\(\), this cursor defaults to including unpublished docs. Subclasses of apostrophe-pieces often extend this to remove more default filters

### requirePiece\(_req_, _res_, _next_\) _\[api\]_

middleware for JSON API routes that expect the ID of an existing piece at req.body.\_id, with editing privileges

### requirePieceEditorView\(_req_, _res_, _next_\) _\[api\]_

middleware for JSON API routes that expect the ID of an existing piece this user is allowed to edit at req.body.\_id

### requireEditor\(_req_, _res_, _next_\) _\[api\]_

User must have some editing privileges for this type

### list\(_req_, _options_, _callback_\) _\[api\]_

options.filters can contain cursor filters. `options.chooser`, `options.format` and `options.manageView` are also implemented. For bc, if `options.filters` does not exist, all properties of options are treated as cursor filters.

### insert\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Insert a piece. Also invokes the `beforeInsert`, `beforeSave`, `afterInsert` and `afterSave` methods of this module.

You may omit the `options` argument completely.

If `options.permissions` is explicitly set to `false`, permissions are not checked. Otherwise the user must have the appropriate permissions to insert the piece.

For convenience, the piece is passed to the callback as the second argument. It's the same piece object, with some new properties.

If no callback is passed, returns a promise.

### update\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Update a piece. Also invokes the `beforeUpdate`, `beforeSave`, `afterUpdate` and `afterSave` methods of this module.

You may omit the `options` argument completely.

If `options.permissions` is explicitly set to `false`, permissions are not checked. Otherwise the user must have the appropriate permissions to insert the piece.

For convenience, the piece is passed to the callback as the second argument. It's the same piece object you passed, likely with modifications such as the `updatedAt` property.

### trash\(_req_, _id_, _callback_\) _\[api\]_

Move a piece to the trash by id. If `callback` is omitted, a promise is returned.

### rescue\(_req_, _id_, _callback_\) _\[api\]_

Rescue a piece from the trash by id. If `callback` is omitted, a promise is returned.

### convert\(_req_, _piece_, _callback_\) _\[api\]_

Convert the data supplied in `req.body` via the schema and update the piece object accordingly.

### afterConvert\(_req_, _piece_, _callback_\) _\[api\]_

Invoked after apos.schemas.convert by the `insert` and `update` routes

### beforeInsert\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Invoked by `self.insert`. Does nothing by default; convenient extension point

### beforeSave\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Invoked by `self.insert` and `self.update`. Does nothing by default; convenient extension point

### afterInsert\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Invoked by `self.insert`. Does nothing by default; convenient extension point

### afterSave\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Invoked by `self.insert` and `self.update`. Does nothing by default; convenient extension point

### beforeUpdate\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Invoked by `self.update`. Does nothing by default; convenient extension point

### afterUpdate\(_req_, _piece_, _options_, _callback_\) _\[api\]_

Invoked by `self.update`. Does nothing by default; convenient extension point

### beforeTrash\(_req_, _id_, _callback_\) _\[api\]_

Invoked by `self.trash`. Does nothing by default; convenient extension point

### afterTrash\(_req_, _id_, _callback_\) _\[api\]_

Invoked by `self.trash`. Does nothing by default; convenient extension point

### beforeRescue\(_req_, _id_, _callback_\) _\[api\]_

### afterRescue\(_req_, _id_, _callback_\) _\[api\]_

### beforeList\(_req_, _filters_, _callback_\) _\[api\]_

### afterList\(_req_, _results_, _callback_\) _\[api\]_

### apiResponse\(_res_, _err_, _data_\) _\[api\]_

### insertResponse\(_req_, _res_, _err_, _data_\) _\[api\]_

### updateResponse\(_req_, _res_, _err_, _data_\) _\[api\]_

### retrieveResponse\(_req_, _res_, _err_, _data_\) _\[api\]_

### listResponse\(_req_, _res_, _err_, _data_\) _\[api\]_

### trashResponse\(_req_, _res_, _err_, _data_\) _\[api\]_

### rescueResponse\(_req_, _res_, _err_, _data_\) _\[api\]_

### composeFilters\(\) _\[api\]_

### composeColumns\(\) _\[api\]_

### searchDetermineTypes\(_types_\) _\[api\]_

Enable inclusion of this type in sitewide search results

### isAdminOnly\(\) _\[api\]_

### addPermissions\(\) _\[api\]_

### addToAdminBar\(\) _\[api\]_

### addUrls\(_req_, _pieces_, _callback_\) _\[api\]_

Add `._url` properties to the given pieces, if possible. The default implementation does nothing, however [apostrophe-pieces-pages](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-pieces-pages/index.html) will call `setAddUrls` to point to [its own `addUrlsToPieces` method](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-pieces-pages/index.html#addUrlsToPieces).

### setAddUrls\(_fn_\) _\[api\]_

Called by [apostrophe-pieces-pages](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-pieces-pages/index.html) to replace the default `addUrls` method with one that assigns `._url` properties to pieces based on the most suitable pages of that type. See [the `addUrlsToPieces` method of `apostrophe-pieces-pages`](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-pieces-pages/index.html#addUrlsToPieces).

### composeBatchOperations\(\) _\[api\]_

### batchSimpleRoute\(_req_, _name_, _change_\) _\[api\]_

Implements a simple batch operation like publish or unpublish. Pass `req`, the `name` of a configured batch operation, and and a function that accepts \(req, piece, data, callback\), performs the modification on that one piece \(including calling `update` if appropriate\), and invokes its callback.

`data` is an object containing any schema fields specified for the batch operation. If there is no schema it will be an empty object.

If `req.body.job` is truthy, replies immediately to the request with `{ status: 'ok', jobId: 'cxxxx' }`. The `jobId` can then be passed to `apos.modules['apostrophe-jobs'].start()` on the rowser side to monitor progress.

Otherwise, replies to the request with { status: 'ok', data: piece } on success. If `ids` rather than `_id` were specified, `data` is an empty object.

To avoid RAM issues with very large selections and ensure that lifecycle callbacks like beforeUpdate, etc. are invoked, the current implementation processes the pieces in series.

### convertInsertAndRefresh\(_req_, _responder_\) _\[api\]_

Accept a piece found at `req.body`, via schema-based convert mechanisms, then invoke `responder` with `req, res, err, piece`. Implements `self.routes.insert`. Also used by the optional `apostrophe-pieces-rest-api` module.

If `req.piece` has a `_copyingId` property, fetch that piece and, if we have permission to edit, copy its non-schema-based top level areas into the new piece. This accounts for content editor-modal.js doesn't know about.

### convertUpdateAndRefresh\(_req_, _responder_\) _\[api\]_

Update the piece object at `req.piece` \(usually populated via the requirePiece middleware or by the insert route\) based on `req.body`, fetch the updated piece and invoke `responder` with `req, res, err, piece`. Implements the back end of the `update` route, also used by the optional `apostrophe-pieces-rest-api` module.

### copyExtraAreas\(_req_, _copyFrom_, _piece_, _callback_\) _\[api\]_

Copy top-level areas present in `copyFrom` to `piece`, leaving any that are already present in `piece` alone. The copy mechanism in the piece editor modal only knows about noncontextual schema fields, this method is called on the server side to copy contextual and undeclared areas too

### copyExtras\(_req_, _copyFrom_, _piece_, _callback_\) _\[api\]_

An empty stub you may override to copy extra properties not visible to the schema when the user carries out a "copy piece" operation. At this point schema fields and top level extra areas have already been copied

### getCreateControls\(_req_\) _\[api\]_

### getEditControls\(_req_\) _\[api\]_

### getChooserControls\(_req_\) _\[api\]_

### getManagerControls\(_req_\) _\[api\]_

### generate\(_i_\) _\[api\]_

Generate a sample piece of this type. The `i` counter is used to distinguish it from other samples. Useful for things like testing pagination, see the `your-piece-type:generate` task.

### modulesReady\(\) _\[api\]_

### createRoutes\(\) _\[routes\]_

### pushAssets\(\) _\[browser\]_

### pushDefineSingleton\(\) _\[browser\]_

### getCreateSingletonOptions\(_req_\) _\[browser\]_

### addTasks\(\) _\[tasks\]_

### addGenerateTask\(\) _\[tasks\]_

## API Routes

### POST /modules/apostrophe-pieces/insert

### POST /modules/apostrophe-pieces/retrieve

### POST /modules/apostrophe-pieces/list

### POST /modules/apostrophe-pieces/update

### POST /modules/apostrophe-pieces/publish

### POST /modules/apostrophe-pieces/unpublish

### POST /modules/apostrophe-pieces/tag

### POST /modules/apostrophe-pieces/untag

### POST /modules/apostrophe-pieces/manager-modal

### POST /modules/apostrophe-pieces/chooser-modal

### POST /modules/apostrophe-pieces/editor-modal

### POST /modules/apostrophe-pieces/create-modal

### POST /modules/apostrophe-pieces/trash

### POST /modules/apostrophe-pieces/rescue

### POST /modules/apostrophe-pieces/insert-via-upload

