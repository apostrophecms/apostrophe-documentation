# Custom columns and sortable columns for the "manage" modal

By default, the "manage" modal displays just a few columns: "title," "last updated," and "published." The "title" and "updated at" columns support sorting on that column, by clicking on the column heading.

You can extend this list and even specify your own sortable columns. Here's how to do that:

```javascript
// lib/modules/your-piece/index.js
module.exports = {
  // Other configuration options, then...
  addColumns: [
    {
      name: 'myCustomField',
      label: 'Custom Field',
      sort: {
        // Sort on this property. The `1` is required
        myCustomField: 1
      }
    }
  ]
}
```

::: tip
Notice that for `sort` you specify an object exactly like what you'd pass to MongoDB's `sort()` method, or Apostrophe's `sort()` cursor filter. In particular, the actual property you sort on does not have to match the property name displayed in the column. For example, when working with people's names you might sort on `{ lastName: 1, firstName: 1 }` rather than `title`.
:::

In some cases, the field you are adding in a new column may not display well as it is in the database. Dates are a good example of this. You can use a custom Nunjucks template to output the value instead. We can use the default `updatedAt` field as an example of this. `updatedAt` is a standard column and we would not suggest adding it twice, but it serves as an example since the referenced template is in the code base for you to see.

```javascript
beforeConstruct: function(self, options) {
  options.addColumns = [
    {
      name: 'updatedAt',
      label: 'Last Updated',
      sort: {
        // Sort on this property. The `1` is required
        updatedAt: 1
      },
      // The value of the property shows up as `data.value` in the template.
      partial: function(value) {
        if (!value) {
          // Don't crash if `updatedAt` is missing
          return '';
        }
        return self.partial('manageUpdatedAt.html', { value: value });
      }
    }
  ]
}
```
To display the title or another field from a join in a column, include the `partial` method in the `addColumns` options:

```javascript
  // Other configuration options, then...
  addColumns: [
  {
    name: '_myJoinedField',
    label: 'Joined Field',
    partial: function(_myJoinedField) {
      if (!_myJoinedField) {
        return 'None';
      } else {
        return _myJoinedField.title;
      }
    }
  }
```

**It's important to note that this is done in `beforeConstruct`.** The `self` object is not available for the `self.partial` method in the simple `addColumns` option (see the previous example).

::: tip
If you want to change one of the standard columns, override `defaultColumns` rather than setting `addColumns`.
:::


[Joins](/reference/field-types/joinbyone.md) are one of Apostrophe's best features:

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
