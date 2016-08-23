---
title: "apostrophe-images (module)"
layout: module
children:
  - server-apostrophe-images-cursor
  - browser-apostrophe-images-chooser
  - browser-apostrophe-images-relationship-editor
  - browser-apostrophe-images-manager-modal
  - browser-apostrophe-images-editor-modal
  - browser-apostrophe-images
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)

## Methods
### first(*within*, *options*) *[api]*
This method is available as a template helper: apos.images.first

Find the first image attachment referenced within an object that may have attachments
as properties or sub-properties.

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass page.thumbnail to avoid an exhaustive search, especially
if the page has many joins.

For ease of use, a null or undefined `within` argument is accepted.

Note that this method doesn't actually care if the attachment is part of
an `apostrophe-images` piece or not. It simply checks whether the `group`
property is set to `images`.

Examples:

1. First image in the body area please

apos.images.first(page.body)

2. Must be a GIF

apos.images.first(page.body, { extension: 'gif' })

(Note Apostrophe always uses .jpg for JPEGs.)

OPTIONS:

You may specify `extension` or `extensions` (an array of extensions)
to filter the results.
### all(*within*, *options*) *[api]*
This method is available as a template helper: apos.images.all

Find all image attachments referenced within an object that may have attachments
as properties or sub-properties.

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass page.thumbnail to avoid an exhaustive search, especially
if the page has many joins.

For ease of use, a null or undefined `within` argument is accepted.

Note that this method doesn't actually care if the attachment is part of
an `apostrophe-images` piece or not. It simply checks whether the `group`
property is set to `images`.

Examples:

1. All images in the body area please

apos.images.all(page.body)

2. Must be GIFs

apos.images.all(page.body, { extension: 'gif' })

(Note Apostrophe always uses .jpg for JPEGs.)

OPTIONS:

You may specify `extension` or `extensions` (an array of extensions)
to filter the results.
### enableHelpers() *[api]*

## Nunjucks template helpers
### first(*within*, *options*)
This method is available as a template helper: apos.images.first

Find the first image attachment referenced within an object that may have attachments
as properties or sub-properties.

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass page.thumbnail to avoid an exhaustive search, especially
if the page has many joins.

For ease of use, a null or undefined `within` argument is accepted.

Note that this method doesn't actually care if the attachment is part of
an `apostrophe-images` piece or not. It simply checks whether the `group`
property is set to `images`.

Examples:

1. First image in the body area please

apos.images.first(page.body)

2. Must be a GIF

apos.images.first(page.body, { extension: 'gif' })

(Note Apostrophe always uses .jpg for JPEGs.)

OPTIONS:

You may specify `extension` or `extensions` (an array of extensions)
to filter the results.
### all(*within*, *options*)
This method is available as a template helper: apos.images.all

Find all image attachments referenced within an object that may have attachments
as properties or sub-properties.

For best performance be reasonably specific; don't pass an entire page or piece
object if you can pass page.thumbnail to avoid an exhaustive search, especially
if the page has many joins.

For ease of use, a null or undefined `within` argument is accepted.

Note that this method doesn't actually care if the attachment is part of
an `apostrophe-images` piece or not. It simply checks whether the `group`
property is set to `images`.

Examples:

1. All images in the body area please

apos.images.all(page.body)

2. Must be GIFs

apos.images.all(page.body, { extension: 'gif' })

(Note Apostrophe always uses .jpg for JPEGs.)

OPTIONS:

You may specify `extension` or `extensions` (an array of extensions)
to filter the results.
