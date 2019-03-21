---
title: apostrophe-utils (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-context
---

# index

## Inherits from: [apostrophe-module](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-module/index.html)

### `apos.utils`

Methods here should be of short, of universal utility, and not clearly in the domain of any other module. If you don't wish it was standard in JavaScript, it probably doesn't belong here. Many methods are simple wrappers for [lodash](https://npmjs.org/package/lodash) methods.

## Options

### `logger`

A function which accepts `apos` and returns an object with at least `info`, `debug`, `warn` and `error` methods. These methods should support placeholders \(see `util.format`\). If this option is not supplied, logs are simply written to the Node.js `console`. A `log` method may also be supplied; if it is not, `info` is called in its place. Calls to `apos.utils.log`, `apos.utils.error`, etc. are routed through this object by Apostrophe. This provides compatibility out of the box with many popular logging modules, including `winston`.

## Methods

### generateId\(\) _\[api\]_

generate a unique identifier for a new page or other object. IDs are generated with the cuid module which prevents collisions and easy guessing of another's ID.

### globalReplace\(_haystack_, _needle_, _replacement_\) _\[api\]_

Globally replace a string with another string. Regular `String.replace` does NOT offer global replace, except when using regular expressions, which are great but problematic when UTF8 characters may be present.

### truncatePlaintext\(_str_, _length_, _pruneStr_\) _\[api\]_

Truncate a plaintext string at the specified number of characters without breaking words if possible, see underscore.string's prune function, of which this is a copy \(but replacing RegExp with XRegExp for better UTF-8 support\)

### escapeHtml\(_s_, _options_\) _\[api\]_

Escape a plaintext string correctly for use in HTML. If `{ pretty: true }` is in the options object, newlines become br tags, and URLs become links to those URLs. Otherwise we just do basic escaping.

If `{ single: true }` is in the options object, single-quotes are escaped, otherwise double-quotes are escaped.

For bc, if the second argument is truthy and not an object, `{ pretty: true }` is assumed.

### htmlToPlaintext\(_html_\) _\[api\]_

Convert HTML to true plaintext, with all entities decoded.

### capitalizeFirst\(_s_\) _\[api\]_

Capitalize the first letter of a string.

### cssName\(_camel_\) _\[api\]_

Convert other name formats such as underscore and camelCase to a hyphenated css-style name.

### camelName\(_s_\) _\[api\]_

Convert a name to camel case.

Useful in converting CSV with friendly headings into sensible property names.

Only digits and ASCII letters remain.

Anything that isn't a digit or an ASCII letter prompts the next character to be uppercase. Existing uppercase letters also trigger uppercase, unless they are the first character; this preserves existing camelCase names.

### addSlashIfNeeded\(_path_\) _\[api\]_

Add a slash to a path, but only if it does not already end in a slash.

### md5\(_s_\) _\[api\]_

Perform an md5 checksum on a string. Returns hex string.

### md5File\(_filename_, _callback_\) _\[api\]_

perform an md5 checksum on a file. Delivers `null`, `hexString` to callback.

### fileLength\(_filename_, _callback_\) _\[api\]_

Get file size in bytes. On success, delivers `(null, integer)` to callback.

### slugify\(_s_, _options_\) _\[api\]_

Turn the provided string into a string suitable for use as a slug. ONE punctuation character normally forbidden in slugs may optionally be permitted by specifying it via options.allow. The separator may be changed via options.separator.

### sortify\(_s_\) _\[api\]_

Returns a string that, when used for indexes, behaves similarly to MySQL's default behavior for sorting, plus a little extra tolerance of punctuation and whitespace differences. This is in contrast to MongoDB's default "absolute match with same case only" behavior which is no good for most practical purposes involving text.

The use of this method to create sortable properties like "titleSortified" is encouraged. It should not be used for full text search, as MongoDB full text search is now available \(see the "search" option to apos.get and everything layered on top of it\). It is however used as part of our "autocomplete" search implementation.

### searchify\(_q_, _prefix_\) _\[api\]_

Turns a user-entered search query into a regular expression. If the string contains multiple words, at least one space is required between them in matching documents, but additional words may also be skipped between them, up to a reasonable limit to preserve performance and avoid useless strings.

Although we now have MongoDB full text search this is still a highly useful method, for instance to locate autocomplete candidates via highSearchWords.

If the prefix flag is true the search matches only at the start.

### clonePermanent\(_o_, _keepScalars_\) _\[api\]_

Clone the given object recursively, discarding all properties whose names begin with `_` except for `_id`. Returns the clone.

This removes the output of joins and other dynamic loaders, so that dynamically available content is not stored redundantly in MongoDB.

If the object is an array, the clone is also an array.

Date objects are cloned as such. All other non-JSON objects are cloned as plain JSON objects.

If `keepScalars` is true, properties beginning with `_` are kept as long as they are not objects. This is useful when using `clonePermanent` to limit JSON inserted into browser attributes, rather than filtering for the database. Preserving simple string properties like `._url` is usually a good thing in the former case.

Arrays are cloned as such only if they are true arrays \(Array.isArray returns true\). Otherwise all objects with a length property would be treated as arrays, which is an unrealistic restriction on apostrophe doc schemas.

### orderById\(_ids_, _items_, _idProperty_\) _\[api\]_

`ids` should be an array of mongodb IDs. The elements of the `items` array, which should be the result of a mongodb query, are returned in the order specified by `ids`. This is useful after performing an `$in` query with MongoDB \(note that `$in` does NOT sort its strings in the order given\).

Any IDs that do not actually exist for an item in the `items` array are not returned, and vice versa. You should not assume the result will have the same length as either array.

Optionally you may specify a property name other than \_id as the third argument. You may use dot notation in this argument.

### isAjaxRequest\(_req_\) _\[api\]_

Return true if `req` is an AJAX request \(`req.xhr` is set, or `req.query.xhr` is set to emulate it, or `req.query.apos_refresh` has been set by Apostrophe's content refresh mechanism\).

### bless\(_req_, _options_ , _, arg2, arg3..._\) _\[api\]_

Store a "blessing" in the session for the given set of arguments \(everything after `req`\).

Example:

DURING PAGE RENDERING OR OTHER TRUSTED RENDERING OPERATION

`apos.utils.bless(req, options, 'widget', widget.type)`

ON A LATER AJAX REQUEST TO THE render-widget ROUTE

`if (apos.utils.isBlessed(req, options, 'widget', widget.type)) { /* It's safe! */ }`

This way we know this set of options was legitimately part of a recent page rendering and therefore is safe to reuse to re-render a widget that is being edited.

### isBlessed\(_req_, _options_ , _, arg2, arg3..._\) _\[api\]_

See apos.utils.bless. Checks whether the given set of arguments \(everything after `req`\) has been blessed in the current session.

### hashBlessing\(_args_\) _\[api\]_

See `self.bless` and `self.isBlessed`. Creates a unique hash for a given set of arguments. Arguments must be JSON-friendly.

### insensitiveSort\(_strings_\) _\[api\]_

Sort the given array of strings in place, comparing strings in a case-insensitive way.

### insensitiveSortByProperty\(_objects_, _property_\) _\[api\]_

Sort the given array of objects in place, based on the value of the given property of each object, in a case-insensitive way.

### insensitiveSortCompare\(_a_, _b_\) _\[api\]_

Copmpare two strings in a case-insensitive way, returning -1, 0 or 1, suitable for use with sort\(\). If the two strings represent numbers, compare them as numbers for a natural sort order when comparing strings like '4' and '10'.

### findNestedObjectById\(_object_, _id_\) _\[api\]_

Within the given object \(typically a doc or widget\), find a subobject with the given `_id` property. Can be nested at any depth.

Useful to locate a specific widget within a doc.

### findNestedObjectAndDotPathById\(_object_, _id_, _\_dotPath_\) _\[api\]_

Within the given object \(typically a doc or widget\), find a subobject with the given `_id` property. Can be nested at any depth.

Useful to locate a specific widget within a doc.

Returns an object like this: `{ object: { ... }, dotPath: 'dot.path.of.object' }`

Ignore the `_dotPath` argument to this method; it is used for recursion.

### enableLogger\(\) _\[api\]_

### log\(_msg_\) _\[api\]_

Log a message. The default implementation wraps `console.log` and passes on all arguments, so substitution strings may be used.

Overrides should be written with support for substitution strings in mind. See the `console.log` documentation.

If the logger has no `log` method, the `info` method is used. This allows an instance of `bole` or similar to be used directly.

### info\(_msg_\) _\[api\]_

Log an informational message. The default implementation wraps `console.info` and passes on all arguments, so substitution strings may be used.

Overrides should be written with support for substitution strings in mind. See the `console.log` documentation.

### debug\(_msg_\) _\[api\]_

Log a debug message. The default implementation wraps `console.debug` if available, otherwise `console.log`, and passes on all arguments, so substitution strings may be used.

Overrides should be written with support for substitution strings in mind. See the `console.warn` documentation.

### warn\(_msg_\) _\[api\]_

Log a warning. The default implementation wraps `console.warn` and passes on all arguments, so substitution strings may be used.

Overrides should be written with support for substitution strings in mind. See the `console.warn` documentation.

The intention is that `apos.utils.warn` should be called for situations less dire than `apos.utils.error`.

### error\(_msg_\) _\[api\]_

Log an error message. The default implementation wraps `console.error` and passes on all arguments, so substitution strings may be used.

Overrides should be written with support for substitution strings in mind. See the `console.error` documentation.

### profile\(_req_, _key_, _optionalDuration_\) _\[api\]_

Performance profiling method. At the start of the operation you want to profile, call with req \(may be null or omitted entirely\) and a dot-namespaced key. A function is returned. Call that function with no arguments at the end of your operation.

Alternatively, you may pass the duration in milliseconds yourself as the third argument. In this case no function is returned. This is useful if you are already gathering timing information for other purposes.

Profiler modules such as `apostrophe-profiler` override this method to provide detailed performance analysis. Note that they must support both calling syntaxes. The default implementation does nothing.

If the dot-separated key looks like `callAll.pageBeforeSend.module-name`, time is tracked to `callAll`, `callAll.pageBeforeSend`, and `callAll.pageBeforeSend.module-name` as categories. Note that the most general category should come first.

To avoid overhead and bloat in the core, the default implementation does nothing. Also most core modules and methods do not invoke this method. However, the `apostrophe-profiler` module extends them to invoke it, for performance reasons: the profiler itself can have a performance overhead.

### now\(\) _\[api\]_

Returns time since the start of the process in milliseconds, with high-resolution accuracy. Used by apos.utils.profile. See: [https://www.npmjs.com/package/performance-now](https://www.npmjs.com/package/performance-now)

### readOnlySession\(_req_\) _\[api\]_

Mark the request as having no impact on the user's session.

This is necessary in high-frequency routes like the notification polling route that could otherwise cause session race conditions, for instance breaking workflow locale switcher operations intermittently.

Of course it only makes sense to invoke it if your route does not actually need to modify the session.

The implementation disables the save method of the session.

In 3.0 this should be unnecessary as we will seek out a default session store that is compatible with `resave: false`.

It would be more ideal if this were a method of the express module however for bc we cannot add an alias to that module in 2.x.

### modulesReady\(\)

Add these after we're sure the templates module is ready. Only necessary because this module is initialized first

## Nunjucks template helpers

### slugify\(_string_, _options_\)

Turn the provided string into a string suitable for use as a slug. ONE punctuation character normally forbidden in slugs may optionally be permitted by specifying it via options.allow. The separator may be changed via options.separator.

### log\(_msg_\)

Log a message from a Nunjucks template. Great for debugging. Outputs nothing to the template. Invokes apos.utils.log, which by default invokes console.log.

### inspect\(_o_\)

Log the properties of the given object in detail. Invokes `util.inspect` on the given object, down to a depth of 10. Outputs nothing to the template.

### generateId\(\)

Generate a globally unique ID

### isCurrentYear\(_date_\)

Test whether the specified date object refers to a date in the current year. The events module utilizes this

### isUndefined\(_o_\)

check if something is properly undefined

### isFalse\(_o_\)

check if something is strictly equal to false

### startCase\(_o_\)

Convert string to start case \(make default labels out of camelCase property names\)

### isFunction\(_o_\)

check if something is a function \(as opposd to property\)

### eqStrict\(_a_, _b_\)

make up for lack of triple equals

### contains\(_list_, _value_\)

Returns true if the list contains the specified value. If value is an array, returns true if the list contains _any of_ the specified values

### containsProperty\(_list_, _property_\)

Returns true if the list contains at least one object with the named property. The first parameter may also be a single object, in which case this function returns true if that object has the named property.

### reverse\(_array_\)

Reverses the order of the array. This MODIFIES the array in addition to returning it

### beginsWith\(_list_, _value_\)

If the `list` argument is a string, returns true if it begins with `value`. If the `list` argument is an array, returns true if at least one of its elements begins with `value`.

### find\(_arr_, _property_, _value_\)

Find the first array element, if any, that has the specified value for the specified property.

### indexBy\(_arr_, _propertyName_\)

If propertyName is \_id, then the keys in the returned object will be the ids of each object in arr, and the values will be the corresponding objects. You may index by any property name.

### filter\(_arr_, _property_, _value_\)

Find all the array elements, if any, that have the specified value for the specified property.

### reject\(_arr_, _property_, _value_\)

Reject array elements that have the specified value for the specified property.

### filterNonempty\(_arr_, _property_\)

Find all the array elements, if any, for which the specified property is truthy.

### filterEmpty\(_arr_, _property_\)

Find all the array elements, if any, for which the specified property is not truthy.

### isEmpty\(_item_\)

Returns true if the specified array or object is considered empty. Objects are empty if they have no own enumerable properties. Arrays are considered empty if they have a length of 0.

### pluck\(_arr_, _property_\)

Given an array of objects with the given property, return an array with the value of that property for each object.

### omit\(_object_, _property_ , _, property..._\)

Given an object, return an object without the named properties or array of named properties \(see \_.omit\(\)\).

### difference\(_array_, _without_, _property_\)

Given the arrays `array` and `without`, return only the elements of `array` that do not occur in `without`. If `without` is not an array it is treated as an empty array.

If `property` is present, then that property of each element of array is compared to elements of `without`. This is useful when `array` contains full-blown choices with a `value` property, while `without`just contains actual values.

A deep comparison is performed with `_.isEqual`.

### concat\(_arrOrObj1_, _arrOrObj2_ , _, ..._\)

Concatenate all of the given arrays and/or values into a single array. If an argument is an array, all of its elements are individually added to the resulting array. If an argument is a value, it is added directly to the array.

### groupBy\(_items_, _key_\)

Groups by the property named by 'key' on each of the values. If the property referred to by the string 'key' is found to be an array property of the first object, apos.utils.groupByArray is called.

Usage:  or 

### object\(_key, value, ..._\)

Given a series of alternating keys and values, this function returns an object with those values for those keys. For instance, apos.utils.object\('name', 'bob'\) returns { name: 'bob' }. This is useful because Nunjucks does not allow you to create an object with a property whose name is unknown at the time the template is written.

### merge\(\)

Pass as many objects as you want; they will get merged via `_.merge` into a new object, without modifying any of them, and the resulting object will be returned. If several objects have a property, the last object wins.

This is useful to add one more option to an options object which was passed to you.

If any argument is null, it is skipped gracefully. This allows you to pass in an options object without checking if it is null.

