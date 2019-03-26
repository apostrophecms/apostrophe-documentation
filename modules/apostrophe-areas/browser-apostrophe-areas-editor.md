---
title: apostrophe-areas-editor (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-areas-editor

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

editor for an area. See enableAreas\(\) method in user.js for where this is invoked.

## Methods

### resetEl\(_$el_\)

### init\(\)

### addEmptyClass\(\)

### enhanceExistingWidgetControls\(\)

### registerClickHandlers\(\)

### registerEventHandlers\(\)

### registerAutosave\(\)

Activate the autosave mechanism, if it is not already operating. This method is invoked for you by `startAutosaving` and `startAutosavingThen`, which also obtain a session lock on the document first for the current user.

### addItem\(_$el_, _type_, _data_, _callback_\)

Add a new widget to the area. `$el` should be the widget wrapper of the widget that should immediately precede it, or null if we are adding at the top. `type` should be the widget type's name property, such as `apostrophe-rich-text` \(note no suffix\). `data` may be an object with existing properties, or null. `callback`, if present, is invoked after the widget has been added to the DOM.

### editItem\(_$el_\)

### cloneItem\(_$el_\)

### moveItem\(_$el_\)

### trashItem\(_$el_\)

### getWidgets\(\)

### disableAreaControls\(\)

Disable area controls interactions while certain menus are open

### enableAreaControls\(\)

### dismissContextContentMenu\(\)

### linkWidgetsToAreaEditor\(\)

### removeInitialContent\(_$el_, _entireItem_\)

### stopEditingRichText\(\)

### insertWidget\(_$wrapper_\)

Implementation detail of `addItem`, should not be called directly. Adds the given widget wrapper to the DOM, respecting the limit.

### fixInsertedWidgetDotPaths\(_$widget_\)

A newly inserted widget that contains subareas cannot autosave correctly as part of the parent unless its doc id and dot path are correctly set to show that relationship. But render-widget has no way of knowing how to set these for us, so we need to fix them up

### enhanceWidgetControls\(_$widget_\)

### addAreaControls\(_$widget_\)

### removeAreaControls\(_$widget_\)

### checkEmptyWidget\(_$widget_\)

### replaceWidget\(_$old_, _$wrapper_\)

Replace an existing widget, preserving any classes and attributes specific to the area editor. Typically called by the widget's editor on save, so it can change attributes of the widget element itself

### insertItem\(_$item_\)

$item whould be a widget wrapper, not just the widget itself

### addSeparators\(_$draggable_\)

This method recreates separators throughout the entire page as appropriate to the element being dragged.

### removeSeparators\(\)

### getDroppableAreas\(_$draggable_\)

### newSeparator\(\)

### editWidget\(_$widget_\)

### cloneWidget\(_$widget_\)

### checkEmptyAreas\(\)

### addWidget\(_type_, _data_, _callback_\)

This method is an implementation detail of `addItem` and should not be called directly.

Insert a widget of the given type with the given initial data \(may be null\) and, optionally, invoke a callback after adding to the DOM.

### enableDroppables\(_$draggable_\)

### disableDroppables\(_$draggable_\)

### reRenderWidget\(_$wrapper_\)

Get the server to re-render a widget for us, applying the options appropriate to its new context at area TODO: we should prevent input during this time

### serialize\(\)

Serialize the editor to an array of items, exactly as expected for storage in an area.

### onInterval\(\)

Called every 5 seconds. Default version checks for empty areas and autosaves if needed in appropriate cases.

### prepareAutosaveRequest\(\)

Returns a JSON-friendly object ready for submission to the `save-area` route, if the area is autosaving, has modifications when compared to `self.previousData` and is present in the DOM. In all other circumstances this method returns `null`. Calling code should set `self.previousData` to the `items` property of the returned object, if and only if it succeeds in actually saving the data. This ensures that retries are made automatically in the event of network errors.

### saveIfNeeded\(_sync_, _callback_\)

If the area editor believes its content has changed, send it to the save-area route. If `sync` is true, make a synchronous AJAX call \(for bc only; we now use the saveAllIfNeededAndUnlock method of the areas module singleton for faster synchronous saves on page unload\).

`callback` is optional and is invoked when the work is complete, or immediately if there is no work to do.

If the document cannot be saved because it has been locked by another user, tab or window, a message is displayed to the user and the page is refreshed to reflect the current content and avoid a cascade of such messages.

### changeOwners\(_$item_\)

Take an item that might belong to a different area and make it ours. Implicitly starts autosaving both affected areas

### respectLimit\(\)

### limitReached\(\)

### fromTemplate\(_sel_\)

### enableHideControlsOnRichTextStart\(\)

### link\(_action_, _callback_\)

Override default apostrophe-context functionality because we need to use $.onSafe, for the sake of nested areas.

### on\(_eventType_, _selector_, _fn_\)

This is a wrapper for $.onSafe that avoids events that are actually happening in nested areas. -Tom and Sam

### startAutosaving\(_callback_\)

Given a method such as `self.addItem`, this method returns a new function that will first ensure the user has a session lock on the document, then initiate autosave for the area, and finally invoke the callback.

If necessary the user is given the option to shatter a lock belonging to another user.

If an error occurs, such as the user declining to steal a session lock, `callback` is invoked with an error rather than null.

### startAutosavingThen\(_fn_, _args_\)

Similar to `startAutosaving`, this method obtains a context lock and starts autosaving of the area, then invokes the given function, invoking it with the given array of arguments. Does not invoke `fn` at all if startAutosaving fails. Part of the implementation of `startAutosavingHandler`.

### startAutosavingHandler\(_fn_\)

Returns a function that invokes `startAutosavingThen` with the given function and passes on the arguments given to it. Useful as an event handler.

### enableInterval\(\)

Establish the so-called `saveInterval`, which actually also carries out the check for empty areas and can be expanded to do more by extending `onInterval`. Note that this interval is established for all areas the user can edit, not just those that autosave.

