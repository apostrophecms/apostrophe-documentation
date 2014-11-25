---
title: Files - nunjucks helpers
---

## Overview

User-uploaded files, such as images, PDFs or Word documents, are part of every Apostrophe site.

Use these Nunjucks helpers to sift through Apostrophe areas and widgets to locate the file objects you want, and also to generate URLs referring to them. This is great when you want to bypass the regular markup and user interface of slideshow widgets and the like.

### `aposAreaImage(page, name, options)`

### `aposAreaImage({ area: area, options... })`

Find an image referenced within an area, such as an image in a slideshow widget. Returns the first `file` object matching the criteria. Only GIF, JPEG and PNG images will be returned.

The returned object can be passed to [aposFilePath](#apos-file-path) to obtain a URL for use in an `img` element.

#### Options

##### `extension`

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg` or `png`), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses these three extensions for images.

##### `extensions`

Specify an array of allowed file extensions. (You do not need to specify `jpeg`, `JPG`, etc. Apostrophe always uses `jpg`.)

Example:

```markup
{% set image = aposAreaImage(page, 'body') %}
{% if image %}
  <img src="{{ aposFilePath(image, { size: 'small' }) }}" />
{% endif %}
```

### `aposAreaImages(page, name, options)`

### `aposAreaImages({ area: area, options... })`

Find images referenced within an area, such as an image in a slideshow widget. Returns an array of `file` objects that meet the criteria. Only GIF, JPEG and PNG images will be returned.

The returned objects can be passed to [aposFilePath](#apos-file-path) to obtain a URL for use in an `img` element.

#### Options

##### `extension`

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg` or `png`), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses these three extensions for images.

##### `extensions`

Specify an array of allowed file extensions. (You do not need to specify `jpeg`, `JPG`, etc. Apostrophe always uses `jpg`.)

Example:

```markup
{% set images = aposAreaImages(page, 'body') %}
<ul>
  {% for image in images %}
    <li>
      <img src="{{ aposFilePath(image, { size: 'small' }) }}" />
    </li>
  {% endif %}
</ul>
```

### `aposAreaFile(page, areaName, options)`

### `aposAreaFile({ area: area, options... })`

Find an file referenced within an area, such as a PDF in a file widget or an image in a slideshow widget. Returns the first `file` object matching the criteria.

The returned object can be passed to [aposFilePath](#apos-file-path) to obtain a URL.

#### Options

##### `extension`

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg`, `pdf`, `xlsx`, `png`, etc.), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses specific extensions, always lower case, typically three letters except for `xlsx` and other recent Microsoft Office formats.

##### `extensions`

Specify an array of allowed file extensions.

Example:

```markup
{% set pdf = aposAreaFile(page, 'body', { extension: 'pdf'}) %}
{% if pdf %}
  <a href="{{ aposFilePath(pdf) }}">Download PDF</a>
{% endif %}
```

### `aposAreaFiles(page, areaName, options)`

### `aposAreaFiles({ area: area, options... })`

Find files referenced within an area, such as a PDF in a file widget or an image in a slideshow widget. Returns an array of `file` objects that meet the criteria.

The returned objects can be passed to [aposFilePath](#apos-file-path) to obtain a URL.

#### Options

##### `extension`

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg`, `pdf`, `xlsx`, `png`, etc.), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses specific extensions, always lower case, typically three letters except for `xlsx` and other recent Microsoft Office formats.

##### `extensions`

Specify an array of allowed file extensions.

Example:

```markup
{% set pdfs = aposAreaFiles(page, 'body', { extension: 'pdf' }) %}
<ul>
  {% for pdf in pdfs %}
    <li>
      <a href="{{ aposFilePath(pdf) }}">Download {{ pdf.name | e }}</a></a>
    </li>
  {% endif %}
</ul>
```

### `aposFilePath(file, options)`

Given a file object, as returned by [aposAreaFile](#apos-area-file) for instance, return the file URL. If `options.size` is set, return the URL for that size (`one-sixth`, `one-third`, `one-half`, `two-thirds`, `full`).

`full` is "full width" (1140px), not the original. For the original, don't pass `size`.

Additional image sizes can be configured on a per-project basis.

Both the server side and the browser side have equivalent JavaScript methods accessible as `apos.filePath`.

**Always use this function to create URLs to files.** Otherwise your code will cease to work if your project's file storage is moved to Amazon S3 at a later date.

Example:

```markup
{% set image = aposAreaImage(page, 'body') %}
{% if image %}
  <img src="{{ aposFilePath(image, { size: 'small' }) }}" />
{% endif %}
```
