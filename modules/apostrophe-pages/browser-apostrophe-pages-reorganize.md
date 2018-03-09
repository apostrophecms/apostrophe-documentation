---
title: "apostrophe-pages-reorganize (browser)"
layout: reference
namespace: browser
---
## Inherits from: [apostrophe-modal](../apostrophe-modal/browser-apostrophe-modal.html)

## Methods
### beforeShow(*callback*)

### enhanceNode(*node*, *$li*)
Enhance a node in the tree with additional elements.
jqtree doesn't template these, and running nunjucks for
each one would be a big perf hit with big trees anyway.
So we add controls directly to `$li` as needed.
### addControlGroupToNode(*node*, *$li*)

### indentLevel(*node*, *$li*)

### configureTitleContainer(*node*, *$li*)

### addVisitLink(*node*, *$li*)
Add button used to visit the page
### afterHide()
After a reorg the page URL may have changed, be prepared to
navigate there or to the home page or just refresh to reflect
possible new tabs
### visit(*$node*)

### edit(*$node*)

### delete(*$node*)

### deleteFromTrash(*$node*)

### move(*e*)

### reload(*callback*)

### updateVirtualTrashcans()

### updateVirtualTrashcan(*node*)

### errorOnReload()

### errorOnMove()

### decorate()

### enableCheckboxEvents()
Currently called by chooser, later perhaps used
to manage pages too
### addChoice(*id*)

### addChoiceToState(*id*)

### removeChoice(*id*)

### removeChoiceFromState(*id*)

### getIds()
Return just the ids of the choices. Subclasses
might need to extend this to avoid returning
other data associated with a choice. Unlike get()
this does not require a callback
### clearChoices()

### reflectChoicesInCheckboxes()
Reflect existing choices in checkboxes.
### getVisibleIds()

### reflectChoiceInCheckbox(*id*)
Reflect the current selection state of the given id
by checking or unchecking the relevant box, if
currently visible
### getCheckbox(*id*)
Return a jquery object referencing the checkbox for the given piece id
### displayChoiceInCheckbox(*id*, *checked*)
Set the display state of the given checkbox. returns
a jQuery object referencing the checkbox, for the convenience
of subclasses that extend this
