---
title: "apostrophe-tags (module)"
layout: module
children:
  - server-apostrophe-tags-cursor
  - browser-apostrophe-tags
  - browser-apostrophe-tags-manager-modal
  - browser-apostrophe-tags-chooser
  - browser-apostrophe-tags-relationship-editor
  - browser-apostrophe-tags-editor-modal
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)
### `apos.tags`
The `apostrophe-tags` module provides administration tools for managing
tags on the site. This module subclasses pieces in order to provide a way
to store tags that were created directly in the tag administration interface
and do not appear on any other types of pieces yet. This ensures that they
are visible when autocompleting tags.


## Methods
### listTags(*req*, *options*, *callback*) *[api]*
Obtain a list of tags beginning with `options.prefix`, or all tags
if `options.all` is set, or specific tags if `options.tags` is set.
On success, invokes the callack with `(null, tags)`
### addTag(*req*, *tag*, *callback*) *[api]*
Add a tag, as submitted via the tags admin interface. Other modules
do not need to call this method; they can just add the tag to the
`tags` property of any doc.
### renameTag(*req*, *tag*, *newTag*, *callback*) *[api]*
Rename an existing tag throughout Apostrophe.
### deleteTag(*req*, *tag*, *callback*) *[api]*
Delete an existing tag throughout Apostrophe.
### launder(*tag*) *[api]*
Launder (sanitize) a tag. The default behavior is to call the
`filterTag` method of `launder`, which converts to lowercase and
trims whitespace.

Fair warning: if you disable conversion to a consistent case, you will have
a lot more trouble with duplicate tags.
### beforeListTags(*req*, *options*, *callback*) *[implementation]*
Overridable hook
### afterListTags(*req*, *options*, *callback*) *[implementation]*
Overridable hook
### beforeAddTag(*req*, *tag*, *callback*) *[implementation]*
Overridable hook
### afterAddTag(*req*, *tag*, *callback*) *[implementation]*
Overridable hook
### beforeRenameTag(*req*, *tag*, *newTag*, *callback*) *[implementation]*
Overridable hook
### afterRenameTag(*req*, *tag*, *newTag*, *callback*) *[implementation]*
Overridable hook
### beforeDeleteTag(*req*, *tag*, *callback*) *[implementation]*
Overridable hook
### afterDeleteTag(*req*, *tag*, *callback*) *[implementation]*
Overridable hook
### createRoutes() *[routes]*

### pushAssets() *[browser]*

### pushDefinitions() *[browser]*

## Nunjucks template helpers
### menu()

## API Routes
### POST /modules/apostrophe-tags/manager

### POST /modules/apostrophe-tags/listTags

### POST /modules/apostrophe-tags/addTag

### POST /modules/apostrophe-tags/renameTag

### POST /modules/apostrophe-tags/deleteTag

### POST /modules/apostrophe-tags/autocomplete

