# apostrophe-pages-cursor (server)
## Inherits from: [apostrophe-cursor](../apostrophe-docs/server-apostrophe-cursor.md)

## Methods
### ancestorPerformanceRestrictions()
Apply default restrictions suitable for fetching ancestor pages to the cursor as
a starting point before applying the ancestor options. Called by the
ancestors filter here and also by pages.pageBeforeSend when it fetches just
the home page using the same options, in the event ancestors were not loaded,
such as on the home page itself. You should not need to modify or invoke this.
### isPage(*value*)
Filter. When calling `self.pages.find` our expectation is that we will only get pages,
not docs that are not a part of the page tree. This filter defaults to `true`.
### ancestors(*value*)
Filter. If set to `true`, retrieve the ancestors of each page and assign them
to the `._ancestors` property. The home page is `._ancestors[0]`. The
page itself is not included in its `._ancestors` array.

If the argument is an object, do all of the above, and also call the
filters present in the object on the cursor that fetches the ancestors.
For example, you can pass `{ children: true }` to fetch the children of
each ancestor as the `._children` property of each ancestor, or pass
`{ children: { depth: 2 } }` to get really fancy.

`ancestors` also has its own `depth` option, but it doesn't do what you think.
If the `depth` option is present as a top-level property of the object passed
to `ancestors`, then only that many ancestors are retrieved, counting backwards
from the immediate parent of each page.
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
reorganize property to false.
