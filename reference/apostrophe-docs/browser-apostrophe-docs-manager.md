---
title: "apostrophe-docs-manager (browser)"
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)

## Methods
### getTool(*name*, *options*, *callback*)
Fetch a related tool such as the chooser, manager-modal or editor-modal for this type.

Return false if no such tool is available.

Options are merged with the options of this manager.

Callback argument can be omitted if this tool doesn't require a callback for
constructing new instances.
### getToolType(*name*)
Figure out the moog type name for a related tool such as the chooser, manager-modal
or editor for this type. First try replacing -manager with -name in the type name
of this manager object. If that doesn't work, look for a generic implementation
as apostrophe-docs-name. If that doesn't work, return false.
