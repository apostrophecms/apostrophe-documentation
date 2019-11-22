# `joinByArray`

A `joinByArray` field expresses a one-to-many relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByArray` field called `_fabrics` that relates them to `fabric` pieces, then the related `fabric` objects will be available as the `._fabrics` array property of each product.

The `name` option **must begin with** `_` to signify that this is temporary information that also lives elsewhere in the database. The `name` option should be plural to signify that this is a one-to-many relationship.

The `withType` option **may** be set to the name of the related type. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added and an optional `s` following.

> Beginning with Apostrophe 2.58.0, you may also set `withType` to an **array** of type names. When you do so, the chooser allows you to pick items of several types via a tabbed interface and create a combined list. These "polymorphic joins" are primarily intended for navigation widgets. They currently do not support pieces filters or `joinByArrayReverse`.

The `idsField` option **may** be set to the name of a property in which to store the ids of the related objects. **If you don't set it yourself, it will be set automatically for you.** For instance, if your join is named `_fabrics`, then `idsField` will automatically be set to `fabricsIds`.

The `ifOnlyOne` option **may** be set to `true` to avoid carrying out the join when you are working with more than one document. This is a handy way to avoid a heavy performance impact except in a `show.html` template or other context where there is just one "main" document in play, so the number of joined documents will be manageable.

By default, if the related type has joins of its own, they are **not** carried out. To carry out "nested" joins, set the `withJoins` option to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.

**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.md) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join.

## Example 1

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

## Relationship properties and `joinByArray`

Sometimes, the relationship between the two objects has properties of its own. For example, the relationship between a person and a department might have a `jobTitle` property. Yes, a person can have more than one job title!

You can express these relationships by using the `relationship` property, which allows you to specify a schema for the relationship. _You may use most schema field types, however joins are not permitted inside the schema for the relationship. If the relationship is overly complex, it is recommended that you consider treating it as a third type of object related to both of the other two._

When you specify the `relationship` property, you **may** also specify `relationshipsField`, a property name to store the relationships in. If you do not specify this property, it is set automatically. For instance, if the join is named `_departments`, the relationships will be stored in `departmentsRelationships`.

### Example 2

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

### Example 3

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

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field to join with (must begin with `_`) |
| withType | `string` | | The name of the related type, if it differs from the name of the join |
| idField | `string` | | Sets the name of the property in which to store the id |
| ifOnlyOne | `boolean` | false | If true, it will not carry out the join if you are working with more than one document |
| label | `string` | | Sets the label of the field that the user sees |
| filters | `object` | | Provide a list of cursor filters to limit acceptable options for the join |
