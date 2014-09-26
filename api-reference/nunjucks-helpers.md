---
title: Nunjucks Helpers
---

Apostrophe provides lots of helpful functions you can call from your Nunjucks templates. Here is the complete list. For a gentler introduction, see [adding editable areas to your page templates](../tutorials/getting-started/adding-editable-content-areas-to-your-page-templates.html).

###aposStylesheets(when)

The `aposStylesheets` function inserts markup to load Apostrophe's stylesheets. This includes Apostrophe's own stylesheets as well as those you "push" from your modules or from app.js. If `minify: true` is turned on in production, the browser loads just one combined and minified file. You don't have to worry about any of this.

`when` is a special variable made available to all page templates. Apostrophe automatically sets it to `anon` or `user` depending on whether the user is logged in. Apostrophe sends extra styles for logged-in users.

This function is called only once, inside the `head` element, in `views/global/base.html`.

Example:

```markup
{{ aposStylesheets(when) }}
```

Outputs (minified example):

```
<link href="/apos-minified/user-518435323655062621.css" rel="stylesheet" />
```

###aposScripts(when)

The `aposScripts` function inserts markup to load Apostrophe's browser-side JavaScript files. This includes Apostrophe's own scripts as those you "push" from your modules or from app.js. If `minify: true` is turned on in production, the browser loads just one combined and minified JavaScript file. You don't have to worry about any of this.

`when` is a special variable made available to all page templates. Apostrophe automatically sets it to `anon` or `user` depending on whether the user is logged in. Apostrophe sends extra scripts to logged-in users.

This function also outputs JavaScript to establish the global `apos` object, set the global `prefix` for sites configured to run in a subdirectory, and set `apos.data.scene` to `anon` or `user`, depending on whether the user is logged in.

This function is called only once, inside the `head` element, in `views/global/base.html`.

Example:

```markup
{{ aposScripts(when) }}
```

Outputs (minified example, with user logged in):

```
<script>
  if (!window.apos) {
    window.apos = {};
  }
  window.apos.data = { prefix: "" };
</script>
<script src="/apos-minified/user-518435323655062621.js"></script>
<script>apos.scene = "user";</script>
```

###aposTemplates(when)

The `aposTemplates` function inserts markup for Apostrophe's browser-side "DOM templates." These are typically modal dialog boxes and other markup that Apostrophe displays often but doesn't display right away. The markup inside these templates will typically have the `apos-template` class to ensure nothing displays until it is needed, at which time these templates are cloned and put to work.

`when` is a special variable made available to all page templates. Apostrophe automatically sets it to `anon` or `user` depending on whether the user is logged in. Apostrophe sends extra templates to logged-in users. This keeps our markup light for logged-out visitors.

This function is usually called only once, at the very end of the `body` element, in `views/global/base.html`.

Example:

```markup
{{ aposTemplates(when) }}
```

Outputs (just a partial sample):

```
<div class="apos-ui-modal apos-template apos-widget-editor...">
  ... Markup for this modal dialog ...
</div>
... More dialogs ...
```

###aposArea(page, areaName, options)

###aposArea({ area: areaObject, options... })

Renders an editable content area. See [adding editable areas to your page templates](../tutorials/getting-started/adding-editable-content-areas-to-your-page-templates.html) for more information about areas.

The first syntax is strongly preferred. Just pass a page object and an area name, which may contain letters and digits only (we suggest usingInterCap). Then pass an object as the third argument with any options intended to configure individual widget types.

The second syntax is usually only used when an area is nested in another property, for instance via [arrays in schemas](../tutorials/snippets/arrays-in-schemas.html). In this case the area is not a direct property of the page object, so the first syntax does not make sense.

#### Options

##### controls

`controls` specifies the text editing controls and Apostrophe widgets to be permitted here. The list of available controls includes:

* Bold
* Italic
* Underline
* Strike
* Subscript
* Superscript
* RemoveFormat
* NumberedList
* BulletedList
* Blockquote
* Link
* Unlink
* Anchor
* Table
* Styles

Note the use of uppercase, which is significant.

*You may encounter older names for these controls which are supported for backwards compatibility.*

The list of available widgets includes:

* slideshow
* video
* buttons
* video
* files
* embed
* pullquote
* html

And any others introduced by the modules in your project. For instance, the sandbox project also has the `snippets`, `blog`, `events`, `rss` and `twitter` widgets.

##### styles

When the `styles` control is present in the editor, the `styles` option is used to override the list of styles that are offerred.

The default `styles` array is:

```javascript
[
  { value: 'div', label: 'Normal' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' },
  { value: 'pre', label: 'Preformatted' }
]
```javascript

You may specify any valid HTML tag as a style. However, Apostrophe's HTML filtering will automatically remove tags not on a whitelist. See the `sanitizeHtml` option in the `app.js` file of the sandbox project for more information.

You may also specify `styles` and `attributes` properties, however again `sanitizeHtml` will remove them unless you whitelist them.

