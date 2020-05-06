# apostrophe-pages (browser)
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager.md)
This singleton provides jquery event handlers to trigger various operations
on pages, such as insert, update, reorganize and trash. Most of the logic
lies elsewhere in modals for those particular tasks.


## Methods
### addLinks()

### pageSettings(*options*)
page settings for current page
### reorganize()
Display UI permitting the user to reorganize the page tree
### chooserModal(*options*)
options.chooser is required
### trash(*_id*, *callback*)

### rescue(*_id*, *callback*)
Rescue a page from the trash. Currently invoked
only when trashInSchema option is true
### deleteFromTrash(*_id*, *callback*)
Irrevocably delete something from the trash
