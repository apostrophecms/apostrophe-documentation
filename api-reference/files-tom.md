---
title: Manipulating files
---

## Manipulating files

These methods of the server-side `apos` object are used to manipulate files in Apostrophe.

The `apos` object is usually readily available to you in your code. For instance, in `app.js` you may refer to `site.apos.acceptFiles`. In an Apostrophe module, you may refer to `options.apos.acceptFiles`. The usual convention is to set `self._apos` to `options.apos` in your module's constructor. If you are subclassing one of our modules, this has already been done for you. [TODO: move this paragraph to developer tutorials and just link it here?]

Many of these methods manipulate `file` objects which are stored in the `aposFiles` MongoDB collection. These are also frequently found already loaded into arrays attached to widgets such as slideshows. Convenience methods are provided to locate files within areas without looping through all of the widgets by hand.

In addition to these methods, you can access the MongoDB `aposFiles` collection directly as `apos.files`. For instance, you can call `apos.files.find` or `apos.files.update`. But you should use the methods below whenever appropriate, especially when permissions are a concern.

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
