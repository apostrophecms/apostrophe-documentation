---
title: Guide to schemas
layout: tutorial
---

# Guide to schemas

No introduction to Apostrophe would be complete without a closer look at schemas! We've already seen some basic uses of schemas, but now it's time to introduce all of the available schema field types, as well as the options that allow you to build up the schema you want.

## Schemas save us time and trouble everywhere

Just to recap, a schema is simply an array of objects that define the fields that will exist for a particular kind of object. Each object in the array describes one field in the schema via `type`, `name`, `label` and other properties.

Schemas don't just power the database on the back end. They also generate friendly user interfaces for creating and editing content in Apostrophe. This is why many projects that are time-consuming when coded from scratch only take half an hour with Apostrophe.

The [apostrophe-schemas](../../modules/apostrophe-schemas/README.md) module provides powerful tools for working with schemas, but 99% of the time we use them automatically by extending [apostrophe-pieces](../../modules/apostrophe-pieces/README.md), [apostrophe-widgets](../../modules/apostrophe-widgets/README.md) or [apostrophe-custom-pages](../../modules/apostrophe-custom-pages/README.md). They can also be used directly in custom projects.

### Building schemas with `addFields` and friends

Modules like [apostrophe-pieces](../../modules/apostrophe-pieces/README.md) pass on their `addFields`, `removeFields`, `alterFields` and `arrangeFields` options to the `compose` method of [apostrophe-schemas\#compose](../../modules/apostrophe-schemas/README.md#compose). And the beautiful thing about `compose` is how easy it becomes to create the schema you want, adding fields here, removing fields there and arranging them into tabs to suit your needs.

`addFields` is simply an array of field definitions as seen below; if a field appears more than once, the later definition wins.

`removeFields` is an array of fields to be removed. It is processed after `addFields`.

`alterFields` should be a function accepting a `schema` array as its sole argument. `alterFields` should _modify_ the `schema` array, rather than returning a value. It is rarely used.

#### arrangeFields: grouping fields together in the interface as tabs

`arrangeFields` groups fields together. The result is typically displayed as tabs. For example, here is the default `arrangeFields` setting for all docs:

```javascript
[
  {
    name: 'basics',
    label: 'Basics',
    fields: [ 'title', 'slug', 'published', 'tags' ]
  },
  {
    name: 'permissions',
    label: 'Permissions',
    fields: [ 'loginRequired', '_viewUsers', '_viewGroups', '_editUsers', '_editGroups' ],
    last: true
  }
]
```

If the same group is defined more than once with `arrangeFields`, the last definition wins.

If a group is defined twice, the last definition wins, and the group moves to the end.

However, if a group was defined with the `last: true` flag, it remains below any other groups unless it appears again without the flag.

This makes it easy to arrange and then re-arrange the groups in subclasses without rearranging everything.

### Using `beforeConstruct` to adjust schemas

When you create a new module that extends [apostrophe-pieces](../../modules/apostrophe-pieces/README.md) at the project level, you will often use these options directly.

But when you're working on a module that other people will extend, you need a little more nuance. You want to configure the schema your way, then honor _their_ settings so that everything is gracefully added to your work.

The `beforeConstruct` function of your module is a great place to do this. For example:

```javascript
// lib/modules/products/index.js

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product',
  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        label: 'Price',
        name: 'price',
        type: 'float',
        required: true
      }
      // If someone is extending or configuring this module,
      // append their fields to ours
    ].concat(options.addFields || [])
  }
};
```

The same technique works for the other options.

### Universal properties of fields

In a moment we'll look at all of the schema field types. But first, here are a few fields that exist for every \(or nearly every\) field type:

* `name` is the name of the field, and will be the name of the resulting property on the object.
* `label` is the label of the field when a form is presented.
* `help` is help text of the field, and will appear below the field's label when a form is presented.
  * Alternatively, you can use `htmlHelp` for the same purpose, but with the ability to use HTML tags. The primary use case for this is adding links to help text.
* `readOnly: true` prevents the user from actually editing the field.
* `required`, if true, makes the field mandatory.
* `type` specifies the field type, as listed below.

> You can skip the `label` property. If you do, it is inferred from `name`. It works pretty well but feel free to specify `label` yourself.

Other properties vary by type.

### Guide to schema field types

Here are all of the standard schema field types. _You can also add more field types to the system; check out the source code of the_ `apostrophe-attachments` _module for a good example._

### `area`

The `area` field type defines an editable content area that allows users to add a series of widgets. It is exactly like calling `apos.area` in a page template.

The `options` property passed to the field is passed on as the `options` object of the area.

Example:

```javascript
{
  name: 'body',
  label: 'Biography',
  type: 'area',
  options: {
    // just like apos.area in a template
    widgets: {
      'apostrophe-rich-text': {
        toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
      },
      'apostrophe-images': {}
    }
  }
}
```

### `singleton`

The `singleton` field type adds a single widget to your schema. It is exactly like calling `apos.singleton` in a page template.

The widget type is set by the `widgetType` property. The `options` property is passed on to the widget as its options object.

Example:

```javascript
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
```

### `string`

`string` adds an editable text string field to the schema. Setting `textarea: true` presents an interface that allows multiple lines. You may set minimum and maximum numbers of characters using the `min` and `max` options.

Example:

```javascript
// Single line
{
  name: 'author',
  label: 'Author',
  type: 'string'
}
```

```javascript
// Multiple line
{
  name: 'authors',
  label: 'Authors',
  type: 'string',
  textarea: true
}
```

#### Case-insensitive, intuitive sorting

If this field is part of a doc type, such as a piece or page type, you may also set `sortify: true` to automatically create a parallel `Sortified` version of the field that is more intuitive for sorting purposes. Apostrophe will automatically use it if a request is made to sort on the original field.

For instance, if your field's `name` is `lastName` and you set `sortify: true`, `lastNameSortified` will automatically be created and used when sorting on the `lastName` field. This provides case-insensitive sorting that also ignores punctuation differences.

Note that if you add `sortify: true` to an existing field, existing objects will get the sortified version of the field the next time you run the `apostrophe-migrations:migrate` command line task. Migrations like this only need to be run once because on future updates or inserts of a document the sortified property is automatically set.

### `email`

`email` fields operate similarly to `string` fields, but will only accept a valid email address. If they are not `required`, then they will also accept an empty string.

Example:

```javascript
// Single line, optional
{
  name: 'contact',
  label: 'Contact',
  type: 'email'
}
```

```javascript
// Single line, required
{
  name: 'contact',
  label: 'Contact',
  type: 'email',
  required: true
}
```

#### Case-insensitive, intuitive sorting

If this field is part of a doc type, such as a piece or page type, you may also set `sortify: true` to automatically create a parallel `Sortified` version of the field that is more intuitive for sorting purposes. Apostrophe will automatically use it if a request is made to sort on the original field.

For instance, if your field's `name` is `lastName` and you set `sortify: true`, `lastNameSortified` will automatically be created and used when sorting on the `lastName` field. This provides case-insensitive sorting that also ignores punctuation differences.

Note that if you add `sortify: true` to an existing field, existing objects will get the sortified version of the field the next time you run the `apostrophe-migrations:migrate` command line task. Migrations like this only need to be run once because on future updates or inserts of a document the sortified property is automatically set.

### `slug`

`slug` adds a slug field to the schema. Usually there is only one, named `slug`, and it is already part of your schema when extending pieces or custom pages.

If the `page` property is `true`, slashes are allowed and a leading slash is always supplied if missing. Otherwise slashes are not allowed.

By default slugs are sanitized by the [sluggo](https://github.com/apostrophecms/sluggo) module. This can be changed by overriding the `apos.utils.slugify` method.

### `tags`

`tags` adds a field allowing the user to enter one or more tags. The interface will suggest completions for each tag, based on those that already exist in the `tags` properties of docs on the site.

Usually a doc has only one `tags` field, called `tags`. You may create more than one, but the autocomplete feature will not currently be aware of values that only exist in others.

The `limit` property can be set to limit how many tags can be set for this field.

If the `lock` option of the `apostrophe-tags` module has been set to `true`, users cannot create brand-new tags when filling out a `tags` field. In this case never-before-seen tags must be created via the "Tags" admin bar button.

By default, tags are converted to lowercase and leading and trailing whitespace is trimmed. Consistent case for tags greatly reduces the risk of duplicate tags.

This behavior can be overridden by configuring the `apostrophe-launder` module's `filterTag` option to a function that accepts a string, filters it as desired, and returns a new string.

### `boolean`

A `boolean` field is a simple "Yes or No" choice. The value stored in the database will be either `true` or `false`.

A `boolean` field can have a `mandatory` property that will require the user to change the value you to `true` during validation. Supply a string as the `mandatory` property and it will be the validation error message. Turning it to true will use a default message.

**The** `showFields` **option can be used to show and hide other fields based on the choice that was made.** This is a very powerful way to make forms more user-friendly.

Example:

```javascript
{
  type: 'boolean',
  name: 'housing',
  label: 'Do you require housing?',
  mandatory: 'Sorry, you need to have housing!',
  choices: [
    {
      value: true,
      showFields: [
        'dormPreference', 'vegetarian'
      ]
    }
  ]
}
```

When "Yes" is selected, the `value` becomes `true`, and the fields named `dormPreference` and `vegetarian` will be visible. At all other times they will not be.

You can also set `showFields` for the value `false` if you wish.

### `checkboxes`

A `checkboxes` field presents an array of checkboxes. Its value is an array containing the values of the selected checkboxes.

**The** `showFields` **option can be used to show and hide other fields based on the choices that were made.** This is a very powerful way to make forms more user-friendly.

For example:

```javascript
{
  type: 'checkboxes',
  name: 'preferences',
  label: 'Preferences (check one or more)',
  choices: [
    {
      label: 'Big',
      value: 'big'
    },
    {
      label: 'Friendly',
      value: 'friendly',
      showFields: [ 'friends' ]
    },
    {
      label: 'Furry',
      value: 'furry'
    }
  ]
}
```

**In this example, the value of the** `preferences` **property of the data object will be an array of strings.** Each string is the `name` property of a choice that was checked. If no boxes are checked, the value is an empty array.

When "Friendly" is one of the selected checkboxes, the field named `friends` becomes visible. Otherwise that field is hidden.

The `required` option currently has no meaning for `checkboxes`.

This is a multiple-select field. For a single yes-or-no choice, see [boolean](schema-guide.md#boolean). For a single-select choice, see [select](schema-guide.md#select).

#### Fetching choices dynamically from APIs

What if the choices change and can't be hardcoded in your code? You can fetch them dynamically.

First, set the `choices` option to the **name of a method in your module.** Pass a string, the name of the method — do not pass a function.

Second, implement that function to take a single `(req)` argument and return an array of choices in the usual format. **You may use an async function, or return a promise that will resolve to the array.** That means you can reach out to APIs using modules like `axios` or `request-promise`.

> It is usually a good idea to perform at least short-term caching in your choices method, in order to limit the impact on performance when editing.

#### Fields and widgets: editing the field "in context" on the page

If present in the schema of a widget, `checkboxes` fields can also be edited inline on the page. All you have to do is set `widgetControls: true` in your schema for the field.

You may also want to set `contextual: true` so the field does not *also* appear in the dialog box for the widget. But, you don't have to.

### `select`

A single-select dropdown menu. The `choices` array should be an array of objects with `label` and `value` properties. `value` is what winds up in the database, `label` is what the user sees.

**The** `showFields` **option can be used to show and hide other fields based on the choice that was made.** This is a very powerful way to make forms more user-friendly.

Example:

```javascript
{
  type: 'select',
  name: 'housing',
  label: 'Where will you be staying?',
  choices: [
    {
      label: 'On Campus',
      value: 'on-campus',
      showFields: [
        'accessible', 'vegetarian'
      ]
    },
    {
      label: 'Off Campus',
      value: 'off-campus'
    }
  ]
}
```

When the "On Campus" choice is selected, the schema fields named `accessible` and `vegetarian` will be visible. At all other times they will not be.

**A cursor filter method is added automatically for all fields of type** `select`**.** This means joins to pieces containing a `select` type field can be filtered by the field's value;

Example:

```javascript
{
  name: '_post',
  type: 'joinByOne',
  filters: {
    postType: 'event',
    projection: [
      ...
    ]
  }
}
```

#### Fetching choices dynamically from APIs

What if the choices change and can't be hardcoded in your code? You can fetch them dynamically.

First, set the `choices` option to the **name of a method in your module.** Pass a string, the name of the method — do not pass a function.

Second, implement that function to take a single `(req)` argument and return an array of choices in the usual format. **You may use an async function, or return a promise that will resolve to the array.** That means you can reach out to APIs using modules like `axios` or `request-promise`.

> It is usually a good idea to perform at least short-term caching in your choices method, in order to limit the impact on performance when editing.

#### Fields and widgets: editing the field "in context" on the page

If present in the schema of a widget, `select` fields can also be edited inline on the page. All you have to do is set `widgetControls: true` in your schema for the field.

You may also want to set `contextual: true` so the field does not *also* appear in the dialog box for the widget. But, you don't have to.

### `integer`

`integer` adds an editable integer field to the schema. You may set minimum and maximum values using the `min` and `max` options. Any fractional part is discarded.

Example:

```javascript
{
  name: 'children',
  label: 'How many children do you have?',
  type: 'integer'
}
```

### `float`

`float` adds an editable floating point numeric field to the schema. You may set minimum and maximum values using the `min` and `max` options.

Example:

```javascript
{
  name: 'gpa',
  label: 'What is your GPA?',
  type: 'float',
  min: 1.0,
  max: 4.0
}
```

### `url`

`url` adds an editable URL field to the schema. Apostrophe will detect common mistakes, like leaving off `http://`, and add those things. Common XSS attack vectors are laundered and discarded. Only "safe" URL schemes, e.g. `http`, `https`, `ftp` and `mailto`, are permitted.

Example:

```javascript
{
  name: 'portfolio',
  label: 'Portfolio URL',
  type: 'url'
}
```

### `date`

`date` adds an editable date field to the schema. A friendly date picker UI is presented when the field is clicked. Dates are stored as strings in `YYYY-MM-DD` format, which is good for sorting and comparing purposes.

Example:

```javascript
{
  name: 'date',
  label: 'Date',
  type: 'date'
}
```

The date picker UI can be configured by using the `pikadayOptions` configuration. We use [pikaday](https://github.com/dbushell/Pikaday#usage) and most configurations should work without problems.

Example with configuration of date picker:

```javascript
{
  name: 'date',
  label: 'Date',
  type: 'date',
  pikadayOptions: {
    format: 'DD/MM/YYYY',
    firstDay: 1
  }
}
```

**Note: Apostrophe tries its best to convert any date picker format to the above mentioned** `YYYY-MM-DD` **friendly sorting format, but very advanced configurations may not work out of the box, so please keep that in mind.**

**If you do not set** `def: null` **or** `required: true`**, the date defaults to the current date.**

### `time`

`time` adds an editable time field to the schema. No special time picker is presented, however Apostrophe is very tolerant of different time formats users may enter, such as "6p" or "6:37pm" or "17:45".

Times are stored in "HH:MM:SS" format \(hours, minutes, seconds, 24 hour time\). However they are converted back to the local time format if edited again in the future.

The default "local" time format, displayed to the user when editing, is American-style 12 hour time. You may change this by configuring the `apostrophe-ui` module and setting the `userTimeFormat` option to a different [moment](https://npmjs.org/packages/moment) format string, however for the field to understand it when saved it must be standard 24-hour or 12-hour time separated by colons \(`:`\).

**If you do not set** `def: null` **or** `required: true`**, the time defaults to the current time.**

### `password`

`password` fields are identical to `string` fields except that the user's input is not visible.

### `array`

An `array` field has its own schema, and allows the user to create one or more objects that have the fields in that schema. These objects are stored as an array.

This is useful for collections that clearly belong to a parent object, such as multiple homes for a person or tabs in a widget, and do not have any other relationships to other objects. If the objects in the array are also related to other types of objects, you should be using joins instead.

The `limit` property on array fields will limit the number of items an editor can add to the array. So if you set `limit: 3`, editors can only add up to three items in that array.

If the `titleField` property is set, the editing interface will use the value of that field as a distinguishing label for each entry in the array. You may also use "dot notation" to access a nested property just as you would with MongoDB.

If there is no `titleField` setting, the items are numbered. Setting `titleField` is recommended.

Note that `titleField` can access joins beginning with Apostrophe 2.50.0, which is especially useful with dot notation.

Example:

```javascript
{
  name: 'homes',
  label: 'Homes',
  type: 'array',
  titleField: 'address',
  schema: [
    {
      type: 'string',
      name: 'address',
      label: 'Address'
    },
    {
      type: 'string',
      name: 'zip',
      label: 'Zip'
    },
  ]
}
```

If `titleField` is not enough for your purposes, you can completely customize the output of the titles by setting `listItemTemplate` to the name of a custom Nunjucks template. All your template has to do is output whatever it wants, based on the `item` variable provided to it.

This template will be loaded from the `apostrophe-schemas` module, at project level \(`lib/modules/apostrophe/schemas/views/your-template-name.html` at project level\). **If you would rather it came from your own module, use "cross-module include" syntax,** like in the example below:

```javascript
// app.js
// ... where you configure your modules ...
  modules: {
    products: {},
    // other modules...
  }
```

```javascript
// lib/modules/products/index.js
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product',
  addFields: [
    {
      type: 'array',
      name: 'features',
      listItemTemplate: 'products:listItem.html',
      schema: [
        {
          type: 'singleton',
          name: 'description',
          widgetType: 'apostrophe-rich-text',
          required: true
        }
      ]
    }
  ]
}
```

```markup
{# lib/modules/products/listItem.html #}

<div>{{ apos.areas.richText(item.description) }}</div>
```

### `object`

An `object` field has its own schema, and is very similar to an `array` field as described above. However there is always exactly one object, represented as an object property of the doc in the database \(a sub-object\).

The use of this field is not strictly necessary, however it does avoid unnecessary prefixing of field names and nesting does take place in the form, which opens up the possibility of styling things to match.

### `attachment`

An `attachment` field allows the user to upload a file to the server. The user may also choose to replace the file later when editing the field, or leave it in place.

Uploaded files are stored via [uploadfs](https://npmjs.org/package/uploadfs).

Once an attachment field has a value, you can obtain a URL to the file by calling `apos.attachments.url(attachment)`. If the file is an image, you can obtain images of any configured size by calling `apos.attachments.url(attachment, { size: 'one-half' })`, etc.

`attachment` fields can be limited to a particular file type group by setting the `group` option to either `images` or `office`. Other groups can be configured via the `fileGroups` option of the [apostrophe-attachments](../../modules/apostrophe-attachments/README.md) module.

Attachments are most often used indirectly via [apostrophe-images-widgets](../../modules/apostrophe-images-widgets/README.md) or [apostrophe-files-widgets](../../modules/apostrophe-files-widgets/README.md), which are backed by the [apostrophe-images](../../modules/apostrophe-images/README.md) and [apostrophe-files](../../modules/apostrophe-files/README.md) subclasses of pieces. Each of those piece types contains an attachment field and some metadata fields, making them a convenient way to reuse files.

However, you may also use attachments directly in your own schemas. Doing so means that the file will not be available via a general-purpose "media library." It will only be readily accessible as a property of your object.

This is often appropriate for resumes, job applications and other attachments relating to a specific person.

_The uploaded files are stored in a web-accessible folder, however their names are generated by the_ [_cuid_](https://github.com/ericelliott/cuid) _module, which makes guessing them mathematically impractical._

Example:

```javascript
{
  type: 'attachment',
  name: 'resume',
  label: 'Resume',
  group: 'office'
}
```

### `video`

A `video` field allows the user to embed video hosted by any [oembed](http://oembed.com/)—compatible video hosting site, or any site for which you have provided an [oembetter](https://github.com/apostrophecms/oembetter) filter via the [apostrophe-oembed](../../modules/apostrophe-oembed/README.md) module.

The user pastes a URL and sees an immediate preview.

The value of the property on the object will have `url`, `title` and `thumbnail` properties. `title` and `thumbnail` are snapshots from the oembed response at the time the field was saved. `thumbnail` is the URL of a thumbnail image as provided by the oembed response.

[apostrophe-oembed](../../modules/apostrophe-oembed/README.md) provides browser-side methods to display the video. See the [apostrophe-video-widgets](../../modules/apostrophe-video-widgets/README.md) source code for an example of using these methods to play a video in a `div` element.

Example:

```text
{
  type: 'video',
  name: 'video',
  label: 'Video'
}
```

### `color`

A `color` field provides a colorpicker interface to the editor for choosing/pasting a hex value to be stored. Values are stored as hex strings.

Example:

```text
{
  type: 'color',
  name: 'bgColor',
  label: 'Background Color'
}
```

### `range`

A `range` field provides a [range input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) interface for tuning integers. Values are stored as floats.

Example:

```text
{
  type: 'range',
  name: 'fontSize',
  label: 'Font Size',
  min: 18,
  max: 32,
  step: 2 // optional
}
```

### `joinByOne`

A `joinByOne` field expresses a one-to-one relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByOne` field called `_fabric` that relates them to `fabric` pieces, then the related `fabric` object will be available as the `._fabric` property of each product.

The `name` option **must begin with** `_` to signify that this is temporary information that also lives elsewhere in the database.

The `withType` option **may** be set to the name of the related type. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added.

The `idField` option **may** be set to the name of a property in which to store the id. **If you don't set it yourself, it will be set automatically for you.** For instance, if your join is named `_fabric`, then `idField` will automatically be set to `fabricId`.

The `ifOnlyOne` option **may** be set to `true` to avoid carrying out the join when you are working with more than one document. This is a handy way to avoid a heavy performance impact except in a `show.html` template or other context where there is just one "main" document in play, so the number of joined documents will be manageable.

By default, if the related type has joins of its own, they are **not** carried out. To carry out "nested" joins, set the `withJoins` option to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.

**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.md) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join. _You must have_ `title`_,_ `slug`_,_ `type`_, and_ `tags` _set in the projection to get the_ `_url` _property._

Example:

```javascript
{
  name: '_fabric',
  // Must match the `name` option given when configuring `fabric` as a subclass of pieces.
  // You could skip this since the name of the join matches the name of the other type.
  withType: 'fabric',
  type: 'joinByOne',
  filters: {
    // Fetch just enough information
    projection: {
      title: 1,
      slug: 1,
      type: 1,
      tags: 1
    }
  }
}
}
```

**Always remember that the** `_fabric` **property of the product may be null at any time.** Perhaps the fabric was moved to the trash, or unpublished. Your code must allow for this possibility.

### `joinByArray`

A `joinByArray` field expresses a one-to-many relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByArray` field called `_fabrics` that relates them to `fabric` pieces, then the related `fabric` objects will be available as the `._fabrics` array property of each product.

The `name` option **must begin with** `_` to signify that this is temporary information that also lives elsewhere in the database. The `name` option should be plural to signify that this is a one-to-many relationship.

The `withType` option **may** be set to the name of the related type. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added and an optional `s` following.

> Beginning with Apostrophe 2.58.0, you may also set `withType` to an **array** of type names. When you do so, the chooser allows you to pick items of several types via a tabbed interface and create a combined list. These "polymorphic joins" are primarily intended for navigation widgets. They currently do not support pieces filters or `joinByArrayReverse`.

The `idsField` option **may** be set to the name of a property in which to store the ids of the related objects. **If you don't set it yourself, it will be set automatically for you.** For instance, if your join is named `_fabrics`, then `idsField` will automatically be set to `fabricsIds`.

The `ifOnlyOne` option **may** be set to `true` to avoid carrying out the join when you are working with more than one document. This is a handy way to avoid a heavy performance impact except in a `show.html` template or other context where there is just one "main" document in play, so the number of joined documents will be manageable.

By default, if the related type has joins of its own, they are **not** carried out. To carry out "nested" joins, set the `withJoins` option to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.

**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.md) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join.

Example:

```javascript
{
  name: '_fabrics',
  label: 'Fabrics',
  // This is optional since the name of our join matches the name of the
  // other type, if the names don't match it is mandatory
  withType: 'fabric',
  type: 'joinByArray',
  filters: {
    // Fetch just enough information
    projection: {
      title: 1,
      slug: 1,
      type: 1,
      tags: 1
    }
  }
}
```

#### Relationship properties and `joinByArray`

Sometimes, the relationship between the two objects has properties of its own. For example, the relationship between a person and a department might have a `jobTitle` property. Yes, a person can have more than one job title!

You can express these relationships by using the `relationship` property, which allows you to specify a schema for the relationship. _You may use most schema field types, however joins are not permitted inside the schema for the relationship. If the relationship is overly complex, it is recommended that you consider treating it as a third type of object related to both of the other two._

When you specify the `relationship` property, you **may** also specify `relationshipsField`, a property name to store the relationships in. If you do not specify this property, it is set automatically. For instance, if the join is named `_departments`, the relationships will be stored in `departmentsRelationships`.

Example:

```javascript
{
  name: '_departments',
  label: 'Departments',
  // We could skip this since it is the same as the name of the join,
  // plus an s. Since we specified it, it must match the `name` property
  // of another type (it'll be singular)
  withType: 'department',
  type: 'joinByArray',
  filters: {
    // Fetch just enough information
    projection: {
      title: 1,
      slug: 1,
      type: 1,
      tags: 1
    }
  },
  relationship: [
    {
      name: 'jobTitle',
      label: 'Job Title',
      type: 'string'
    }
  ]
}
```

**Since there is a relationship, the** `_departments` **property will be an array of objects with** `item` **and** `relationship` **properties.** The `item` property will be the actual department, and the `relationship` property will contain the relationship fields, which are unique to this person.

**Inline relationship fields**

Sometimes, expecting users to click a special button to access a separate modal dialog box to edit relationship fields isn't worth it. Users just don't find it, or the fields are few enough that it would make more sense to add the form field directly to the chooser.

You can do this with the `inline: true` flag \(since 2.6.0\):

```javascript
relationship: [
  {
    name: 'jobTitle',
    label: 'Job Title',
    type: 'string',
    inline: true
  }
],
```

If you have a mix of inline and regular fields, you'll still get the option of opening the modal, but for data integrity reasons fields are presented only in one place or the other.

### `joinByOneReverse`

A `joinByOneReverse` field allows us to access the other side of a [joinByOne](schema-guide.md#joinByOne) relationship. Since this is the "other end" of the relationship, there is no editing interface. It is just a convenience allowing us to "see" the related object from the other point of view.

You **may** set the `withType` property to the name of the other document type, the one you are joining with. This is singular and will match the `name` option you gave when you configured the module for that type. If you do not set `withType`, then the name of your join must match the name of the other type, with an optional "s" on the end.

You **may** set the `reverseOf` property to the name of the _other join_ \(the one you are reversing, which will be part of the schema for the other type\). If you do not, Apostrophe will look for the first join in the other type that points to this document type.

_For backwards compatibility, you can set the_ `idField` _option instead to match that in the other join, but this is confusing and hard to maintain. Just use_ `reverseOf`_._

Again, note that a reverse join just looks up information that is saved in another, existing join in the other type of document. We are not storing any new information of our own.

The `ifOnlyOne` option **may** be set to `true` to avoid carrying out the join when you are working with more than one document. This is a handy way to avoid a heavy performance impact except in a `show.html` template or other context where there is just one "main" document in play, so the number of joined documents will be manageable. This option is especially useful with reverse joins where the number of joined documents may be high.

Example:

```javascript
// Part of our schema for fabrics (see the joinByOne example)
{
  // No editing interface is currently offered, edit it from the other end
  //
  // Name is plural because more than one product might be joining to
  // each fabric; that's why `_products` will be an array
  name: '_products',
  type: 'joinByOneReverse',
  // Optional since our join name matches the other type's name
  withType: 'product',
  // Optional since there is only one join to fabrics in the other type
  reverseOf: '_fabric',
}
```

We can now see `_product` as a property of each `fabric` object that is related to a product.

### `joinByArrayReverse`

A `joinByArrayReverse` field allows us to access the other side of a [joinByArray](schema-guide.md#joinByArray) relationship. Since this is the "other end" of the relationship, there is no editing interface. It is just a convenience allowing us to "see" the related objects from the other point of view.

You **may** set the `withType` property to the name of the other document type, the one you are joining with. This is singular and will match the `name` option you gave when you configured the module for that type. If you do not set `withType`, then the name of your join must match the name of the other type, with an optional "s" on the end.

You **may** set the `reverseOf` property to the name of the _other join_ \(the one you are reversing, which will be part of the schema for the other type\). If you do not, Apostrophe will look for the first join in the other type that points to this document type.

_For backwards compatibility, you can set the_ `idsField` _option instead to match that in the other join, but this is confusing and hard to maintain. Just use_ `reverseOf`_._

Again, note that a reverse join just looks up information that is saved in another, existing join in the other type of document. We are not storing any new information of our own.

The `ifOnlyOne` option **may** be set to `true` to avoid carrying out the join when you are working with more than one document. This is a handy way to avoid a heavy performance impact except in a `show.html` template or other context where there is just one "main" document in play, so the number of joined documents will be manageable. This option is especially useful with reverse joins where the number of joined documents may be high.

Example:

```javascript
// Part of our schema for fabrics (see the joinByArray example)
{
  // No actual editing interface is currently offered, edit it from the other end
  name: '_products',
  type: 'joinByArrayReverse',
  // Optional since the name of our join matches the name of the type, plus an s
  withType: 'product',
  // Optional since there is only one join with fabrics in the product schema
  reverseOf: '_fabrics'
}
```

We can now see `_products` as a property of each `fabric` object that is related to a product.

If desired, we can specify `relationship` and `relationshipsField` just as we would for `joinByArray`. Currently these are not automatic in a reverse join and must be fully specified if relationship properties are to be accessed. Most array joins do not have relationship properties and thus do not require reverse access to them.

