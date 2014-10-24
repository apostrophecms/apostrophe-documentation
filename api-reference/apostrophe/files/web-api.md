---
title: Files - web API
---

## Overview

These web API endpoints allow you to manipulate files from browser-side JavaScript code.

What you can do is dependent on who you are. If you are logged out, most of these APIs are typically not available to you. If you are logged in, it depends on your permissions.

Unless noted otherwise, all endpoints both send and receive JSON. You should use [jquery-json-call](https://github.com/punkave/jquery-json-call) on the browser side to handle this conveniently. Notable expections are endpoints such as `/apos/upload-files` that upload files to the server. You should always use [jQuery File Upload](https://blueimp.github.io/jQuery-File-Upload/) for these.

### `POST /apos/upload-files`

Uploads one or more files to Apostrophe's media library.

#### POST parameters

* `files` `(array or object)` a single or multiple file upload field, powered by [jQuery File Upload](https://blueimp.github.io/jQuery-File-Upload/)

#### Response object

```'javascript'
{
  status: "ok", // either "ok" or an error
  files: [
    {
      _id: "xxxxx",
      name: "slugified-original-filename",
      extension: "jpg",
      group: "images", // or group: 'office'
      width: 1400,
      height: 800,
      portrait: true, // or orientation: true
    }
  ]
}
```

If any files are not accepted, an error will be reported as `status`, and `files` will be undefined.

#### Example

```markup

{# File upload element. Note we do NOT need a form with #}
{# an enctype because we are using jquery-file-upload. #}
{# Uploads start immediately #}

<input data-my-uploader type="file" name="files[]" data-url="/apos/upload-files" />

<script type="text/javascript">
$(function() {
  // Use jQuery file upload
  $('[data-my-uploader]').fileupload({
    dataType: 'json',
    // Avoid slamming the server
    sequentialUploads: true,
    add: function(e, data) {
      // Upload immediately when file is picked
      return data.submit();
    }
    done: function (e, data) {
      if (data.result.files) {
        _.each(data.result.files, function (file) {
          if (file.group === 'images') {
            var $img = $('<img />');
            var url = apos.filePath(file, { size: 'medium' });
            $img.src(url);
            $('.my-marquee').append($img);
          }
        });
      }
    }
  });
});
</script>
```

#### Notes

**This is a low-level API. If you just want to include file uploads in your website,** use the slideshow widget or the files widget.

**File uploads and saving other fields are completely decoupled in Apostrophe.** You should allow users to upload files as they see fit, record the `_id` property of the file objects in the responses, and then makes a separate API request to associate those IDs with something on the server.

**Apostrophe always uses [jQuery File Upload](https://blueimp.github.io/jQuery-File-Upload/) to upload files.** You should too.

### `POST /apos/replace-file`

Replace an existing file in Apostrophe's media library.

#### Query-string parameters

* `id` `(string)` the `_id` property of an existing file in the media library.

#### POST parameters

* `files` `(array or object)` a single or multiple file upload field, powered by [jQuery File Upload](https://blueimp.github.io/jQuery-File-Upload/). If multiple files are uploaded only the last one is used.

#### Response JSON object

```'javascript'
{
  "status": "ok", // either "ok" or an error
  "file": {
    "_id": "xxxxx",
    "name": "slugified-original-filename",
    "extension": "jpg",
    "group": "images", // or group: 'office'
    "width": 1400,
    "height": 800,
    "portrait": true, // or orientation: true
  }
}
```

If an error occurs, a `500` status code is returned.

#### Example

```markup

{# File upload element. Note we do NOT need a form with #}
{# an enctype because we are using jquery-file-upload. #}
{# Uploads start immediately #}

<input data-my-replacer type="file" name="files[]" />

<script type="text/javascript">
$(function() {
  // "item" is a file object that we already
  // know about and want to replace. Build
  // the correct URL, including the file ID
  // in the query string
  var url = '/apos/replace-file?id=' + item._id;
  var $upload = $('[data-my-replacer]');
  $upload.attr('data-url', url);
  $('[data-my-replacer]').fileupload(
    dataType: 'json',
    add: function(e, data) {
      // Upload immediately when file is picked
      return data.submit();
    },
    done: function (e, data) {
      if (data.result.status === 'ok') {
        // data.result.file now contains the
        // updated file object
      }
    },
  });
</script>
```

#### Notes

Apostrophe always uses [jQuery File Upload](https://blueimp.github.io/jQuery-File-Upload/) to upload files. You should too.

### `POST /apos/crop`

Crop an existing image file in Apostrophe's media library. The image becomes available permanently in the new, cropped size in addition to the original size.

#### Request JSON object

```javascript
{
  "_id": "xxxxxx",
  "crop": {
    "top": 100,
    "left": 100,
    "width": 500,
    "height": 500
}
```

`top`, `left`, `width` and `height` are specified in pixels and are always relative to the original image size. Scaled versions of each crop are also generated automatically.

#### Response

A `200 OK` status code indicates success. Any other status indicates failure. There is no additional information available. (TODO: change this to a JSON API.)

#### Example

```javascript
$(function() {
  // Our desired cropping coordinates
  var crop = {
    top: 100,
    left: 100,
    width: 500,
    height: 500
  };
  $.post('/apos/crop', {
    _id: item._id,
    crop: crop
  }, function() {
    // Now this image is available forever at
    // the desired cropped size
    $('.my-image').attr('src', apos.filePath(
      item, { crop: crop, size: 'medium' }));
  }).error(function() {
    // cropping failed
  });
});
```

#### Notes

Previously generated crops can be discovered via the `crops` property of each `file` object.

**This is a low-level API. If you just want to let people crop images,** use the slideshow widget which already fully supports that.
