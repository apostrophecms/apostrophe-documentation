---
title: "apostrophe-any-page-manager (module)"
layout: module
children:
  - server-apostrophe-any-page-manager-cursor
  - browser-apostrophe-any-page-manager-chooser
  - browser-apostrophe-any-page-manager
  - browser-apostrophe-any-page-manager-relationship-editor
---
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/index.html)
This module provides a special doc type manager for the `apostrophe-page` type, which
actually refers to any page in the tree, regardless of type. This
allows you to create [apostrophe-schemas](Apostrophe schema joins) that can link to
any page in the page tree, rather than one specific page type.


## Methods
### find(*req*, *criteria*, *projection*)
Return a cursor for finding pages of any type (but only pages, never pieces).
`apostrophe-pages-cursor` takes care of ensuring that pieces don't creep in.
