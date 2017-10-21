---
title: "apostrophe-docs (module)"
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-cursor
  - browser-apostrophe-docs
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.docs`
This module is responsible for managing all of the documents (apostrophe "docs")
in the `aposDocs` mongodb collection.

The `getManager` method should be used to obtain a reference to the module
that manages a particular doc type, so that you can benefit from behavior
specific to that module. One method of this module that you may sometimes use directly
is `apos.docs.find()`, which returns a [cursor](server-apostrophe-cursor.html) for
fetching documents of all types. This is useful when implementing something
like the [apostrophe-search](../apostrophe-search/index.html) module.

## Options

**`trashInSchema`: if set to `true`, a "trash" checkbox appears in the
schema for each doc type, and pieces in the trash can be edited. Pages
in the trash are visually displayed beneath a trashcan for every "folder"
(parent page), which is another way of expressing that trash is just a flag.

This allows pages to be restored to their exact previous position and decouples
moving pages from trashing pages, which is useful for the `apostrophe-workflow`
module. In addition, it becomes possible to edit the page settings of a page
that is in the trash. Similar benefits apply to pieces and are needed for the
workflow module. On the minus side, a trashcan at each level is less intuitive
to users raised on the traditional shared trashcan.

**`conflictResolution`: by default, Apostrophe will attempt to resolve
conflicts between users trying to edit the same document by presenting
the option to take control or leave the other user in control. This
mechanism can be disabled by explicitly setting `conflictResolution`
to false. Doing so is *not recommended* for normal operation but has
valid applications in automated testing.


## Methods
### enableCollection(*callback*) *[api]*

### ensureSlugIndex(*callback*) *[api]*
Index on the slug property. Emits a slugIndex event with a params object
so it can be altered by other listening modules
### getSlugIndexParams() *[api]*

### ensureIndexes(*callback*) *[api]*

### ensureTextIndex(*callback*) *[api]*

### find(*req*, *criteria*, *projection*) *[api]*
Returns a query cursor based on the permissions
associated with the given request. The criteria
and projection arguments are optional, you
can also call the chainable .criteria() and
.projection() methods.

If you do not provide criteria or call .criteria()
you get every document in Apostrophe, which is
too many.

If you do not provide `projection` or call
`.projection()` you get all properties of
the docs, which is fine.

This method returns a cursor, not docs! You
need to chain it with toArray() or other
cursor methods:

apos.docs.find(req, { type: 'foobar' }).toArray(
  function(err, docs) { ... }
);
### insert(*req*, *doc*, *options*, *callback*) *[api]*
**Most often you will insert or update docs via the
insert and update methods of the appropriate doc manager.**
This method is for implementation use in those objects,
and for times when you wish to explicitly bypass most type-specific
callbacks such as the `beforeInsert` method of the
doc manager.

Insert the given document. If the slug is not
unique it is made unique. docBeforeInsert,
docBeforeSave, docAfterInsert
and docAfterSave are called on all modules that have them.
These have a performance impact so they should only be used
for critical matters and cross-cutting concerns such as versioning
and security.

On success the callback is invoked with
(null, doc).

If the slug property is not set, the title
property is converted to a slug. If neither
property is set, an error occurs.

The `edit-type-name` permission is checked based on
doc.type.

If a unique key error occurs,
apos.*.docFixUniqueError is called with the
document. Modify the document to fix any
properties that may need to be more unique
due to a unique index you have added. It is
not possible to know which property was
responsible. This method takes care of
the slug property directly.

The `options` object may be omitted completely.

If `options.permissions` is set explicitly to
`false`, permissions checks are bypassed.
### update(*req*, *doc*, *options*, *callback*) *[api]*
**Most often you will insert or update docs via the
insert and update methods of the appropriate doc manager.**
This method is for implementation use in those objects,
and for times when you wish to explicitly bypass most type-specific
callbacks such as the `beforeUpdate` method of the
doc manager.

Update the given document. If the slug is not
unique it is made unique. docBeforeInsert,
docBeforeSave, docAfterInsert
and docAfterSave are called on all modules that have them.

Update a single document.

The second argument must be the document itself.
$set, $inc, etc. are NOT available via
this interface. This simplifies the implementation
of permissions and workflow. If you need to
update an object, find it first and then update it.

docBeforeSave, docBeforeUpdate,
docAfterSave and docAfterUpdate are invoked on
all modules that have them. These have a performance
impact, so they should be used only to implement
cross-cutting concerns like versioning and address security matters.

On success the callback is invoked with
(null, doc).

The `edit-doc` permission is checked for the
specific object passed.

`docBeforeUpdate` methods can be used to
enforce other restrictions.

If a unique key error occurs,
apos.*.docFixUniqueError is called with the
document. Modify the document to fix any
properties that may need to be more unique
due to a unique index you have added. It is
not possible to know which property was
responsible. This method takes care of
the slug property directly.

The `options` object may be omitted completely.

If `options.permissions` is set explicitly to
`false`, permissions checks are bypassed.
### denormalizePermissions(*req*, *doc*, *options*, *callback*) *[api]*
Apostrophe edits doc editing and viewing permissions via joins,
but for query performance then copies them to a single array with entries
like: `[ 'edit-xxx', 'view-xxx' ]`, where `xxx` might be a user id
or a group id. This method performs that copying. It also invokes
the docAfterDenormalizePermissions method of every module that has one,
which allows the pages module to piggyback and add `applyToSubpages` behavior.

The `options` object is for future extension and is passed on
to this method by `insert` and `update`.
### trash(*req*, *idOrCriteria*, *options*, *callback*) *[api]*
Trash a single document. The second
argument may be either an _id, or a MongoDB
criteria object. If more than one document
matches the criteria only one will be
updated. You must have permission to
edit the document.

docBeforeTrash and docAfterTrash
are invoked on all modules.

If `options.permission` is set, that permission is required
(or none if it is set to `false`), otherwise `'edit-doc'` is required.

The `options` argument may be omitted entirely.

On success the callback receives `(null, doc)`.
### trashBody(*req*, *doc*, *callback*) *[api]*

### rescue(*req*, *idOrCriteria*, *options*, *callback*) *[api]*
Rescue the document matching the specified
criteria from the trash. Only one document
is rescued regardless of the criteria.
You must have permission to edit it.

If `options.permission` is set, that permission is required
(or none if it is set to `false`), otherwise `'edit-doc'` is required.

docBeforeRescue and docAfterRescue are
invoked on all modules.

On success the callback receives `(null, doc)`.
### rescueBody(*req*, *doc*, *callback*) *[api]*
Remove the given document from the trash. You
should call .rescue(), not this method. However
you can override this method to alter the
implementation.
### deleteFromTrash(*req*, *idOrCriteria*, *callback*) *[api]*
Forever discard the specified document or
documents. All documents matching the criteria
are discarded completely.

Documents not already marked as trash are
not discarded.

You must have publish permission
for the documents to discard them.

The use of this API without extensive user
confirmation is strongly discouraged. Users
who ask for a way to empty the trash will often
ask for a way to un-empty it. There isn't one.
### emptyTrash(*req*, *idOrCriteria*, *callback*) *[api]*
bc wrapper for self.deleteFromTrash
### walk(*doc*, *callback*, *_dotPath*, *_ancestors*) *[api]*
Recursively visit every property of a doc,
invoking a callback for each one. Optionally
deletes properties.

The second argument must be a function that takes
an object, a key, a value, a "dot path" and an
array containing the ancestors of this property
(beginning with the original `doc` and including
"object") and explicitly returns `false` if that property
should be discarded. If any other value is returned the
property remains.

Remember, keys can be numbers; toString() is
your friend.

If the original object looks like:

{ a: { b: 5 } }

Then when the callback is invoked for b, the
object will be { b: 5 }, the key
will be `b`, the value will be `5`, the dotPath
will be the string `a.b`, and ancestors will be
[ { a: { b: 5 } } ].

You do not need to pass the `_dotPath` and `_ancestors` arguments.
They are used for recursive invocation.
### retryUntilUnique(*req*, *doc*, *actor*, *callback*) *[api]*
"Protected" API: methods typically invoked
by the public API, although you may invoke
and override them
Retry the given "actor" function until it
does not yield a MongoDB error related to
unique indexes. The actor is not passed
any arguments other than a callback. If
an error does occur, docFixUniqueError is
invoked on all modules with `doc` and an
optional callback before the next retry.
### docBeforeInsert(*req*, *doc*, *options*) *[api]*
Invoked before any doc is inserted. Checks
that the user has general permission to
create docs of that type, generates an _id if needed,
and sets createdAt to the current Date.
Note that methods of this name are invoked
on ALL modules that have them, starting with
this one. Although this method takes no
callback, other implementations MAY
take a callback and are invoked in series.

If `options.permissions` is explicitly `false`,
permissions checks are not performed.
### testInsertPermissions(*req*, *doc*, *options*) *[api]*
Called by `docBeforeInsert` to confirm that the user
has the appropriate permissions for the doc's type
and, in some extensions of Apostrophe, the new doc's
content.
### docBeforeSave(*req*, *doc*, *options*) *[api]*
Invoked before any doc is saved (either
updated or inserted). Generates a slug
from the title if needed, throwing an
error if there is neither slug nor title.

Also implements the "sortify" behavior for
fields that specify it in the schema.

Note that methods of this name are invoked
on ALL modules that have them, starting with
this one. Although this method takes no
callback, other implementations MAY
take a callback and are invoked in series.
### docFixUniqueError(*req*, *doc*) *[api]*
Invoked when a MongoDB index uniqueness error
occurs, such as when the slug property is
not unique. Modifies the slug to be unique.
Apostrophe then retries the operation.

Note that methods of this name are invoked
on ALL modules that have them, starting with
this one. Although this method takes no
callback, other implementations MAY
take a callback and are invoked in series.
### docBeforeUpdate(*req*, *doc*, *options*) *[api]*
Invoked when a doc is about to be updated
(not inserted for the first time). Checks
permissions on that document and refuses
to update it if the user lacks permission to
do so.

Note that methods of this name are invoked
on ALL modules that have them, starting with
this one. Although this method takes no
callback, other implementations MAY
take a callback and are invoked in series.

If `options.permissions` is explicitly `false`,
permissions checks are not performed.
### updateBody(*req*, *doc*, *options*, *callback*) *[api]*
Do not call this yourself, it is called
by .update(). You will usually want to call the
update method of the appropriate doc type manager instead:

self.apos.docs.getManager(doc.type).update(...)

You may override this method to change the implementation.
### insertBody(*req*, *doc*, *options*, *callback*) *[api]*
Insert the given document. Called by `.insert()`. You will usually want to
call the update method of the appropriate doc type manager instead:

```javascript
self.apos.docs.getManager(doc.type).update(...)
```

However you can override this method to alter the
implementation.
### idOrCriteria(*idOrCriteria*) *[api]*
Given either an id (as a string) or a criteria
object, return a criteria object.
### isUniqueError(*err*) *[api]*
Is this MongoDB error related to uniqueness? Great for retrying on duplicates.
Used heavily by the pages module and no doubt will be by other things.

There are three error codes for this: 13596 ("cannot change _id of a document")
and 11000 and 11001 which specifically relate to the uniqueness of an index.
13596 can arise on an upsert operation, especially when the _id is assigned
by the caller rather than by MongoDB.

IMPORTANT: you are responsible for making sure ALL of your unique indexes
are accounted for before retrying... otherwise an infinite loop will
likely result.
### setManager(*type*, *manager*) *[api]*
Set the manager object corresponding
to a given doc type. Typically `manager`
is a module that subclasses `apostrophe-doc-type-manager`
(or its subclasses `apostrophe-pieces` and `apostrophe-custom-pages`).
### getManaged() *[api]*
Returns an array of all of the doc types that have a registered manager.
### getManager(*type*) *[api]*
Fetch the manager object corresponding to a given
doc type. The manager object provides methods such
as find() specific to that type.

If no manager has been registered, this method will
return null. **All** doc types used in your project must
have a registered manager (hint: all subclasses of
pieces, the `data.global` doc, and page types registered
with `apostrophe-pages` always have one).
### docUnversionedFields(*req*, *doc*, *fields*) *[api]*
Add fields to the list of those unsuitable for
rollback due to knock-on effects, permissions checks,
etc.
### lock(*req*, *id*, *contextId*, *options*, *callback*) *[api]*
Lock the given doc id to a given `contextId`, such
that other calls to `lock` for that doc id will
fail unless they have the same `contextId`. If
`options.force` is true, any existing lock is
overwritten. The `options` argument may be
omitted entirely.

`id` must be truthy. If a doc is new and therefore
has no id yet, you don't need to lock it because
it isn't possible that anyone else knows about it.

If the `conflictResolution` option is set to false
for the docs module, this method invokes its callback
successfully without actually doing anything.
This is *not recommended* but has valid applications
in automated testing.
### verifyLock(*req*, *id*, *contextId*, *callback*) *[api]*
Verifies that a lock obtained with `lock` is
still held by the given context id. If not,
the error is the string `locked` and a second
argument with an internationalized message
is provided also. If the lock was taken
by the same user in another tab or window,
the error is `locked-by-me`.

If the `conflictResolution` option is set to false
for the docs module, this method invokes its callback
successfully without actually doing anything.
This is *not recommended* but has valid applications
in automated testing.
### unlock(*req*, *id*, *contextId*, *callback*) *[api]*
Release a document lock set via `lock` for
a particular contextId.

If the `conflictResolution` option is set to false
for the docs module, this method invokes its callback
successfully without actually doing anything.
This is *not recommended* but has valid applications
in automated testing.
### unlockAll(*req*, *contextId*, *callback*) *[api]*
Release all document locks set on behalf of
the given `contextId`.

If the `conflictResolution` option is set to false
for the docs module, this method invokes its callback
successfully without actually doing anything.
This is *not recommended* but has valid applications
in automated testing.
### pushAssets() *[browser]*

### pushCreateSingleton() *[browser]*

## API Routes
### POST /modules/apostrophe-docs/lock

### POST /modules/apostrophe-docs/verify-lock

### POST /modules/apostrophe-docs/unlock

