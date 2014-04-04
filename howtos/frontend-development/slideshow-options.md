---
title: "Slideshow options"
---

Here's how to change the appearance and behavior of a slideshow via options in your templates.

The simplest way to try out slideshow options is in a [singleton](../getting-started/adding-editable-content-areas-to-your-page-templates.html):

```markup
{{ aposSingleton(page, 'mypicture', 'slideshow', { size: 'one-third' } ) }}
```

Here we output a slideshow using images at the `one-third` size. See [image sizes in Apostrophe](image-sizes-in-apostrophe.html) for a list of standard sizes.

It is also possible to [add custom sizes](custom-image-sizes.html). But  most of the time your best choice is to use CSS to adjust the displayed size of the images, starting from one of our standard sizes.

In addition, you can limit the number of images permitted in the slideshow:

```markup
{{ aposSingleton(page, 'mypicture', 'slideshow', { limit: 3 } ) }}
```

A limit of `1` gives you a single-image widget.

## Slideshow options in an area

You can pass these options to [areas](../getting-started/adding-editable-content-areas-to-your-page-templates.html) too, in order to change the appearance of all slideshows the user may add to that area:

```markup
{{ aposArea(page, 'content1', { slideshow: { limit: 3 }  }) }}
```

TODO: document more slideshow options.

