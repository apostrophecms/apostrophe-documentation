---
title: apostrophe-rich-text-widgets (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-rich-text-widgets
  - browser-apostrophe-rich-text-widgets-editor
---

# index

## Inherits from: [apostrophe-widgets](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-widgets/index.html)

Implements rich text editor widgets. Unlike most widget types, the rich text editor does not use a modal; instead you edit in context on the page.

## Methods

### getRichText\(_widget_\)

Return just the rich text of the widget, which may be undefined or null if it has not yet been edited

### load\(_req_, _widgets_, _callback_\)

TODO We may want to use the default widget load, if we start having nested areas in rich text widgets to support lockups

### sanitize\(_req_, _input_, _callback_\)

### filterForDataAttribute\(_widget_\)

Rich text editor content is found in the div itself as markup, so don't redundantly represent it as a data attribute.

### addSearchTexts\(_item_, _texts_\)

### compare\(_old_, _current_\)

### isEmpty\(_widget_\)

### pushAssets\(\)

