---
title: "apostrophe-caches (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.caches`
A general purpose cache implementation for improved performance in all areas
where results can be retained and reused temporarily. Any number of distinct cache
objects can be created, identified by distinct names. The standard implementation
is powered by a MongoDB collection, however it is straightforward to extend this
module with a different implementation for some or all caches by overriding
its `get` method.


## Methods
### get(*name*)
**SLOW DOWN - READ CAREFULLY!**

THIS IS NOT THE METHOD YOU CALL TO GET A VALUE - THIS IS
THE METHOD YOU CALL TO **GET A CACHE IN WHICH YOU CAN GET AND SET
VALUES.** Call it with a name that uniquely identifies
your **entire cache**, like `weather-data` or similar. The
object it **returns** has `get` and `set` methods for actual data,
**as described below**.

`get('cachename')` returns a cache object to store things in
temporarily. If you call `get` many times with the same cache name,
you get the same cache object each time.

CACHES MUST NEVER BE RELIED UPON TO STORE INFORMATION. They are a
performance enhancement ONLY and data may DISAPPEAR at any time.

HOW TO ACTUALLY CACHE DATA: **Every cache object has `.get(key, callback)` and
`.set(key, value, lifetime, callback)` methods to get
and store values in the cache.** If you call without a callback,
a promise is returned.

Example (with promises):

```javascript
// Get a cache for weather data, keyed by zip code
var myCache = self.apos.caches.get('weather-data');

// Store something in the cache
myCache.set('19147', { clouds: 'cumulus' }, 86400).then(function() { ... })

// Get a value from the cache
myCache.get('19147').then(function(data) { ... })
```

The data to be stored must be representable as JSON for compatibility with
different implementations. You do NOT have to stringify it yourself.

The `.get` method of each cache object invokes its callback with `(null, value)` in the event
of success. If the key does not exist in the cache, `value`
is `undefined`. This is *not* considered an error. If there is no callback
a promise is returned, which resolves to the cached value or `undefined`.

The `lifetime` argument of `.set` is in seconds and may be omitted
entirely, in which case data is kept indefinitely (but NOT forever,
remember that caches can be erased at ANY time, they are not for permanent data storage).

The default implementation is a single MongoDB collection with a
`name` property to keep the caches separate, but this
can be swapped out by overriding the `get` method.

Caches also have a `clear()` method to clear the cache. If
no callback is passed, it returns a promise.

CACHES MUST NEVER BE RELIED UPON TO STORE INFORMATION. They are a
performance enhancement ONLY and data may DISAPPEAR at any time.
### constructCache(*name*)

### getCollection(*callback*)

### clearCacheTask(*argv*, *callback*)

### addClearCacheTask()
