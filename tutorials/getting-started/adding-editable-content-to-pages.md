---
title: "Adding Editable Content To Pages"
layout: tutorial
---

## Adding Editable Content to Pages

Central to Apostrophe is the philosophy that editors can edit their content in context. In order for you to enable this functionality in your templates, Apostrophe provides `singleton` and `area` helpers that you can use in your templates.

### Singletons

Singletons are a slot on a page that allow an editor to add a single "widget" of a specific type. Let's add a rich text singleton to our `home.html` template!

```markup
{% block main %}
  <div class="main-content">
    {{ apos.singleton(data.page, 'textBlock', 'apostrophe-rich-text', {
      toolbar: [ 'Bold', 'Italic' ]
    }) }}
  </div>
{% endblock %}
```

Let's deconstruct the arguments we are passing here.

##### `data.page`

The page object you want to save the singleton to. In this case, we are editing content on the current page, so the content should be saved to that page.

##### `'textBlock'`

The name of the area. This denotes what property the singleton will be saved to in the page object. In this case, it would be saved to `data.page['textBlock']`.

##### `'apostrophe-rich-text'`

The widget type we want to allow in the singleton. In this case, we are using the standard rich text widget.

##### `{ toolbar: [ 'Bold', 'Italic' ] }`

An "options" object that allows us to pass type-specific options to the widget. Rich text widgets support a `toolbar` option.

If we restart our server and refresh our site's home page while logged in, we'll see a gray block with a button prompting us to add rich text. Once you start adding text, your edits save automatically. **There is no "save" button because you don't need one.** All edits are saved in the background.

<img src="/docs/images/tutorials/developer/boilerplate_singleton.png" class="shadow">

### Areas

Oftentimes, we'll want to enable an editor to add several widgets of different types to build out a column of content in a page. For this, we can use the `apos.area` helper.

When we use the area helper a "+" sign appears on the page, allowing the user to add a new widget in a series (usually a vertical column), often alternating between images and rich text, for instance.

```markup
{{ apos.area(data.page, 'body', {
  widgets: {
    'apostrophe-rich-text': {
      toolbar: [ 'Bold', 'Italic' ]
    },
    'apostrophe-images': {
      size: 'full'
    }
  }
}) }}
```

The first two arguments for this helper work the same way as for `apos.singleton`. The third option is an options object. We can see that that options object supports a `widgets` option, which takes a key-value map of available widget names and their respective options.

> Not sure how to add a second widget? After you're finished editing rich text, click anywhere outside of the rich text widget. Then hover over it and you'll see the "+" signs in each position where you're allowed to add a new widget.

### Widget Types

Apostrophe offers a range of widgets, and you can easily create your own. Here are some of the most popular widgets. Later on we'll also talk about "pieces" and how they allow you to create and reuse the same content around the site via pages and widgets.

#### `apostrophe-rich-text`

