---
title: apostrophe-any-page-manager (module)
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-any-page-manager-cursor
  - browser-apostrophe-any-page-manager-chooser
  - browser-apostrophe-any-page-manager
  - browser-apostrophe-any-page-manager-relationship-editor
---

# apostrophe-any-page-manager

## Inherits from: [apostrophe-doc-type-manager](https://github.com/apostrophecms/apostrophe-documentation/tree/56e9be7df36a153d8751804c1aac4ce5a70fd5c2/modules/apostrophe-doc-type-manager/index.html)

This module provides a special doc type manager for the `apostrophe-page` type, which actually refers to any page in the tree, regardless of type. This allows you to create [apostrophe-schemas](https://github.com/apostrophecms/apostrophe-documentation/tree/56e9be7df36a153d8751804c1aac4ce5a70fd5c2/modules/apostrophe-any-page-manager/Apostrophe%20schema%20joins/README.md) that can link to any page in the page tree, rather than one specific page type.

## Methods

### find\(_req_, _criteria_, _projection_\)

Return a cursor for finding pages of any type \(but only pages, never pieces\). `apostrophe-pages-cursor` takes care of ensuring that pieces don't creep in.

### getAutocompleteProjection\(_query_\)

### getAutocompleteTitle\(_doc_, _query_\)

Returns a string to represent the given `doc` in an autocomplete menu. `doc` will contain only the fields returned by `getAutocompleteProjection`. `query.field` will contain the schema field definition for the join the user is attempting to match titles from. The default behavior is to return the `title` property, but since this is a page we are including the slug as well.

