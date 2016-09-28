---
title: "apostrophe-widgets (browser)"
layout: reference
namespace: browser
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)
`apostrophe-widgets` is a parent class for the browser-side managers of
widget types. Each manager object is responsible for *all* widgets of that type.

Extends `apostrophe-context` in order to gain access to conveniences like
the `self.api` and `self.html` methods. There is no `self.$el`, because
this object manages many widgets.

The `play` method, if it exists, is invoked when appropriate with `($widget, data, options)`,
and should enhance that specific widget. The `play` method should **never** use
`$(...)` selectors, instead always using `$widget.find(...)` to scope them to that
specific widget.


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

### canEdit(*$widget*)
Returns true if we are allowed to edit this widget.
Independent of `getData` because that is sometimes
overridden but this is always the right place to get
the `_edit` flag from. -Tom
### edit(*data*, *options*, *save*)
Opens the editor modal of a widget, unless the widget is contextualOnly,
in which case we simply save the widget and call the save method
### isEmpty(*$widget*)
Area editor calls this to determine whether to apply an empty state
class for the widget
### getData(*$widget*)

