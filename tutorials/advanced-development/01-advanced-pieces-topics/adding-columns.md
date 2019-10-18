# Custom columns and sortable columns for the "manage" modal

By default, the "manage" modal displays just a few columns: "title," "last updated," and "published." The "title" and "updated at" columns support sorting on that column, by clicking on the column heading.

You can extend this list and even specify your own sortable columns. Here's how to do that:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
module.exports = {
  // Other configuration options, then...
  addColumns: [
    // These are the standard columns, we would not add
    // them twice, just using them as an example
    {
      name: 'title',
      label: 'Title',
      sort: {
        // Sort on this property. The `1` is required
        title: 1
      }
    },
    {
      name: 'updatedAt',
      label: 'Last Updated',
      sort: {
        // Sort on this property. The `1` is required
        updatedAt: 1
      },
      // Use a custom nunjucks template to output the
      // value, rather than outputting the value simply
      // as a string. The value of the property shows up
      // as `data.value` in the template
      partial: function(value) {
        if (!value) {
          // Don't crash if updatedAt is missing
          return '';
        }
        return self.partial('manageUpdatedAt.html', { value: value });
      }
    }
  ]
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
Notice that for `sort` you specify an object exactly like what you'd pass to MongoDB's `sort()` method, or Apostrophe's `sort()` cursor filter. In particular, the actual property you sort on does not have to match the property name displayed in the column. For example, when working with people's names you might sort on `{ lastName: 1, firstName: 1 }` rather than `title`.
{% endhint %}

**If you want to change one of the standard columns, override `defaultColumns`** rather
than setting `addColumns`.


[Joins](../../schema-guide/schema-guide.md#joinbyone) are one of Apostrophe's best features:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds'
  }
]
```

But if you try to access the `_children` property of those pages, you'll be disappointed at first.

Child pages get fetched only if the `children()` filter is called on the cursor that fetches those docs. This takes extra time and does extra work, and most joins don't need them. So by default, they are not fetched.

Fortunately, you can turn on extra cursor filters yourself in any join:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: true
    }
  }
]
```
