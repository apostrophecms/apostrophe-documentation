---
title: "apostrophe-pages-cursor (server)"
---
## Inherits from: [apostrophe-cursor](../apostrophe-docs/server-apostrophe-cursor.html)

## Methods
### isPage(*value*)
When calling self.pages.find our expectation is that we will only get pages,
not docs that are not a part of the page tree
### ancestors(*value*)

### orphan(*value*)
Filter. if flag is `null`, `undefined` or this method
is never called, return docs regardless of
orphan status. if flag is `true`, return only
orphan docs. If flag is `false`, return only
docs that are not orphans. Orphans are pages that
are not returned by the default behavior of the
`children` filter implemented by `apostrophe-pages-cursor`
and thus are left out of standard navigation.
### children(*value*)

### reorganize(*value*)
Use .reorganize(true) to return only pages that
are suitable for display in the reorganize view.
For instance, if you have thousands of subpages
of a "blog" page, you might want to hide them from
the global reorganize interface by setting their
reorganize property to false. —Tom and Sam
