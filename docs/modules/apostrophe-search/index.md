---
title: "apostrophe-search (module)"
layout: reference
module: true
children:
  - server-apostrophe-search-cursor
  - browser-apostrophe-search
  - browser-apostrophe-search-chooser
  - browser-apostrophe-search-relationship-editor
---
## Inherits from: [apostrophe-custom-pages](../apostrophe-custom-pages/index.html)
### `apos.search`
Implement sitewide search for Apostrophe. Provides the
`apostrophe-search` page type for the `/search` page, which
you should include in your "parked pages" if you wish
to have one (see [apostrophe-pages](../apostrophe-pages/index.html)).

Search is powered by the full-text search features of MongoDB.


## Methods
### pushAssets() *[browser]*

### modulesReady(*callback*)

### determineTypes(*callback*)

### enableFilters()

### indexPage(*req*, *callback*)

### beforeIndex(*req*, *callback*)
Called before each page of search results is rendered; override hook
### dispatchAll()

### docBeforeSave(*req*, *doc*, *options*)
Implementation of search indexing as documents are saved. Invoked
via callAll by the docs module
### getSearchTexts(*doc*)
Returns texts which are a reasonable basis for
generating search results for this page. Should return
an array in which each entry is an object with
'weight' and 'text' properties. 'weight' is a measure
of relative importance. 'text' is the text associated
with that chunk of content.
### boilTexts(*texts*)
Reduces array of texts to a single space-separated string, passes the result
through apos.utils.sortify to eliminate unwanted characters and case differences
### docUnversionedFields(*req*, *doc*, *fields*)
Invoked by the apostrophe-versions module.
Identify fields that should never be rolled back
