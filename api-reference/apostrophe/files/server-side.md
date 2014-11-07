---
title: Files - server-side methods
---

## Overview

User-uploaded files, such as images, PDFs or Word documents, are part of every Apostrophe site.

Apostrophe stores information about these in the `aposFiles` MongoDB collection. A rich API is provided to browse, upload, annotate and display files.

The actual files themselves can be found in the `public/uploads/files` folder, if you're not using Amazon S3 for storage via [uploadfs](https://github.com/punkave/uploadfs). However, for best compatibility, you should always use the methods and Nunjucks helpers of Apostrophe to determine URLs for them.

A typical file object looks like this:

```javascript
{
  "_id": "78120023818271972",
  // Might be "images" or "office"
  "group": "images",
  "createdAt": "2014-11-06T20:52:24.656Z",
  // Part of the filename
  "name": "bloque-cover",
  "title": "bloque cover",
  // Standardized, always 3 lowercase letters
  "extension": "jpg",
  // Dimensions of original
  "width": 1553,
  "height": 971,
  // Or "portrait": true
  "landscape": true,
  // Corresponding person is in aposPages
  "ownerId": "674614893112991444",
  // An array of existing cropped versions
  // of the file
  "crops": [
    {
      "top": "17",
      "left": "0",
      "width": "1553",
      "height": "936"
    }
  ],
  // Detailed description, if provided
  "description": "Lots of details",
  // The artist
  "credit": "Ansel Adams",
  // Tags improve media library searches
  "tags": [
    "bayonet"
  ]
}
```

## Finding Files

Use these methods to search across all files in your Apostrophe website. Because they are going to the database to find files, they are asynchronous.

### `getFiles(req, options, callback)`

Fetch files according to the parameters specified by the `options` object.

#### Arguments

* `req` `(object)` the current Express request object [TODO: link to tutorial re: req objects], for permissions.
* `options` `(object)` An object containing all options.
* `callback` `(function)` called on completion, with error if any.

#### Returns `(object)`

The returned object contains the following information:

```javascript
{
  // count of files that match criteria, even
  // if not part of this response due to
  // skip or limit
  total: 100
  // array of file objects
  files: [{...}],
  // distinct set of tags for all of the files
  // matching the criteria
  tags: ['cool', 'awesome'],
}
```

#### Example

```javascript
// in context
  // TODO

// with all available options, with defaults if applicable
apos.getFiles(req, {
  // Populates a ._owner propery on each file object that is the Person object of the owner if set to true
  // This is set to false by default for performance reasons
  owners: false,
  // Specifies the file type group, by default 'images' and 'office' are available, pass as string
  group: null,
  // Specifies to only returns images owned by current user if set to 'user'
  owner: 'all',
  // Specifies ids to match, pass as array
  ids: null,
  // Specifies the owner id to filter on, pass as string
  ownerId: null,
  // Specifies the tags to filter on, pass as array
  tags: null,
  // Specifies to exclude images that contain the tags, pass as array
  notTags: null,
  // Specifies the extenion to filter on, pass as array
  extension: null,
  // Specifies to filter base on if the file is in the trash or not
  trash: 0,
  // Specifies minimum width and height for photos, pass as array [width, height]
  minSize: null,
  // If true, only files not marked private
  // are returned
  browsing: false,
  // Optional search string
  q: undefined,
  // To start with the 11th file, set skip to 10
  skip: 0,
  // To limit the number of files returned
  // for this particular request
  limit: undefined
}, function(err, files) {
  // ... do something with the files ...
});
```

### `browseFiles(req, options, callback)`

This method is identical to [getFiles](#code-get-files) except that:

1. The `browsing` option is always set.

2. All parameters are fully validated as if they came directly from an untrusted web browser. Specifically, it is safe to pass `req.body` as `options`.

This method is intended for use in implementing routes that accept browser input.

## Finding files in areas

Use these methods to find files that live in areas that belong to a page or snippet. Because they are referencing an area we already have in memory, they are synchronous.

### `areaFiles(page, 'body'[, options])` `(array)`

Find files referenced within an area, such as an image in a slideshow widget,
or a PDF in a file widget.

Returns all the files matching the criteria.

`page` (object) A page or snippet object that contains the area

`name` (string) Name of the area

`options` (object) *optional*. An object containing additional options

#### Real-World Example

Consider this example as might be found in a subclass of [snippets](../../../tutorials/snippets/index.html).

```javascript
// in context
var superBeforeShow = self.beforeShow;
self.beforeShow = function(req, snippet, callback) {

  // pass all of the files from my snippet body to the template
  req.extras.bodyFiles = options.apos.areaFiles(snippet, 'body');

  return superBeforeShow(req, snippet, callback);
}
```

#### All Options

```javascript
apos.areaFiles(page, 'myArea', {
  // Specifies just one acceptable file extension
  extension: 'gif',
  // Specifies multiple acceptable file extensions
  extensions: ['gif', 'png'],
  // Specifies the file type group, by
  // default 'images' and 'office' are available
  group: 'office',
  // Specifies the maximum number of files returned
  limit: 3
});


// alternative syntax using only an options object
// The area option is required, and it is a direct reference to your area
var files = apos.areaFiles({area: snippet.body});
```

### `areaFile(page, 'body' [, options])` `(object)`

This is a convenience method that returns the first file referenced within an area (an option of `limit: 1`), and takes all of the same parameters as [areaFiles](#area-files). It also allows for the alternative syntax.

### `areaImages(page, 'body' [, options])` `(array)`

This is a convenience method that returns files with a `group: 'images'` property referenced within an area, and takes all of the same parameters as [areaFiles](#area-files). It also allows for the alternative syntax.

### `areaImage(page, 'body' [, options])` `(object)`

This is a convenience method that returns the first file with a `group: 'images'` property referenced within an area (an option of `limit: 1`), and takes all of the same parameters as [areaFiles](#area-files). It also allows for the alternative syntax.
