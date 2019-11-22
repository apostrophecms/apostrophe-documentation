# `joinByOneReverse`

A `joinByOneReverse` field allows us to access the other side of a [joinByOne](schema-guide.md#joinByOne) relationship. Since this is the "other end" of the relationship, there is no editing interface. It is just a convenience allowing us to "see" the related object from the other point of view.

You **may** set the `withType` property to the name of the other document type, the one you are joining with. This is singular and will match the `name` option you gave when you configured the module for that type. If you do not set `withType`, then the name of your join must match the name of the other type, with an optional "s" on the end.

You **may** set the `reverseOf` property to the name of the _other join_ \(the one you are reversing, which will be part of the schema for the other type\). If you do not, Apostrophe will look for the first join in the other type that points to this document type.

_For backwards compatibility, you can set the_ `idField` _option instead to match that in the other join, but this is confusing and hard to maintain. Just use_ `reverseOf`_._

Again, note that a reverse join just looks up information that is saved in another, existing join in the other type of document. We are not storing any new information of our own.

The `ifOnlyOne` option **may** be set to `true` to avoid carrying out the join when you are working with more than one document. This is a handy way to avoid a heavy performance impact except in a `show.html` template or other context where there is just one "main" document in play, so the number of joined documents will be manageable. This option is especially useful with reverse joins where the number of joined documents may be high.

## Example

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

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field to join with (must begin with `_`) |
| label | `string` | | Sets the label of the field that the user sees |
| withType | `string` | | The name of the related type, if it differs from the name of the join |
| reverseOf | `string` | | Set to the name of the join you are reversing (optional) |
| ifOnlyOne | `boolean` | false | If true, it will not carry out the join if you are working with more than one document |
