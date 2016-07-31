---
title: "apostrophe-docs-chooser (browser)"
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)

## Methods
### load(*callback*)

### set(*choices*)

### get(*callback*)

### getFinal(*callback*)

### finalize(*callback*)

### add(*_id*)

### remove(*_id*)

### refresh()

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

### decorateManager(*manager*, *options*)

### afterManagerSave()

### afterManagerCancel()

