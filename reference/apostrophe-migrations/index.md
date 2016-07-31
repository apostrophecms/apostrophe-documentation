---
title: "apostrophe-migrations (module)"
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### enableCache(*name*, *callback*, *options*) *[implementation]*

### addMigrationTask(*criteria*, *limit*, *iterator*, *callback*) *[implementation]*

### migrationTask(*apos*, *argv*, *callback*, *iterator*, *callback*) *[implementation]*

### runOne(*migration*, *callback*, *iterator*, *callback*) *[implementation]*

### eachWidget(*criteria*, *limit*, *iterator*, *callback*) *[api]*
Invoke the iterator function once for each widget in each area in each doc
in the aposDocs collection. The `iterator` function receives
`(doc, widget, dotPath, callback)`. `criteria` may be used to limit
the docs for which this is done.

If only three arguments are given, `limit` is assumed to be 1 (only one
doc may be processed at a time).

This method will never visit the same doc twice in a single call, even if
modifications are made.

Widget loaders are NOT called.

THIS API IS FOR MIGRATION AND TASK USE ONLY AND HAS NO SECURITY.

YOUR ITERATOR MUST BE ASYNCHRONOUS.
