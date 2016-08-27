---
title: "apostrophe-areas (browser)"
---

## Methods
### setWidgetManager(*name*, *manager*)
Called by subclasses of `apostrophe-widgets`. The `manager`
object must provide, at a minimum, `setData`, `getData` and
`play` methods. See `always.js` and `user.js` in the
`apostrophe-widgets` module for examples. Normally you
will extend `apostrophe-widgets` and this will be invoked
for you.
### getWidgetManager(*name*)
Fetch the manager object for the given widget type name.
### enablePlayers()
Ensure that the `play` method of the manager for every
widget is invoked, if it exists, every time new widgets are
present in the page. Adds a handler for the `enhance`
Apostrophe event, which is triggered both on page load and
any time new content is rendered into the page during editing.
The `play` method will receive the widget's jQuery element,
the widget's data and the configured options for that
widget type.
### getWidgetOptions(*$widget*)
Fetch the configured options for the specified
`$widget`, a jQuery element which should be markup representing
a widget, with a `data-options` JSON attribute.
### getWidgetData(*$widget*)
Fetch the data associated with the specified `$widget`,
a jQuery element which should be markup representing a
widget. The `data-apos-widget` attribute is used to identify
the widget type, and the `getData` method of the manager for
that widget type is invoked to get the data.
### enhanceAddContent()
When a `[data-apos-add-content]` button is clicked, toggle the `apos-active` class
on the closest ancestor with `[data-apos-dropdown]`, and also the closest
ancestor with `.apos-area-controls`.
### getTemplates(*callback*)

### fromTemplate(*sel*)

### enableCkeditor()

### enableOnEnhance()

### enableAll(*sel*)

### register(*docId*, *dotPath*, *editor*)

### enableShift()

### getWidgetOptions(*$widget*)
Helper functions for getting widget data and options that don't depend
on the context of a specific area editor
Get the options that apply to the widget in its current context
### getAreaOptions(*$area*)

### getWidgetData(*$widget*)

### setWidgetData(*$widget*, *data*)

