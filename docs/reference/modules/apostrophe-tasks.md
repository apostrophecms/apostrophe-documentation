# apostrophe-tasks
## Inherits from: [apostrophe-module](./apostrophe-module/README.md)
### `apos.tasks`
This module allows other modules to create command line tasks.

A command line task is invoked like this:

node app apostrophe-migrations:migrate

Apostrophe is fully initialized before your task is run, except that it does
not listen for connections. So you may access all of its features in your task.

Direct use of `console` makes sense here because
we're implementing an interaction at the CLI.
-Tom


## Methods
### invoke(*name*, *args*, *options*, *callback*)
For use when you wish to execute an Apostrophe command line task from your code and continue,
without using the command line or using the `child_process` module.

Except for `name`, all arguments may be omitted.

If you do not pass a callback, a promise is returned.

Examples (assume `products` extends `apostrophe-pieces`):

`self.apos.tasks.invoke('apostrophe-users:add', [ 'admin', 'admin' ]).then(function() { ... })`

`self.apos.tasks.invoke('products:generate', { total: 20 }).then(function() { ... })`

The `args` and `options` arguments may be completely omitted.

If present, `args` contains an array of positional arguments to
the task, **not including** the task name.

If present, `options` contains the optional parameters that would normally
be hyphenated, i.e. at the command line you might write `--total=20`.

**Gotchas**

If you can invoke a method directly rather than invoking a task, do that. This
method is for cases where that option is not readily available.

During the execution of the task, `self.apos.argv` will have a new,
temporary value to accommodate tasks that inspect this property directly
rather than examining their `argv` argument. `self.apos.argv` will be
restored at the end of task execution.

Some tasks may not be written to be "good neighbors." For instance, a
task developer might assume they can exit the process directly.
### add(*groupName*, *name*, *usage*, *callback*)
Add a command line task to Apostrophe. It is easiest to invoke this
via the `addTask` method of your own module. You may also call it
directly.

If you do call directly, the group name should be the name of your module.

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

**Your task may return a promise** instead of invoking the callback.
You **must not** do both.

Your code will usually need to invoke methods that require a `req` argument.
Call `self.apos.tasks.getReq()` to get a `req` object with
unlimited admin permissions. Use `self.apos.tasks.getAnonReq()` to get
a `req` object without permissions.
### run()
You should not need to call this method directly. You probably
want `apos.tasks.invoke` (see above).

This method is invoked by Apostrophe to execute the task specified
by the first command line argument. On completion the process exits.
If the task experiences an error it is printed to `console.error`
and the process exits with a nonzero status code.

This method also implements the `help` task directly.
### find(*fullName*)
Identifies the task corresponding to the given command line argument.
This allows for Rails-style hyphenated syntax with a `:` separator,
which is the documented syntax, and also allows camel-cased syntax with a `.`
separator for those who prefer a more JavaScript-y syntax.
### usage()
Displays a usage message, including a list of available tasks,
and exits the entire program with a nonzero status code.
### getReq(*properties*)
Return a `req` object with permission to do anything.
Useful since most APIs require one and most tasks
should run with administrative rights.

The `req` object returned is a mockup of a true Express `req` object
with sufficient functionality to implement Apostrophe's
unit tests, so it is suitable for command line
task code that requires a `req` as well.

Optionally a `properties` object can be passed. If it is
passed its properties are added to the req object before
any initialization tasks such as computing `req.absoluteUrl`.
This allows testing of that mechanism by setting `req.url`.
### getAnonReq(*properties*)
Return a `req` object with privileges equivalent
to an anonymous user visiting the website. Most
often used for unit testing but sometimes useful
in tasks as well.

The `req` object returned is a mockup of a true Express `req` object
with sufficient functionality to implement Apostrophe's
unit tests, so it is suitable for command line
task code that requires a `req` as well.

Optionally a `properties` object can be passed. If it is
passed its properties are added to the req object before
any initialization tasks such as computing `req.absoluteUrl`.
This allows testing of that mechanism by setting `req.url`.