The `apostrophe-rich-text` widget provides a rich text editor. It is based on [CKEditor 4](http://ckeditor.com/). You can use options to configure it. Here's an example with the two most commonly used options:

```markup
  {{ apos.singleton(data.page, 'textBlock', 'apostrophe-rich-text', {
    toolbar: [ 'Styles', 'Bold', 'Italic' ],
    styles: [
      { name: 'Title', element: 'h3' },
      { name: 'Meta', element: 'h5' }
    ]
  }) }}
```

*All of these widgets work in areas, too.* We're just using singletons for the examples.

##### `toolbar`

`toolbar` determines which controls appear in the editor's toolbar. Here are the frequently used controls:

`Styles`, `Bold`, `Italic`, `Link`, `Unlink`, `Anchor`, `Table`, `BulletedList`, `Blockquote`, `Strike`, `Subscript`, `Superscript`, `Split`

**For good responsive development you should avoid offering controls for font sizes, colors, etc.** Let your design's styles provide those things in a thoughtful way.

##### Using the Split control

The "Split" button can be clicked to break a rich text widget in two, allowing widgets of other types to be added in between.

##### `styles`

`styles` specifies an array of valid CKEditor styles, which will appear on the "Style" dropdown menu if it is included in the `toolbar`. Each style has a `name` property and an `element` property. Most semantic HTML5 elements are allowed here.

#### `apostrophe-images`

The `apostrophe-images` widget lets you add one or more images. If multiple images are added in a single widget, they are presented as a slideshow.

Here is an example with the popular options:

```markup
  {{ apos.singleton(data.page, 'heroPic', 'apostrophe-images', {
    minSize: [ 700, 350 ],
    aspectRatio: [ 2, 1 ],
    limit: 1,
    size: 'full'
  }) }}
```

##### `minSize`

`minSize` ensures the user can't pick images smaller than the given dimensions `[ width, height ]`.

##### `aspectRatio`

`aspectRatio` will crop the images to display the largest portion that has the given aspect ratio `[ x, y ]`, throwing away some of the image if necessary. If the user clicks the cropping button while picking the image, the cropping controls will also enforce the aspect ratio.

##### `limit`

`limit` prevents the user from selecting more than the given number of images. A `limit` of `1` is appropriate where you don't want a slideshow treatment.

##### `size`

`size` controls the size of the image that gets displayed. To conserve bandwidth Apostrophe never sends the original image by default. Apostrophe resizes your image to the following sizes by default, always preserving the aspect ratio:

* `max`: no larger than 1600x1600.
* `full`: no larger than 1140x1140.
* `two-thirds`: no larger than 760x760.
* `one-half`: no larger than 570x700.
* `one-third`: no larger than 380x700.
* `one-sixth`: no larger than 190x350.
* `original`: the original file (WARNING: educate your users about the downsides of sending huge files to browsers over 3G).

If you don't specify a size, the `full` size is displayed.

We'll talk about custom image sizes in a later tutorial.

#### `apostrophe-files`

The `apostrophe-files` widget lets you add download links to access various documents, such as PDFs or Word files. If multiple files are added in a single widget, they are presented as a list.

Here's a simple example:

```markup
  {{ apos.singleton(data.page, 'resume', 'apostrophe-files', {
    limit: 1
  }) }}
```

##### `limit`

`limit` prevents the user from selecting more than the given number of files.

##### More about files and Apostrophe

Users editing these widgets have the option of uploading files or reusing them. By default the office-oriented file types accepted by Apostrophe are:

`[ 'txt', 'rtf', 'pdf', 'xls', 'ppt', 'doc', 'pptx',
'sldx', 'ppsx', 'potx', 'xlsx', 'xltx', 'csv', 'docx', 'dotx' ]`

In addition to GIF, JPEG and PNG files.

This can be adjusted by configuring the [apostrophe-attachments](../../modules/apostrophe-attachments/index.html) module.

#### `apostrophe-html`

There is an `apostrophe-html` widget. It allows users to paste raw HTML into your site. Don't use it. It tends to have a negative impact on well-designed sites.

But if you must turn it on, educate your end users to use it very sparingly, and never to use it in ways that wreck your beautiful, mobile-friendly design. Because nobody wants that.

It doesn't take any options.

### Take control of your controls

Areas and singletons both accept useful options for managing their controls. Sometimes you'd like to change the edit button, sometimes you'd like to disallow removing a singleton entirely and so on.

* If `options.addLabel` is set, that text appears on the button to
initially populate the singleton. If `options.editLabel` is set, that
text appears on the button to edit an existing widget in the singleton.

* If `options.controls.movable` is false, the widget may not be dragged out
of the singleton. (Note that `controls` is an object nested within the options.)

* If `options.controls.removable` is false, the widget may not be removed entirely.

* If `options.controls.position` is set to `top-left`, `top-right`,
`bottom-left` or `bottom-right`, the widget controls (edit, drag
and remove) are positioned accordingly. This can be helpful if the default
location (`top-left`) doesn't play well with your widget's design.

Here's a complete example:

```markup
{{ apos.singleton(data.page, 'logo', 'apostrophe-images', {
  limit: 1,
  minSize: [ 1200, 600 ],
  addLabel: 'Set the logo',
  editLabel: 'Change the logo',
  controls: {
    movable: false,
    removable: false,
    position: 'bottom-right'
  }
}) }}
```

### More Widgets

Is that all? Definitely not! We'll discuss custom widgets, "pieces" and other strategies for creating editable content in later tutorials. But first, let's look at some intermediate frontend topics, like navigation and image sizes.
