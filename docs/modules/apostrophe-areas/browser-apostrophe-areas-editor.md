---
title: "apostrophe-areas-editor (browser)"
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)
editor for an area. See enableAreas() method
in user.js for where this is invoked.



## Methods
### resetEl(*$el*)

### init()

### addEmptyClass()

### enhanceExistingWidgetControls()

### registerClickHandlers()

### registerEventHandlers()

### registerAutosave()

### addItem(*$el*, *value*)

### editItem(*$el*)

### moveItem(*$el*)

### trashItem(*$el*)

### getWidgets()

### dismissContextContentMenu()

### linkWidgetsToAreaEditor()

### removeInitialContent(*$el*, *entireItem*)

### stopEditingRichText()

### insertWidget(*$wrapper*)
Insert a newly created apos-widget, typically called by the
widget's editor on save of a new widget
### enhanceWidgetControls(*$widget*)

### addAreaControls(*$widget*)

### removeAreaControls(*$widget*)

### checkEmptyWidget(*$widget*)

### replaceWidget(*$old*, *$wrapper*)
Replace an existing widget, preserving any classes and
attributes specific to the area editor. Typically
called by the widget's editor on save, so it can change
attributes of the widget element itself
### insertItem(*$item*)

### addSeparators(*$draggable*)
This method recreates separators throughout the entire page as appropriate
to the element being dragged.
### removeSeparators()

### getDroppableAreas(*$draggable*)

### newSeparator()

### editWidget(*$widget*)

### checkEmptyAreas()

### addWidget(*type*)

### enableDroppables(*$draggable*)

### disableDroppables(*$draggable*)

### reRenderWidget(*$wrapper*)
Get the server to re-render a widget for us, applying the
options appropriate to its new context at area
TODO: we should prevent input during this time
### serialize()
Serialize the editor to an array of items, exactly as expected for
storage in an area.
### saveIfNeeded(*sync*)

### changeOwners(*$item*)
Take an item that might belong to a different
area and make it ours
### respectLimit()

### limitReached()

### fromTemplate(*sel*)

### enableHideControlsOnRichTextStart()

### link(*action*, *callback*)
Override default apostrophe-context functionality because we
need to use $.onSafe, for the sake of nested areas.
### on(*eventType*, *selector*, *fn*)
This is a wrapper for $.onSafe that avoids events that are actually
happening in nested areas. -Tom and Sam
