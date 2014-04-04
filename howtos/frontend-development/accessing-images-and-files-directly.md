---
title: "Accessing images and files directly"
previous: custom-image-sizes
---

Sometimes you might want to display a thumbnail image directly with your own markup, bypassing the normal markup for the slideshow widget. Sometimes you don't even care if the image is in the first slideshow widget in a content area, or somewhere further down in the area. There is a safe and simple way to do this.

Let's say we want the first image in the `body` area, if any:

```markup
{% if aposAreaImage(page, 'body') %}
  <img src="{{ aposFilePath(aposAreaImage(page, 'body'), { size: 'one-sixth' }) }}" />
{% endif %}
```


`aposAreaImage` gives us back the first image, if any, and `aposFilePath` gives us a URL to that image at a specific size. (If you don't specify a size you'll get the original, which could be humunguous.) The standard sizes are:



Images will never be larger than the dimensions listed here, but may be smaller on one dimension to preserve the aspect ratio.

TODO: separate HOWTO on how to add additional sizes at project level, and how to force Apostrophe to generate those sizes on an existing project.


You can also fetch all the images:

```markup
{% for image in aposAreaImages(page, 'body') %}
  <img src="{{ aposFilePath(image, { size: 'one-sixth' }) }}" />
{% endif %}
```

You can use the `limit` option to specify just two images at most:

```markup
{% for image in aposAreaImages(page, 'body', { limit: 2 }) %}
  <img src="{{ aposFilePath(image, { size: 'one-sixth' }) }}" />
{% endif %}
```

Or use the `extension` option to specify we only care about JPEGs:

```markup
{% set image = aposAreaImage(page, 'body', { extension: 'jpg' }) %}
{% if image %}
  <img src="{{ aposFilePath(image, { size: 'one-sixth' }) }}" />
{% endif %}
```

Or `extensions` to allow JPEG and PNG but not GIF:

```markup
{% set image = aposAreaImage(page, 'body', { extensions: [ 'jpg', 'png' ] }) %}
{% if image %}
  <img src="{{ aposFilePath(image, { size: 'one-sixth' }) }}" />
{% endif %}
```

*Apostrophe always uses three-letter lowercase extensions.*

If you're interested in PDFs and other non-image files, as might be found in the files widget, call `aposAreaFile` and `aposAreaFiles` instead. You might want to use the `group` option to restrict the results to office documents, like csv, docx and pdf files:

```markup
{% set file = aposAreaFile(page, 'body', group: 'office') %}
{% if file %}
  <a href="{{ aposFilePath(file) }}">{{ file.name | e }}</a>
{% endif %}
```

You can also use `group: "images"`, but in that case it is usually more convenient to call `aposAreaImage` or `aposAreaImages`.
