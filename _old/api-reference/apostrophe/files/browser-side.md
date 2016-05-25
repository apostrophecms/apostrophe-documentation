---
title: Files - browser-side methods
---

## Overview

User-uploaded files, such as images, PDFs or Word documents, are part of every Apostrophe site.

On the browser side, you may encounter `file` objects when interacting with Apostrophe's web APIs or subclassing the slideshow widget editor.

**All of these methods are methods of the `apos` object, which is global in the browser.**

### Obtaining URLs for files and images

### `filePath(file, options)`

Given a file object, as returned by [aposAreaFile](#apos-area-file) for instance, return the file's URL. If `options.size` is set, return the URL for that size (`one-sixth`, `one-third`, `one-half`, `two-thirds`, `full`).

`full` is "full width" (1140px), not the original. For the original, don't pass `size`. Note that the `size` option only makes sense for images.

Additional image sizes can be configured on a per-project basis.

There is a matching server-side JavaScript implementation accessible as `apos.filePath`, and also a Nunjucks helper, `aposFilePath`.

**Always use this function to create URLs to files.** Otherwise your code will cease to work if your project's file storage is moved to Amazon S3 at a later date.

Real-world example:

```javascript
// Let's fetch all of the images
// tagged "marquee" and append them
// to a "marquee" div

$.jsonCall('/apos/browse-files', {
  tag: 'marquee'
}, function(results) {
  var files = results.files;
  var $marquee = $('.marquee');
  _.each(files, function(file) {
    var $img = $('<img />');
    $img.attr('src', apos.filePath(file, { size: 'one-third' }));
    $marquee.append($img);
  });
});
```

Of course most of the time you'd be better off solving this problem on the server side, typically just by including a slideshow widget in a page template.
