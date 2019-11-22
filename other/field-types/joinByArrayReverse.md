# `joinByArrayReverse`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| searchable | boolean | true | If false, content from the area will not appear in search results. |
| limit | int | | Sets the number of widgets that can be added to an area |  

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