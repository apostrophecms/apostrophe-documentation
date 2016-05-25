---
title: Adding file types in the media library
---

Our standard media library accepts both images (GIF, JPG, PNG) and "office" files such as `.txt`, `.rtf`, `.xlsx`, etc.

To prevent the spread of malware the library does not accept file extensions it does not recognize.

If you need to extend the set of accepted file extensions, you can do so in an `afterInit` callback in your `app.js` configuration. Here is code to add a file extension to the `office` group.

```javascript
afterInit: function(callback) {
  var office = _.find(site.apos.fileGroups, function(group) {
    return group.name === 'office';
  });
  office.extensions.push('csv');
  office.extensions.push('tsv');
  return callback(null);
}
```

*Note:* adding new file extensions to the `images` group does not make sense, since web browsers still won't support them in the `img` tag, in style attributes, etc.
