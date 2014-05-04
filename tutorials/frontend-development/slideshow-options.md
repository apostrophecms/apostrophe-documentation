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

## Aspect Ratios and Minimum Sizes

You can also control the aspect ratio and the minimum size of images the editor is allowed to choose. Images with different aspect ratios are center-cropped if the user does not use the crop button to change that. The user will not be permitted to change the aspect ratio when cropping, or to crop below the minimum size.

Here is an example:

```markup
{{ aposSingleton(page, 'mypicture', 'slideshow', { aspectRatio: [ 4, 3 ], minSize: [ 800, 600 ] } })
```

## Slideshow options in an area

You can pass these options to [areas](../getting-started/adding-editable-content-areas-to-your-page-templates.html) too, in order to change the appearance of all slideshows the user may add to that area:

```markup
{{ aposArea(page, 'content1', { slideshow: { limit: 3 }  }) }}
```

## Slideshow options in schemas

You can also pass these options when creating or extending a schema for [a snippet subclass, like the blog](../snippets/subclassing-snippets.html). Here's an example of adding sensible constraints to the `thumbnail` property in `app.js` when configuring the blog module:

```javascript
'apostrophe-blog': {
  addFields: [
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'singleton',
      widgetType: 'slideshow',
      options: {
        aspectRatio: [ 4, 3 ],
        minSize: [ 400, 300 ]
      }
    }
  ]
}
```

Note that even though `thumbnail` already exists by default, we can still override it via the `addFields` option.

TODO: document more slideshow options.

