## Inherits from: [apostrophe-custom-pages](../apostrophe-custom-pages/README.md)
### `apos.search`
Implement sitewide search for Apostrophe. Provides the
`apostrophe-search` page type for the `/search` page, which
you should include in your "parked pages" if you wish
to have one (see [apostrophe-pages](/modules/apostrophe-pages)).

Search is powered by the full-text search features of MongoDB.

## Options

### `perPage`: search results per results page. Defaults to 10.

### `suggestions`: if `suggestions` is `true`, and the `notFound.html`
template of `apostrophe-pages` contains this element:

`<div data-apos-notfound-search-results></div>`

Apostrophe will attempt to locate relevant pages by feeding the component
words of the URL to the search engine, and display those suggestions.

If `suggestions` is explicitly `false`, this does not happen.

If `suggestions` is an object, this feature is enabled and the `limit`
suboption may optionally be changed to a value other than `10`.

For legacy reasons, if `suggestions` is not set at all, the feature
still operates but attempts to obtain suggestions from `/search`. This
will work adequately if you have an Apostrophe sitewide search page
at that URL, but we recommend you set `suggestions: true` instead.
This allows you to override `suggest.html` to customize the behavior,
and also improves performance by using a simpler query for the 404
suggestions.

`types`: an array of page and piece doc type names allowed to be included
in search results. If not present, this is determined programmatically.
In the latter case, the `searchDetermineTypes` callAll method and the
`determineTypes` promise event are fired. Implementations of these
take an array argument and push new type names on it. `apostrophe-pieces` modules
monitor this and add their `name`, or do not, based on their `searchable` option.

`filters`: an array of filters to be offered to the user, each of which
is an object with a `name` property and a `label` property. If no
entry has the name `__else`, an "Everything Else" filter is automatically
added. This is because there are always page types and piece types that
are edge cases not relevant enough to explicitly offer a filter for, but
which should nevertheless be included in results.


## Methods
### pushAssets() *[browser]*

### modulesReady(*callback*)

### determineTypes(*callback*)

### enableFilters()

### suggest(*req*, *q*)

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
