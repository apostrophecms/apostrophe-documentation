---
title: "apostrophe-docs (module)"
children:
  - server-apostrophe-cursor
  - browser-apostrophe-docs
  - browser-apostrophe-docs-chooser
  - browser-apostrophe-docs-manager
  - browser-apostrophe-docs-relationship-editor
  - browser-apostrophe-docs-manager-modal
  - browser-apostrophe-docs-editor-modal
  - browser-apostrophe-docs-create-modal
  - browser-apostrophe-docs-chooser-modal
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### pushAssets(*callback*) *[browser]*

### pushCreateSingleton(*callback*) *[browser]*

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
### insert(*req*, *doc*, *callback*) *[api]*
Insert the given document. If the slug is not
unique it is made unique. docBeforeInsert,
docBeforeSave, docAfterInsert
and docAfterSave are called on all modules.
On success the callback is invoked with
(null, doc).

If the slug property is not set, the title
property is converted to a slug. If neither
property is set, an error occurs.

The `edit-doc` permission is checked for the
general case. `beforeInsertDoc` methods can
be used to enforce other restrictions.

If a unique key error occurs,
apos.*.docFixUniqueError is called with the
document. Modify the document to fix any
properties that may need to be more unique
due to a unique index you have added. It is
not possible to know which property was
responsible. This method takes care of
the slug property directly.
### update(*req*, *doc*, *callback*) *[api]*
Update a single document.

The second argument must be the document itself.
$set, $inc, etc. are NOT available via
this interface. This simplifies the implementation
of permissions and workflow. If you need to
update an object, find it first and then update it.

docBeforeSave, docBeforeUpdate,
docAfterSave and docAfterUpdate are invoked on
all modules.

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
### trash(*req*, *idOrCriteria*, *callback*) *[api]*
Trash a single document. The second
argument may be either an _id, or a MongoDB
criteria object. If more than one document
matches the criteria only one will be
updated. You must have permission to
edit the document.

docBeforeTrash and docAfterTrash
are invoked on all modules.
### trashBody(*req*, *doc*, *callback*) *[api]*

### rescue(*req*, *idOrCriteria*, *callback*) *[api]*
Rescue the document matching the specified
criteria from the trash. Only one document
is rescued regardless of the criteria.
You must have permission to edit it.

docBeforeRescue and docAfterRescue are
invoked on all modules.
### emptyTrash(*req*, *idOrCriteria*, *callback*) *[api]*
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
optional callback.
### docBeforeInsert(*req*, *doc*) *[api]*
Invoked before any doc is inserted. Checks
that the user has general permission to
create docs, generates an _id if needed,
and sets createdAt to the current Date.
Note that methods of this name are invoked
on ALL modules that have them, starting with
this one. Although this method takes no
callback, other implementations MAY
take a callback and are invoked in series.
### docBeforeSave(*req*, *doc*) *[api]*
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
### docBeforeUpdate(*req*, *doc*) *[api]*
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
### updateBody(*req*, *doc*, *callback*) *[api]*
Do not call this yourself, it is called
by .update. You may override this method
to change the implementation.
### rescueBody(*req*, *doc*, *callback*) *[api]*
Move the given document to the trash. You
should call .rescue(), not this method. However
you can override this method to alter the
implementation.
### insertBody(*req*, *doc*, *callback*) *[api]*
Insert the given document. You
should call .insert(), not this method. However
you can override this method to alter the
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
to a given doc type. However it is usually easier
to call getManager(type) and modify that object.
### getManager(*type*) *[api]*
Fetch the manager object corresponding to a given
doc type. The manager object provides services such
as find(). By default a manager object is created
for you. That object can be modified to extend the
functionality for a particular type, or you can call
setManager if you have created one from scratch.
See manager.js for the default manager's feature set.
### autocomplete(*req*, *query*, *callback*) *[api]*
This method provides the back end of /autocomplete routes.
For the implementation of the autocomplete() filter see autocomplete.js.

"query" must contain a "field" property which is the schema join field
that describes the relationship we're adding items to.

"query" must also contain a "term" property, which is a partial
string to be autocompleted; otherwise an empty array is delivered
to the callback.

We don't launder the input here, see the 'autocomplete' route.
### docUnversionedFields(*req*, *doc*, *fields*) *[api]*
Add fields to the list of those unsuitable for
rollback due to knock-on effects, permissions checks,
etc.
## API Routes
### POST /modules/apostrophe-docs/chooser

### POST /modules/apostrophe-docs/chooser-choices

### POST /modules/apostrophe-docs/relationship-editor

### POST /modules/apostrophe-docs/autocomplete

