---
title: "apostrophe-migrations (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.migrations`
Provide services for database migration. The `apostrophe-migrations:migrate` task
carries out all migrations that have been registered with this module. Migrations
are used to make changes to the database at the time of a new code deployment,
typically because we need to represent the data in a different way or correct
errors.

Migrations MUST be idempotent (it must be safe to run them twice). Apostrophe
does remember whether they have been run before in a cache but there is
NO guarantee that they will not run again when the cache is cleared. If this is
difficult to guarantee, you may wish to write a task instead.


## Methods
### add(*name*, *callback*, *options*) *[api]*
Add a migration callback to be invoked when the apostrophe-migrations:migrate task is invoked. As an optimization,
the callback MIGHT not be invoked if it has been invoked before, but your callback MUST be idempotent (it must not
behave badly if the migration has been run before).

The options argument may be omitted. If options.safe is true, this migration will still be run when the
--safe option is passed to the task. ONLY SET THIS OPTION IF THE CALLBACK HAS NO NEGATIVE IMPACT ON A RUNNING,
LIVE SITE. But if you can mark a migration safe, do it, because it minimizes downtime when deploying.
### eachDoc(*criteria*, *limit*, *iterator*, *callback*) *[api]*
Invoke the iterator function once for each doc in the aposDocs collection.
If only three arguments are given, `limit` is assumed to be 1 (only one
doc may be processed at a time).

This method will never visit the same doc twice in a single call, even if
modifications are made.

THIS API IS FOR MIGRATION AND TASK USE ONLY AND HAS NO SECURITY.
### each(*collection*, *criteria*, *limit*, *iterator*, *callback*) *[api]*
Invoke the iterator function once for each document in the given collection.
If only three arguments are given, `limit` is assumed to be 1 (only one
doc may be processed at a time).

This method will never visit the same document twice in a single call, even if
modifications are made.

THIS API IS FOR MIGRATION AND TASK USE ONLY AND HAS NO SECURITY.
### eachArea(*criteria*, *limit*, *iterator*, *callback*) *[api]*
Invoke the iterator function once for each area in each doc in
the aposDocs collection. The `iterator` function receives
`(doc, area, dotPath, callback)`. `criteria` may be used to limit
the docs for which this is done.

If only three arguments are given, `limit` is assumed to be 1 (only one
doc may be processed at a time).

This method will never visit the same doc twice in a single call, even if
modifications are made.

THIS API IS FOR MIGRATION AND TASK USE ONLY AND HAS NO SECURITY.

YOUR ITERATOR MUST BE ASYNCHRONOUS.
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
### addSortify(*migrationNamePrefix*, *criteria*, *field*) *[api]*
Most of the time, this is called automatically for you. Any
doc type schema field marked with `sortify: true` automatically
gets a migration implemented via this method. Don't forget
to run the `apostrophe-migration:migrate` task.

Adds a migration that takes the given field, such as `lastName`, and
creates a parallel `lastNameSortified` field, formatted with
`apos.utils.sortify` so that it sorts and compares in a more
intuitive, case-insensitive way.

The migration applies only to documents that match `criteria`.

After adding such a migration, you can add `sortify: true` to the
schema field declaration for `field`, and any calls to
the `sort()` cursor filter for `lastName` will automatically
use `lastNameSortified`. You can also do that explicitly of course.

Note that you want to do both things (add the migration, and
add `sortify: true`) because `sortify: true` guarantees that
`lastNameSortified` gets updated on all saves of the doc.

`migrationNamePrefix` just helps uniquely identify this
migration, since different modules might contribute migrations
for fields of the same name.
### enableCache() *[implementation]*
Legacy cache of migrations performed
### enableCollection(*callback*) *[implementation]*
How we now track migrations performed: a mongodb collection (persistent)
### addMigrationTask() *[implementation]*

### migrationTask(*apos*, *argv*, *callback*) *[implementation]*

### addCollectionMigration() *[implementation]*

### afterInit() *[implementation]*

### addSortifyMigrations() *[implementation]*

### migrate(*options*, *callback*) *[implementation]*

### runOne(*migration*, *callback*) *[implementation]*

