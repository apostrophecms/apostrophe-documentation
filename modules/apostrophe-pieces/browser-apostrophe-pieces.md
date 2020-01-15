## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager.md)
The browser-side doc type manager for a type of piece. Provides jQuery event handlers
for edit, rescue, create and version rollback based on data attributes that can
appear anywhere, which is useful for contextual pieces.


## Methods
### clickHandlers()

### manage()

### edit(*_id*, *options*)
`options` object is merged with the options passed to the editor modal,
in particular you can pass a `hint` to be displayed
at the top of the modal to provide context for why the edit operation
was undertaken
### create(*options*)
`options` object is merged with the options passed to the editor modal,
in particular you can pass a `hint` to be displayed
at the top of the modal to provide context for why the edit operation
was undertaken
### rescue(*_id*)

### launchBatchPermissionsModal(*data*, *callback*)

