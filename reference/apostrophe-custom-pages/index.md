---
title: "apostrophe-custom-pages (module)"
layout: module
children:

---
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/index.html)

## Methods
### dispatch(*pattern *, *, middleware..., handler*) *[dispatch]*

### pageServe(*req*, *callback*) *[dispatch]*

### match(*req*, *rule*, *url*) *[dispatch]*

### find(*req*, *criteria*, *projection*)
Return a cursor for finding pages of this type only. The cursor is an
`apostrophe-pages-cursor`, so it has access to filters like
`ancestors` and `children`. Subclasses will often override this
to create a cursor of a more specific type that adds more filters
