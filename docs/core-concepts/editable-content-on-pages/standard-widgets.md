---
title: Standard (Included) Widgets
layout: tutorial
---

# Apostrophe Widgets

Apostrophe comes with a number of widgets built in to help you build out content for your site. Below is a quick reference for some of the most commonly used widgets.

## Widget Types

Apostrophe offers a range of widgets, and you can easily create your own. Here are some of the most popular widgets. Later on you'll also talk about "pieces" and how they allow you to create and reuse the same content around the site via pages and widgets.


### `'apostrophe-rich-text'`

The rich text widget provides a space for to enter text, with various options for formatting that text in a WYSIWYG editor based on CKEditor.

```markup
        {{ apos.singleton(data.page, 'textBlock', 'apostrophe-rich-text', {
          toolbar: [ 'Bold', 'Italic' ]
        }) }}
    ```

#### `'textBlock'`

The name of the area. This denotes what property the singleton will be saved to in the page object. In this case, it would be saved to `data.page['textBlock']`.

#### `toolbar`

`toolbar` determines which controls appear in the editor's toolbar. Here are the frequently used controls:

`Styles`, `Bold`, `Italic`, `Link`, `Unlink`, `Anchor`, `Table`, `BulletedList`, `Blockquote`, `Strike`, `Subscript`, `Superscript`, `Split`

#### `styles`

`styles` specifies an array of valid CKEditor styles, which will appear on the "Style" dropdown menu if it is included in the `toolbar`. Each style has a `name` property and an `element` property. Most semantic HTML5 elements are allowed here.

### `apostrophe-images`

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

#### `minSize`

`minSize` ensures the user can't pick images smaller than the given dimensions `[ width, height ]`.

#### `aspectRatio`

`aspectRatio` will crop the images to display the largest portion that has the given aspect ratio `[ x, y ]`, throwing away some of the image if necessary. If the user clicks the cropping button while picking the image, the cropping controls will also enforce the aspect ratio.

#### `limit`

`limit` prevents the user from selecting more than the given number of images. A `limit` of `1` is appropriate where you don't want a slideshow treatment.

#### `size`

`size` controls the size of the image that gets displayed. To conserve bandwidth Apostrophe never sends the original image by default. Apostrophe resizes your image to the following sizes by default, always preserving the aspect ratio:

* `max`: no larger than 1600x1600.
* `full`: no larger than 1140x1140.
* `two-thirds`: no larger than 760x760.
* `one-half`: no larger than 570x700.
* `one-third`: no larger than 380x700.
* `one-sixth`: no larger than 190x350.
* `original`: the original file \(WARNING: educate your users about the downsides of sending huge files to browsers over 3G\).

If you don't specify a size, the `full` size is displayed.

You'll talk about adding custom image sizes in [`apostrophe-attachments`](/modules/apostrophe-attachments/README.md#addimagesizes) in a later tutorial.

### `apostrophe-files`

The `apostrophe-files` widget lets you add download links to access various documents, such as PDFs or Word files. If multiple files are added in a single widget, they are presented as a list.

Add this below the `apos.area` to add a simple `apostrophe-files` widget to the page:



{% code-tabs-item title="lib/modules/apostrophe-pages/views/home.html" %}
```markup
  {{ apos.singleton(data.page, 'resume', 'apostrophe-files', {
    limit: 1
  }) }}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

#### `limit`

`limit` prevents the user from selecting more than the given number of files.

#### More about files and Apostrophe

Users editing these widgets have the option of uploading files or reusing them. By default the office-oriented file types accepted by Apostrophe are:

`[ 'txt', 'rtf', 'pdf', 'xls', 'ppt', 'doc', 'pptx', 'sldx', 'ppsx', 'potx', 'xlsx', 'xltx', 'csv', 'docx', 'dotx' ]`

In addition to GIF, JPEG and PNG files.

This can be adjusted by configuring the [apostrophe-attachments](/modules/apostrophe-attachments/README.md) module.

### `apostrophe-html`

There is an `apostrophe-html` widget. It allows users to paste raw HTML into your site. Don't use it. It tends to have a negative impact on well-designed sites.

But if you must turn it on, educate your end users to use it very sparingly, and never to use it in ways that wreck your beautiful, mobile-friendly design. Because nobody wants that.

It doesn't take any options.

## Take control of your controls

Areas and singletons both accept useful options for managing their controls. Sometimes you'd like to change the edit button, sometimes you'd like to disallow removing a singleton entirely and so on.

* If `options.addLabel` is set, that text appears on the button to initially populate the singleton. If `options.editLabel` is set, that text appears on the button to edit an existing widget in the singleton.
* If `options.controls.movable` is false, the widget may not be dragged out of the singleton. \(Note that `controls` is an object nested within the options.\)
* If `options.controls.removable` is false, the widget may not be removed entirely.
* If `options.controls.position` is set to `top-left`, `top-right`, `bottom-left` or `bottom-right`, the widget controls \(edit, drag and remove\) are positioned accordingly. This can be helpful if the default location \(`top-left`\) doesn't play well with your widget's design.

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


## Custom Widgets

Next to provide an example for custom widgets, you'll create a custom navigation widget.