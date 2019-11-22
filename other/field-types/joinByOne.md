# `joinByOne`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| searchable | boolean | true | If false, content from the area will not appear in search results. |
| limit | int | | Sets the number of widgets that can be added to an area |  

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
