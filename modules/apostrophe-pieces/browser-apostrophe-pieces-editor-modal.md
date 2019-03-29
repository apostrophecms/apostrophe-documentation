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
Update the display in response to this item being saved.

If the piece is brand new and the server provided
a `_url` property and set `contextual: true` for this
type of piece, or the piece has been updated and
apos.pages.piece._id (the in-context piece) matches the
id of the piece just edited, go to `_url`.

In any case, the main content area is refreshed and the manage
view, if open, refreshes its list (`apos.change` is invoked).
This will all make sense if the URL hasn't changed, and do no
harm if it has.
### onChange(*e*)

### trash(*$el*, *next*)

### rescue(*$el*, *next*)

### versions(*$el*)

### copy(*$el*)
Save this modal, then open a new modal to create a new piece of
this type that starts out as a copy of the current piece
### displayResponse(*result*, *callback*)

### afterHide()

