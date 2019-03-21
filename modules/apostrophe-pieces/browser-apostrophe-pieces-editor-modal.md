---
title: apostrophe-pieces-editor-modal (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-pieces-editor-modal

## Inherits from: [apostrophe-modal](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-modal/browser-apostrophe-modal.html)

An editor modal for creating and updating pieces. An instance of this modal is created each time you click "Add" or click to edit an existing piece. Relies on [apostrophe-schemas](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-schemas/index.html) to edit the fields.

## Methods

### beforeShow\(_callback_\)

### edit\(_\_id_, _callback_\)

### create\(_callback_\)

### open\(_verb_, _data_, _callback_\)

### populate\(_piece_, _callback_\)

### beforePopulate\(_piece_, _callback_\)

### afterPopulate\(_piece_, _callback_\)

### saveContent\(_callback_\)

### getErrorMessage\(_err_\)

### beforeConvert\(_piece_, _callback_\)

### afterConvert\(_piece_, _callback_\)

### displayResponse\(_result_, _callback_\)

Update the display in response to this item being saved.

If the piece is brand new and the server provided a `_url` property and set `contextual: true` for this type of piece, or the piece has been updated and apos.pages.piece.\_id \(the in-context piece\) matches the id of the piece just edited, go to `_url`.

In any case, the main content area is refreshed and the manage view, if open, refreshes its list \(`apos.change` is invoked\). This will all make sense if the URL hasn't changed, and do no harm if it has.

### onChange\(_e_\)

### trash\(_$el_, _next_\)

### versions\(_$el_\)

### copy\(_$el_\)

Save this modal, then open a new modal to create a new piece of this type that starts out as a copy of the current piece

### displayResponse\(_result_, _callback_\)

### afterHide\(\)

