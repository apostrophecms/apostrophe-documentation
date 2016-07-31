---
title: "apostrophe-widgets (module)"
children:
  - browser-apostrophe-widgets
  - browser-apostrophe-widgets-editor
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### output(*widget*, *options*)
Outputs the widget. Invoked by
apos.widget in Nunjucks.
### load(*req*, *widgets*, *callback*)
Perform joins and any other necessary async
actions for our type of widget. Note that
an array of widgets is handled in a single call
as you can usually optimize this.

Override this to perform custom joins not
specified by your schema, talk to APIs, etc.
### sanitize(*req*, *input*, *callback*)

### filterForDataAttribute(*widget*)
Remove all properties of a widget that are the results of joins
or otherwise dynamic (_) for use in stuffing the
"data" attribute of the widget. If we don't do a
good job here we get 1MB+ of markup! So if you override
this, play nice! - Tom and Sam
### filterOptionsForDataAttribute(*options*)
Filter options passed from template to widget before stuffing
them into JSON for use by the widget editor. If we don't do a
good job here we get 1MB+ of markup! So if you override
this, play nice! - Tom and Sam
### pushAssets()

### pushCreateSingleton()

### list(*apos*, *argv*, *callback*)

## API Routes
### POST /modules/apostrophe-widgets/modal

