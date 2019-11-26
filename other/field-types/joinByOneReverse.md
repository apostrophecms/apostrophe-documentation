# `joinByOneReverse`

A `joinByOneReverse` field allows us to access the other side of a [joinByOne](schema-guide.md#joinByOne) relationship. Since this is the "other end" of the relationship, there is no editing interface. It is just a convenience allowing us to "see" the related object from the other point of view.

{% hint style='info' %}
For backwards compatibility, you can set the `idField` option instead to match that in the other join, but this is confusing and hard to maintain. Just use `reverseOf`.
{% endhint %}

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
| withType | `string` | | The name of the related type, if it differs from the name of the join. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added.  || reverseOf | `string` | | Set to the name of the join you are reversing (optional) |
| ifOnlyOne | `boolean` | false | If true, it will not carry out the join if you are working with more than one document |

{% hint style='info' %}
In documents with many joins in play, the `ifOnlyOne` option will avoid running through all the possible joins, and can be used to avoid a heavy performance impact in complex documents.
{% endhint %}