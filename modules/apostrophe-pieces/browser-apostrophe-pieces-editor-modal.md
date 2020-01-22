## Inherits from: [apostrophe-modal](../apostrophe-modal/browser-apostrophe-modal.md)
An editor modal for creating and updating pieces. An instance of this modal is created
each time you click "Add" or click to edit an existing piece. Relies on
[apostrophe-schemas](https://docs.apostrophecms.org/apostrophe/modules/apostrophe-schemas) to edit the fields.


## Methods
### beforeShow(*callback*)

### afterShow()
Make sure the field indicated by options.field is initially visible
### edit(*_id*, *callback*)

### create(*callback*)

### open(*verb*, *data*, *callback*)

### populate(*piece*, *callback*)

### beforePopulate(*piece*, *callback*)

### afterPopulate(*piece*, *callback*)

### saveContent(*callback*)

### displayError(*result*)
Calls getErrorMessage with result.status and passes the
returned string to apos.notify. This method is a good
candidate for overrides because it has access to the
entire result object. Invoked when result.status
is not `ok`.
### getErrorMessage(*err*, *result*)

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

