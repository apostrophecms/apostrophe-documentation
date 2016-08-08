---
title: "apostrophe-pieces-widgets (module)"
layout: module
children:
  - browser-apostrophe-pieces-widgets-editor
  - browser-apostrophe-pieces-widgets
---
## Inherits from: [apostrophe-widgets](../apostrophe-widgets/index.html)

## Methods
### load(*req*, *widgets*, *callback*)
Load the appropriate pieces for each widget in the array. Apostrophe will try to feed
us as many at once as it can to cut down on database queries. We'll take all the
widgets for which pieces were chosen "by id" and do a single query, via
self.loadManyById. For everything we'll call self.loadOne individually, via
self.loadOthersOneAtATime. But in ALL cases, we invoke self.afterLoadOne for
each widget, allowing an opportunity to do custom work without thinking
about all this.
### loadManyById(*req*, *widgets*, *callback*)
Load many widgets, all of which were set to choose pieces "by id." This allows
Apostrophe to work efficiently when a page contains many pieces widgets in an
array, etc. This method is called by self.load, you don't need to call it yourself.

This method still calls afterLoadOne for each widget, so there is still a simple
way to go beyond this if you need to do something fancy after a widget has been
through the normal loading process.
### loadOthersOneAtATime(*req*, *widgets*, *callback*)
Load widgets that were NOT set to choose pieces "by id." Feeds them all
through self.loadOne and self.afterLoadOne. You don't have to call this,
self.load calls it for you.
### loadOne(*req*, *widget*, *callback*)

### attachPiecesToWidget(*widget*, *pieces*)
Given an array of pieces, this method attaches them to the widget
as the _pieces property correctly with pushPiecesToWidget, and
orders them correctly if the user chose them in a specific order
### orderPiecesForWidget(*widget*)
A utility method that puts the pieces loaded for the widget in the
order requested by the user. widget._pieces should already be loaded
at this point. Called for you by the widget loader methods; useful
if you are overriding loadOne and disabling loadManyById
### pushPieceForWidget(*widget*, *piece*)
A utility method to append a piece to the ._pieces array for the given widget correctly,
whether the join has relationship properties or not.
### afterLoadOne(*req*, *widget*, *callback*)

### widgetCursor(*req*, *criteria*)
Hook to modify cursor before the load method is invoked
