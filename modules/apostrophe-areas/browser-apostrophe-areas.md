---
title: apostrophe-areas (browser)
layout: reference
namespace: browser
---

# Methods

## setWidgetManager\(_name_, _manager_\)

Called by subclasses of `apostrophe-widgets`. The `manager` object must provide, at a minimum, `setData`, `getData` and `play` methods. See `always.js` and `user.js` in the `apostrophe-widgets` module for examples. Normally you will extend `apostrophe-widgets` and this will be invoked for you.

## getWidgetManager\(_name_\)

Fetch the manager object for the given widget type name.

## enablePlayers\(\)

Ensure that the `play` method of the manager for every widget is invoked, if it exists, every time new widgets are present in the page. Adds a handler for the `enhance` Apostrophe event, which is triggered both on page load and any time new content is rendered into the page during editing. The `play` method will receive the widget's jQuery element, the widget's data and the configured options for that widget type.

## getWidgetOptions\(_$widget_\)

Fetch the configured options for the specified `$widget`, a jQuery element which should be markup representing a widget, with a `data-options` JSON attribute.

## getWidgetData\(_$widget_\)

Fetch the data associated with the specified `$widget`, a jQuery element which should be markup representing a widget. The `data-apos-widget` attribute is used to identify the widget type, and the `getData` method of the manager for that widget type is invoked to get the data.

## enhanceAddContent\(\)

When a `[data-apos-add-content]` button is clicked, toggle the `apos-active` class on the closest ancestor with `[data-apos-dropdown]`, and also the closest ancestor with `.apos-area-controls`.

## enhanceControlsHover\(_sel_\)

Handles the hovering of widgets in the specified selector or jQuery object and reveals only the controls on the directly hovered widget, not the parent wrapper widget

## getTemplates\(_callback_\)

## fromTemplate\(_sel_\)

## enableCkeditor\(\)

## enableOnEnhance\(\)

## enableAll\(_sel_\)

Enable the areas in the specified selector or jQuery object to be edited. If sel is falsy all areas currently in the body are made editable

## register\(_docId_, _dotPath_, _editor_\)

## enableShift\(\)

## getWidgetOptions\(_$widget_\)

Helper functions for getting widget data and options that don't depend on the context of a specific area editor Get the options that apply to the widget in its current context

## getAreaOptions\(_$area_\)

## getWidgetData\(_$widget_\)

## setWidgetData\(_$widget_, _data_\)

## getEditors\(\)

Return an array of all area editor objects \(subclasses of apostrophe-areas-editor\) which are currently visible.

## saveAllIfNeeded\(_sync_, _callback_\)

Gives all area editors a chance to save changes, if they need to, before invoking the callback.

Both the sync flag and the callback may be omitted entirely. The default is asynchronous.

This method is ideal in situations where you wish to be sure everything has been saved before transitioning to a UI such as a commit dialog box that displays what has changed, etc.

## saveAllIfNeededAndUnlock\(\)

Similar to `saveAllIfNeeded`, this method is invoked on a `beforeunload` event, when the user navigates away or closes the tab. However this method has no callback, makes only one synchronous API call to complete all of the work to maximize the chances of success when called during the `beforeunload` event, and also unlocks any docs locked by the current html page as part of that one API call.

## enableUnload\(\)

