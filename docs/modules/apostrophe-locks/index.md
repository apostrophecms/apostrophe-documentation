---
title: "apostrophe-locks (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.locks`

## Methods
### lock(*name*, *options*, *callback*)
Obtain a lock with the given name. The lock remains exclusive until
we unlock it (except for certain situations in unusual synchronous code,
see below).

We MUST release the lock later by calling `unlock` with the same name.

The `options` argument can be omitted completely.

Calling this method when you already have the specified lock will
yield an error.

SYNCHRONOUS CODE: if you need to go more than 30 seconds without ever returning to the
event loop, set `options.idleTimeout` to a longer period of time (in milliseconds).
This applies only to synchronous code. (And seriously, why  are you running
without returning for 5 minutes in nodejs? Nobody can see your site while you do that.)
### unlock(*name*, *callback*)
Release the given lock name. You must first obtain a lock successfully
via `lock`. Calling this method when you do not already have the lock will
yield an error.
### ensureCollection(*callback*)

