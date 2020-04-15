# apostrophe-any-page-manager
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/README.md)
This module provides a special doc type manager for the `apostrophe-page` type, which
actually refers to any page in the tree, regardless of type. This
allows you to create [apostrophe-schemas](/tutorials/schema-guide/schema-guide) that can link to
any page in the page tree, rather than one specific page type.


## Methods
### find(*req*, *criteria*, *projection*)
Return a cursor for finding pages of any type (but only pages, never pieces).
`apostrophe-pages-cursor` takes care of ensuring that pieces don't creep in.
### getAutocompleteProjection(*query*)

### getAutocompleteTitle(*doc*, *query*)
Returns a string to represent the given `doc` in an
autocomplete menu. `doc` will contain only the fields returned
by `getAutocompleteProjection`. `query.field` will contain
the schema field definition for the join the user is attempting
to match titles from. The default behavior is to return
the `title` property, but since this is a page we are including
the slug as well.
