# apostrophe-browser-utils (browser)

## Methods
### sslIfNeeded(*url*)
If the current page in the browser is https:, make this
URL https: too.
### camelName(*s*)
KEEP IN SYNC WITH SERVER SIDE VERSION IN apostrophe.js

Convert a name to camel case.

Useful in converting CSV with friendly headings into sensible property names.

Only digits and ASCII letters remain.

Anything that isn't a digit or an ASCII letter prompts the next character
to be uppercase. Existing uppercase letters also trigger uppercase, unless
they are the first character; this preserves existing camelCase names.
### cssName(*camel*)
Convert other name formats such as underscore and camelCase to a hyphenated css-style
name.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### eventName()
Create an event name from one or more strings. The original strings can be
CSS names or camelized names, it makes no difference. The end result
is always in a consistent format.

Examples:

apos.eventName('aposChange', 'blog') ---> aposChangeBlog
apos.eventName('aposChangeEvents') ---> aposChangeEvents
apos.eventName('apos-jump-gleefully') ---> aposJumpGleefully

It doesn't matter how many arguments you pass. Each new argument
is treated as a word boundary.

This method is often useful both when triggering and when listening.
No need to remember the correct way to construct an event name.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### generateId()
Widget ids should be valid names for javascript variables, just in case
we find that useful, so avoid hyphens. Prefixed with a `w` so it can
always be distinguished from a cuid that came from the server; if we
start using cuid in the browser we must keep the `w` prefix

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### escapeHtml(*string*)
Escape HTML as plaintext.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### globalReplace(*haystack*, *needle*, *replacement*)
String.replace does NOT do this
Regexps can but they can't be trusted with unicode ):
Keep in sync with server side version

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### padInteger(*i*, *places*)
pad an integer with leading zeroes, creating a string.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### capitalizeFirst(*s*)
Capitalize the first letter of a string.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### slugify(*s*, *options*)
Turn the provided string into a string suitable for use as a slug.
ONE punctuation character normally forbidden in slugs may
optionally be permitted by specifying it via options.allow.
The separator may be changed via options.separator.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### clonePermanent(*o*, *keepScalars*)
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

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### log(*msg*)
Log a message. The default
implementation wraps `console.log` and passes on
all arguments, so substitution strings may be used.

Overrides should be written with support for
substitution strings in mind. See the
`console.log` documentation.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### info(*msg*)
Log an informational message. The default
implementation invokes
`console.info` if available, otherwise
an alias for `apos.utils.log`. Note that
substitution strings may be used.

Overrides should be written with support for
substitution strings in mind. See the
`console.log` documentation.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### error(*msg*)
Log an error message. The default implementation
wraps `console.error` and passes on all arguments,
so substitution strings may be used.

Overrides should be written with support for
substitution strings in mind. See the
`console.log` documentation.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
### warn(*msg*)
Log a warning. The default implementation wraps
`console.warn` and passes on all arguments,
so substitution strings may be used.
If `console.warn` does not exist, falls back
to `apos.utils.error`.

Overrides should be written with support for
substitution strings in mind. See the
`console.log` documentation.

The intention is that `apos.utils.warn` should be
called for situations less dire than
`apos.utils.error`.

NOTE: this method is not available if `lean: true` is active
for `apostrophe-assets` and the user is not logged in.
