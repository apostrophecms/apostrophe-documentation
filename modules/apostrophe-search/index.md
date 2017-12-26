---
title: "apostrophe-search (module)"
layout: reference
module: true
namespaces:
  server: true
  browser: true
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
This method implements the search results page. It populates `req.data.docs`
and provides pagination via `req.data.currentPage` and `req.data.totalPages`,
not to be confused with `req.data.totalDocs` which is the total number of
documents matching the search. The filters configured for the module are
respected.
### beforeIndex(*req*, *callback*)
Called before each page of search results is rendered; override hook
### dispatchAll()

### docBeforeSave(*req*, *doc*, *options*)
Implementation of search indexing as documents are saved. Invoked
via callAll by the docs module
### indexDoc(*req*, *doc*)
Index one doc for participation in search
### indexTask(*apos*, *argv*, *callback*)
Implements the `apostrophe-search:index` task, which re-indexes all pages.
This should only be needed if you have changed your mind about the
`searchable` property for various schema fields. Indexing is automatic
every time a doc is saved
### indexTaskOne(*req*, *doc*, *callback*)
Indexes just one document as part of the implementation of the
`apostrophe-search:index` task. This isn't the method you want to
override. See `indexDoc` and `getSearchTexts`
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
