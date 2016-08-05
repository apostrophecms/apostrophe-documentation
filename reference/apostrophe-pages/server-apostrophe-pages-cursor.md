---
title: "apostrophe-pages-cursor (server)"
---
## Inherits from: [apostrophe-cursor](../apostrophe-docs/server-apostrophe-cursor.html)

## Methods
### isPage(*value*)
When calling self.pages.find our expectation is that we will only get pages,
not docs that are not a part of the page tree
### ancestors(*value*)

### children(*value*)

### reorganize(*value*)
Use .reorganize(true) to return only pages that
are suitable for display in the reorganize view.
For instance, if you have thousands of subpages
of a "blog" page, you might want to hide them from
the global reorganize interface by setting their
reorganize property to false. —Tom and Sam
