---
title: "apostrophe-global (module)"
layout: module
children:
  - browser-apostrophe-global
  - browser-apostrophe-global-chooser
  - browser-apostrophe-global-relationship-editor
---
## Inherits from: [apostrophe-doc-type-manager](../apostrophe-doc-type-manager/index.html)
Provides req.data.global, a virtual page
for sitewide content such as a footer displayed on all pages.
Provides middleware so that `req.data.global` is always available,
even in requests that are not for Apostrophe pages.


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
