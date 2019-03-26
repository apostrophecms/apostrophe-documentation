---
title: apostrophe-pages (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-pages

## Inherits from: [apostrophe-doc-type-manager](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager.html)

This singleton provides jquery event handlers to trigger various operations on pages, such as insert, update, reorganize and trash. Most of the logic lies elsewhere in modals for those particular tasks.

## Methods

### addLinks\(\)

### reorganize\(\)

Display UI permitting the user to reorganize the page tree

### chooserModal\(_options_\)

options.chooser is required

### trash\(_\_id_, _callback_\)

### rescue\(_\_id_, _callback_\)

Rescue a page from the trash. Currently invoked only when trashInSchema option is true

### deleteFromTrash\(_\_id_, _callback_\)

Irrevocably delete something from the trash

