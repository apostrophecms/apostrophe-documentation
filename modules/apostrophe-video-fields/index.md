---
title: apostrophe-video-fields (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-video-fields
---

# index

## Inherits from: [apostrophe-module](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-module/index.html)

### `apos.videoFields`

Implements the ["video" apostrophe schema field type](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/getting-started/schema-guide.html).

The value of the field is an object with `url`, `title` and `thumbnail` properties, the latter two being as obtained by `oembetter` at the time the URL was originally pasted and fetched via the `oembed` protocol.

This field type is locked down to accept only URLs whose oembed response type is `video`.

Videos are not actually hosted or stored by Apostrophe. They are displayed via oembed-capable third party services like Vimeo and YouTube.

## Methods

### addFieldType\(\) _\[schemaField\]_

### fieldTypePartial\(_data_\) _\[schemaField\]_

### pushAssets\(\) _\[browser\]_

### pushCreateSingleton\(\) _\[browser\]_

