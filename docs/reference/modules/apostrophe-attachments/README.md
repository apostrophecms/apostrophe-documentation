# apostrophe-attachments
## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
### `apos.attachments`
This module implements the
[attachment](/reference/field-types/attachment.md) schema field type,
which makes it straightforward to allow users to attach uploaded files to docs.

## Options

### `addImageSizes`

Add an array of image sizes, in addition to Apostrophe's standard sizes. For example:

```javascript
[
  {
     name: 'tiny',
     width: 100,
     height: 100
  }
]
```

The resulting image *will not exceeed* either dimension given, and will preserve its
aspect ratio.

These extra sizes are then available as the `size` option to `apostrophe-images` widgets
and when calling `apos.attachments.url`.

### `imageSizes`

Like `addImageSizes`, but Apostrophe's standard sizes are completely replaced. Bear in mind
that certain sizes are used by Apostrophe's editing interface unless overridden. We recommend
using `addImageSizes`.

### `fileGroups`

Apostrophe will reject files that do not have extensions configured via `fileGroups`.
the default setting is:

```
[
  {
    name: 'images',
    label: 'Images',
    extensions: [ 'gif', 'jpg', 'png' ],
    extensionMaps: {
      jpeg: 'jpg'
    },
    // uploadfs should treat this as an image and create scaled versions
    image: true
  },
  {
    name: 'office',
    label: 'Office',
    extensions: [ 'txt', 'rtf', 'pdf', 'xls', 'ppt', 'doc', 'pptx', 'sldx', 'ppsx', 'potx', 'xlsx', 'xltx', 'csv', 'docx', 'dotx' ],
    extensionMaps: {},
    // uploadfs should just accept this file as-is
    image: false
  }
]
```

NOTE: adding another extension for `images` will not make web browsers
magically know how to show it or teach uploadfs how to scale it. So don't do that.
However, see `svgImages` below.

You may add extensions to the `office` fileGroup.

## `svgImages`

If set to `true`, SVGs are permitted to be uploaded as "images" in Apostrophe. This
means they may appear in any widget that uses images, such as the `apostrophe-images`
widget. Since programmatically cropping SVGs across all possible SVG configurations is
difficult if not impossible, manual cropping is not permitted, and autocropping does
not take place either, even if an `aspectRatio` option is present for the widget.
To help you account for this, the CSS class `apos-slideshow-item--svg` is added
to the relevant item in the slideshow on the front end. And, the standard `widgetBase.html`
for this module works together with styles provided in `always.less` to do something
reasonable, presenting the svg with `background-size: contain`, which leverages the
fact that most SVGs play very nicely with your background.

If you have overridden `widget.html` for `apostrophe-images-widgets`, view recent commits
on `widgetBase.html` to see how to implement this technique yourself.


## Methods
### addFieldType() *[schemaField]*

### fieldTypePartial(*data*) *[schemaField]*

### indexer(*value*, *field*, *texts*) *[schemaField]*

### acceptableExtension(*field*, *attachment*) *[schemaField]*

### accept(*req*, *file*, *callback*) *[api]*
For backwards compatibility. Equivalent to calling `insert` with
the same three arguments.
### insert(*req*, *file*, *options*, *callback*) *[api]*
Insert a file as an Apostrophe attachment. The `file` object
should be an object with `name` and `path` properties.
`name` must be the name the user claims for the file, while `path`
must be the actual full path to the file on disk and need not have
any file extension necessarily.

Note that when using Express to handle file uploads,
req.files['yourfieldname'] will be such an object as long as you
configure jquery fileupload to submit one per request.

The `options` argument may be omitted completely.
If `options.permissions` is explicitly set to `false`,
permissions are not checked.

`callback` is invoked with `(null, attachment)` where
`attachment` is an attachment object, suitable
for passing to the `url` API and for use as the value
of an `type: 'attachment'` schema field.

If `callback` is omitted completely, a promise is returned.
The promise resolves to an attachment object.
### getFileGroup(*extension*) *[api]*

### crop(*req*, *_id*, *crop*, *callback*) *[api]*

### sanitizeCrop(*crop*) *[api]*

### clone(*req*, *source*, *callback*) *[api]*
Clones a file
### getMissingAttachmentUrl() *[api]*
This method return a default icon url if an attachment is missing
to avoid template errors
### url(*attachment*, *options*) *[api]*
This method is available as a template helper: apos.attachments.url

Given an attachment object,
return the URL. If options.size is set, return the URL for
that size (one-third, one-half, two-thirds, full). full is
"full width" (1140px), not the original. For the original,
pass `original`. If size is not specified, you will receive
the `full` size if an image, otherwise the original.

