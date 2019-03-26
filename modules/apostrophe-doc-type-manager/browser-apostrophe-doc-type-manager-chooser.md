---
title: apostrophe-doc-type-manager-chooser (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-doc-type-manager-chooser

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

## Methods

### load\(_callback_\)

### set\(_choices_\)

Set a new array of currently selected choices. Each should have label and value properties at a minimum

### get\(_callback_\)

### getFinal\(_callback_\)

### finalize\(_callback_\)

### add\(_\_id_\)

### clear\(\)

### remove\(_\_id_, _refresh_\)

### refresh\(_options_\)

### convertInlineRelationships\(_callback_\)

### decrementRefreshing\(\)

### enableLinks\(\)

### enableAutocomplete\(\)

### getBrowserType\(\)

### launchBrowser\(\)

### clone\(_options_, _callback_\)

Create a new chooser with the same data and options, merging in any additional options from the first argument. Async because the constructor is async. Delivers \(err, newChooser\)

### onChange\(\)

### enableInlineSchema\(\)

### decorateManager\(_manager_, _options_\)

Adds and overrides methods of the apostrophe-pieces-manager-modal to accommodate its use as a full-featured selection tool for the chooser, including the ability to create new items on the fly and choose them

### afterManagerSave\(\)

### afterManagerCancel\(\)

### pieceInsertedListener\(_piece_\)

This listener only actually gets installed for a chooser appearing in a manager

### pieceIsRelevant\(_piece_\)

