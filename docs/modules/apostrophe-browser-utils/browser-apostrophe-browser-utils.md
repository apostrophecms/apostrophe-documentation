---
title: "apostrophe-browser-utils (browser)"
layout: reference
namespace: browser
---

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
Convert everything else to a hyphenated css name. Not especially fast,
hopefully you only do this during initialization and remember the result
KEEP IN SYNC WITH SERVER SIDE VERSION in apostrophe.js
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
### generateId()
Widget ids should be valid names for javascript variables, just in case
we find that useful, so avoid hyphens
### escapeHtml(*string*)

### globalReplace(*haystack*, *needle*, *replacement*)
String.replace does NOT do this
Regexps can but they can't be trusted with unicode ):
Keep in sync with server side version
### padInteger(*i*, *places*)
pad an integer with leading zeroes, creating a string
### capitalizeFirst(*s*)

### slugify(*s*, *options*)
Turn the provided string into a string suitable for use as a slug.
ONE punctuation character normally forbidden in slugs may
optionally be permitted by specifying it via options.allow.
The separator may be changed via options.separator.
### clonePermanent(*o*, *keepScalars*)
Clone the given object recursively, discarding all
properties whose names begin with `_` except
for `_id`. Returns the clone.

This removes the output of joins and
other dynamic loaders, so that dynamically available
related content is not considered when comparing the
equality of two objects with _.isEq later.

If the object is an array, the clone is also an array.

Date objects are cloned as such. All other non-JSON
objects are cloned as plain JSON objects.

If `keepScalars` is true, properties beginning with `_`
are kept as long as they are not objects.
