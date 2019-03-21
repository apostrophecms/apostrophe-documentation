---
title: apostrophe-video-widgets (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-video-widgets
  - browser-apostrophe-video-widgets-editor
---

# Inherits from: apostrophe-widgets

Provides the `apostrophe-video` widget, which displays videos, powered by [apostrophe-video-field](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-video-field/index.html) and [apostrophe-oembed](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-oembed/index.html). The video widget accepts the URL of a video on any website that supports the [oembed](http://oembed.com/) standard, including vimeo, YouTube, etc. In some cases the results are refined by oembetter filters configured by the `apostrophe-oembed` module. It is possible to configure new filters for that module to handle video sites that don't natively support oembed.

Videos are not actually hosted or stored by Apostrophe.

