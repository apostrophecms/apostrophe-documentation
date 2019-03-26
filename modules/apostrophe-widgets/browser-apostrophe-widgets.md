---
title: apostrophe-widgets (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-widgets

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

`apostrophe-widgets` is a parent class for the browser-side managers of widget types. Each manager object is responsible for _all_ widgets of that type.

Extends `apostrophe-context` in order to gain access to conveniences like the `self.api` and `self.html` methods. There is no `self.$el`, because this object manages many widgets.

The `play` method, if it exists, is invoked when appropriate with `($widget, data, options)`, and should enhance that specific widget. The `play` method should **never** use `$(...)` selectors, instead always using `$widget.find(...)` to scope them to that specific widget.

## Methods

### getData\(_$widget_\)

Supply me in your subclass if your widget needs a player, such as a slideshow animation self.play = function\($widget, data, options\) { } Get the data associated with the widget. By default this is just the data attribute's JSON data, but some widgets, like apostrophe-rich-text, also store data as markup

### setData\(_$widget_, _data_\)

### canEdit\(_$widget_\)

Returns true if we are allowed to edit this widget. Independent of `getData` because that is sometimes overridden but this is always the right place to get the `_edit` flag from.

If editing would otherwise be permitted but is specifically disabled for this area for workflow reasons, false is returned.

### edit\(_data_, _options_, _save_\)

Opens the editor modal of a widget, unless the widget is contextualOnly, in which case we simply save the widget and call the save method Widget can opitonally be set to skipInitialModal which skips the first edit modal but binds future editing interactions

### isEmpty\(_$widget_\)

Area editor calls this to determine whether to apply an empty state class for the widget

### getData\(_$widget_\)

### startAutosavingAreaThen\(_$widget_, _fn_\)

Start autosaving the area containing the given widget, then invoke the given function. On failure fn is not invoked. Invoked by widgets that are edited contextually on the page, like apostrophe-rich-text, as opposed to widgets edited via a modal.

