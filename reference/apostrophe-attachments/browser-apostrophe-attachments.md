---
title: "apostrophe-attachments (browser)"
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)

## Methods
### crop(*attachment*, *options*, *callback*)
Invoke with an attachment, options (such as minSize), and a callback.
Callback receives (err, crop). If no err, crop has coordinates and
can be stored as the crop property of the attachment (when there is
one and only one crop ever for this attachment), or stored as part
of a relationship to the doc containing the attachment; that part
is up to you.
### addFieldType()

### populate(*object*, *name*, *$field*, *$el*, *field*, *callback*)

### convert(*data*, *name*, *$field*, *$el*, *field*, *callback*)

### addHandlers()

### updateExisting(*$fieldset*, *info*, *field*)