If the "uploadfsPath" option is true, an
uploadfs path is returned instead of a URL.
### first(*within*, *options*) *[api]*
This method is available as a template helper: apos.attachments.first

Find the first attachment referenced within any object with
attachments as possible properties or sub-properties.

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass page.thumbnail to avoid an exhaustive search, especially
if the page has many joins.

Returns the first attachment matching the criteria.

For ease of use, a null or undefined `within` argument is accepted.

Examples:

1. In the body please

apos.attachments.first(page.body)

2. Must be a PDF

apos.attachments.first(page.body, { extension: 'pdf' })

3. May be any office-oriented file type

apos.attachments.first(page.body, { group: 'office' })

apos.images.first is a convenience wrapper for fetching only images.

OPTIONS:

You may specify `extension`, `extensions` (an array of extensions)
or `group` to filter the results.
### all(*within*, *options*) *[api]*
This method is available as a template helper: apos.attachments.all

Find all attachments referenced within an object, whether they are
properties or sub-properties (via joins, etc).

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass piece.thumbnail to avoid an exhaustive search, especially
if the piece has many joins.

Returns an array of attachments, or an empty array if none are found.

When available, the `_description`, `_credit`, `_creditUrl`, and '_title' are
also returned as part of the object.

For ease of use, a null or undefined `within` argument is accepted.

Examples:

1. In the body please

apos.attachments.all(page.body)

2. Must be a PDF

apos.attachments.all(page.body, { extension: 'pdf' })

3. May be any office-oriented file type

apos.attachments.all(page.body, { group: 'office' })

apos.images.all is a convenience wrapper for fetching only images.

OPTIONS:

You may specify `extension`, `extensions` (an array of extensions)
or `group` to filter the results.

If `options.annotate` is true, a `._urls` property is added to all
image attachments wherever they are found in `within`, with
subproperties for each image size name, including `original`.
For non-images, a `._url` property is set.
### each(*criteria*, *limit*, *each*, *callback*) *[api]*
Iterates over all of the attachments that exist, processing
up to `limit` attachments at any given time.

If only 3 arguments are given the limit defaults to 1.

For use only in command line tasks, migrations and other batch operations
in which permissions are a complete nonissue. NEVER use on the front end.
### hasFocalPoint(*attachment*) *[api]*
Returns true if, based on the provided attachment object,
a valid focal point has been specified. Useful to avoid
the default of `background-position: center center` if
not desired.
### focalPointToBackgroundPosition(*attachment*) *[api]*
If a focal point is present on the attachment, convert it to
CSS syntax for `background-position`. No trailing `;` is returned.
The coordinates are in percentage terms.
### getFocalPoint(*attachment*) *[api]*
Returns an object with `x` and `y` properties containing the
focal point chosen by the user, as percentages. If there is no
focal point, null is returned.
### isCroppable(*attachment*) *[api]*
Returns true if this type of attachment is croppable.
Available as a template helper.
### isSized(*attachment*) *[api]*
Returns true if this type of attachment is sized,
i.e. uploadfs produces versions of it for each configured
size, as it does with GIF, JPEG and PNG files.

Accepts either an entire attachment object or an extension.

Can accept `jpeg` or `jpg`, because it is needed prior to the
imagemagick code that resolves that difference.
### resolveExtension(*extension*) *[api]*
Resolve a file extension such as jpeg to its canonical form (jpg).
If no extension map is configured for this extension, return it as-is.
### addTypeMigration() *[api]*

### addDocReferencesMigration() *[api]*

### addRecomputeAllDocReferencesTask() *[api]*

### recomputeAllDocReferences(*callback*) *[api]*
Recompute the `docIds` and `trashDocIds` arrays
from scratch. Should only be needed by the
one-time migration that fixes these for older
databases, but can be run at any time via the
`apostrophe-attachments:recompute-doc-references`
task, just in case the need arises or your site
was affected by the very brief availability of 2.77.0
which effectively marked all attachments as
not in use.
### addFixPermissionsMigration() *[api]*

### addResetUploadfsPermissionsTask() *[api]*

### resetUploadfsPermissions(*callback*) *[api]*

### docAfterSave(*req*, *doc*, *options*, *callback*) *[api]*

### docAfterTrash(*req*, *doc*, *callback*) *[api]*

### docAfterRescue(*req*, *doc*, *callback*) *[api]*

