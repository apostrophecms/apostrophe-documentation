---
title: Command line tasks in Apostrophe
---

We often need to carry out command line tasks with access to the same database and capabilities that regular Apostrophe code has access to. Apostrophe makes it really easy to register command line tasks as part of your application.

If the command line is:

    node app.js

The app will start listening for connections as usual. But if it is:

    node app.js project:send-emails

The app will execute that task. We'll see how to implement that task below.

To see the available tasks, just type:

    node app.js apostrophe:help

This will list all of the registered tasks.

### Registering your own tasks

All you have to do is include a `tasks` option in `app.js`. Each task is a simple callback function that takes four arguments, `site`, `apos`, `argv`, and `callback`. Tasks are grouped together into categories.

Here's an example:

```javascript
tasks: {
  project: {
    sendEmails: function(site, apos, argv, callback) {
      // Do time consuming, asynchronous things!
      // When we're finished:
      return callback(null);
    }
  }
}
```

This structure allows for projects with many tasks, grouped into categories.

The code above allows us to run this task:

    node app project:send-emails

**Task names are alwaysCamelCase in the source code.** On the command line, you have a choice: you can type them like this...

    node app project:send-emails

Or like this:

    node app project.sendEmails

### Accessing command line arguments

It's really, really easy.

If there is a `--go` option on the command line, here's how to test for that in your task:

```javascript
if (argv.go) { ... }
```

If there is a `--color=blue` option, that's easy to access to:

```javascript
console.log(argv.color);
```

You can also access positional arguments. If the user types:

    node app project:send-emails 100

You can access that extra argument as `argv._[1]`. (`argv._[0]` is the name of your task.)

[See the optimist module for more information.](https://github.com/substack/node-optimist)

### "What if an error happens?"

Pass it to the callback.

### "How do I call methods that need a req object?"

Good question. Lots of Apostrophe methods expect a `req` object, because permissions are tied to the identity of the user, and certain types of caching are tied to the lifetime of a request.

If your task needs to call a function like `snippets.get` which requires a `req` object, call this function to get a `req` object that always has unlimited permissions:

```javascript
apos.getTaskReq()
```

### "How do I hook into existing tasks?"

The `apos` object is an EventEmitter. In English, that means you can write:

```javascript
apos.on('task:apostrophe:migrate:before', function() {
  apos.taskBusy();
  // Do a variety of things asynchronously
  apos.taskDone();
}
```

Or:

```javascript
apos.on('task:apostrophe:migrate:after', function() {
  apos.taskBusy();
  // Do a variety of things asynchronously
  apos.taskDone();
}
```

### "What do apos.taskBusy and apos.taskDone do?"

These only matter if you're hooking into an existing task.

Apostrophe needs to know when your event handler is finished. But you're likely to call asynchronous functions (functions with callbacks), so Apostrophe can't just assume that your event handler is finished when it returns.

`apos.taskBusy()` solves this problem. If your event handler needs to do lots of asynchronous stuff, call `apos.taskBusy()`. Apostrophe will not move on until you call `apos.taskDone()`.

