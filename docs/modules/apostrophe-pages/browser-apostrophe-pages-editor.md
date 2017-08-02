---
title: "apostrophe-pages-editor (browser)"
layout: reference
namespace: browser
---
Edit page settings.

Typically instantiated by the page settings button, however it can be instantiated
programmatically to edit the page settings of a different page, in which case
`options.page` must provide at least the `_id` and `type` properties.

If the page settings of the current page are edited, after editing is complete the
user is redirected to the page on save, to reflect all changes including slug edits.

`options.afterSave` may be a function which takes a page object and a callback.
The page object is the page as returned by the server after the save operation.


## Methods
### beforeShow(*callback*)

### open(*callback*)

### populate(*data*, *callback*)

### beforeSave(*callback*)

### afterSave(*callback*)

### convert(*page*, *callback*)

### saveContent(*callback*)
For pages, saveContent never invokes its callback except on an error,
because it redirects to the new page URL. To aid you in doing something
before that happens, the afterSave method is provided and can be overridden
as you see fit.
### changedType(*type*)

