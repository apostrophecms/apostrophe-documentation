# apostrophe-images
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/README.md)
### `apos.images`
A subclass of `apostrophe-pieces`, `apostrophe-images` establishes a library
of uploaded images in formats suitable for use on the web.

Together with [apostrophe-images-widgets](/reference/modules/apostrophe-images-widgets),
this module provides a simple way to add downloadable PDFs and the like to
a website, and to manage a library of them for reuse.

Each `apostrophe-image` doc has an `attachment` schema field, implemented
by the [apostrophe-attachments](/reference/modules/apostrophe-attachments) module.

::: warning NOTE
By default, `apostrophe-images-widgets` take the `title` field of the image piece to fill
the img tag alt attribute.

We recommend for new projects to pass this option to your `apostrophe-images` module,
in order to add a new `alt` field to images. It will then be used in alt attributes:

```javascript
  // app.js
  modules: {
    'apostrophe-images': {
      enableAltField: true
    },
  }
```
This flag is now enabled by default in `apostrophe-boilerplate` for new projects.
:::

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

When available, the `_description`, `_credit`, `_creditUrl`, and '_title' are
also returned as part of the object.

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
### srcset(*attachment*, *cropRelationship*) *[api]*
This method is available as a template helper: apos.images.srcset

Given an image attachment, return a string that can be used as the value
of a `srcset` HTML attribute.
### isCroppable(*image*) *[api]*

### enableHelpers() *[api]*

### afterList(*req*, *results*, *callback*) *[api]*
Make the minimum size, if any, accessible to the templates
### getListProjection(*req*) *[api]*

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

When available, the `_description`, `_credit`, `_creditUrl`, and '_title' are
also returned as part of the object.

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
### srcset(*attachment*, *cropRelationship*)
This method is available as a template helper: apos.images.srcset

Given an image attachment, return a string that can be used as the value
of a `srcset` HTML attribute.
### isCroppable(*image*)

