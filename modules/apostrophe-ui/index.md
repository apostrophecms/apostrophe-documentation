---
title: apostrophe-ui (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-ui
---

# Inherits from: apostrophe-module

Provides the [apos.ui](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-ui/browser-apostrophe-ui/README.md) singleton on the browser side, which implements various general purpose UI features for Apostrophe sites, and also the [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-ui/browser-apostrophe-context/README.md) base class on the browser side, which is the base class of modals and of other types that benefit from being able to make API calls conveniently via `self.action` and link click handlers based on `self.$el`.

