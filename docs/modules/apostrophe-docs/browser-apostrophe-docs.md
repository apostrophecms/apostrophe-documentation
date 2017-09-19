---
title: "apostrophe-docs (browser)"
layout: reference
namespace: browser
---

## Methods
### getManager(*type*)

### setManager(*type*, *manager*)

### lock(*_id*, *callback*)
Obtain a lock on the given doc _id, interacting with the user
if necessary to give them the option of shattering another
user's lock. Invokes the callback with null on a successful lock,
an error otherwise. If `id` is falsy, the callback succeeds
immediately, because this indicates a new doc that no one
else could know about or have a lock on. The lock is
granted to the current html page.
### lockAndWatch(*_id*, *callback*)
Obtain a lock via the lock method, then
watch the lock by periodically verifying
whether the lock is still held. If the
lock is lost the user is notified and
the page is reloaded. This method is used
by the modal editor for pieces, since they
do not otherwise carry out autosave operations
that would quickly make the user aware a lock has
been seized by someone else.

The callback is invoked as soon as
the lock method succeeds, and monitoring
then proceeds in the background, stopping if unlock()
is invoked successfully.
### unlock(*_id*, *sync*, *callback*)
Release a lock on the given doc _id, if any.
Callback succeeds (receives `null`) as long as the
current HTML page does not have a lock anymore after
the call, whether they initially had one or not.

If `sync` is true a synchronous call is made.
This is normally a bad thing, but it is appropriate
in a beforeunload handler.

`callback` is optional.
