---
title: "apostrophe-rich-text-widgets (browser)"
layout: reference
---
## Inherits from: [apostrophe-widgets](../apostrophe-widgets/browser-apostrophe-widgets.html)

## Methods
### getData(*$widget*)

### edit(*data*, *options*, *save*)

### startEditing(*$widget*)
does not use a modal, start and stop editing
contextually via ckeditor instead
### stopEditing(*$widget*)

### play(*$widget*, *data*, *options*)
If we're logged in, rich text has a "player"
to implement the "click to start editing" behavior
### isEmpty(*$widget*)
Area editor calls this to determine whether to apply an empty state
class for the widget
