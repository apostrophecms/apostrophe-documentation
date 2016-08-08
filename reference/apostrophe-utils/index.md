---
title: "apostrophe-utils (module)"
children:
  - browser-apostrophe-context
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
Methods here should be of short, of universal utility, and not
clearly in the domain of any other module. If you don't wish
it was standard in JavaScript, it probably doesn't belong here.


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

### escapeHtml(*s*, *options*) *[api]*
Escape a plaintext string correctly for use in HTML.
If { pretty: true } is in the options object,
newlines become br tags, and URLs become links to
those URLs. Otherwise we just do basic escaping.

If { single: true } is in the options object,
single-quotes are escaped, otherwise double-quotes
are escaped.

For bc, if the second argument is truthy and not an
object, { pretty: true } is assumed.
### htmlToPlaintext(*html*) *[api]*
Convert HTML to true plaintext, with all entities decoded
### capitalizeFirst(*s*) *[api]*

### cssName(*camel*) *[api]*
Convert other name formats such as underscore and camelCase to a hyphenated css-style
name. KEEP IN SYNC WITH BROWSER SIDE VERSION
### camelName(*s*) *[api]*
Convert a name to camel case.

Useful in converting CSV with friendly headings into sensible property names.

Only digits and ASCII letters remain.

Anything that isn't a digit or an ASCII letter prompts the next character
to be uppercase. Existing uppercase letters also trigger uppercase, unless
they are the first character; this preserves existing camelCase names.
### addSlashIfNeeded(*path*) *[api]*
Add a slash to a path, but only if it does not already end in a slash
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
preserve performance and avoid useless results.

Although we now have MongoDB full text search this is still
a highly useful method, for instance to locate autocomplete
candidates via highSearchWords.

If the prefix flag is true the search matches only at the start.
### clonePermanent(*o*) *[api]*
Clone the given object recursively, discarding all
properties whose names begin with `_` except
for `_id`. Returns the clone.

This removes the output of joins and
other dynamic loaders, so that dynamically available
content is not stored redundantly in MongoDB.

If the object is an array, the clone is also an array.

Date objects are cloned as such. All other non-JSON
objects are cloned as plain JSON objects.
### orderById(*ids*, *items*, *idProperty*) *[api]*
`ids` should be an array of mongodb IDs. The elements of the `items` array, which
should be the result of a mongodb query, are returned in the order specified by `ids`.
This is useful after performing an `$in` query with MongoDB (note that `$in` does NOT sort its
results in the order given).

Any IDs that do not actually exist for an item in the `items` array are not returned,
and vice versa. You should not assume the result will have the same length as
either array.

Optionally you may specify a property name other than _id as the third argument.
You may use dot notation in this argument.
### isAjaxRequest(*req*) *[api]*

### bless(*req*, *options *, *, arg2, arg3...*) *[api]*
Example:

DURING PAGE RENDERING OR OTHER TRUSTED RENDERING OPERATION

apos.utils.bless(req, options, 'widget', widget.type)

ON A LATER AJAX REQUEST TO THE render-widget ROUTE

if (apos.utils.isBlessed(req, options, 'widget', widget.type)) { /* It's safe! */ }

This way we know this set of options was legitimately part of a recent page rendering
and therefore is safe to reuse to re-render a widget that is being edited.
### isBlessed(*req*, *options *, *, arg2, arg3...*) *[api]*
See apos.utils.bless
### hashBlessing(*args*) *[api]*

### modulesReady()
Add these after we're sure the templates module
is ready. Only necessary because this module is
initialized first
