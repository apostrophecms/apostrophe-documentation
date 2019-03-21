---
title: apostrophe-pages-reorganize (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-pages-reorganize

## Inherits from: [apostrophe-modal](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-modal/browser-apostrophe-modal.html)

## Methods

### beforeShow\(_callback_\)

### enhanceNode\(_node_, _$li_\)

Enhance a node in the tree with additional elements. jqtree doesn't template these, and running nunjucks for each one would be a big perf hit with big trees anyway. So we add controls directly to `$li` as needed.

### addControlGroupToNode\(_node_, _$li_\)

### indentLevel\(_node_, _$li_\)

### configureTitleContainer\(_node_, _$li_\)

### addVisitLink\(_node_, _$li_\)

Add button used to visit the page

### afterHide\(\)

After a reorg the page URL may have changed, be prepared to navigate there or to the home page or just refresh to reflect possible new tabs

### visit\(_$node_\)

### edit\(_$node_\)

### delete\(_$node_\)

### deleteFromTrash\(_$node_\)

### move\(_e_\)

### reload\(_callback_\)

### updateVirtualTrashcans\(\)

### updateVirtualTrashcan\(_node_\)

### errorOnReload\(\)

### errorOnMove\(\)

### decorate\(\)

### enableCheckboxEvents\(\)

Currently called by chooser, later perhaps used to manage pages too

### addChoice\(_id_\)

### addChoiceToState\(_id_\)

### removeChoice\(_id_\)

### removeChoiceFromState\(_id_\)

### getIds\(\)

Return just the ids of the choices. Subclasses might need to extend this to avoid returning other data associated with a choice. Unlike get\(\) this does not require a callback

### clearChoices\(\)

### reflectChoicesInCheckboxes\(\)

Reflect existing choices in checkboxes.

### getVisibleIds\(\)

### enableSelectAll\(\)

### reflectSelectAll\(\)

### reflectChoiceInCheckbox\(_id_\)

Reflect the current selection state of the given id by checking or unchecking the relevant box, if currently visible

### getCheckbox\(_id_\)

Return a jquery object referencing the checkbox for the given piece id

### displayChoiceInCheckbox\(_id_, _checked_\)

Set the display state of the given checkbox. returns a jQuery object referencing the checkbox, for the convenience of subclasses that extend this

### reflectChoiceCountBody\(\)

### enableBatchOperations\(_callback_\)

Enables batch operations, such as moving every selected item to the trash. Maps the operations found in options.batchOperations to methods, for instance `{ name: 'trash'}` maps to a call to `self.batchTrash()`. Also implements the UI for selecting and invoking a batch operation.

### reflectBatchOperation\(\)

Invoked when a new batch operation is chosen to reflect it in the UI by displaying the appropriate button and, where relevant, the appropriate string field. Also invoked when the manage view is refreshed, so that filters can impact which operations are currently enabled.

### enableBatchOperation\(_batchOperation_, _callback_\)

Preps for supporting a single batch operation, matching the operation name to a method name such as `batchTrash` via the `name` property. Also populates the subform for it, if any. Requires callback. Invoked for you by `enableBatchOperations`. Do not invoke directly.

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

