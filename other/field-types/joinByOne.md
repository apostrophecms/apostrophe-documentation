# `joinByOne`

A `joinByOne` field expresses a one-to-one relationship between this type of object and another type of object. After Apostrophe loads the original object, it will fetch the "joined" object and attaching it to the original via the specified `name` property.

For instance, if `product` pieces have a `joinByOne` field called `_fabric` that relates them to `fabric` pieces, then the related `fabric` object will be available as the `._fabric` property of each product.

{% hint style='info' %}
**For performance, it is strongly recommended that you set a projection filter** via the `filters` option, limiting the amount of information fetched about each related doc. You may also call other [cursor filters](../../modules/apostrophe-docs/server-apostrophe-cursor.md) by setting subproperties of the `filters` property. This is a useful way to limit the acceptable choices for the join. _You must have_ `title`_,_ `slug`_,_ `type`_, and_ `tags` _set in the projection to get the_ `_url` _property._
{% endhint %}

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
      slug: 1,
      type: 1,
      tags: 1
    }
  }
}
}
```

**Always remember that the** `_fabric` **property of the product may be null at any time.** Perhaps the fabric was moved to the trash, or unpublished. Your code must allow for this possibility.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field to join with (must begin with `_`) |
| withType | `string` | | The name of the related type, if it differs from the name of the join. If you do not set `withType`, then the name of the join must match the name of the related type, with a leading `_` added.  |
| idField | `string` | | Sets the name of the property in which to store the id. The id is set automatically otherwise. |
| ifOnlyOne | `boolean` | false | If true, it will not carry out the join if you are working with more than one document |
| withJoins | `array` |  | If you need to carry out nested joins, set to an array containing those join field names. You may also use "dot notation" in these names to indicate that you want to follow a series of joins between related types.
| label | `string` | | Sets the label of the field that the user sees |
| filters | `object` | | Provide a list of cursor filters to limit acceptable options for the join |

{% hint style='info' %}
In documents with many joins in play, the `ifOnlyOne` option will avoid running through all the possible joins, and can be used to avoid a heavy performance impact in complex documents.
{% endhint %}
