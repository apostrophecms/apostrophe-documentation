---
title: "apostrophe-video-fields (module)"
layout: module
children:
  - browser-apostrophe-video-fields
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
Implements the ["video" apostrophe schema field type](../../tutorials/getting-started/schema-guide.html).

The value of the field is an object with `url`, `title` and `thumbnail` properties, the latter
two being as obtained by `oembetter` at the time the URL was originally pasted and fetched
via the `oembed` protocol.

This field type is locked down to accept only URLs whose oembed response type
is `video`.

Videos are not actually hosted or stored by Apostrophe. They are displayed via
oembed-capable third party services like Vimeo and YouTube.


## Methods
### addFieldType() *[schemaField]*

### fieldTypePartial(*data*) *[schemaField]*

### pushAssets() *[browser]*

### pushCreateSingleton() *[browser]*

