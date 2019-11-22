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

| Field | Description | Properties |
|-------|-------------|------------|
|[area](/other/field-types/area.md) | An editable content area |
|[singleton](/other/field-types/singleton.md) | A single widget |
|[string](/other/field-types/string.md) | accepts text entry from a user |
|[email](/other/field-types/email.md) | accepts a valid email address as input from a user  |
|[slug](/other/field-types/slug.md) | provides an entry for the canonical URL for a page. not needed if extending an existing page or piece. all entries are sanitized |
|[tags](/other/field-types/tags.md) | accepts text entry from a user to define "tags" |
|[boolean](/other/field-types/boolean.md) | provides a "Yes" or "No" input from a user |
|[checkboxes](/other/field-types/checkbox.md) | provides an array of checkboxes which a user can select |
|[select](/other/field-types/select.md) | provides a single-select dropdown menu |
|[integer](/other/field-types/integer.md) | accepts input of an integer from a user |
|[float](/other/field-types/float.md) | accepts input of a floating point number |
|[url](/other/field-types/url.md) | provides an editable URL field | 
|[date](/other/field-types/date.md) | provides a date picker |
|[time](/other/field-types/time.md) | provides entry for a time, which is stored in HH:MM:SS format |
|[password](/other/field-types/password.md) | accepts text entry from the user, but hides that entry |
|[object](/other/field-types/object.md) | A field which can store a single object | 
|[array](/other/field-types/array.md) | A field which can store one of more objects as an array |
|[attachment](/other/field-types/attachment.md) | allows the user to upload a file to the server |
|[video](/other/field-types/video.md) | allows the user to embed a video with an oembed compatible link |
|[color](/other/field-types/color.md) | provides a color picker for the user | 
|[range](/other/field-types/range.md) | "provides an input for seleting a range of numbers" |
|[joinByOne](/other/field-types/joinByOne.md) | expresses a one-to-one relationship between two types of objects | 
|[joinByArray](/other/field-types/joinByArray.md) | expresses a one-to-many relationship between an object and an array |
|[joinByOneReverse](/other/field-types/joinByOneReverse.md) | allows the user to see the "other side" of a joinByOne relationship |
|[joinByArrayReverse](/other/field-types/joinByArrayReverse.md) | allows the user to see the "other side" of a joinByArray relationship |

