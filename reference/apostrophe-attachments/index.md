---
title: "apostrophe-attachments (module)"
layout: module
children:
  - browser-apostrophe-attachments
  - browser-apostrophe-attachments-crop-editor
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
This module implements the
[attachment](../../tutorials/getting-started/schema-guide.html#attachment) schema field type,
which makes it straightforward to allow users to attach uploaded files to docs. See
the [schema guide](../../tutorials/getting-started/schema-guide.html#attachment) for
more information.


## Methods
### addFieldType() *[schemaField]*

### fieldTypePartial(*data*) *[schemaField]*

### indexer(*value*, *field*, *texts*) *[schemaField]*

### accept(*req*, *file*, *callback*) *[api]*
Accept a file as submitted by an HTTP file upload.
req is checked for permissions. The callback receives an error if any
followed by a file object.

"file" should be an object with "name" and "path" properties.
"name" must be the name the user claims for the file, while "path"
must be the actual full path to the file on disk and need not have
any file extension necessarily.

(Note that when using Express to handle file uploads,
req.files['yourfieldname'] will be such an object as long as you
configure jquery fileupload to submit one per request.)
### getFileGroup(*extension*) *[api]*

### crop(*req*, *_id*, *crop*, *callback*) *[api]*

### sanitizeCrop(*crop*) *[api]*

### clone(*req*, *source*, *callback*) *[api]*
Clones a file
### url(*attachment*, *options*) *[api]*
This method is available as a template helper: apos.attachments.url

Given an attachment object,
return the URL. If options.size is set, return the URL for
that size (one-third, one-half, two-thirds, full). full is
"full width" (1140px), not the original. For the original, don't pass size.
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
### each(*criteria*, *limit*, *each*, *callback*) *[api]*
Iterates over all of the attachments that exist, processing
up to `limit` attachments at any given time.

If only 3 arguments are given the limit defaults to 1.

For use only in command line tasks, migrations and other batch operations
in which permissions are a complete nonissue. NEVER use on the front end.
### addTypeMigration() *[api]*

### pushAssets() *[browser]*

### pushCreateSingleton() *[browser]*

### initUploadfs(*callback*)

### enableCollection(*callback*)

### enableHelpers()

### addPermissions()

## Nunjucks template helpers
### url(*attachment*, *options*)
This method is available as a template helper: apos.attachments.url

Given an attachment object,
return the URL. If options.size is set, return the URL for
that size (one-third, one-half, two-thirds, full). full is
"full width" (1140px), not the original. For the original, don't pass size.
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
## API Routes
### POST /modules/apostrophe-attachments/upload

### POST /modules/apostrophe-attachments/crop
Crop a previously uploaded image, based on the `id` POST parameter
and the `crop` POST parameter. `id` should refer to an existing
file in /attachments. `crop` should contain top, left, width and height
properties.

This route uploads a new, cropped version of
the existing image to uploadfs, named:

/attachments/ID-NAME.top.left.width.height.extension

The `crop` object is appended to the `crops` array property
of the file object.
### POST /modules/apostrophe-attachments/crop-editor

