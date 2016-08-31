---
title: "apostrophe-cursor (server)"
---
An `apostrophe-cursor` allows you to conveniently fetch docs from
the `aposDocs` mongodb collection using chainable filters, much
like a MongoDB or Doctrine cursor.

Usually you'll be working with a subclass of `apostrophe-cursor`
appropriate to a particular type of piece or page. Each subclass
typically adds new filters. Some modules also add filters to the
main `apostrophe-cursor` class that are useful with all types
of docs, like the `areas` filter that calls loaders for
the widgets in Apostrophe areas.

Normally you get a cursor object by calling the `find()` method of
the module associated with the piece type or page type you are
interested in. If you are interested in all docs, call the
`find()` method of the `apostrophe-docs` module (`apos.docs.find`).
If you are interested in all pages (docs that are part of the
page tree), call the `find()` method of the `apostrophe-pages`
module (`apos.pages.find`).

All of these `find()` methods take `req` as the first argument
in order to check permissions.

Examples:

Let's fetch all docs with an `age` property >= 30 that are published...

```
return apos.docs.find(req).
  and({ age: { $gte: 30 } }).
  published(true).
  toArray(function(err, docs) { ... });
```

Let's get the 10 most recent blog posts (assumes the
`apostrophe-blog` module is in use)

```
return apos.docs.getManager('apostrophe-blog').
  find().
  limit(10).
  toArray(function(err, blogPosts) { ... })
```

If a filter provides a `launder` function and sets its
`safeFor` property to `public`, then it is called
automatically if a query parameter matching its name is seen
on an `apostrophe-pieces-pages` page, such as a blog. In many
cases this is the main motivation for adding a filter.


## Methods
### areas(*value*)
The areas filter calls the `load` methods of the
widget type managers for widgets in areas. By default
this does occur. With `.areas(false)` you can
shut it off for a particular cursor. With
.areas([ 'thumbnail' ]) you can load just that
one area for all pages matching the query.
### addFilter(*name*, *definition*)
Add a new filter method to this cursor.

`name` is the filter method name. `definition` is an
object which can  have `set`, `finalize` and `after`
functions and a default value, `def`. You provide
this functionality and Apostrophe builds the
actual chainable method for you.

A filter may also have a `launder` function. If present
it is expected to clean up data passed by an end user and
return the cleaned-up value. It must not trust the data
in any way (hint: use `self.apos.launder.string`, etc).
If you also set `safeFor: 'public'`, the filter then becomes
available as a query string parameter in `apostrophe-pieces-pages`
and other modules that invoke `queryToFilters`.

`set` defaults to a simple `self.set` call
to store its single argument for retrieval
by `self.get('nameOfFilter')`. `finalize` defaults
to doing nothing. Usually your finalizer
modifies the criteria in some way, most often
by calling the `self.and(obj)` filter to
add new conditions to the criteria built
up so far.

Your finalizer must be idempotent — That is,
it must not be harmful to invoke it twice.
If it is harmful, just use self.set to
undefine your state so your code doesn't
run twice.

If the filter has still not been called at
finalization time, the filter is called
with `def` before the finalizer is invoked.

`finalize` may optionally take a callback.
So can `after`.

If `finalize` returns the string `refinalize`
or delivers that string to its callback, the
entire series of finalizers is invoked
again. This is useful if you wish to simplify
the query and be assured that all of the other
finalizers will see your modification.
### toDistinct(*property*, *callback*)
Invokes callback with `(err, results)` where
`results` is an array of all distinct values
for the given `property`. Not chainable.
### toObject(*callback*)
Invokes callback with `(err, doc)` where
`doc` is the first document matching the query.
Not chainable.
### toCount(*callback*)
Invokes callback with `(err, count)` where
`count` is the number of documents matching
the query, ignoring the `page`, `skip` and `limit` filters.

If the `perPage` filter is set, `totalPages` is
made available via `cursor.get('totalPages')`.

