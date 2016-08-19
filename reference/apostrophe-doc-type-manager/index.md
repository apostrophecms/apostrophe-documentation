---
title: "apostrophe-doc-type-manager (module)"
layout: module
children:
  - server-apostrophe-doc-type-manager-cursor
  - browser-apostrophe-doc-type-manager
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
This module is the base class of `apostrophe-custom-pages`, `apostrophe-pieces`,
`apostrophe-global` and any other module that serves as the manager for a
doc type. You can introduce new fields to the schema of *all* docs by
extending this module at project level and modifying `addFields` in
`beforeConstruct`.

The `name` option must be set to the doc type name, as found in the `type`
property of each individual doc. Thus it is usually singular.


## Methods
### find(*req*, *criteria*, *projection*)
Returns a cursor that will only yield docs of the appropriate type
as determined by the `name` option of the module. Subclasses often
extend this method to return a cursor of a subclass that adds
additional filters.
### newInstance()
Returns a new instance of the doc type, with the appropriate default
values for each schema field.
### getAutocompleteProjection(*query*)
Returns a MongoDB projection object to be used when querying
for this type if all that is needed is a title for display
in an autocomplete menu. Default behavior is to
return only the `title` and `_id` properties.

`query.field` will contain the schema field definition for
the join the user is attempting to match titles from.
### getAutocompleteTitle(*doc*, *query*)
Returns a string to represent the given `doc` in an
autocomplete menu. `doc` will contain only the fields returned
by `getAutocompleteProjection`. `query.field` will contain
the schema field definition for the join the user is attempting
to match titles from. The default behavior is to return
the `title` property. This is sometimes extended to include
event start dates and similar information that helps the
user distinguish between docs.
### decorateChange(*doc*, *change*)
Used by `apostrophe-versions` to label changes that
are made to joins by ID. Set `change.text` to the
desired text.
### isAdminOnly()
Returns true if only admins are allowed to edit this type.
Respected by the pieces module when deciding whether to
enumerate more specific permissions as choices for this
module.
### allowedSchema(*req*)
Return a new schema containing only fields for which the
current user has the permission specified by the `permission`
property of the schema field, or there is no `permission` property for the field.
### composeSchema()

