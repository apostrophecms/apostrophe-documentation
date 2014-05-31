---
title: "Slideshow options"
---

Here's how to change the appearance and behavior of a slideshow via options in your templates.

The simplest way to try out slideshow options is in a [singleton](../getting-started/adding-editable-content-areas-to-your-page-templates.html):

```markup
{{ aposSingleton(page, 'mypicture', 'slideshow', { size: 'one-third' } ) }}
```

Here we output a slideshow using images at the `one-third` size. See [image sizes in Apostrophe](image-sizes-in-apostrophe.html) for a list of standard sizes.

It is also possible to [add custom sizes](custom-image-sizes.html). But most of the time your best choice is to use CSS to adjust the displayed size of the images, starting from one of our standard sizes.

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

## Allowing Users to Choose an Orientation

Images in a slideshow should have a consistent look, but sometimes it makes sense to let the user choose among two or more aspect ratios, and then enforce these for all of the images in the slideshow.

Here's how to give the user a choice:

```markup
{{ aposSingleton(page, 'mypicture', slideshow', {
  userOptions: {
    orientation: {
      choices: [
        {
          label: 'Portrait',
          name: 'portrait',
          css: 'apos-portrait',
          aspectRatio: [ 1, 1.66 ]
        },
        {
          label: 'Landscape',
          name: 'landscape',
          css: 'apos-landscape',
          aspectRatio: [ 1.66, 1 ]
        }
      ]
    }
  }
) }}
```

Options that empower the user to make a choice are grouped together under the `userOptions` property.

The user will see a menu at the bottom of the slideshow dialog that allows them to pick either "portrait" or "landscape." The labels are just title text; the icons produced by CSS are what the user primarily sees. We provide CSS classes that produce an appropriately shaped icon for `apos-portrait`, `apos-landscape` and `apos-square`. If you wish you may provide others, using our CSS as a guide.

The first orientation in the `choices` list is active by default.

## Disabling Titles, Descriptions and Credits

By default the user may choose to display the title, description and credit properties of images in the slideshow.

If you do not want to allow this, perhaps because it doesn't make sense in a narrow sidebar or your design just doesn't accommodate it, you can turn off these features:

```markup
{{ aposSingleton(page, 'mypicture', slideshow', {
  userOptions: {
    disableTitles: true,
    disableDescriptions: true,
    disableCredits: true
  }
) }}
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
        minSize: [ 400, 300 ],
        limit: 1
      }
    }
  ]
}
```

Note that even though `thumbnail` already exists by default, we can still override it via the `addFields` option.

TODO: document more slideshow options.

