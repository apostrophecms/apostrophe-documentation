---
title: "apostrophe-push (module)"
layout: module
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.push`
This module provides ways to "push" JavaScript calls so that they happen in the
web browser in a well-managed way.

For calls that should happen for every page load, or for every logged-in page load,
see the `browserCall` method of this module (`apos.push.browserCall`) as documented
below.

For calls that should happen only for a specific request (`req`), this module
extends `req` with a `browserCall` method which takes exactly the same arguments
as `apos.push.browserCall`, except that there is no `when` argument.

Example:

```
req.browserCall('apos.someModule.method(?, ?)', arg1, arg2, ...)
```

Each `?` is replaced by a properly JSON-encoded version of the
next argument.

If you need to pass the name or part of the name of a
function dynamically, you can use @ to pass an argument
literally:

```
req.browserCall('new @(?)', 'MyConstructor', { options... })
```

In addition, the `browserMirrorCall` method provides a way to dynamically
duplicate the inheritance tree of a server-side moog type for a browser-side
moog type, so that developers don't have to ask themselves whether a particular
module bothered to subclass a particular modal, etc. when subclassing further.


## Methods
### browserCall(*when*, *pattern *, *, arg1, arg2...*)
Push a browser side JS call that will be invoked "when"
a particular situation applies. Currently `always` and
`user` (a logged in user is present) are supported. Any
`@`s and `?`s in `pattern` are replaced with the remaining arguments
after `when`. `@` arguments appear literally (useful for
constructor names) while `?` arguments are JSON-encoded.

Example:
`apos.push.browserCall('user', 'myObject.addType(?)', typeObject)`
### browserMirrorCall(*when*, *object*, *options*)
A convenience wrapper for invoking apos.mirror
on the browser side, to ensure a client-side
moog type exists with the same class hierarchy
as the given object (usually a server-side module).

You can think of this as just passing the object.__meta
object to apos.mirror on the browser side, although
we prune it to avoid revealing information about the
filesystem that doesn't matter on the browser side.

`options` may be omitted. If `options.tool` is present,
it is appended to the type names being defined, after a hyphen.
This is useful to define related types, like `apostrophe-pieces-manager-modal`.
If an `options.substitute` object is present, the type names specified by
its keys are replaced with the corresponding values. Related types starting with
`my-` are also substituted without the need to separately specify that.

If `options.stop` is present, mirroring stops when that base class
is reached (inclusive). The search begins from the deepest subclass.
`options.stop` is considered AFTER `options.substitute` is applied.
### getBrowserCalls(*when*)
Returns browser-side JavaScript to make the calls
queued up for the particular situation (`always`
or `user`).
### getBrowserCallsBody(*calls*)
Part of the implementation of req.getBrowserCalls and
apos.push.getBrowserCalls.

Turn any number of call objects like this:
`[ { pattern: @.func(?), arguments: [ 'myFn', { age: 57 } ] } ]`

Into javascript source code like this:

`myFn.func({ age: 57 });`

`... next call here ...`

Suitable to be emitted inside a script tag.

Note that `?` JSON-encodes an argument, while `@` inserts it literally.
