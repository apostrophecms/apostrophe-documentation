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
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|withType | `string` | | The name of the related type, if it differs from the name of the join. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added.  || reverseOf | `string` | | Set to the name of the join you are reversing (optional) |
|ifOnlyOne | `boolean` | false | If true, it will only carry out the join if the query that returned the original document returned only one document. This is useful if the joined information is only to be displayed on the `show.html` page of a piece, for instance, and you don't want the performance impact of loading it on the `index.html` page. |

{% hint style='info' %}
In documents with many joins in play, the `ifOnlyOne` option will avoid running through all the possible joins, and can be used to avoid a heavy performance impact in complex documents.
{% endhint %}
