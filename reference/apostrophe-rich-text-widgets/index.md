---
title: "apostrophe-rich-text-widgets (module)"
layout: module
children:
  - browser-apostrophe-rich-text-widgets
  - browser-apostrophe-rich-text-widgets-editor
---
## Inherits from: [apostrophe-widgets](../apostrophe-widgets/index.html)
Implements rich text editor widgets. Unlike most widget types, the rich text
editor does not use a modal; instead you edit in context on the page.


## Methods
### load(*req*, *widgets*, *callback*)
TODO We may want to use the default widget load, if we start having nested
areas in rich text widgets to support lockups
### sanitize(*req*, *input*, *callback*)

### filterForDataAttribute(*widget*)
Rich text editor content is found in the
div itself as markup, so don't redundantly
represent it as a data attribute.
### addSearchTexts(*item*, *texts*)

### compare(*old*, *current*)

### pushAssets()

