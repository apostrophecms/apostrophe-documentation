---
title: "apostrophe-pieces-pages (module)"
layout: module
children:

---
## Inherits from: [apostrophe-custom-pages](../apostrophe-custom-pages/index.html)

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

