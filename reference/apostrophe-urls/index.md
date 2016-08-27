---
title: "apostrophe-urls (module)"
layout: module
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
Provides the `build` method, a flexible and powerful way to build
URLs with query parameters and more. This method is made available
as the `build` filter in Nunjucks. This is also the logical place
to add new utility methods relating to URLs.


## Methods
### build(*url*, *path*, *data*)
Build filter URLs. `data` is an object whose properties
become new query parameters. These parameters override any
existing parameters of the same name in the URL. If you
pass a property with a value of `undefined`, `null` or an
empty string, that parameter is removed from the
URL if already present (note that the number `0` does not
do this). This is very useful for maintaining filter
parameters in a query string without redundant code.

Pretty URLs

If the optional `path` argument is present, it must be an
array. (You may skip this argument if you are just
adding query parameters.)

Any properties of `data` whose names appear in `path`
are concatenated to the URL directly, separated by slashes,
in the order they appear in that array.

The first missing or empty value for a property in `path`
stops this process to prevent an ambiguous URL.

Note that there is no automatic detection that this has
already happened in an existing URL, so you can't override
existing components of the path.

If a property's value is not equal to the slugification of
itself as determined by apos.utils.slugify, then a query
parameter is set instead.

If you don't want to handle a property as a query parameter,
make sure it is always slug-safe.

Overrides: multiple data objects

You may pass additional data objects. The last one wins, so
you can pass your existing parameters first and pass new
parameters you are changing as a second data object.

Working with Arrays

Normally, a new value for a property replaces any old one,
and `undefined`, `null` or `''` removes the old one. If you
wish to build up an array property instead you'll need
to use the MongoDB-style $addToSet and $pull operators to add and
remove values from an array field in the URL:

Add tags[]=blue to the query string, if not already present

`{ tags: { $addToSet: 'blue' } }`

Remove tags[]=blue from the query string, if present

`{ tags: { $pull: 'blue' } }`

All values passed to $addToSet or $pull must be strings or
convertible to strings via `toString()` (e.g. numbers, booleans)

(The actual query string syntax includes array indices and
is fully URI escaped, so it's slightly different but has
the same impact. PHP does the same thing.)
