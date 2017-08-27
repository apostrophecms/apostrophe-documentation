---
title: "apostrophe-global (module)"
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-global-cursor
  - browser-apostrophe-global
  - browser-apostrophe-global-chooser
  - browser-apostrophe-global-relationship-editor
  - browser-apostrophe-global-editor-modal
  - browser-apostrophe-global-manager-modal
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)
### `apos.global`

## Methods
### findGlobal(*req*, *callback*)
Fetch the `global` doc object. On success, the callback is invoked
with `(null, global)`.
### modulesReady(*callback*)

### initGlobal(*callback*)
Initialize the `global` doc, if necessary. Invoked late in the
startup process by `modulesReady`.
### enableMiddleware()
Add the `addGlobalToData` middleware.
### addGlobalToData(*req*, *res*, *next*)
Standard middleware. Fetch the global doc and add it to `req.data` as `req.data.global`.
### getCreateSingletonOptions(*req*)

### addToAdminBar()
There is only one useful object of this type, so having access to the admin
bar button is not helpful unless you can edit that one, rather than
merely creating a new one (for which there is no UI). Thus we need
to set the permission requirement to admin-apostrophe-global.
This is called for you.
