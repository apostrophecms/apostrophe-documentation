---
title: "apostrophe-pieces-pages (module)"
layout: module
children:
  - browser-apostrophe-pieces-pages
  - browser-apostrophe-pieces-pages-chooser
  - browser-apostrophe-pieces-pages-relationship-editor
---
## Inherits from: [apostrophe-custom-pages](../apostrophe-custom-pages/index.html)
`apostrophe-pieces-pages` implements "index pages" that display pieces of a
particular type in a paginated, filterable way. It's great for implementing
blogs, event listings, project listings, staff directories... almost any
content type.

You will `extend` this module in new modules corresponding to your modules
that extend `apostrophe-pieces`.

To learn more and see complete examples, see:

[Reusable content with pieces](../../tutorials/getting-started/reusable-content-with-pieces.html)


## Methods
### indexCursor(*req*)
Extend this method in your piece type to add
chainable filters and additional criteria to the cursor
### indexPage(*req*, *callback*)

### beforeIndex(*req*, *callback*)

### filterByIndexPageTags(*cursor*, *page*)

### showPage(*req*, *callback*)

### beforeShow(*req*, *callback*)

### dispatchAll()

### chooseParentPage(*pages*, *piece*)
Given an array containing all of the index pages that
exist on the site and an individual piece, return the
index page that is the best fit for use in the URL of
the piece. The algorithm is based on shared tags, with
an emphasis on matching tags, and also favors an index
page with no preferred tags over bad matches.
### buildUrl(*page*, *piece*)

