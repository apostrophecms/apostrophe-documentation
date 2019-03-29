## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)

## Methods
### load(*callback*)

### set(*choices*)
Set a new array of currently selected choices. Each should have
label and value properties at a minimum
### get(*callback*)

### getFinal(*callback*)

### finalize(*callback*)

### add(*_id*)

### clear()

### remove(*_id*, *refresh*)

### refresh(*options*)

### convertInlineRelationships(*callback*)

### decrementRefreshing()

### enableLinks()

### enableAutocomplete()

### getBrowserType()

### launchBrowser()

### clone(*options*, *callback*)
Create a new chooser with the same data and options, merging in any
additional options from the first argument. Async because
the constructor is async. Delivers (err, newChooser)
### onChange()

### enableInlineSchema()

### decorateManager(*manager*, *options*)
Adds and overrides methods of the apostrophe-pieces-manager-modal to
accommodate its use as a full-featured selection tool for the chooser,
including the ability to create new items on the fly and choose them
### afterManagerSave()

### afterManagerCancel()

### pieceInsertedListener(*piece*)
This listener only actually gets installed for a chooser appearing in a manager
### pieceIsRelevant(*piece*)

