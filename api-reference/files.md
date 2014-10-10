---
title: Manipulating files
---

## Manipulating files

These methods of the server-side `apos` object are used to manipulate files in Apostrophe.

The `apos` object is usually readily available to you in your code. For instance, in `app.js` you may refer to `site.apos.acceptFiles`. In an Apostrophe module, you may refer to `options.apos.acceptFiles`. The usual convention is to set `self._apos` to `options.apos` in your module's constructor. If you are subclassing one of our modules, this has already been done for you. [TODO: move this paragraph to developer tutorials and just link it here?]

Many of these methods manipulate `file` objects which are stored in the `aposFiles` MongoDB collection. These are also frequently found already loaded into arrays attached to widgets such as slideshows. Convenience methods are provided to locate files within areas without looping through all of the widgets by hand.

In addition to these methods, you can access the MongoDB `aposFiles` collection directly as `apos.files`. For instance, you can call `apos.files.find` or `apos.files.update`. But you should use the methods below whenever appropriate, especially when permissions are a concern.

### areaImage

Find an image referenced within an area, such as an image in a slideshow widget.
Returns the first image matching the criteria. Only GIF, JPEG and PNG images
will ever be returned.


#### areaImage(page, 'areaName', [options])

`page` (object)  A page or snippet object that contains the area
`'areaName'` (string) The name of the area
`options` (object) An object containing additional options


##### Example

```javascript
apos.areaImage(page1, 'coolArea');

//with options object
apos.areaImage(page1, 'coolArea', {extension: 'gif'});
```

##### options

###### extension

Specifies the file extension

Syntax example

```javascript
{ extension: 'jpg' }
```

######  extensions

Specifies the file extensions

Syntax example

```javascript
{ extension: ['jpg', 'gif']}
```


#### areaImage({ area: page.body }) *alternate syntax*

`{ area: page.body }` (object) An object containing all options. The `area` property is requiered.

### areaImages

Find images referenced within an area, such as images in a slideshow widget.
Returns all the files matching the criteria unless the "limit" option is used.


#### areaImages(page, 'areaName', [options])

`page` (object)  A page or snippet object that contains the area
`'areaName'` (string) The name of the area
`options` (object) An object containing additional options


##### Example

```javascript
apos.areaImages(page1, 'coolArea');

//with options object
apos.areaImages(page1, 'coolArea', {extension: 'gif', limit: 3});
```

##### options

###### extension 

Specifies the file extension

Syntax example 

```javascript
{ extension: 'jpg' }
```

######  extensions

Specifies the file extensions

Syntax example

```javascript
{ extension: ['jpg', 'gif']}
```
######  limit

Specifies the number of images to be returned. Note that
`areaImage` is more convenient than `areaImages` if limit is 1.

Syntax example

```javascript
{ limit: 3}
```

#### areaImages({ area: page.body }) *alternate syntax*

`{ area: page.body }` (object) An object containing all options. The `area` property is requiered.

### browseFiles

