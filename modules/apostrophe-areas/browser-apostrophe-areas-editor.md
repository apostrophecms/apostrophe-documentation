## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.md)
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
Activate the autosave mechanism, if it is not already
operating. This method is invoked for you by
`startAutosaving` and `startAutosavingThen`, which
also obtain a session lock on the document first for
the current user.
### addItem(*$el*, *type*, *data*, *callback*)
Add a new widget to the area. `$el` should be the widget wrapper
of the widget that should immediately precede it, or null if
we are adding at the top. `type` should be the widget type's name
property, such as `apostrophe-rich-text` (note no suffix).
`data` may be an object with existing properties, or null.
`callback`, if present, is invoked after the widget has been
added to the DOM.
### editItem(*$el*)

### cloneItem(*$el*)

### moveItem(*$el*)

### trashItem(*$el*)

### getWidgets()

### disableAreaControls()
Disable area controls interactions while certain menus are open
### enableAreaControls()

### dismissContextContentMenu()

### linkWidgetsToAreaEditor()

### removeInitialContent(*$el*, *entireItem*)

### stopEditingRichText()

### insertWidget(*$wrapper*)
Implementation detail of `addItem`, should not be called directly.
Adds the given widget wrapper to the DOM, respecting the limit.
### fixInsertedWidgetDotPaths(*$widget*)
A newly inserted widget that contains subareas cannot autosave
correctly as part of the parent unless its doc id and
dot path are correctly set to show that relationship. But
render-widget has no way of knowing how to set these for us,
so we need to fix them up
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
$item whould be a widget wrapper, not just the widget itself
### addSeparators(*$draggable*)
This method recreates separators throughout the entire page as appropriate
to the element being dragged.
### removeSeparators()

### getDroppableAreas(*$draggable*)

### newSeparator()

### editWidget(*$widget*)

### cloneWidget(*$widget*)

### checkEmptyAreas()

### addWidget(*type*, *data*, *callback*)
This method is an implementation detail of `addItem` and should not be called directly.

Insert a widget of the given type with the given initial data (may be null)
and, optionally, invoke a callback after adding to the DOM.
### enableDroppables(*$draggable*)

### disableDroppables(*$draggable*)

### reRenderWidget(*$wrapper*)
Get the server to re-render a widget for us, applying the
options appropriate to its new context at area
TODO: we should prevent input during this time
### serialize()
Serialize the editor to an array of items, exactly as expected for
storage in an area.
### onInterval()
Called every 5 seconds. Default version checks for empty areas
and autosaves if needed in appropriate cases.
### prepareAutosaveRequest()
Returns a JSON-friendly object ready for
submission to the `save-area` route, if
the area is autosaving, has modifications
when compared to `self.previousData` and is present
in the DOM. In all other circumstances
this method returns `null`. Calling code should
set `self.previousData` to the `items` property
of the returned object, if and only if it succeeds
in actually saving the data. This ensures that
retries are made automatically in the event
of network errors.
### saveIfNeeded(*sync*, *callback*)
If the area editor believes its content has changed, send it to the
save-area route. If `sync` is true, make a synchronous AJAX call
(for bc only; we now use the saveAllIfNeededAndUnlock method of
the areas module singleton for faster synchronous saves on page unload).

`callback` is optional and is invoked when the work is complete,
or immediately if there is no work to do.

If the document cannot be saved because it has been locked
by another user, tab or window, a message is displayed to
the user and the page is refreshed to reflect the current
content and avoid a cascade of such messages.
### changeOwners(*$item*)
Take an item that might belong to a different
area and make it ours. Implicitly starts
autosaving both affected areas
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
### startAutosaving(*callback*)
Given a method such as `self.addItem`, this method returns
a new function that will first ensure the user has a session lock
on the document, then initiate autosave for the area, and
finally invoke the callback.

If necessary the user is given the option to shatter a lock belonging
to another user.

If an error occurs, such as the user declining to steal
a session lock, `callback` is invoked with an error rather than null.
### startAutosavingThen(*fn*, *args*)
Similar to `startAutosaving`, this method
obtains a context lock and starts autosaving of
the area, then invokes the given function,
invoking it with the given array of arguments.
Does not invoke `fn` at all if startAutosaving
fails. Part of the implementation of `startAutosavingHandler`.
### startAutosavingHandler(*fn*)
Returns a function that invokes `startAutosavingThen`
with the given function and passes on the arguments
given to it. Useful as an event handler.
### enableInterval()
Establish the so-called `saveInterval`, which actually
also carries out the check for empty areas and can
be expanded to do more by extending `onInterval`. Note
that this interval is established for all areas the
user can edit, not just those that autosave.
