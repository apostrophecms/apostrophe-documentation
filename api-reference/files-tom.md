---
title: Manipulating files
---

## Manipulating files

These methods of the server-side `apos` object are used to manipulate files in Apostrophe.

The `apos` object is usually readily available to you in your code. For instance, in `app.js` you may refer to `site.apos.acceptFiles`. In an Apostrophe module, you may refer to `options.apos.acceptFiles`. The usual convention is to set `self._apos` to `options.apos` in your module's constructor. If you are subclassing one of our modules, this has already been done for you. [TODO: move this paragraph to developer tutorials and just link it here?]

In addition to these methods, you can access the MongoDB `aposFiles` collection directly as `apos.files`. For instance, you can call `apos.files.find` or `apos.files.update`. But you should use the methods below whenever appropriate, especially when permissions are a concern.

### updateTrash

Moves a file object in or out of the trash. A file in the trash becomes inaccessible via permissions but still exists on disk. For images, a low-resolution version remains available for display when browsing the trash.

#### updateTrash(req, id, trash, callback)

`req` (object) the current Express request object [TODO: link to tutorial re: req objects], for permissions.

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
