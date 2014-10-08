---
title: Nunjucks Helpers
---

Apostrophe provides lots of helpful functions you can call from your Nunjucks templates. Here is the complete list. For a gentler introduction, see [adding editable areas to your page templates](../tutorials/getting-started/adding-editable-content-areas-to-your-page-templates.html).

## Editable Content: Areas and Singletons

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
```

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

Example:

```markup
{{
  aposArea(page, 'sidebar', {
    controls: [
      'style', 'bold', 'italic', 'createLink', 'slideshow', 'video'
    ],
    slideshow: {
      size: 'one-half'
    }
  })
}}
```

###aposSingleton(page, areaName, widgetType, options)

###aposSingleton({ area: areaObject, type: widgetType, options... })

This function renders a singleton (a standalone widget, with no "Add Content" menu).

As with `aposArea`, you may simply pass a page object, an area name, a widget type, and an optional object containing options specific to that type of widget. Or, you may pass a single object with `area` and `type` properties. You should use the first syntax, unless you are dealing with nested objects.

Since singletons are really just areas with only one item, you may also use `aposSingleton` to output only the first widget of a specific type from an area. If you use this technique, be sure to specify `edit: false` so that the user does not inadvertently remove the rest of the area's content by editing it as a singleton.

See [aposArea](#apos-area) for a list of possible widget types.

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

This function returns true if a singleton is considered empty. Although similar to [aposAreaIsEmpty](#apos-area-is-empty), this function will make sure there is a widget of the appropriate type that is not empty, ignoring any other content.

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

###aposAreaContent(item, options)

**Usually not called directly.** Outputs the normal views of all of the content items (widgets
and/or rich text blocks) present in the first array, passing on
the specified options. Typically invoked for you by `aposArea`
or `aposSingleton`, via the `area.html` or `singleton.html` template, this function may also be called
directly with `area.items` when you *do not wish to render
the wrapper markup for the area as a whole* and editing is
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

```markup
{# Output just the richText items in the body area #}
{{ aposAreaContent(piece.body.items, { allowed: [ 'richText' ] }) }}
```

### aposAreaPlaintext(page, name, options)
### aposAreaPlaintext(options)

Convert an area to plaintext.

Plaintext means truly plain, so if you want to output the
text with nunjucks, be sure to use the "e" filter.

If the truncate option is present, it is used as a character
limit. The plaintext is cut at the closest word boundary
before that length. If this cannot be done a hard cutoff is
applied so that the result is never longer than
options.truncate characters.

This will only contain text for items that clearly have an appropriate plaintext representation for the public (slideshows do not, for instance). But you can define the 'getPlaintext' method
for your custom widgets to return one.

You may call with the `page, areaName, options` syntax:

```markup
{{ aposAreaPlaintext(page, 'body', { truncate: 200 }) }}
```

Or with a single options object:

```markup
{{ aposAreaPlaintext({ area: page.body, truncate: 200 }) }}
```

Example:

```markup
{% for item in items %}
<h4><a href="{{ item.url | e }}">{{ item.title | e }}</a></h4>
<div class="excerpt">
  {{ aposAreaPlaintext(item, 'body', { truncate: 200 }) }}
</div>
```

### aposItemNormalView(item, options)

Renders the normal, public view of a widget or rich text item.
Typically invoked by [aposAreaContent](#apos-area-content), which
is usually invoked by [aposArea](#apos-area) or [aposSingleton](#apos-singleton).

**Normally you do not need to call this function yourself.** However you may do so if you are bypassing the normal wrapper elements output as part of an editable singleton or area.

The provided `options` object is passed to the renderer for the widget. For instance, for a slideshow item you might pass the `size` option.

Example:

```markup
{# Let's render just the slideshows from the body #}
{# area, with no editing controls or wrappers #}
{% for item in page.body.items %}
  {% if item.type == 'slideshow' %}
    {{ aposItemNormalView(item, { size: 'medium' }) }}
  {% endif %}
{% endfor %}
```

## Assets and the Outer Layout

These functions are usually called for you by `views/global/outerLayout.html` (or `views/global/base.html` if `outerLayout.html` extends that in your project). You will encounter them when you make changes to those templates.

###aposStylesheets(when)

The `aposStylesheets` function inserts markup to load Apostrophe's stylesheets. This includes Apostrophe's own stylesheets as well as those you "push" from your modules or from app.js. If `minify: true` is turned on in production, the browser loads just one combined and minified file. You don't have to worry about any of this.

`when` is a special variable made available to all page templates. Apostrophe automatically sets it to `anon` or `user` depending on whether the user is logged in. Apostrophe sends extra styles for logged-in users.

This function is called only once, inside the `head` element, in `views/global/base.html` or `views/global/outerLayout.html`.

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

```markup
<div class="apos-ui-modal apos-template apos-widget-editor...">
  ... Markup for this modal dialog ...
</div>
... More dialogs ...
```

### aposMediaMenu(options)

Outputs markup for a button that accesses the media admin interface. Normally called from `outerLayout.html` as part of the admin bar markup.

#### Options

`edit` should be true if the user is permitted to see the button, false otherwise. Typically `permissions.guest` is passed, allowing users who are permitted to contribute media to edit their media.

Example:

```markup
{{ aposMediaMenu({ edit: permissions.guest }) }}
```

### aposTagsMenu(options)

Outputs markup for a button that accesses the media admin interface. Normally called from `outerLayout.html` as part of the admin bar markup.

#### Options

`edit` should be true if the user is permitted to see the button, false otherwise. `permissions.admin` should be passed as only admins are permitted to edit tags globally. *Passing other values here will not prevent the server from verifying permissions before actually allowing tags to be edited.*

Example:

```markup
{{ aposTagsMenu({ edit: permissions.admin }) }}
```
## Files and Images

These functions help you access files and images directly, bypassing the normal markup for a slideshow or file widget.

### aposAreaImage(page, name, options)

### aposAreaImage({ area: area, options... })

Find an image referenced within an area, such as an image in a slideshow widget. Returns the first `file` object matching the criteria. Only GIF, JPEG and PNG images will be returned.

The returned object can be passed to [aposFilePath](#apos-file-path) to obtain a URL for use in an `img` element.

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

The returned objects can be passed to [aposFilePath](#apos-file-path) to obtain a URL for use in an `img` element.

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

### aposAreaFile(page, areaName, options)

### aposAreaFile({ area: area, options... })

Find an file referenced within an area, such as a PDF in a file widget or an image in a slideshow widget. Returns the first `file` object matching the criteria.

The returned object can be passed to [aposFilePath](#apos-file-path) to obtain a URL.

#### Options

##### extension

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg`, `pdf`, `xlsx`, `png`, etc.), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses specific extensions, always lower case, typically three letters except for `xlsx` and other recent Microsoft Office formats.

##### extensions

Specify an array of allowed file extensions.

Example:

```markup
{% set pdf = aposAreaFile(page, 'body', { extension: 'pdf'}) %}
{% if pdf %}
  <a href="{{ aposFilePath(pdf) }}">Download PDF</a>
{% endif %}
```

### aposAreaFiles(page, areaName, options)

### aposAreaFiles({ area: area, options... })

Find files referenced within an area, such as a PDF in a file widget or an image in a slideshow widget. Returns an array of `file` objects that meet the criteria.

The returned objects can be passed to [aposFilePath](#apos-file-path) to obtain a URL.

#### Options

##### extension

To force Apostrophe to return only images with a specific file extension (`gif`, `jpg`, `pdf`, `xlsx`, `png`, etc.), specify the `extension` option. Do **not** specify a leading `.`. Note that Apostrophe always uses specific extensions, always lower case, typically three letters except for `xlsx` and other recent Microsoft Office formats.

##### extensions

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

### aposFilePath(file, options)

Given a file object, as returned by [aposAreaFile](#apos-area-file) for instance, return the file URL. If `options.size` is set, return the URL for that size (`one-sixth`, `one-third`, `one-half`, `two-thirds`, `full`).

`full` is "full width" (1140px), not the original. For the original, don't pass `size`.

Additional image sizes can be configured on a per-project basis.

There is a matching client-side JavaScript implementation accessible as `apos.filePath`.

**Always use this function to create URLs to files.** Otherwise your code will cease to work if your project's file storage is moved to Amazon S3 at a later date.

Example:

```markup
{% set image = aposAreaImage(page, 'body') %}
{% if image %}
  <img src="{{ aposFilePath(image, { size: 'small' }) }}" />
{% endif %}
```

## Arrays, objects and strings

In our JavaScript, we always use [lodash](http://lodash.com) to help out with common tasks like finding elements in an array, or grouping array elements by a property. These functions provide similar capabilities for your Nunjucks templates. Many of these functions are simple wrappers for lodash.

### aposContains(list, value)

Returns `true` if the array `list` contains `value`.

If `value` is also an array, this function returns `true` if any of the values in `value` appear in `list`.

Example:

```markup
{% if aposContains(item.tags, 'fancy') %}
  <h3>Very Fancy Heading</h3>
{% endif %}
```

### aposContainsProperty(list, propertyName)
### aposContainsProperty(object, propertyName)

Returns true if the array `list` contains at least one
object with the property `propertyName`. The property need not have any specific value, it only has to exist.

The first parameter may also be a single object, in which case this function returns true if that object has the named property.

Example:

```markup
{# Other table headings... #}
{% if aposContainsProperty(items, 'address') %}
  {# At least one will need an address column #}
  <th>Address</th>
{% endif %}
```

### aposReverse(array)

Reverses the order of the array. This **modifies the original array**. In addition, for convenience, the reversed array is returned.

Example:

```markup
{% if query.reverse %}
  {{ aposReverse(items) }}
{% endif %}

<h4>Team Members,
  {% if query.reverse %}
    Z-A
  {% else %}
    A-Z
  {% endif %}
</h4>
<ul>
{% for item in items %}
  <li>
    {{ item.lastName | e }}, {{ item.firstName | e }}
  </li>
{% endfor %}
</ul>
```

### aposBeginsWith(haystackString, needleString)
### aposBeginsWith(haystackArray, needleString)

`aposBeginsWith` returns true if the `haystackString` begins with the `needleString`.

If the first argument is an array, then `aposBeginsWith` returns true if *any* of the strings in `haystackArray` begin with the `needleString`.

Example:

```markup
{# Apply color-related CSS classes to an item based #}
{# on its tags #}
<div class="
  {% for tag in item.tags %}
    {% if aposBeginsWith(tag, 'color-') %}
      {{ tag | e }}
    {% endif %}
  {% endfor %}
">
  <h4>{{ item.title | e }}</h4>
</div>

### aposMerge(object1, object2, object3...)

Recursively merges the properties of the specified objects. If a later object has a property of the same name, it overrides the earlier object's property.

If one of the parameters is `null`, it is gracefully ignored.

If there are no objects passed, an empty object is returned.

Example:

```markup
{% macro photo(options) %}
  {% set defaults = { size: 'large' } %}
  {# Properties of options will override properties #}
  {# of defaults #}
  {% set _options = aposMerge(defaults, options) %}

  <div class="{{ _options.size | e }}">
    <img src="{{ _options.url | e }} " />
  </div>
{% endmacro %}
```

### aposFind(array, property, value)

Returns the first element of `array`, if any, that has the specified `value` for the specified `property`.

Example:

```markup
{% set clown = aposFind(people, 'occupation', 'clown') %}

{% if clown %}
  <h4>Our clown is {{ clown.title | e }}.</h4>
{% endif %}
```

### aposFilter(array, property, value)

Returns all elements of `array` that have the specified `value` for the specified `property`.

Example:

```markup
{% set clowns = aposFilter(people, 'occupation', 'clown') %}

{% if clowns.length %}
  <h4>Our clowns are:</h4>
  <ul>
    {% for clown in clowns %}
      <li>{{ clown.title | e }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

### aposFilterNonempty(array, property)

Returns all elements of `array` for which the specified `property` is "truthy." "Truthy" values include:

Arrays (even if they have no elements)
Objects (even if they have no properties)
All strings except the empty string
All numbers, except zero (but "0" as a string is truthy)
`true`

In general, if JavaScript's `if` statement considers it to be true, it's truthy.

Example:

```markup
{% set employed = aposFilterNonempty(people, 'occupation') %}

{% if employed.length %}
  <h4>These folks have jobs:</h4>
  <ul>
    {% for person in employed %}
      <li>{{ person.title | e }}: {{ person.occupation | e }}</li>
    {% endfor %}
  </ul>
{% endif %}
```

### aposPluck(array, property)

Given an array of objects and a property name, this function returns an array containing the value of `property` for each object in the original array.

Example:

```markup
<script type="text/javascript">
  var names = {{ aposPluck(people, 'title') | [json](nunjucks-filters.html#json) }};
</script>
```

### aposGroupBy(items, property)

Group the elements of the array `items` into separate arrays, one for each value of `property`. If `property` is `color`, and there are three elements whose `color` property is `red`, then the returned object will have a `red` property containing an array of those three elements, and so on for every value of `property`.

If the value of `property` is an array, then the element will be "grouped" for each value in the array. Note that this means the object will appear in more than one place. *This works only if the value of `property` is an array for the very first element.*

```markup
{% set occupations = aposGroupBy(people, 'occupation') %}
{# List people by job #}
{% for occupation, people in occupations %}
  <h4>{{ occupation | e }}</h4>
  <ul>
    {% for person in people %}
      <li>{{ person.title | e }}</li>
    {% endfor %}
  </ul>
{% endfor %}
```

### aposObject(key, value, key, value, ...)

Given a series of alternating keys and values, this
function returns a new object with the given values
for the given keys. For instance, `aposObject('name', 'bob')`
returns `{ name: 'bob' }`.

This is useful because Nunjucks does not allow you to
set a property of an object, and [aposMerge](#apos-merge) is only helpful if you know the property name in advance.

You may find it useful to combine `aposObject` with the [build](nunjucksFilters.html#build) filter.

Example:

```markup

{# Display toggles to turn filters on and off in the page URL #}

{# a loader function gave us req.extras.filterStatus, an #}
{# object with a "0" or "1" property for each filter name #}

{# The build filter merges new query parameters into page.url, #}
{# removing them if the values are empty #}

{%- macro here(changes) -%}
  {{ page.url | build(filterStatus, changes) }}
{%- endmacro -%}

{# The loader also gave us an array describing each filter #}
{# with "name", "active" and "label" properties #}

{% for filter in searchFilters %}
    {% if filter.active %}
      <a href="{{ here(aposObject(filter.name, '0')) }}">
        {{ filter.label }}
      </a>
    {% else %}
      <a href="{{ here(aposObject(filter.name, '1')) }}">
        {{ filter.label }}
      </a>
    {% endif %}
{% endfor %}
```

## Miscellaneous

Not everything fits into a neat category. You'll functions for logging, ID generation, checking whether a date falls in the current year and other miscellaneous tasks here.

### aposCanEditSomething(permissions)

Returns true if this user can edit *something*. It doesn't matter what. As long as they have some kind of editing access, this function returns true.

This is useful to decide whether to show the admin bar or not. It is used for that purpose in `outerLayout.html`. Inside the admin bar, other helpers like `aposMediaMenu` require more nuanced decisions about which controls to display.

Note that the `permissions` object is always available to your page templates. This object is equal to `req.user.permissions`.

Example:

```markup
{% if loginButton or aposCanEditSomething(permissions) %}
  <div class="apos-admin-bar">...</div>
{% endif %}
```

### aposGenerateId()

Generates a unique identifier. Useful when you want many things to coexist without interfering with each other. Most of the time you won't need this, but it can be handy when attaching JavaScript to your template markup.

Example:

```markup
{% macro map() %}
  {% set mapId = aposGenerateId() %}
  <div id="{{ mapId }}">Lovely Map Goes Here</div>
  <script type="text/javascript">
    $(function() {
      var mapId = "{{ mapId }}";
      $('#' + mapId).doCleverThings();
    });
  </script>
{% endmacro %}
```

### aposIsCurrentYear(date)

Returns `true` if the provided date object refers to a date in the present year.

Example:

```markup
{# Output 2-digit year but only if it is not the present year #}
{% if not aposIsCurrentYear(item.publishedAt) %}
  '{{ item.publishedAt | date('YY') }}
{% endif %}
```

### aposLog(s)

Passes `s` to `console.log`. Very useful for debugging.

Example:

```markup
{{ aposLog(page.slug) }}
```

### aposPageRange(options)

Returns an array of numbers representing the page numbers that should appear in Apostrophe's standard pager. **This function exists to assist the macros in `pagerMacros.html` and work around a limitation of Nunjucks.** Typically if you are calling this yourself you would be happier invoking the `renderPager` macro from that file.

#### Options

`options.page` is the current page number.
`options.shown` is the number of page numbers to be shown (typically `5` in our pager).

Example:

See `pagerMacros.html`.

###aposSlugify(string)

This function returns a "slug" based on the given string. All sequences of punctuation and whitespace are removed and replaced with a single `-`. Note that you should *not* use this function to link to Apostrophe pages and singletons, which already have a `slug` property that is guaranteed to be unique. Just use `page.slug`.

Example:

```markup
{# Make a pretty link to people with the same occupation #}
{# as the person in "item." Of course you would have to #}
{# write a dispatcher or page loader that understood #}
{# these URLs #}

<a href="{{ page.url }}/occupations/{{ item.occupation | slug }}">
  Find more {{ item.occupation | e }}s in your area
</a>
```
