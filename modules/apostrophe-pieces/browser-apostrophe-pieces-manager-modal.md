---
title: apostrophe-pieces-manager-modal (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-pieces-manager-modal

## Inherits from: [apostrophe-modal](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-modal/browser-apostrophe-modal.html)

A "manage" modal for pieces, displaying them list and/or grid views and providing filtering and sorting features. The manager modal is also extended on the fly by the chooser for use as a more full-featured chooser when selecting pieces to appear in a widget, such as a slideshow.

## Methods

### decorate\(\)

### generateFilter\(_filter_\)

turn a filter config object into a working filter

### beforeShow\(_callback_\)

### enableFilters\(\)

### enableBatchOperations\(_callback_\)

Enables batch operations, such as moving every selected item to the trash. Maps the operations found in options.batchOperations to methods, for instance `{ name: 'trash'}` maps to a call to `self.batchTrash()`. Also implements the UI for selecting and invoking a batch operation.

### reflectBatchOperation\(\)

Invoked when a new batch operation is chosen to reflect it in the UI by displaying the appropriate button and, where relevant, the appropriate string field. Also invoked when the manage view is refreshed, so that filters can impact which operations are currently enabled.

### enableBatchOperation\(_batchOperation_, _callback_\)

Preps for supporting a single batch operation, matching the operation name to a method name such as `batchTrash` via the `name` property. Also populates the subform for it, if any. Requires callback. Invoked for you by `enableBatchOperations`. Do not invoke directly.

### enableInsertViaUpload\(\)

### batchTrash\(\)

Moves all selected items \(`self.choices`\) to the trash, after asking for user confirmation.

### batchRescue\(\)

Rescues all selected items \(`self.choices`\) from the trash, after asking for user confirmation.

### batchPublish\(\)

Publishes all selected items \(`self.choices`\), after asking for user confirmation.

### batchUnpublish\(\)

Unpublishes all selected items \(`self.choices`\), after asking for user confirmation.

### batchTag\(\)

Tags all selected items \(`self.choices`\), after asking for user confirmation.

### batchUntag\(\)

Untags all selected items \(`self.choices`\), after asking for user confirmation.

### batchSimple\(_operationName_, _confirmationPrompt_, _options_\)

Carry out a named batch operation, such as `trash`, displaying the provided prompt and, if confirmed by the user, invoking the corresponding verb in this module's API.

`options.dataSource` can be used to specify a function to be invoked to gather more input before calling the API. It receives `(data, callback)`, where `data.ids` and any input gathered from the schema are already present, and should update `data` and invoke `callback` with null on success or with an error on failure.

`options.success` is invoked only if the operation succeeds. It receives `(result, callback)` where `result` is the response from the API and `callback` _must_ be invoked by the success function after completing its additional operations, even if the user chooses to cancel or skip those operations.

### enableSorts\(\)

### enableChooseViews\(\)

### enableSearch\(\)

### enableCheckboxEvents\(\)

Enable checkbox selection of pieces. The ids of the chosen pieces are added to `self.choices`. This mechanism is used for ordinary manager modals and their bulk features, like "Trash All Selected". The chooser used for selecting pieces for joins overrides this with an empty method and substitutes its own implementation.

### shrinkGrid\(\)

shrink and grow make visual reflectments to accommodate the the new Select Everything element

### growGrid\(\)

### reflectSelectEverythingCheckbox\(\)

### getSelectAll\(\)

### enableSelectEverything\(\)

### addChoice\(_id_\)

### addChoiceToState\(_id_\)

### removeChoice\(_id_\)

### removeChoiceFromState\(_id_\)

### getIds\(\)

Return just the ids of the choices. Subclasses might need to extend this to avoid returning other data associated with a choice. Unlike get\(\) this does not require a callback

### clearChoices\(\)

### clearEverythingChoices\(\)

When the "select everything" checkbox is cleared, we go back to selecting just the current page of content

### refreshSelectEverything\(\)

### getSelectEverything\(\)

### reflectChoicesInCheckboxes\(\)

Reflect existing choices in checkboxes. Invoked by `self.refresh` after the main view is refreshed. Important when the user is selecting items while paginating. This mechanism is used for ordinary manager modals and their bulk features, like "Trash All Selected". The chooser used for selecting pieces for joins overrides this with an empty method and substitutes its own implementation.

### reflectChoiceInCheckbox\(_id_\)

Reflect the current selection state of the given id by checking or unchecking the relevant box based on whether it is included in `self.getIds()`

### getCheckbox\(_id_\)

Return a jquery object referencing the checkbox for the given piece id

### getVisibleIds\(\)

Return array of ids corresponding to the items currently visible in the modal's list view, whether checked or not

### displayChoiceInCheckbox\(_id_, _checked_\)

Set the display state of the given checkbox. returns a jQuery object referencing the checkbox, for the convenience of subclasses that extend this

### reflectChoiceCount\(\)

### reflectHasChoices\(\)

### getListOptions\(_options_\)

Given an options object, returns a new object with those options plus standard options for the list API, such as `sort`, `search` and `manageView`. Also invokes `self.beforeList`. Called by `refresh`.

### refresh\(_callback_\)

### beforeList\(_listOptions_\)

An initially empty method you can override to add properties to the query object sent to the server to fetch another page of results. Also used to build the query that goes to the server in a insert-via-upload operation in order to make sure things like the `minSize` filter of `apostrophe-images` are honored.

### afterRefresh\(\)

### onChange\(_type_\)

### afterHide\(\)

