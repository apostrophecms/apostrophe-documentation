---
title: Restricting child page types
---

You can restrict the page types allowed beneath a particular fancy page type by using the `childTypes` and `descendantTypes` options. Here is an an example:

```javascript
'myPageType': {
  extend: 'apostrophe-fancy-page',
  name: 'myPageType',
  label: 'My Page Type',
  // Immediate children must be of one of these types
  childTypes: [
    'default',
    'blog'
  ],
  // All descendants must be of one of these types
  descendantTypes: [
    'default',
    'blog',
    'blogPost'
  ]
}
```

The `childTypes` restriction applies to immediate children of this page. The `descendantTypes` restriction applies to all pages that are descendants of this page (children of its children, etc).

These restrictions are cumulative. If a page higher in the tree has already restricted the types allowed beneath it, your restrictions further limit what can be done. They cannot make an exception to a rule that comes from further up the tree.

For these reasons it is usually best to make these restrictions at the project level in `app.js` where you know about all of the page types that are in use.
