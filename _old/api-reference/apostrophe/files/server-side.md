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

**All of these methods are methods of the `apos` object.** You can access the `apos` object in `app.js` as `site.apos`. When subclassing one of Apostrophe's modules it is accessible as `self._apos`.

## Finding files in the database

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

### Obtaining paths to files

### `aposFilePath(file, options)`

Given a file object, as returned by [aposAreaFile](#apos-area-file) for instance, return the file's URL. If `options.size` is set, return the URL for that size (`one-sixth`, `one-third`, `one-half`, `two-thirds`, `full`).

`full` is "full width" (1140px), not the original. For the original, don't pass `size`. Note that the `size` option only makes sense for images.

Additional image sizes can be configured on a per-project basis.

There is a matching client-side JavaScript implementation accessible as `apos.filePath`.

**Always use this function to create URLs to files.** Otherwise your code will cease to work if your project's file storage is moved to Amazon S3 at a later date.

By default this function returns a URL, which is almost always what you want. If you need an `uploadfs` path instead, include `uploadfsPath: true` among your options. This is useful if you want to retrieve the original file from [uploadfs](https://github.com/punkave/uploadfs).

Real-world example:

Let's add a route in our subclass of the `people` module that allows the thumbnail portrait of the current user to be fetched as `/profile`.

```javascript
// Send the user's profile image, if any
app.get('/profile', function(req, res) {
  if (!req.user) {
    return fail();
  }
  var image = self._apos.areaImage(req.user, 'thumbnail');
  if (!image) {
    return fail();
  }
  return res.redirect(
    self._apos.filePath(image, { size: 'one-third' })
  });

  function fail() {
    res.statusCode = 404;
    return res.send('notfound');
  }
});
```

Now we can write:

```javascript
<img src="/profile" />
```

Of course, we could just use `aposAreaImage` and `aposFilePath` in our Nunjucks template instead.
