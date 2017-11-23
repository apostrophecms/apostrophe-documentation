---
title: "apostrophe-doc-type-manager-chooser (browser)"
layout: reference
namespace: browser
---
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

### remove(*_id*)

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
### shrinkGrid()
shrink and grow make visual reflectments to accommodate the the new Select Everything element
### growGrid()

### afterManagerSave()

### afterManagerCancel()

### pieceInsertedListener(*piece*)
This listener only actually gets installed for a chooser appearing in a manager