### updateDocReferences(*doc*, *callback*) *[api]*
When the last doc that contains this attachment goes to the
trash, its permissions should change to reflect that so
it is no longer web-accessible to those who know the URL.

This method is invoked after any doc is inserted, updated, trashed
or rescued.
### updatePermissions(*callback*) *[api]*
Update the permissions in uploadfs of all attachments
based on whether the documents containing them
are in the trash or not. Specifically, if an attachment
has been utilized at least once but no longer has
any entries in `docIds` and `trash` is not yet true,
it becomes web-inaccessible, `utilized` is set to false
and `trash` is set to true. Similarly, if an attachment
has entries in `docIds` but `trash` is true,
it becomes web-accessible and trash becomes false.

This method is invoked at the end of `updateDocReferences`
and also at the end of the migration that adds `docIds`
to legacy sites. You should not need to invoke it yourself.
### applyPermissions(*attachment*, *trash*, *callback*) *[api]*
Enable or disable access to the given attachment via uploadfs, based on whether
trash is true or false. If the attachment is an image, access
to the size indicated by the `sizeAvailableInTrash` option
(usually `one-sixth`) remains available. This operation is carried
out across all sizes and crops.
### migrateToDisabledFileKeyTask(*argv*, *callback*) *[api]*

### migrateFromDisabledFileKeyTask(*argv*, *callback*) *[api]*

### urlsTask(*callback*) *[api]*

### addFixOrientationsMigration() *[api]*

### pushAssets() *[browser]*

### pushCreateSingleton() *[browser]*

### initUploadfs(*callback*)

### apostropheDestroy(*callback*)

### enableCollection(*callback*)

### ensureIndexes(*callback*)

### enableHelpers()

### addPermissions()

## Nunjucks template helpers
### url(*attachment*, *options*)
This method is available as a template helper: apos.attachments.url

Given an attachment object,
return the URL. If options.size is set, return the URL for
that size (one-third, one-half, two-thirds, full). full is
"full width" (1140px), not the original. For the original,
pass `original`. If size is not specified, you will receive
the `full` size if an image, otherwise the original.

If the "uploadfsPath" option is true, an
uploadfs path is returned instead of a URL.
### first(*within*, *options*)
This method is available as a template helper: apos.attachments.first

Find the first attachment referenced within any object with
attachments as possible properties or sub-properties.

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass page.thumbnail to avoid an exhaustive search, especially
if the page has many joins.

Returns the first attachment matching the criteria.

For ease of use, a null or undefined `within` argument is accepted.

Examples:

1. In the body please

apos.attachments.first(page.body)

2. Must be a PDF

apos.attachments.first(page.body, { extension: 'pdf' })

3. May be any office-oriented file type

apos.attachments.first(page.body, { group: 'office' })

apos.images.first is a convenience wrapper for fetching only images.

OPTIONS:

You may specify `extension`, `extensions` (an array of extensions)
or `group` to filter the results.
### all(*within*, *options*)
This method is available as a template helper: apos.attachments.all

Find all attachments referenced within an object, whether they are
properties or sub-properties (via joins, etc).

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass piece.thumbnail to avoid an exhaustive search, especially
if the piece has many joins.

Returns an array of attachments, or an empty array if none are found.

When available, the `_description`, `_credit`, `_creditUrl`, and '_title' are
also returned as part of the object.

For ease of use, a null or undefined `within` argument is accepted.

Examples:

1. In the body please

apos.attachments.all(page.body)

2. Must be a PDF

apos.attachments.all(page.body, { extension: 'pdf' })

3. May be any office-oriented file type

apos.attachments.all(page.body, { group: 'office' })

apos.images.all is a convenience wrapper for fetching only images.

OPTIONS:

You may specify `extension`, `extensions` (an array of extensions)
or `group` to filter the results.

If `options.annotate` is true, a `._urls` property is added to all
image attachments wherever they are found in `within`, with
subproperties for each image size name, including `original`.
For non-images, a `._url` property is set.
### hasFocalPoint(*attachment*)
Returns true if, based on the provided attachment object,
a valid focal point has been specified. Useful to avoid
the default of `background-position: center center` if
not desired.
### getFocalPoint(*attachment*)
Returns an object with `x` and `y` properties containing the
focal point chosen by the user, as percentages. If there is no
focal point, null is returned.
### focalPointToBackgroundPosition(*attachment*)
If a focal point is present on the attachment, convert it to
CSS syntax for `background-position`. No trailing `;` is returned.
The coordinates are in percentage terms.
### isCroppable(*attachment*)
Returns true if this type of attachment is croppable.
Available as a template helper.