Not chainable.
### toArray(*callback*)
Invokes callback with `(err, docs)` where
`docs` is an array of documents matching
the query. Not chainable.
### toMongo(*callback*)
Invokes callback with `(err, mongo)` where
`mongo` is a MongoDB self. You can use this
to access MongoDB's `nextObject` method, etc.
If you use it, you should also invoke `after`
for each result (see below). Generally you should
use `toObject`, `toArray`, etc. but for some
low-level operations this may be desirable. Not chainable.
### clone()
Clones a cursor, creating an independent
clone that can be modified without modifying
the original cursor. This should be called when
querying based on the same criteria multiple
times. Returns the new cursor.
### handleFindArguments()
Invoked by afterConstruct to handle the arguments that came
from the find() call responsible for creating this cursor.
### set(*key*, *value*)
Filters and any other methods you add should
store their state with this method rather than
by directly modifying `self` or `self.state`. The
default implementation of the `set` function for
each cursor just calls this with the cursor's name
and first argument.
### get(*key*)
Filters you add to cursors should fetch their
state with this method rather than by directly
modifying `self` or `self.state`. By default the
first argument to the filter is stored under
the filter's name.
### queryToFilters(*query*, *safeFor*)
Apply filters present in a query object (often from req.query), skipping all
filters not declared as safe for the given domain (such as "public" or "manage").
Filters declaring themselves as safe must implement a `launder` function to
clean up the data. Never trust a browser.

If `safeFor` is not specified or is set to `manage`, we assume any filter that
has a launder method is suitable for our use.
### applyFilters(*obj*)
Apply the named filters present in the given object, WITHOUT checking for safety or
laundering the data in any way. ALWAYS use `queryToFilters` instead for anything
coming directly from the user.
### finalize(*callback*)
Applies all defaults and transformations prior
to handing off the query to MongoDB. This is where
most filters add criteria, and it is where tricky filters
like `autocomplete` make database queries.
### mongoToArray(*mongo*, *callback*)
An implementation detail of `toArray`, subject to
change. You probably wanted toMongo.
### after(*results*, *callback*)
Invokes "after" methods of all filters
that have them. Invoked for you by `toArray`.
### criteria(*value*)
Filter. Sets the MongoDB criteria, discarding
criteria previously added using this
method or the `and` method. For this reason,
`and` is a more common choice. You can also
pass a criteria object as the second argument
to any `find` method.
### and(*value*)
Filter. Requires all criteria already specified AND
the criteria object specified by `c` to match
the docs.
### projection(*value*)
Filter. Sets the MongoDB projection. You can also
set the projection as the third argument to any
`find` method.
### sort(*value*)
Filter. Sets the MongoDB sort, with some extra features.

If `false` is explicitly passed, there is
*no sort at all* (helpful with `$near`).

If this method is never called or `obj` is
undefined, a case-insensitive sort on the title
is the default, unless `search()` has been
called, in which case a sort by search result
quality is the default.

If you sort on a field that is defined in the
schema for the specific doc type you are finding,
and that field has the `sortify: true` option in
its schema field definition, then this filter will
automatically substitute a "sortified" version of
the field that is case-insensitive, ignores
extra whitespace and punctuation, etc. for a
more natural sort than MongoDB normally provides.

For instance, `title` has `sortify: true` for all
doc types, so you always get the more natural sort.
### skip(*value*)
Filter. Skip the first n documents. Affects
`toArray` and `toObject`. Does not affect
`toDistinct` or `toMongo`.
### limit(*value*)
Filter. Limit to n documents. Affects `toArray` only.
### perPage(*value*)
Filter. Allows you to paginate docs rather than using
skip and limit directly.

Sets the number of docs per page and enables the
use of the `page` filter to indicate the current page.

Used by `apostrophe-pieces` and `apostrophe-pieces-pages`.
### page(*value*)
Filter. Sets the current page number. You must also
use `perPage`.

