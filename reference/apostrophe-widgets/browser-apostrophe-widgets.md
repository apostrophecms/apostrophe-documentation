---
title: "apostrophe-widgets (browser)"
---

## Methods
### getData(*$widget*)
Supply me in your subclass if your widget
needs a player, such as a slideshow animation
self.play = function($widget, data, options) {
}
Get the data associated with the widget. By
default this is just the data attribute's
JSON data, but some widgets, like apostrophe-rich-text,
also store data as markup
### setData(*$widget*, *data*)

### edit(*data*, *options*, *save*)
Opens the editor modal of a widget, unless the widget is contextualOnly,
in which case we simply save the widget and call the save method
### isEmpty(*$widget*)
Area editor calls this to determine whether to apply an empty state
class for the widget
### getData(*$widget*)

