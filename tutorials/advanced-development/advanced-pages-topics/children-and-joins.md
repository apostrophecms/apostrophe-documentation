---
title: Accessing the children of pages via joins
layout: tutorial
---

[Joins](../schema-guide/schema-guide.md#joinbyone) are one of Apostrophe's best features:

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

> If we pass an object to `children`, its properties are invoked as cursor filters when fetching the children. The same trick works with `ancestors`.

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