Used by `apostrophe-pieces` and `apostrophe-pieces-pages`.
### permission(*value*)
Filter limit the returned docs to those for which the
user associated with the cursor's `req` has the
named permission. By default, `view-doc` is
checked for.

`edit`, `view` and `publish` are the
permissions you're likely to want to restrict
results to.

USE WITH CARE: If you pass `false`, permissions checks are disabled.

If this method is never called, or you pass
`undefined` or `null`, `view` is checked for.

The permission name is suffixed for you
with a specific doc type name if the type filter
has been called, however for database queries
this normally makes no difference unless the permissions
module has been extended.

In all cases, all of the returned docs are marked
with `_edit: true` and/or `_publish: true` properties
if the user associated with the request is allowed to
do those things. This is useful if you are fetching
docs for viewing but also want to know which ones
can be edited.
### autocomplete(*value*)
Filter. Limits results to docs which are a good match for
a partial string typed by the user. Appropriate words must
exist in the title, tags or other text schema fields of
the doc (autocomplete is not full text body search). Those words
are then fed back into the `search` filter to prioritize the results.
### search(*value*)
Filter. Limits results to those that match the given search.
Search is implemented using MongoDB's `$text` operator and a full
text index.

If this filter is set, the `sort` filter will default to sorting
by search quality. This is important because the worst of the
full-text search matches will be of very poor quality.
### tag(*value*)
Filter. Limits results to those which include the specified
tag in their `tags` property.
### tags(*value*)
Filter. Limits results to those which include at least one
of the specified array of tags in their tags property.
### trash(*value*)
Filter. if flag is `false`, `undefined` or this method is
never called, return only docs not in the trash. This is
the default behavior.

if flag is `true`, return only docs in the trash.

if flag is `null` (not undefined), return
docs regardless of trash status.
### published(*value*)
Filter. If flag is `undefined`, `true` or this
method is never called, return only published docs.

If flag is `false`, return only unpublished docs.

If flag is `null`, return docs without regard
to published status.

Regardless of this filter the user's permissions are
always taken into account. For instance, a logged-out user will never
see unpublished documents unless `permissions(false)` is called.
### explicitOrder(*value*)
Filter. Pass an array of `_id` values. The returned
docs will be in that specific order. If a
doc is not mentioned in the array it will
be discarded from the result. Docs that
exist in the array but not in the database are
also absent from the result.

You may optionally specify a property name
other than `_id` to order the results on as a
second argument.
### type(*value*)
Filter. This cursor will only retrieve documents of the
specified type. Filters out everything else.

Generally you don't want to call this filter directly.
Call the `find()` method of the doc type manager
for the type you are interested in. This will also
give you a cursor of the right subclass.
### joins(*value*)
Filter. Performs joins by default, for all types retrieved,
based on the schema for each type. If `joins(false)` is
explicitly called no joins are performed. If
`joins()` is invoked with an array of join names
only those joins and those intermediate to them
are performed (dot notation). See `apostrophe-schemas`
for more information.

TODO: identify joins with identical definitions in
each schema and pass those "intersection" schemas to
self.apos.schemas.join just once, for performance.
### addUrls(*value*)
Invokes the `addUrls` method of all doc type managers
with relevant docs among the results, if they have one.

The method receives `(req, docs, callback)`. All of the docs will be of
the appropriate type for that manager.

The `addUrls` method should add the `._url` property to each doc,
if possible.

If it is not possible (there is no corresponding pieces-page)
it may be left unset.

Defaults to `true`. If set to false, `addUrls` methods are
not invoked.
### pageUrl(*value*)
Filter. All docs that are part of the page tree (they have a slug
beginning with a `/`) receive a `._url` property, which takes the
sitewide prefix into account if necessary. Always use this property.
Never use the slug as a URL.

This filter is turned on by default.

Note that many type-specific cursors, such as those for `pieces`,
also add a `._url` property appropriate to type if a suitable
pieces page is available.
