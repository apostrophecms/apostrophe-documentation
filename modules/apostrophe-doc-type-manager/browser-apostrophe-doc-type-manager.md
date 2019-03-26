---
title: apostrophe-doc-type-manager (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-doc-type-manager

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

## Methods

### getTool\(_name_, _options_, _callback_\)

Fetch a related tool such as the chooser, manager-modal or editor-modal for this type.

Return false if no such tool is available.

Options are merged with the options of this manager.

Callback argument can be omitted if this tool doesn't require a callback for constructing new instances.

### getToolType\(_name_\)

Figure out the moog type name for a related tool such as the chooser, manager-modal or editor for this type.

