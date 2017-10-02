---
title: "apostrophe-pieces-manager-modal (browser)"
layout: reference
namespace: browser
---
## Inherits from: [apostrophe-modal](../apostrophe-modal/browser-apostrophe-modal.html)
A "manage" modal for pieces, displaying them list and/or grid views and providing
filtering and sorting features. The manager modal is also extended on the fly
by the chooser for use as a more full-featured chooser when selecting pieces
to appear in a widget, such as a slideshow.


## Methods
### decorate()

### generateFilter(*filter*)
turn a filter config object into a working filter
### beforeShow(*callback*)

### enableFilters()

### enableBatchOperations(*callback*)
Enables batch operations, such as moving every selected
item to the trash. Maps the operations found in options.batchOperations
to methods, for instance `{ name: 'trash'}` maps to
a call to `self.batchTrash()`. Also implements the UI for
selecting and invoking a batch operation.
### reflectBatchOperation()
Invoked when a new batch operation is chosen to reflect it in the UI
by displaying the appropriate button and, where relevant, the
appropriate string field. Also invoked when the manage view is refreshed,
so that filters can impact which operations are currently enabled.
### enableBatchOperation(*batchOperation*, *callback*)
Preps for supporting a single batch operation, matching the operation name
to a method name such as `batchTrash` via the `name` property.
Also populates the subform for it, if any. Requires callback.
Invoked for you by `enableBatchOperations`. Do not invoke directly.
### enableInsertViaUpload()

### batchTrash()
Moves all selected items (`self.choices`) to the trash, after
asking for user confirmation.
### batchRescue()
Rescues all selected items (`self.choices`) from the trash, after
asking for user confirmation.
### batchPublish()
Publishes all selected items (`self.choices`), after asking for
user confirmation.
### batchUnpublish()
Unpublishes all selected items (`self.choices`), after asking for
user confirmation.
### batchTag()
Tags all selected items (`self.choices`), after asking for
user confirmation.
### batchUntag()
Untags all selected items (`self.choices`), after asking for
user confirmation.
### batchSimple(*operationName*, *confirmationPrompt*, *options*)
Carry out a named batch operation, such as `trash`, displaying the
provided prompt and, if confirmed by the user, invoking the
corresponding verb in this module's API.
### enableSorts()

### enableChooseViews()

### enableSearch()

### enableCheckboxEvents()
Enable checkbox selection of pieces. The ids of the chosen pieces are added
to `self.choices`. This mechanism is used for ordinary manager modals and their
bulk features, like "Trash All Selected". The chooser used for selecting
pieces for joins overrides this with an empty method and substitutes its
own implementation.
### addChoice(*id*)

### removeChoice(*id*)

### reflectChoicesInCheckboxes()
Reflect existing choices in checkboxes. Invoked by `self.refresh` after
the main view is refreshed. Important when the user is selecting items
while paginating. This mechanism is used for ordinary manager modals and their
bulk features, like "Trash All Selected". The chooser used for selecting
pieces for joins overrides this with an empty method and substitutes its
own implementation.
### reflectChoiceInCheckbox(*id*)

### reflectChoiceCount()

### refresh(*callback*)

### beforeList(*listOptions*)
An initially empty method you can override to add properties to the
query object sent to the server to fetch another page of results. Also
used to build the query that goes to the server in a insert-via-upload
operation in order to make sure things like the `minSize` filter
of `apostrophe-images` are honored.
### afterRefresh()

### onChange(*type*)

### afterHide()

