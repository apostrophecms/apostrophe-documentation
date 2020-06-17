# How Apostrophe Starts Up

This tutorial covers how Apostrophe initializes itself. In the process, it provides insight into how you can influence that process and the best times to do things in your own modules.

## Initialization of modules

When the application starts up, the modules initialize in the order found in `node_modules/apostrophe/default.js`, followed by any project level or npm modules, in the order configured in `app.js`.

### Initialization of an individual module

When initializing, an individual module invokes `beforeConstruct` at project level first, then at npm module level; note that project level code runs first here to adjust the `options` if needed before the base class sees them. If a module extends another, the subclass runs first, again getting a chance to adjust `options` before the base class sees them.

Then `construct` runs for this module, this time starting with the base class, so that the subclasses can override methods assigned there.

Then `afterConstruct` runs for the module. Ideally `construct` doesn’t do anything but set up methods, so that `afterConstruct` can safely invoke them, knowing that any subclass overrides have already happened.

See the [moog documentation](https://npmjs.org/package/moog) for more information about `beforeConstruct`, `construct` and `afterConstruct`.

### Running code after all modules are constructed

After all of the modules are initialized, Apostrophe invokes the `modulesReady` methods of any modules that have one, in the order those modules were initialized. This is a good time to do work that requires other modules initialized after yours.

Note that your `modulesReady` method may optionally take a callback.

If you are extending another module, be sure to check whether it already has a `modulesReady` method and invoke it via the super pattern if so.

### Running code after `modulesReady`

The last thing Apostrophe does before listening for connections, or running the task in the case of a command line task, is invoking the `afterInit` method of any module that has one.

Like `modulesReady`, `afterInit` may also take a callback if it needs to do asynchronous work.

### `afterInit` in `app.js`

You may also supply a top-level `afterInit` property in your `app.js` configuration. If provided this function must take a callback. We recommend using `modulesReady` or `afterInit` in a project-level module instead. Cluttering up `app.js` with executable code generally leads to hard-to-understand projects.

