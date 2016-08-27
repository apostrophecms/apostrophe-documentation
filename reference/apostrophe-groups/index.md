---
title: "apostrophe-groups (module)"
layout: module
children:
  - server-apostrophe-groups-cursor
  - browser-apostrophe-groups
  - browser-apostrophe-groups-chooser
  - browser-apostrophe-groups-relationship-editor
  - browser-apostrophe-groups-editor-modal
  - browser-apostrophe-groups-manager-modal
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)
Provide a way to group [apostrophe-users](../apostrophe-users/index.html) together
and assign permissions to them. This module is always active "under the hood," even if
you take advantage of the `groups` option of `apostrophe-users` to skip a separate
admin bar button for managing groups.

By default the `published` schema field is removed. As a general rule we believe
that conflating users and groups, who can log into the website, with public directories
of people most often leads to confusion. Use a separate subclass of pieces to
represent departments, etc.

If you do add the `published` field back you will need to extend the cursor to make
`published(true)` the default again.

This module is **not** intended to be extended with new subclass modules, although
you may implicitly subclass it at project level to change its behavior.


## Methods
### modulesReady()

### setPermissionsChoices()

### addToAdminBar()

### addToAdminBarIfSuitable()
Adds an admin bar button if and only if the `apostrophe-users` module
is not using its `groups` option for simplified group administration.
