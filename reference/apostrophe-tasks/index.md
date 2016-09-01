---
title: "apostrophe-tasks (module)"
layout: module
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.tasks`
This module allows other modules to create command line tasks.

A command line task is invoked like this:

node app apostrophe-migrations:migrate

Apostrophe is fully initialized before your task is run, except that it does
not listen for connections. So you may access all of its features in your task.


## Methods
### add(*groupName*, *name*, *usage*, *callback*)
Add a command line task to Apostrophe.

The group name, by convention, should be the name of your module.

The name may be any short, memorable identifier, hyphenated if necessary.

You may omit the `usage` parameter complete if you don't want to supply
a help message, but we recommend that you do so.

Your callback function receives `(apos, argv, callback)`. Your
function should perform the necessary task, referring to
`argv._` for positional command line arguments (`[0]` is the task name)
and to `argv.foo` for an option specified as `--foo=bar`.

On completing the task your function should invoke the callback.
If the callback is invoked with `null`, Apostrophe will exit quietly
with status 0 (success), otherwise it will display the error given
and exit with status 1 (failure).

Your code will usually need to invoke methods that require a `req` argument.
Call `self.apos.tasks.getReq()` to get a `req` object with
unlimited admin permissions.
### run()

### find(*fullName*)

### usage()

### getReq()
Return a req object with permission to do anything.
Useful since most APIs require one and most tasks
should run with administrative rights.
