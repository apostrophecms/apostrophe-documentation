---
title: apostrophe-tags (module)
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-tags-cursor
  - browser-apostrophe-tags
  - browser-apostrophe-tags-manager-modal
  - browser-apostrophe-tags-chooser
  - browser-apostrophe-tags-relationship-editor
  - browser-apostrophe-tags-editor-modal
---

# index

## Inherits from: [apostrophe-pieces](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-pieces/index.html)

### `apos.tags`

The `apostrophe-tags` module provides administration tools for managing tags on the site. This module subclasses pieces in order to provide a way to store tags that were created directly in the tag administration interface and do not appear on any other types of pieces yet. This ensures that they are visible when autocompleting tags.

## Methods

### listTags\(_req_, _options_, _callback_\) _\[api\]_

Obtain a list of tags beginning with `options.prefix`, or all tags if `options.all` is set, or specific tags if `options.tags` is set. On success, invokes the callack with `(null, tags)`

### addTag\(_req_, _tag_, _callback_\) _\[api\]_

Add a tag, as submitted via the tags admin interface. Other modules do not need to call this method; they can just add the tag to the `tags` property of any doc.

### renameTag\(_req_, _tag_, _newTag_, _callback_\) _\[api\]_

Rename an existing tag throughout Apostrophe.

### deleteTag\(_req_, _tag_, _callback_\) _\[api\]_

Delete an existing tag throughout Apostrophe.

### launder\(_tag_\) _\[api\]_

Launder \(sanitize\) a tag. The default behavior is to call the `filterTag` method of `launder`, which converts to lowercase and trims whitespace.

Fair warning: if you disable conversion to a consistent case, you will have a lot more trouble with duplicate tags.

### beforeListTags\(_req_, _options_, _callback_\) _\[implementation\]_

Overridable hook

### afterListTags\(_req_, _options_, _callback_\) _\[implementation\]_

Overridable hook

### beforeAddTag\(_req_, _tag_, _callback_\) _\[implementation\]_

Overridable hook

### afterAddTag\(_req_, _tag_, _callback_\) _\[implementation\]_

Overridable hook

### beforeRenameTag\(_req_, _tag_, _newTag_, _callback_\) _\[implementation\]_

Overridable hook

### afterRenameTag\(_req_, _tag_, _newTag_, _callback_\) _\[implementation\]_

Overridable hook

### beforeDeleteTag\(_req_, _tag_, _callback_\) _\[implementation\]_

Overridable hook

### afterDeleteTag\(_req_, _tag_, _callback_\) _\[implementation\]_

Overridable hook

### createRoutes\(\) _\[routes\]_

### pushAssets\(\) _\[browser\]_

### pushDefinitions\(\) _\[browser\]_

## Nunjucks template helpers

### menu\(\)

## API Routes

### POST /modules/apostrophe-tags/manager

### POST /modules/apostrophe-tags/listTags

### POST /modules/apostrophe-tags/addTag

### POST /modules/apostrophe-tags/renameTag

### POST /modules/apostrophe-tags/deleteTag

### POST /modules/apostrophe-tags/autocomplete

