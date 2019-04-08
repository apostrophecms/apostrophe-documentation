## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
### `apos.locks`

## Methods
### lock(*name*, *options*, *callback*)
Obtain a lock with the given name. The lock remains exclusive until
we unlock it (except for certain situations in unusual synchronous code,
see below).

We MUST release the lock later by calling `unlock` with the same name.

If the lock is in use by another party, this method will wait until it is
no longer in use, unless `options.wait` is present. If `options.wait`
is explicitly `false`, the method will not wait at all, and
the error reported will be the string `'locked'`. If `options.wait`
is a number, the method will wait that many milliseconds before
reporting the `locked` error.

The `options` argument can be omitted completely.

Calling this method when you already have the specified lock will
yield an error unless the `waitForSelf` option is true.

If you call without a callback, a promise is returned instead.

SYNCHRONOUS CODE: if you need to go more than 30 seconds without ever returning to the
event loop, set `options.idleTimeout` to a longer period of time (in milliseconds).
This applies only to synchronous code. (And seriously, why  are you running
without returning for 5 minutes in nodejs? Nobody can see your site while you do that.)
### unlock(*name*, *callback*)
Release the given lock name. You must first obtain a lock successfully
via `lock`. Calling this method when you do not already have the lock will
yield an error.

If you call without a callback, a promise is returned instead.
### withLock(*name*, *fn*, *callback*)
Obtains the named lock, then invokes the provided function,
which must take one argument (a callback), or
take zero arguments and return a promise. Then `callback`
is invoked or, if there is no callback, an error is returned.

You can think of this as an "upgrade" of your function to
run within a lock in every way. If you use promises,
the promise returned by `withLock` will resolve to the
value that `fn` resolves to. If you use callbacks, the
second argument is passed on as you would expect.

You may omit `callback`, in which case `withLock`
returns a promise.

The lock gets released at the end, whether fn results in an
error or not.
### ensureCollection(*callback*)

