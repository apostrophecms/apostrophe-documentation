---
title: "apostrophe-tags (module)"
children:
  - server-apostrophe-tags-cursor
  - browser-apostrophe-tags
  - browser-apostrophe-tags-manager-modal
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)


## Methods
### listTags(*req*, *options*, *callback*) *[api]*

### addTag(*req*, *tag*, *callback*) *[api]*

### renameTag(*req*, *tag*, *newTag*, *callback*) *[api]*

### deleteTag(*req*, *tag*, *callback*) *[api]*

### launder(*tag*) *[api]*

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

### pushCreateSingleton() *[browser]*

## Nunjucks template helpers
### menu()

## API Routes
### POST /modules/apostrophe-tags/manager

### POST /modules/apostrophe-tags/listTags

### POST /modules/apostrophe-tags/addTag

### POST /modules/apostrophe-tags/renameTag

### POST /modules/apostrophe-tags/deleteTag

### ALL /modules/apostrophe-tags/autocomplete

