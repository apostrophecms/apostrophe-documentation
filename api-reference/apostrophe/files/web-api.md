---
title: Files - web API
---

## Overview

These web API endpoints allow you to manipulate files from browser-side JavaScript code.

What you can do is dependent on who you are. If you are logged out, most of these APIs are typically not available to you. If you are logged in, it depends on your permissions.

Unless noted otherwise, all endpoints both send and receive JSON. You should use [jquery-json-call](https://github.com/punkave/jquery-json-call) on the browser side to handle this conveniently. Notable expections are endpoints such as `/apos/upload-files` that upload files to the server.

### `POST /apos/upload-files`

Upload one or more files to Apostrophe's media library. **Expects a `multipart/form-data` upload**, or other formats accepted by the Express file upload middleware. Apostrophe always uses [jQuery File Upload](https://blueimp.github.io/jQuery-File-Upload/) to upload files, but you may also use a conventional file upload form with the correct `enctype`.

#### Request parameters

* `files` `(array or object)` a single or multiple file upload field

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

{# Provide our own form that uploads to Apostrophe's #}
{# media library and appends each uploaded image to the #}
{# bottom of the current page. You might use similar code #}
{# if you wanted to avoid our slideshow editor completely #}

<form method="POST" action="/apos/upload-files">
  <input data-my-uploader type="file" name="files[]" />
</form>

<script type="text/javascript">
$(function() {
  $('[data-my-uploader]').fileupload({
    dataType: 'json',
    // Avoid slamming the server
    sequentialUploads: true,
    done: function (e, data) {
      if (data.result.files) {
        _.each(data.result.files, function (file) {
          if (file.group === 'images') {
            var $img = $('<img />');
            var url = apos.filePath(file, { size: 'medium' });
            $img.src(url);
          }
        });
      }
    }
  });
});
</script>
```

