---
title: "apostrophe-array-editor-modal (browser)"
layout: reference
namespace: browser
---
## Inherits from: [apostrophe-modal](../apostrophe-modal/browser-apostrophe-modal.html)

## Methods
### load()
This method initializes the array editor and triggers either the creation
or the editing of the first item. In the latter case the list of items
is also implicitly loaded after first generating the item titles for the
list view. This method is invoked for you by `afterShow` and should not be
invoked again.
### generateTitle(*item*)
This method generates the list view title for a single item, based
on the `titleField` property of the field. If there is none,
item._ordinal (the index of the item when it was first added
to the array during this editing session) is displayed.
### beforeShow(*callback*)
This method, called for you when the modal is about to display,
binds the various click handlers.
### afterHide()
This method removes the "save" click handler after the modal is hidden,
necessary to ensure it does not fire again when a parent array is saved.
### addSaveHandler()
This method installs the `saveHandler` method as the click handler for
the outer modal's "save" button. It is invoked for you during `beforeShow`.
### removeSaveHandler()
This method removes the save button handler. It is invoked for you
during `afterHide`.
### saveHandler()
This method saves the item state for the current item, then saves the
array as a whole and dismisses the modal via `hide`. It is invoked for
you when save is clicked.
### afterShow()
This method invokes the `load` method to populate the array and
prepare for editing. It is invoked for you as the modal becomes visible.
### addToItems()
This method adds a new item to the array. It is invoked
by `createItem`, which should be called instead if your intention
is to immediately display the new item in the item editor.
### setItemTitles()

### refreshItems()
bc wrapper. This method was redundant. See `refresh`
### createItem()
Adds a new item to the array, populating the form with its
initial default values from the schema. The list view is refreshed.
### editItem()
Like `createItem`, this method  asks the server for a
empty form; however, it then populates it with the currently
active item's content. The list view is refreshed.
### populateItem()
This method populates the editing form with the content of the
currently active item as determined by the array index `self.active`.
The list view is also refreshed.
### saveItemState(*callback*)
This method saves the content of the currently active item
back to `self.arrayItems[self.active]` by invoking `convert` for
the schema fields, and also updates the `_title` property for the
list view.
### saveArray()
This method invokes `options.save` and passes `self.arrayItems` to it,
then dismisses the modal via `hide`.
### bindClickHandlers()
This method binds click handlers for all elements inside
`self.$el`, the modal itself. The save handler is bound elsewhere
because it may reside in a parent modal.
### remove(*id*)
This method removes the item with the specified `id` property from the
array.
### refresh(*callback*)
Refresh (re-render) the list of items, then invoke the `onChange` method
if they differ from the previous set. This method is debounced. If calls to
this method are nested only two refreshes will take place: the initial one
and also the last one, to ensure the impact of any changes made in nested
function calls is seen. As a further optimization, only the last one actually
updates the markup in the browser.

If a callback is passed, it is always invoked, even if this
refresh is being skipped as an optimization due to nesting.
### onChange()
Invoked when the contents of the array have changed, after
a refresh of the display. Invokes the limit mechanism.
### limit()
Implements the `limit` option by showing and hiding
the limit message and the add button, respectively.
### required()
Implements the `required` option by showing and hiding
save button.
### decrementRefreshing()
Invoked by `refresh` to decrement the count of nested
`refresh` calls. Nested `refresh` calls are automatically
debounced for performance, however the first and last both
result in actual renders by the server to ensure all
changes made in between are reflected.
