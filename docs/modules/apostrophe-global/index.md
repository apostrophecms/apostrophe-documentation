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
Provides req.data.global, a virtual page
for sitewide content such as a footer displayed on all pages. You
can also create site-wide preferences by adding schema fields. Just
configure this module with the `addFields` option as you normally would
for any widget or pieces module.

## options

`deferWidgetLoading`: a performance option. if true, any widget loads that can be deferred
will be until the end of the process of loading the global doc, reducing the number of queries
for simple cases.

Note that the `defer` option must also be set to `true` for all widget types
you wish to defer loads for.

To avoid causing problems for routes that depend on the middleware, loads are
only deferred until the end of loading the global doc and anything it
joins with; they are not merged with deferred loads for the actual page.
This option defaults to `false` because in many cases performance is
not improved, as the global doc often contains no deferrable widgets,
or loads them efficiently already.

`addFields`: if the schema contains fields, the "Global Content" admin bar button will
launch the editor modal for those, otherwise it will shortcut directly to the versions dialog box
which is still relevant on almost all sites because of the use of global header
and footer areas, etc.

This module provides middleware so that `req.data.global` is always available,
even in requests that are not for Apostrophe pages. In a command line task, you can use
the provided `findGlobal` method.

## properties

`_id`: the MongoDB ID of the global doc. Available after `modulesReady`.


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

