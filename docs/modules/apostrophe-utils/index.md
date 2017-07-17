---
title: "apostrophe-utils (module)"
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-context
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.utils`
Methods here should be of short, of universal utility, and not
clearly in the domain of any other module. If you don't wish
it was standard in JavaScript, it probably doesn't belong here.
Many methods are simple wrappers for [lodash](https://npmjs.org/package/lodash) methods.


## Methods
### generateId() *[api]*
generate a unique identifier for a new page or other object.
IDs are generated with the cuid module which prevents
collisions and easy guessing of another's ID.
### globalReplace(*haystack*, *needle*, *replacement*) *[api]*
Globally replace a string with another string.
Regular `String.replace` does NOT offer global replace, except
when using regular expressions, which are great but
problematic when UTF8 characters may be present.
### truncatePlaintext(*str*, *length*, *pruneStr*) *[api]*
Truncate a plaintext string at the specified number of
characters without breaking words if possible, see
underscore.string's prune function, of which this is
a copy (but replacing RegExp with XRegExp for
better UTF-8 support)

### escapeHtml(*s*, *options*) *[api]*
Escape a plaintext string correctly for use in HTML.
If `{ pretty: true }` is in the options object,
newlines become br tags, and URLs become links to
those URLs. Otherwise we just do basic escaping.

If `{ single: true }` is in the options object,
single-quotes are escaped, otherwise double-quotes
are escaped.

For bc, if the second argument is truthy and not an
object, `{ pretty: true }` is assumed.
### htmlToPlaintext(*html*) *[api]*
Convert HTML to true plaintext, with all entities decoded.
### capitalizeFirst(*s*) *[api]*
Capitalize the first letter of a string.
### cssName(*camel*) *[api]*
Convert other name formats such as underscore and camelCase to a hyphenated css-style
name.
### camelName(*s*) *[api]*
Convert a name to camel case.

Useful in converting CSV with friendly headings into sensible property names.

Only digits and ASCII letters remain.

Anything that isn't a digit or an ASCII letter prompts the next character
to be uppercase. Existing uppercase letters also trigger uppercase, unless
they are the first character; this preserves existing camelCase names.
### addSlashIfNeeded(*path*) *[api]*
Add a slash to a path, but only if it does not already end in a slash.
### md5(*s*) *[api]*
Perform an md5 checksum on a string. Returns hex string.
### md5File(*filename*, *callback*) *[api]*
perform an md5 checksum on a file. Delivers `null`, `hexString` to callback.
### slugify(*s*, *options*) *[api]*
Turn the provided string into a string suitable for use as a slug.
ONE punctuation character normally forbidden in slugs may
optionally be permitted by specifying it via options.allow.
The separator may be changed via options.separator.
### sortify(*s*) *[api]*
Returns a string that, when used for indexes, behaves
similarly to MySQL's default behavior for sorting, plus a little
extra tolerance of punctuation and whitespace differences. This is
in contrast to MongoDB's default "absolute match with same case only"
behavior which is no good for most practical purposes involving text.

The use of this method to create sortable properties like
"titleSortified" is encouraged. It should not be used for full text
search, as MongoDB full text search is now available (see the
"search" option to apos.get and everything layered on top of it).
It is however used as part of our "autocomplete" search implementation.
### searchify(*q*, *prefix*) *[api]*
Turns a user-entered search query into a regular expression.
If the string contains multiple words, at least one space is
required between them in matching documents, but additional words
may also be skipped between them, up to a reasonable limit to
preserve performance and avoid useless strings.

Although we now have MongoDB full text search this is still
a highly useful method, for instance to locate autocomplete
candidates via highSearchWords.

If the prefix flag is true the search matches only at the start.
### clonePermanent(*o*, *keepScalars*) *[api]*
Clone the given object recursively, discarding all
properties whose names begin with `_` except
for `_id`. Returns the clone.

This removes the output of joins and
other dynamic loaders, so that dynamically available
content is not stored redundantly in MongoDB.

If the object is an array, the clone is also an array.

Date objects are cloned as such. All other non-JSON
objects are cloned as plain JSON objects.

If `keepScalars` is true, properties beginning with `_`
are kept as long as they are not objects. This is useful
when using `clonePermanent` to limit JSON inserted into
browser attributes, rather than filtering for the database.
Preserving simple string properties like `._url` is usually
a good thing in the former case.

Arrays are cloned as such only if they are true arrays
(Array.isArray returns true). Otherwise all objects with
a length property would be treated as arrays, which is
an unrealistic restriction on apostrophe doc schemas.
### orderById(*ids*, *items*, *idProperty*) *[api]*
`ids` should be an array of mongodb IDs. The elements of the `items` array, which
should be the result of a mongodb query, are returned in the order specified by `ids`.
This is useful after performing an `$in` query with MongoDB (note that `$in` does NOT sort its
strings in the order given).

Any IDs that do not actually exist for an item in the `items` array are not returned,
and vice versa. You should not assume the result will have the same length as
either array.

Optionally you may specify a property name other than _id as the third argument.
You may use dot notation in this argument.
### isAjaxRequest(*req*) *[api]*
Return true if `req` is an AJAX request (`req.xhr` is set, or
`req.query.xhr` is set to emulate it, or `req.query.apos_refresh` has
been set by Apostrophe's content refresh mechanism).
### bless(*req*, *options *, *, arg2, arg3...*) *[api]*
Store a "blessing" in the session for the given set of arguments
(everything after `req`).

Example:

DURING PAGE RENDERING OR OTHER TRUSTED RENDERING OPERATION

`apos.utils.bless(req, options, 'widget', widget.type)`

ON A LATER AJAX REQUEST TO THE render-widget ROUTE

`if (apos.utils.isBlessed(req, options, 'widget', widget.type)) { /* It's safe! */ }`

This way we know this set of options was legitimately part of a recent page rendering
and therefore is safe to reuse to re-render a widget that is being edited.
### isBlessed(*req*, *options *, *, arg2, arg3...*) *[api]*
See apos.utils.bless. Checks whether the given set of arguments
(everything after `req`) has been blessed in the current session.
### hashBlessing(*args*) *[api]*
See `self.bless` and `self.isBlessed`. Creates a unique hash for a given
set of arguments. Arguments must be JSON-friendly.
### insensitiveSort(*strings*) *[api]*
Sort the given array of strings in place, comparing strings in a case-insensitive way.
### insensitiveSortByProperty(*objects*, *property*) *[api]*
Sort the given array of objects in place, based on the value of the given property of each object,
in a case-insensitive way.
### insensitiveSortCompare(*a*, *b*) *[api]*
Copmpare two strings in a case-insensitive way, returning -1, 0 or 1, suitable for use with sort().
### modulesReady()
Add these after we're sure the templates module
is ready. Only necessary because this module is
initialized first
## Nunjucks template helpers
### slugify(*string*, *options*)
Turn the provided string into a string suitable for use as a slug.
ONE punctuation character normally forbidden in slugs may
optionally be permitted by specifying it via options.allow.
The separator may be changed via options.separator.
### log(*m*)
Log a message to the console from a Nunjucks template. Great for debugging.
### generateId()
Generate a globally unique ID
### isCurrentYear(*date*)
Test whether the specified date object refers to a date in the current year.
The events module utilizes this
### isUndefined(*o*)
check if something is properly undefined
### isFalse(*o*)
check if something is strictly equal to false
### startCase(*o*)
Convert string to start case (make default labels out of camelCase property names)
### isFunction(*o*)
check if something is a function (as opposd to property)
### eqStrict(*a*, *b*)
make up for lack of triple equals
### contains(*list*, *value*)
Returns true if the list contains the specified value.
If value is an array, returns true if the list contains
*any of* the specified values
### containsProperty(*list*, *property*)
Returns true if the list contains at least one
object with the named property.
The first parameter may also be a single object, in
which case this function returns true if that object
has the named property.
### reverse(*array*)
Reverses the order of the array. This MODIFIES the array
in addition to returning it
### beginsWith(*list*, *value*)
If the `list` argument is a string, returns true if it begins
with `value`. If the `list` argument is an array, returns
true if at least one of its elements begins with `value`.
### merge()
Pass as many objects as you want; they will get merged via
`_.merge` into a new object, without modifying any of them, and
the resulting object will be returned. If several objects have
a property, the last object wins.

This is useful to add one more option to an options object
which was passed to you.

If any argument is null, it is skipped gracefully. This allows
you to pass in an options object without checking if it is null.
### find(*arr*, *property*, *value*)
Find the first array element, if any, that has the specified value for
the specified property.
### indexBy(*arr*, *propertyName*)
If propertyName is _id, then the keys in the returned
object will be the ids of each object in arr,
and the values will be the corresponding objects.
You may index by any property name.
### filter(*arr*, *property*, *value*)
Find all the array elements, if any, that have the specified value for
the specified property.
### reject(*arr*, *property*, *value*)
Reject array elements that have the specified value for
the specified property.
### filterNonempty(*arr*, *property*)
Find all the array elements, if any, for which the specified property
is truthy.
### filterEmpty(*arr*, *property*)
Find all the array elements, if any, for which the specified property
is not truthy.
### isEmpty(*item*)
Returns true if the specified array or object is considered empty.
Objects are empty if they have no own enumerable properties.
Arrays are considered empty if they have a length of 0.
### pluck(*arr*, *property*)
Given an array of objects with the given property, return an array with
the value of that property for each object.
### omit(*object*, *property *, *, property...*)
Given an object, return an object without
the named properties or array of named
properties (see _.omit()).
### concat(*arrOrObj1*, *arrOrObj2 *, *, ...*)
Concatenate all of the given arrays and/or values
into a single array. If an argument is an array, all
of its elements are individually added to the
resulting array. If an argument is a value, it is
added directly to the array.
### groupBy(*items*, *key*)
Groups by the property named by 'key' on each of the values.
If the property referred to by the string 'key' is found to be
an array property of the first object, apos.utils.groupByArray is called.

Usage: {{ apos.utils.groupBy(people, 'age') }} or {{ apos.utils.groupBy(items, 'tags') }}
### object(*key, value, ...*)
Given a series of alternating keys and values, this
function returns an object with those values for
those keys. For instance, apos.utils.object('name', 'bob')
returns { name: 'bob' }. This is useful because
Nunjucks does not allow you to create an object with
a property whose name is unknown at the time the
template is written.
### merge()

