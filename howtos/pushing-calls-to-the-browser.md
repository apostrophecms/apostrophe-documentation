---
title: Pushing calls to the browser
---

One of the challenges of full-stack development is to call functions in browser-side javascript from server-side code without making a mess. Apostrophe can help here. Apostrophe has features that help you create a single block of clean JavaScript code without escaping problems or a zillion separate `script` elements.

Apostrophe adds `req.pushCall` to the Express request object. You call `req.pushCall` like so:

```javascript
req.pushCall('something.func(?)', { any: { json: [5, 7] } });
```

You can do this as many times as you need to, for instance in page loader functions or the `index` or `show` method of a snippet subclass.

Apostrophe will automatically spool these out as a single `script` element, correctly escape all the data and invoke your functions.

Every `?` in the pattern (the first argument) is replaced by a correctly JSON-encoded representation of each additional argument. You can use as many `?`s as you need.

JSON-encoding is a great way to avoid escaping bugs, but sometimes you do want one of your parameters to be inserted literally, for instance to pass a constructor function name dynamically. To do that, use `@` rather than `?`:

```javascript
req.pushCall('@(?)', 'SomeFunction', 'SomeData')
```

Note that `req.pushCall` pushes a call to be invoked just in the current HTTP request's response. To make calls that will be included in the `calls` property for *every* request, make a call like this:

```javascript
apos.pushGlobalCall('myblog.setup(?)', options)
```

Apostrophe's modules use this approach heavily for browser-side initialization.

You can use both `?` (escaped via JSON) and `@` (inserted literally) as placeholders here too.

## A warning

Your JavaScript calls are inserted automatically when a complete page is sent to the user. But if you're just coding an AJAX response that sends an HTML fragment, you'll need to call `apos.getCalls(req)` and `apos.getGlobalCalls()` to get two blocks of JavaScript source code ready to insert at the end of the body inside a `script` element.
