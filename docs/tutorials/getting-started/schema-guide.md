---
title: Guide to schemas
layout: tutorial
---

No introduction to Apostrophe would be complete without a good look at schemas! We've already seen some basic uses of schemas, but now it's time to introduce all of the available schema field types, as well as the options that allow you to build up the schema you want.

## Schemas save us time and trouble everywhere

Just to recap, a schema is simply an array of objects that define the fields that will exist for a particular kind of object. Each object in the array describes one field in the schema via `type`, `name`, `label` and other properties.

Schemas don't just power the database on the back end. They also generate friendly user interfaces for creating and editing content in Apostrophe. This is why many projects that are time-consuming when coded from scratch only take half an hour with Apostrophe.

The [apostrophe-schemas](../../modules/apostrophe-schemas/index.html) module provides powerful tools for working with schemas, but 99% of the time we use them automatically by extending [apostrophe-pieces](../../modules/apostrophe-pieces/index.html), [apostrophe-widgets](../../modules/apostrophe-widgets/index.html) or [apostrophe-custom-pages](../../modules/apostrophe-custom-pages/index.html). They can also be used directly in custom projects.

### Building schemas with `addFields` and friends

Modules like [apostrophe-pieces](../../modules/apostrophe-pieces/index.html) pass on their `addFields`, `removeFields`, `alterFields` and `arrangeFields` options to the `compose` method of [apostrophe-schemas#compose](../../modules/apostrophe-schemas/index.html). And the beautiful thing about `compose` is how easy it becomes to create the schema you want, adding fields here, removing fields there and arranging them into tabs to suit your needs.

`addFields` is simply an array of field definitions as seen below; if a field appears more than once, the later definition wins.

`removeFields` is an array of fields to be removed. It is processed after `addFields`.

`alterFields` should be a function accepting a `schema` array as its sole argument. `alterFields` should *modify* the `schema` array, rather than returning a value. It is rarely used.

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

When you create a new module that extends [apostrophe-pieces](../../modules/apostrophe-pieces/index.html) at the project level, you will often use these options directly.

But when you're working on a module that other people will extend, you need a little more nuance. You want to configure the schema your way, then honor *their* settings so that everything is gracefully added to your work.

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

In a moment we'll look at all of the schema field types. But first, here are a few fields that exist for every (or nearly every) field type:

* `name` is the name of the field, and will be the name of the resulting property on the object.
* `label` is the label of the field when a form is presented.
* `required`, if true, makes the field mandatory.
* `type` specifies the field type, as listed below.

Other properties vary by type.

### Guide to schema field types

Here are all of the standard schema field types. *You can also add more field types to the system; check out the source code of the `apostrophe-attachments` module for a good example.*

#### `area`

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
        controls: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
      },
      'apostrophe-images': {}
    }
  }
}
```

#### `singleton`

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

#### `string`

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

#### `slug`

`slug` adds a slug field to the schema. Usually there is only one, named `slug`, and it is already part of your schema when extending pieces or custom pages.

If the `page` property is `true`, slashes are allowed and a leading slash is always supplied if missing. Otherwise slashes are not allowed.

By default slugs are sanitized by the [sluggo](https://github.com/punkave/sluggo) module. This can be changed by overriding the `apos.utils.slugify` method.

#### `tags`

`tags` adds a field allowing the user to enter one or more tags. The interface will suggest completions for each tag, based on those that already exist in the `tags` properties of docs on the site.

Usually a doc has only one `tags` field, called `tags`. You may create more than one, but the autocomplete feature will not currently be aware of values that only exist in others.

The `limit` property can be set to limit how many tags can be set for this field.

If the `lock` option of the `apostrophe-tags` module has been set to `true`, users cannot create brand-new tags when filling out a `tags` field. In this case never-before-seen tags must be created via the "Tags" admin bar button.

By default, tags are converted to lowercase and leading and trailing whitespace is trimmed. Consistent case for tags greatly reduces the risk of duplicate tags.

This behavior can be overridden by configuring the `apostrophe-launder` module's `filterTag` option to a function that accepts a string, filters it as desired, and returns a new string.

#### `boolean`

A `boolean` field is a simple "Yes or No" choice. The value stored in the database will be either `true` or `false`.

If a `boolean` field is set `required: true`, the user must select "Yes" to complete the form. This may seem odd but is useful for consent fields.

#### `checkboxes`

A `checkboxes` field presents an array of checkboxes. For example:

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
      value: 'friendly'
    },
    {
      label: 'Furry',
      value: 'furry'
    }
  ]
}
```

