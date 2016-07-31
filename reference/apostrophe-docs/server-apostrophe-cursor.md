---
title: "apostrophe-cursor (server)"
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### pageUrl(*value*, *definition*)

### toDistinct(*property*, *callback*)
YIELDERS

These methods deliver docs or other
result values and do not return the cursor
(they are not chainable).
Invokes callback with `(err, results)` where
`results` is an array of all distinct values
for the given `property`
### toObject(*callback*)
Invokes callback with `(err, doc)` where
`doc` is the first document matching the query
### toCount(*callback*)
Invokes callback with `(err, count)` where
`count` is the number of documents matching
the query, ignoring the `page`, `skip` and `limit` filters
### toArray(*callback*)
Invokes callback with `(err, docs)` where
`docs` is an array of documents matching
the query.
### toMongo(*callback*)
Invokes callback with `(err, mongo)` where
`mongo` is a MongoDB self. You can use this
to access MongoDB's `nextObject` method, etc.
If you use it, you should also invoke `after`
for each result (see below).
### clone()
Clones a cursor, creating an independent
clone that can be modified without modifying
the original cursor. This should be called when
querying based on the same criteria multiple
times.
### handleFindArguments()
Protected API of cursors (for extending cursors).
Invoked by afterConstruct to handle the arguments that came
from the find() call responsible for creating this cursor
### set(*key*, *value*)
Filters and any other methods you add should
store their state with this method rather than
by directly modifying `self` or `self.state`
### get(*key*)
Methods you add to cursors should fetch their
state with this method rather than by directly
modifying `self` or `self.state`
### queryToFilters(*query*, *safeFor*)
Apply filters present in a query object (often from req.query), skipping all filters not declared as
safe for the given domain (such as "public" or "manage"). If `safeFor` is not specified or is set
to `manage` we assume any filter that has a launder method is suitable for our use.
### applyFilters(*query*)
Apply the filters present in the query object, without checking for safety or laundering
the data in any way. Use queryToFilters instead for anything coming from the user
### finalize(*callback*)
Applies all defaults and transformations prior
to handing off the query to MongoDB.
### mongoToArray(*mongo*, *callback*)
Implementation detail, subject to
change. You probably wanted toMongo
### after(*results*, *callback*)
Invokes "after" methods of all filters
that have them
### criteria(*value*)
Filters modify the cursor, adding criteria,
setting the projection, setting the sort, etc.
Set the MongoDB criteria. Other criteria are
also applied behind the scenes to ensure users
do not see what they should not see, etc.
### and(*value*)
Require all criteria already specified AND
the criteria object specified by `c` to match
the docs
### projection(*value*)
Set the MongoDB projection
### sort(*value*)
Set the MongoDB sort.

If `false` is explicitly passed, there is
no sort at all (helpful with `$near`).

If this method is never called or `obj` is
undefined, a case-insensitive sort on the title
is the default, unless `search()` has been
called, in which case a sort by search result
quality is the default.
### skip(*value*)
Skip the first n documents. Affects
toArray and toObject.
### limit(*value*)
Limit to n documents. Does not affect toCount().
### perPage(*value*)
You can also paginate docs rather than using
skip and limit directly.

Set the number of docs per page.
### page(*value*)
Set the current page number
### permission(*value*)
Limit the returned docs to those for which the
user associated with the self's `req` has the
named permission.

"edit-doc", "view-doc" and "publish-doc" are
permissions you're likely to want to restrict
results to.

If you are also using the type() filter, then you
may simply pass "edit", "view", "publish", etc. and
the right suffix is automatically added.

If this method is never called, or you pass
`undefined` or `null`, "view-doc" is checked for.

If permissionNameOrFalse is explicitly `false`,
permissions are ignored (use this only for tasks
and special admin functionality).
### autocomplete(*value*)
Limits results to docs which are a good match for
a partial string typed by the user. This is
based on title, keywords and other high-priority
fields, not full text search
### search(*value*)

### tag(*value*)

### tags(*value*)

### trash(*value*)
if flag is `false`, `undefined` or this method is
never called, return only docs not in the trash.

if flag is `true`, return only docs in the trash.

if flag is `null` (not undefined), return
docs regardless of trash status.
### orphan(*value*)
if flag is `null`, `undefined` or this method
is never called, return docs regardless of
orphan status. if flag is `true`, return only
orphan docs. If flag is `false`, return only
docs that are not orphans
### published(*value*)
if flag is `undefined`, `true` or this
method is never called, return only published docs.

If flag is `false`, return only unpublished docs.

If flag is `null`, return docs without regard
to published status.
### explicitOrder(*value*)
Pass an explicit array of _ids. The returned
docs will be in that specific order. If a
doc is not mentioned in the array it will
be discarded from the result. docs that
exist in the array but not in the database are
also absent from the result.

You may optionally specify a property name
other than _id to order the results on.
### type(*value*)
This cursor will only retrieve documents of the
specified type. Filter out everything else, and
run the joins in the schema returned by the type's
manager object unless otherwise specified
(see the "joins" filter).
### joins(*value*)
Perform joins if the 'type' filter is in use and
the type manager has a schema. If joins(false) is
explicitly called no joins are performed. If
joins() is invoked with an array of join names
only those joins and those intermediate to them
are performed (dot notation). See apostrophe-schemas
for more information.