Fetch files according to the parameters specified by the
`options` object. These properties are sanitized to ensure they are in the proper format. A sanitizing wrapper for [getFiles](#getFiles), which also always sets the `browsing` option to ensure that we only receive files we are entitled to add to our pages.

#### browseFiles(req, options, callback)

`req` (object) the current Express request object [TODO: link to tutorial re: req objects], for permissions.
`options` (object) An object containing additional options.
`callback` (function) called on completion, with error if any.

##### Example

```javascript
apos.browseFiles(req, options, callback);
```

##### options

###### owners (boolean)

If truthy, the `_owner` property of each file will be populated with the current `person` object as determined by the `ownerId`. For performance this is not done by default.

###### group (string)

Specifies that we only want to see files in a particular extension group. May be either `office` or `images`. If not specified all groups are returned.

```javascript
{ group: 'office'}
```

###### owner (string)

If set to `user`, only files belonging to the current user are returned. If set to `all` (the default), files belonging to all owners are returned.

```javascript
{ owner: 'all' }
```

###### extension (string)

Specifies the file extension of interest. Only files with that extension are returned. Note that Apostrophe standardizes file extensions: `gif`, `jpg`, `png`, never `GIF` or `JPEG`. [TODO reference list]

```javascript
{ extension: 'jpg' }
```

###### ids (array)

An array of file IDs. Only files with these IDs will be returned. Useful when editing annotations of existing files.

###### q (string)

A search string. Only files containing this search string in their (search text)[#fileSearchText] are returned.

###### skip (integer)

For pagination. Returns results starting with the specified offset.

```javascript
// Second page of results
{ skip: 10, limit: 10 }
```

######  limit (integer)

For pagination. Specifies the number of images to be returned.

Syntax example

```javascript
{ limit: 10 }
```

###### minSize (array)

Specifies the minimum width and height of image files with array `[width, height]`. Note: using this option will only return images.

```javascript
{ minSize: [ 1140, 800 ] }
```

### getFiles

Fetch files according to the parameters specified by the
`options` object. TODO: copy browseFiles docs here, make browseFiles a link with an explanation that it does sanitization and sets the browsing flag first.

### areaFile

Find a file referenced within an area, such as an image in a slideshow widget,
or a PDF in a file widget.

Returns the first file matching the criteria.

#### areaFile(page, name, [options])

`page` (object) A page or snippet object that contains the area

`name` (string) Name of the area

`options` (object) *optional*. An object containing additional options

##### Example

```javascript
apos.areaFile(page, 'body');

// with options object
apos.areaFile(page, 'body', { extension: 'jpg' });
```
##### options

###### extension (string)

An extension to use for filtering the results.

Example

```javascript
{ extension: 'jpg' }
```

###### extentions (array)

Extensions to use for filtering the results.

Example

```javascript
{ extensions: ['jpg','png'] }
```

###### group (string)

A group to use for filtering the results. By default the `images` and `office` groups
are available.

```javascript
{ group: 'office' }
```

*Note:* If you are using `group: "images"` consider calling apos.areaImage instead.
This is convenient and protects you from accidentally getting a PDF file.

#### apos.areaFile(options) *Alternative Syntax*

*options* (object) An object containing all options. The `area` property is required.

This alternative syntax takes a direct reference to the area that refernces a file. 

##### Example

```javascript
apos.areaFile({ area: page.body })
```


* * * 



### areaFiles

Find a file referenced within an area, such as an image in a slideshow widget,
or a PDF in a file widget.

Returns all the files matching the criteria unless the "limit" option is used.

#### areaFiles(page, name, [options])

`page` (object) A page or snippet object that contains the area

`name` (string) Name of the area

`options` (object) *optional*. An object containing additional options

##### Example

```javascript
apos.areaFiles(page, 'body');

// with options object
apos.areaFiles(page, 'body', { extension: 'jpg' });
```
##### options

All options available in [areaFile](#area-file) are available in _areaFiles_.

###### limit (integer)

Limits the number of files returned.

Example

```javascript
{ limit: 3 }
```

#### apos.areaFiles(options) *Alternative Syntax*

*options* (object) An object containing all options. The `area` property is required.

This alternative syntax takes a direct reference to the area that refernces a file. 

##### Example

```javascript
apos.areaFiles({ area: page.body })
```

### acceptFiles

Attempts an upload of one or more files, as submitted by an HTTP file upload. 

This function will ensure the user has permissions to upload the files, as well as ensure the files are an acceptable type. If accepted, the files are uploaded using uploadfs, and then documents are created in the aposFiles collection for each file. 

The callback receives an error, if any, followed by an array of new file objects as they were stored in the aposFiles collection.

#### acceptFiles(req, files, callback)

`req` (object) The current Express request object [TODO: link to tutorial re: req objects], for permissions

`files` (array or object) An object or array of objects with "name" and "path" properties

`callback` (function) Invoked on completion, with error if any and an array of new file objects as they were stored in the aposFiles collection.

The `files` argument accepts object to keep this function flexible for command line task usage. It's usually easy enough to pass it something from `req.files`.

##### Example

```javascript
// get the file details from an input called 'upload'
var fileInfo = req.files['upload'];

apos.acceptFiles(req, fileInfo, function(err, files){
  ...
  // do something with the files we just uploaded
  ...
});
```

### updateTrash

Moves a file object in or out of the trash, marking it as such in the files MongoDB collection and also in uploadfs. A file in the trash becomes inaccessible via permissions but still exists. For images, a low-resolution version remains available for display when browsing the trash.

#### updateTrash(req, id, trash, callback)

`req` (object) the current Express request object [TODO: link to tutorial re: req objects], for permissions checking. An error is reported to the callback if the user does not have permission to modify the file.

`id` (string) the id of the file (`file._id`).

`trash` (boolean) if true, move to trash; if false, rescue from trash.

`callback` (function) called on completion, with error if any.

##### Example

```javascript
// Remove a file object we obtained with getFiles or browseFiles

apos.updateTrash(req, file._id, true, callback);
```

##### See also

[getFiles](#getFiles), [browseFiles](#browseFiles)

### fileSearchText

Retrieves a plaintext description of the file suitable for generating search engine indexes. This will include the filename, title, description, credit, tags and owner's name. **This method is called for you** by `acceptFiles` and other methods that update the file's description. Those methods set the `searchText` property of the object in the database to the result. In most cases, if you are not updating a file object directly, you should just refer to the `file.searchText` property.

#### fileSearchText(file, [callback])

`file` (object) a file object.
`callback` *optional* (function) called on completion, with error if any, and the search text as the second argument. Only necessary if the `_owner` property has not already been attached. If the callback is not provided, then the search text is returned directly from the function, and the function makes no attempt to determine the owner's name if an `_owner` property has not already been loaded.

##### Example

```javascript
// Let's claim a photo as our own work by giving
// it our name as the credit field
file.credit = req.user.title;
file.searchText = apos.fileSearchText(file);
return apos.files.update({ _id: file._id }, file, callback);
```

### md5File

Determines the MD5 hash value of a local file, as a hex string. Note that normally file objects in Apostrophe already have a `.md5` property containing this information.

#### md5File(path, callback)

`path` (string) a local filesystem path.

`callback` (function) called on completion, with an error if any. If successful, the second argument is the md5 hash hex string.

##### Example

```javascript
// An Express route implementing an API
// that reports the MD5 hash of the uploaded file
app.post('/hash-my-file', function(req, res) {
  var file = req.files.file;
  return apos.md5File(file.path, function(err, md5) {
    if (err) {
      return res.send({ status: 'error' });
    } else {
      return res.send({ status: 'ok', md5: md5 });
    }
  });
});
```

### md5

Determines the md5 hash value of the provided string. Returns a hex string. Useful for generating cache keys. This method is synchronous. For files, see [md5File](#md5File).

#### md5File(s)

`s` (string) a string.

##### Example

```javascript
var hashKey = apos.md5(JSON.stringify({ req.query }));
```
