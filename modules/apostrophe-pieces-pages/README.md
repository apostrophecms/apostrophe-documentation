## Inherits from: [apostrophe-custom-pages](../apostrophe-custom-pages/README.md)
`apostrophe-pieces-pages` implements "index pages" that display pieces of a
particular type in a paginated, filterable way. It's great for implementing
blogs, event listings, project listings, staff directories... almost any
content type.

You will `extend` this module in new modules corresponding to your modules
that extend `apostrophe-pieces`.

To learn more and see complete examples, see:

[Reusable content with pieces](../../tutorials/getting-started/reusable-content-with-pieces.html)

## Options

### `piecesFilters`

If present, this is an array of objects with `name` properties. The named cursor filters are
marked as `safeFor: "public"` if they exist, and an array of choices for each is populated
in `req.data.piecesFilters.tags` (if the field in question is `tags`), etc. The choices in the
array are objects with `label` and `value` properties.

If a filter configuration has a `counts` property set to `true`, then the array provided for
that filter will also have a `count` property for each value. This has a performance
impact.


## Methods
### indexCursor(*req*)
Extend this method for your piece type to call additional
chainable filters by default. You should not add entirely new
filters here. For that, define the appropriate subclass of
`apostrophe-pieces-cursor` in your subclass of
`apostrophe-pieces`.
### indexPage(*req*, *callback*)
At the URL of the page, display an index view (list view) of
the pieces, with support for pagination.
### beforeIndex(*req*, *callback*)
Called before `indexPage`. By default, does nothing.
A convenient way to extend the functionality.
### filterByIndexPageTags(*cursor*, *page*)
Invokes filters on the given cursor to ensure it only fetches
results with the tags this page has been locked down to via
page settings. If it has not been locked down, no filtering occurs.
Override to change the behavior.
### showPage(*req*, *callback*)
Invoked to display a piece by itself, a "show page." Renders
the `show.html` template after setting `data.piece`.

If the pieces module is set `contextual: true`, the context menu
(the gear at lower left) is updated appropriately if the user has
editing permissions.
### beforeShow(*req*, *callback*)
Invoked just before the piece is displayed on its "show page." By default,
does nothing. A useful override point.
### dispatchAll()
Set the dispatch routes. By default, the bare URL of the page displays
the index view via `indexPage`; if the URL has an additional component,
e.g. `/blog/good-article`, it is assumed to be the slug of the
article and `showPage` is invoked. You can override this method,
for instance to also accept `/:year/:month/:day/:slug` as a way of
invoking `self.showPage`. See [apostrophe-custom-pages](../apostrophe-custom-pages/index.html)
for more about what you can do with dispatch routes.
### chooseParentPage(*pages*, *piece*)
Given an array containing all of the index pages of this type that
exist on the site and an individual piece, return the
index page that is the best fit for use in the URL of
the piece. The algorithm is based on shared tags, with
an emphasis on matching tags, and also favors an index
page with no preferred tags over bad matches. Override to
replace the algorithm.

This method is called for you. In the presence of index pages, the
cursors for the corresponding pieces are automatically enhanced to
invoke it when building URLs.
### buildUrl(*page*, *piece*)
Given an index page and a piece, build a complete URL to
the piece. If you override `dispatch` to change how
"show page" URLs are matched, you will also want to override
this method to build them differently.
### pushContextPiece(*req*)
Make the browser-side `apos` object aware of the current
in-context piece, as `apos.contextPiece`. Just enough to
help the contextual editing tools in various modules
### pageBeforeSend(*req*)
Calls `pushContextPiece` to make `apos.contextPiece` available
in the browser
### addUrlsToPieces(*req*, *results*, *callback*)
Adds the `._url` property to all of the provided pieces,
which are assumed to be of the appropriate type for this module.
Aliased as the `addUrls` method of [apostrophe-pieces](../apostrophe-pieces/index.html), which
is invoked by the `addUrls` filter of [apostrophe-cursor](../apostrophe-docs/server-apostrophe-cursor.html).
### findForAddUrlsToPieces(*req*)
Returns a cursor suitable for finding pieces-pages for the
purposes of assigning URLs to pieces based on the best match.

Should be as fast as possible while still returning enough
information to do that. For instance, tags are essential for the standard
`chooseParentPage` algorithm, but joins and areas are not.

The default implementation returns a cursor with areas
and joins shut off.
### enableAddUrlsToPieces()
Configure our `addUrlsToPieces` method as the `addUrls` method
of the related pieces module.
### populatePiecesFilters(*cursor*, *callback*)
Populate `req.data.piecesFilters` with arrays of choice objects,
with label and value properties, for each filter configured in the
`piecesFilters` array option. Each filter in that array must have a
`name` property. Distinct values are fetched for the corresponding
cursor filter (note that most schema fields automatically get a
corresponding cursor filter method). Each filter's choices are
reduced by the other filters; for instance, "tags" might only reveal
choices not ruled out by the current "topic" filter setting.

If a filter in the array has its `counts` property set to true,
Apostrophe will supply a `count` property for each distinct value,
whenever possible. This has a performance impact.
