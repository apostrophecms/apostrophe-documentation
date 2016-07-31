---
title: "apostrophe-caches (module)"
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
A general purpose cache implementation for improved performance in all areas
where results can be retained and reused temporarily. Any number of distinct cache
objects can be created, identified by distinct names. The standard implementation
is powered by a MongoDB collection, however it is straightforward to extend this
module with a different implementation for some or all caches by overriding
its `get` method.


## Methods
### get(*name*)
`get('cachename')` returns a cache object to store things in
temporarily. If you call `get` many times with the same cache name,
you get the same cache object each time.

CACHES MUST NEVER BE RELIED UPON TO STORE INFORMATION. They are a
performance enhancement ONLY and data may DISAPPEAR at any time.

Every cache object provides `.get(key, callback)` and
`.set(key, value, lifetime, callback)` methods to get
and store values in the cache. The data to be
stored must be representable as JSON for compatibility with
different implementations. You do NOT have to stringify it yourself.

The `.get` method of each cache object invokes its callback with `(null, value)` in the event
of success. If the key does not exist in the cache, `value`
is `undefined`. This is *not* considered an error.

The `lifetime` argument of `.set` is in seconds and may be omitted
entirely, in which case data is kept indefinitely.

The default implementation is a single MongoDB collection with a
`name` property to keep the caches separate, but this
can be swapped out by overriding the `get` method.

CACHES MUST NEVER BE RELIED UPON TO STORE INFORMATION. They are a
performance enhancement ONLY and data may DISAPPEAR at any time.
### constructCache(*name*)

### getCollection(*callback*)