See the [CKEditor documentation](http://docs.ckeditor.com/#!/guide/dev_styles) for the syntax of the `styles` and `attributes` properties.

##### edit

By default, if you use the first syntax, Apostrophe will figure out whether the user is allowed to edit the page and then permit them to edit this area. If you wish you can forbid editing by passing `edit: false` as an option.

With the second syntax editing is not possible. Areas nested in schemas should only be edited as part of the snippet or schema widget in which they are found.

##### initialContent

By default, an area with nothing in it displays a welcome message saying "Click the pencil to get started" or "Use the Add Content button to get started," depending on whether it has the `textOnly` property or not. You can override this message by setting the `initialContent` option to a new string.

##### textOnly

When `textOnly` is set to `true`, there is no "Add Content" menu, just a simple rich text editing field with no widgets.

##### slideshow, video, etc.

You may pass options to all widgets of a given type that appear in an area. If you pass an option named `slideshow`, its value should be an object containing the options you wish to pass to all slideshows.

###aposSingleton(page, areaName, widgetType, options)

###aposSingleton({ area: areaObject, type: widgetType, options... })

This function renders a singleton (a standalone widget, with no "Add Content" menu).

As with `aposArea`, you may simply pass a page object, an area name, a widget type, and an optional object containing options specific to that type of widget. Or, you may pass a single object with `area` and `type` properties. You should use the first syntax, unless you are dealing with nested objects.

Since singletons are really just areas with only one item, you may also use `aposSingleton` to output only the first widget of a specific type from an area. If you use this technique, be sure to specify `edit: false` so that the user does not inadvertently remove the rest of the area's content by editing it as a singleton.

See [aposArea](#aposArea) for a list of possible widget types.

####Options

#####edit

When you use the first syntax, Apostrophe automatically determines
if the user is permitted to edit the widget. However if you wish you may override this to prevent editing in an inconvenient location. Just set the `edit` option to `false`.

With the second syntax editing in context is not possible.

###aposAreaIsEmpty(page, areaName)

###aposAreaIsEmpty({ area: page.areaName })

This function returns true if the area is considered empty. This is useful for skipping unnecessary wrappers and headers when there is no content.

The first syntax is usually preferred. Use the second when the area is nested in another property, for instance when working with schema widgets or snippet schemas.

Example:

```markup
{% if aposAreaIsEmpty(page, 'body') %}
  <h3>There are no agents in your area.</h3>
{% else %}
  <h3>About illuminati agents in your area</h3>
  {{ aposArea(page, 'body') }}
{% endif %}
```

###aposSingletonIsEmpty(page, areaName, type)

###aposSingletonIsEmpty({ area: page.areaName, type: type })

This function returns true if a singleton is considered empty. Although similar to [aposAreaIsEmpty](#aposAreaIsEmpty), this function will make sure there is a widget of the appropriate type that is not empty, ignoring any other content.

Since singletons are actually just areas with only one item in them, this function may also be used to check whether an area has at least one item of a specific type, such as `slideshow`.

The first syntax is preferred, unless you are working with areas that are nested in other properties.

Example:

```markup
{% if aposSingletonIsEmpty(page, 'thumbnail', 'slideshow') %}
  <img src="/dorky-default-profile-picture.png" />
{% else %}
  {{ aposSingleton(page, 'thumbnail', 'slideshow') }}
{% endif %}
```

###aposSlugify(string)

This function returns a "slug" based on the given string. All sequences of punctuation and whitespace are removed and replaced with a single `-`. Note that you should *not* use this function to link to Apostrophe pages and singletons, which already have a `slug` property that is guaranteed to be unique. Just use `page.slug`.

###aposAreaContent(item, options)

Outputs the normal views of all of the content items (widgets
and/or rich text blocks) present in the first array, passing on
the specified options. Typically invoked for you by `aposArea`
or `aposSingleton`, this function may also be called
directly with `area.items` when you do not wish to render
the wrapper markup for the area as a whole and editing is
not a concern.

The individual items still have wrapper `div`s, but these are minimal and necessary to preserve the structure and allow the widgets to work properly.

#### Options

##### allowed

The `allowed` option, if present, should be a list
of permitted item types; any items not on that list are not
rendered. "Item types" include all widget types and also `richText`.

##### slideshow, etc.

Options for individual widget types can be passed as part of the second, optional argument:

`{ slideshow: { ... options ... } }`

Example:

{# Output just the richText items in the body area #}
{{ aposAreaContent(piece.body.items, { allowed: [ 'richText' ] }) }}

### aposAreaImage(page, name, options)

### aposAreaImage({ area: area, options... })

Find an image referenced within an area, such as an image in a slideshow widget. Returns the first `file` object matching the criteria. Only GIF, JPEG and PNG images will be returned.

The returned object can be passed to [aposFilePath](#aposFilePath) to obtain a URL for use in an `img` element.

#### Options

##### extension

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg` or `png`), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses these three extensions for images.

##### extensions

Specify an array of allowed file extensions. (You do not need to specify `jpeg`, `JPG`, etc. Apostrophe always uses `jpg`.)

Example:

```markup
{% set image = aposAreaImage(page, 'body') %}
{% if image %}
  <img src="{{ aposFilePath(image, { size: 'small' }) }}" />
{% endif %}
```

### aposAreaImages(page, name, options)

### aposAreaImages({ area: area, options... })

Find images referenced within an area, such as an image in a slideshow widget. Returns an array of `file` objects that meet the criteria. Only GIF, JPEG and PNG images will be returned.

The returned objects can be passed to [aposFilePath](#aposFilePath) to obtain a URL for use in an `img` element.

#### Options

##### extension

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg` or `png`), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses these three extensions for images.

##### extensions

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

TODO CONTINUE