**In this example, the value of the `preferences` property of the data object will be an array of strings.** Each string is the `name` property of a choice that was checked. If no boxes are checked, the value is an empty array.

The `required` option currently has no meaning for `checkboxes`.

This is a multiple-select field. For a single yes-or-no choice, see [boolean](#boolean). For a single-select choice, see [select](#select).

#### `select`

A single-select dropdown menu. The `choices` array should be an array of objects with `label` and `value` properties. `value` is what winds up in the database, `label` is what the user sees.

**The `showFields` option can be used to show and hide other fields based on the choice that was made.** This is a very powerful way to make forms more user-friendly.

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

#### `integer`

`integer` adds an editable integer field to the schema. You may set minimum and maximum values using the `min` and `max` options. Any fractional part is discarded.

Example:

```javascript
{
  name: 'children',
  label: 'How many children do you have?',
  type: 'integer'
}
```

#### `float`

`integer` adds an editable floating point numeric field to the schema. You may set minimum and maximum values using the `min` and `max` options.

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

#### `url`

`url` adds an editable URL field to the schema. Apostrophe will detect common mistakes, like leaving off `http://`, and add those things. Common XSS attack vectors are laundered and discarded. Only "safe" URL schemes, e.g. `http`, `https`, `ftp` and `mailto`, are permitted.

Example:

```javascript
{
  name: 'portfolio',
  label: 'Portfolio URL',
  type: 'url'
}
```

#### `date`

`date` adds an editable date field to the schema. A friendly date picker UI is presented when the field is clicked. Dates are stored as strings in `YYYY-MM-DD` format, which is good for sorting and comparing purposes.

Example:

```javascript
{
  name: 'date',
  label: 'Date',
  type: 'date'
}
```

**If you do not set `def: null` or `required: true`, the date defaults to the current date.**

#### `time`

`time` adds an editable time field to the schema. No special time picker is presented, however Apostrophe is very tolerant of different time formats users may enter, such as "6p" or "6:37pm" or "17:45".

Times are stored in "HH:MM:SS" format (hours, minutes, seconds, 24 hour time). However they are converted back to the local time format if edited again in the future.

The default "local" time format, displayed to the user when editing, is American-style 12 hour time. You may change this by configuring the `apostrophe-ui` module and setting the `userTimeFormat` option to a different [moment](https://npmjs.org/packages/moment) format string, however for the field to understand it when saved it must be standard 24-hour or 12-hour time separated by colons (`:`).

**If you do not set `def: null` or `required: true`, the time defaults to the current time.**

#### `password`

`password` fields are identical to `string` fields except that the user's input is not visible.

#### `array`

An `array` field has its own schema, and allows the user to create one or more objects that have the fields in that schema. These objects are stored as an array.

This is useful for collections that clearly belong to a parent object, such as multiple homes for a person, and do not have any other relationships to other objects. If the objects in the array are also related to other types of objects, you should be using joins instead.

If the `titleField` property is set, the editing interface will use the value of that field as a distinguishing label for each entry in the array. If there is no such property, the items are numbered. Setting `titleField` is recommended.

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

#### `object`

An `object` field has its own schema, and is very similar to an `array` field as described above. However there is always exactly one object, represented as an object property of the doc in the database (a sub-object).

The use of this field is not strictly necessary, however it does avoid unnecessary prefixing of field names and nesting does take place in the form, which opens up the possibility of styling things to match.

#### `attachment`

An `attachment` field allows the user to upload a file to the server. The user may also choose to replace the file later when editing the field, or leave it in place.

Uploaded files are stored via [uploadfs](https://npmjs.org/package/uploadfs).

Once an attachment field has a value, you can obtain a URL to the file by calling `apos.attachments.url(attachment)`. If the file is an image, you can obtain images of any configured size by calling `apos.attachments.url(attachment, { size: 'one-half' })`, etc.

`attachment` fields can be limited to a particular file type group by setting the `group` option to either `images` or `office`. Other groups can be configured via the `fileGroups` option of the [apostrophe-attachments](../../modules/apostrophe-attachments/index.js) module.

Attachments are most often used indirectly via [apostrophe-images-widgets](../../modules/apostrophe-images-widgets/index.html) or [apostrophe-files-widgets](../../modules/apostrophe-files-widgets/index.html), which are backed by the [apostrophe-images](../../modules/apostrophe-images) and [apostrophe-files](../../modules/apostrophe-files) subclasses of pieces. Each of those piece types contains an attachment field and some metadata fields, making them a convenient way to reuse files.

However, you may also use attachments directly in your own schemas. Doing so means that the file will not be available via a general-purpose "media library." It will only be readily accessible as a property of your object.

This is often appropriate for resumes, job applications and other attachments relating to a specific person.

*The uploaded files are stored in a web-accessible folder, however their names are generated by the [cuid](https://github.com/ericelliott/cuid) module, which makes guessing them mathematically impractical.*

Example:

```javascript
{
  type: 'attachment',
  name: 'resume',
  label: 'Resume',
  group: 'office'
}
```

#### `video`

A `video` field allows the user to embed video hosted by any [oembed](http://oembed.com/)—compatible video hosting site, or any site for which you have provided an [oembetter](https://github.com/punkave/oembetter) filter via the [apostrophe-oembed](../../modules/apostrophe-oembed/index.html) module.

The user pastes a URL and sees an immediate preview.

The value of the property on the object will have `url`, `title` and `thumbnail` properties. `title` and `thumbnail` are snapshots from the oembed response at the time the field was saved. `thumbnail` is the URL of a thumbnail image as provided by the oembed response.

[apostrophe-oembed](../../modules/apostrophe-oembed/index.html) provides browser-side methods to display the video. See the [apostrophe-video-widgets](../../modules/apostrophe-video-widgets/index.html) source code for an example of using these methods to play a video in a `div` element.

Example:

```javascript:
{
  type: 'video',
  name: 'video',
  label: 'Video'
}
```

#### `joinByOne`

A `joinByOne` field expresses a one-to-one relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByOne` field called `_fabric` that relates them to `fabric` pieces, then the related `fabric` object will be available as the `._fabric` property of each product.

The `name` option **must begin with `_`** to signify that this is temporary information that also lives elsewhere in the database.

The `withType` option must be set to the name of related type.

The `idField` option must be set to the name of a property in which to store the id. *Convention:* if the join is called `_fabric`, set `idField` to `fabricId`.

By default, if the related type has joins of its own, they are **not** carried out. To carry out "nested" joins, set the `withJoins` option to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.

**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.html) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join. *You must have `title`, `slug`, `type`, and `tags` set in the projection to get the `_url` property.*

Example:

```javascript
{
  name: '_fabric',
  label: 'Fabric',
  // Must match the `name` option given when configuring `fabric` as a subclass of pieces
  withType: 'fabric',
  type: 'joinByOne',
  // The id of the fabric will be stored in the fabricId property of the product
  idField: 'fabricId',
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

**Always remember that the `_fabric` property of the product may be null at any time.** Perhaps the fabric was moved to the trash, or unpublished. Your code must allow for this possibility.

#### `joinByArray`

A `joinByArray` field expresses a one-to-many relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByArray` field called `_fabrics` that relates them to `fabric` pieces, then the related `fabric` objects will be available as the `._fabrics` array property of each product.

The `name` option **must begin with `_`** to signify that this is temporary information that also lives elsewhere in the database. The `name` option should be plural to signify that this is a one-to-many relationship.

The `withType` option must be set to the name of related type.

The `idsField` (NOTE: PLURAL) option must be set to the name of a property in which to store the array of IDs. *Convention:* if the join is called `_fabrics`, set `idsField` to `fabricIds`.

By default, if the related type has joins of its own, they are **not** carried out. To carry out "nested" joins, set the `withJoins` option to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.

**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.html) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join.

Example:

```javascript
{
  name: '_fabrics',
  label: 'Fabrics',
  // Must match the `name` option given when configuring `fabric` as a subclass of pieces
  withType: 'fabric',
  type: 'joinByArray',
  // The id of the fabric will be stored in the fabricIds property of the product
  idsField: 'fabricIds',
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

##### Relationship properties and `joinByArray`

Sometimes, the relationship between the two objects has properties of its own. For example, the relationship between a person and a department might have a `jobTitle` property. Yes, a person can have more than one job title!

You can express these relationships by using the `relationship` property, which allows you to specify a schema for the relationship. *You may use most schema field types, however joins are not permitted inside the schema for the relationship. If the relationship is overly complex, it is recommended that you consider treating it as a third type of object related to both of the other two.*

When you specify the `relationship` property, you must also specify `relationshipsField`, a property name to store the relationships in. *Convention: if the join is called `_departments`, set `relationshipsField` to `departmentRelationships`.*


Example:

```javascript
{
  name: '_departments',
  label: 'Departments',
  // Must match the `name` option given when configuring `fabric` as a subclass of pieces
  withType: 'department',
  type: 'joinByArray',
  // The id of the fabric will be stored in the fabricIds property of the product
  idsField: 'departmentIds',
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
  ],
  relationshipsField: '_departmentsRelationships'
}
```

**Since there is a relationship, the `_departments` property will be an array of objects with `item` and `relationship` properties.** The `item` property will be the actual department, and the `relationship` property will contain the relationship fields, which are unique to this person.

###### Inline relationship fields

Sometimes, expecting users to click a special button to access a separate modal dialog box to edit relationship fields isn't worth it. Users just don't find it, or the fields are few enough that it would make more sense to add the form field directly to the chooser.

You can do this with the `inline: true` flag (since 2.6.0):

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

#### `joinByOneReverse`

A `joinByOneReverse` field allows us to access the other side of a [joinByOne](#joinByOne) relationship. Since this is the "other end" of the relationship, there is no editing interface. It is just a convenience allowing us to "see" the related object from the other point of view.

The `idField` option **must match the setting of `idField` on the corresponding `joinByOne` field**, in the schema of the other type. We are not storing any new information of our own.

Example:

```javascript
// Part of our schema for fabrics (see the joinByOne example)
{
  name: '_product',
  // No actual editing interface is currently offered, edit it from the other end
  label: 'Product',
  type: 'joinByOneReverse',
  withType: 'product',
  idField: 'fabricId'
}
```

We can now see `_product` as a property of each `fabric` object that is related to a product.

#### `joinByArrayReverse`

A `joinByArrayReverse` field allows us to access the other side of a [joinByArray](#joinByArray) relationship. Since this is the "other end" of the relationship, there is no editing interface. It is just a convenience allowing us to "see" the related objects from the other point of view.

The `idsField` option **must match the setting of `idsField` on the corresponding `joinByArray` field**, in the schema of the other type. We are not storing any new information of our own.

Example:

```javascript
// Part of our schema for fabrics (see the joinByArray example)
{
  name: '_products',
  // No actual editing interface is currently offered, edit it from the other end
  label: 'Product',
  type: 'joinByArrayReverse',
  withType: 'product',
  idField: 'fabricIds'
}
```

We can now see `_products` as a property of each `fabric` object that is related to a product.

If desired, we can specify `relationship` and `relationshipsField` just as we would for `joinByArray`. They must actually exist in the original `joinByArray` field and `relationshipField` must have the *same* setting as we are just referring to the information stored on the other end. Just as before, the `_products` array now becomes an array of objects with `item` and `relationship` properties.
