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

### Guide to schema field types

You can find a list of all Schema Field Types and a detailed reference for each of them in the [Schema Field Type Reference](/other/field-types.md), and a list of related properties in the [Schema Property Reference](/other/field-properties.md). You can also learn how to create custom schema field types in [How Do I Create a Custom Schema Field Type?](/howtos/custom-schema-field-types.md).