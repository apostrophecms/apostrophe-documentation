---
title: "apostrophe-pieces-editor-modal (browser)"
---
## Inherits from: [apostrophe-modal](../apostrophe-modal/browser-apostrophe-modal.html)
An editor modal for creating and updating pieces. An instance of this modal is created
each time you click "Add" or click to edit an existing piece. Relies on
[apostrophe-schemas](../apostrophe-schemas/index.html) to edit the fields.


## Methods
### beforeShow(*callback*)

### edit(*_id*, *callback*)

### create(*callback*)

### open(*verb*, *data*, *callback*)

### populate(*piece*, *callback*)

### beforePopulate(*piece*, *callback*)

### afterPopulate(*piece*, *callback*)

### saveContent(*callback*)

### getErrorMessage(*err*)

### beforeConvert(*piece*, *callback*)

### afterConvert(*piece*, *callback*)

### displayResponse(*result*, *callback*)

### onChange(*e*)

### trash(*$el*, *next*)

### versions(*$el*)

### copy(*$el*)
Save this modal, then open a new modal to create a new piece of
this type that starts out as a copy of the current piece
