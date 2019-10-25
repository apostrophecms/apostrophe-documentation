# Filters for the "manage" modal

In the "manage" modal, enabling a "tags" filter for admins is often handy:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags'
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

You can also allow multiple tags to be selected, in which case pieces with at least one of those tags are displayed:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags',
      multiple: true
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

The same approach works for most types of schema fields, including joins. We do not recommend using it if the number of items in the dropdown will be very large. However, adding options to support filters that employ typeahead and avoid sending a large list of options to the browser is on our roadmap for the future.


## Fetching thumbnails

By default, `children` will not load any widgets present in the child pages, again for performance reasons.

Here's how to turn it on for just one area, a singleton widget called `thumbnail`:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: {
        areas: [ 'thumbnail' ]
      }
    }
  }
]
```

{% hint style='info' %}
If we pass an object to `children`, its properties are invoked as cursor filters when fetching the children. The same trick works with `ancestors`.
{% endhint %}

## Projections and children

If you are using the `projection` filter to load just the absolute minimum information about those pages, `children` won't work, because it requires a little more information about the original pages to understand their place in the page tree.

Here is the absolute minimum `projection` needed for use with `children`:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: true,
      projection: {
        title: 1,
        slug: 1,
        rank: 1,
        level: 1,
        path: 1
      }
    }
  }
]
```

But while using projections is fastest, you can improve performance quite a lot just by not loading areas:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: true,
      areas: false
    }
  }
]
```
