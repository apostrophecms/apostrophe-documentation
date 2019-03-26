---
title: apostrophe-browser-utils (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-browser-utils
---

# Inherits from: apostrophe-module

Pushes utility methods to the browser as the `apos.utils` singleton. This module is separate from [apostrophe-utils](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/index.html) because that module is initialized very early, before it is possible to push assets to the browser.

