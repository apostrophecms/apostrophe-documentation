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
or editor for this type.
