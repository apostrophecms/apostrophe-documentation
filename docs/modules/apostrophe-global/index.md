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
---
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/index.html)
### `apos.global`
Provides req.data.global, a virtual page
for sitewide content such as a footer displayed on all pages.
Provides middleware so that `req.data.global` is always available,
even in requests that are not for Apostrophe pages.

## properties

`_id`: the MongoDB ID of the global page. Available after `modulesReady`.

## click handlers

Although it is not in the UI by default, if you create an element with
a `data-apos-versions-global` attribute, a click on that element will
open the doc versions dialog box for the global doc. This is useful if
your global doc is used for critical infrastructure like building
custom sitewide navigation. TODO: consider how this might be best made available
as a standard feature in the UI.


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
### pushAssets()

### getCreateSingletonOptions(*req*)

