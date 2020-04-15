# `joinByOne`

A `joinByOne` field expresses a one-to-one relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByOne` field called `_fabric` that relates them to `fabric` pieces, then the related `fabric` object will be available as the `._fabric` property of each product.

::: warning NOTE
**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.md) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join. _You must have_ `title`_,_ `slug`_,_ `type`_, and_ `tags` _set in the projection to get the_ `_url` _property._
:::

## Example

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
      _url: 1
    }
  }
}
```

{% hint style='info' %}
You could separately specify `slug`, `type`, and `tags`, but using `_url` specifies sufficient information to generate the `_url` property with less writing. You'll see this in the next example as well.
{% endhint %}


**Always remember that the** `_fabric` **property of the product may be null at any time.** Perhaps the fabric was moved to the trash, or unpublished. Your code must allow for this possibility.

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
|withType | `string` | | The name of the related type, if it differs from the name of the join. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added.  |
|idField | `string` | | Sets the name of the property in which to store the id. The id is set automatically otherwise. |
|ifOnlyOne | `boolean` | false | If true, it will only carry out the join if the query that returned the original document returned only one document. This is useful if the joined information is only to be displayed on the `show.html` page of a piece, for instance, and you don't want the performance impact of loading it on the `index.html` page. |
|withJoins | `array` |  | If you need to carry out nested joins, set to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.
|filters | `object` | | Provide a list of cursor filters to limit acceptable options for the join |

{% hint style='info' %}
In documents with many joins in play, the `ifOnlyOne` option will avoid running through all the possible joins, and can be used to avoid a heavy performance impact in complex documents.
{% endhint %}
