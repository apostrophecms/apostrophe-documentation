---
title: Page loader functions
---

If your module has a `loader` method, it will automatically be invoked whenever Apostrophe is about to render a page. Page loaders are very powerful and are the foundation of both [fancy pages](../pages/index.html) and [snippet index pages](../snippets/index.html).

Page loaders are a simple implementation of the filter pattern in which each loader has an opportunity to modify `req`, the Express request object, and give hints that cause Apostrophe to render the page differently.

The method receives two arguments, `req` and `callback`. `req` is the Express request object, enhanced with useful properties such as:

* `page` is the current page, if the URL matches a page slug directly.
* `bestPage` is the page whose slug matches the largest portion of the URL as a prefix. For instance, if the URL is `/blog/article`, and there is no `/blog/article` page but `/blog` does exist, then `req.bestPage` will be `/blog`.
* If the URL does not exactly match a page, `remainder` will contain the rest of the URL following that of `bestPage`.

If your page loader decides the URL is relevant based on `bestPage`, you should set `req.page = req.bestPage` so that a 404 not found error is not sent.

A page loader function should always begin by deciding if it cares about this particular URL, and if not, immediately invoke its callback and return. Making this decision quickly is critical for performance.

A page loader function should always end by invoking its callback.

If you set the error parameter to the callback, a 500 error results. For a 404 not found error, just set `req.notfound = true` and invoke the callback normally (with null or no argument).

## Rendering a page in your page loader

Here is a page loader function which asks Apostrophe to render a particular template as the body of the page:

```javascript
self.loader = function(req, callback) {
  if (req.page && req.page.type === 'monkey') {
    req.template = self.renderer('monkeyshow', { some data... });
  }
  return callback(null);
};
```

The `self.renderer` method is available only if you call `mixinModuleAssets` in your module as described earlier.

`self.renderer('monkeyshow', ...)` returns a function that will render the `views/monkeyshow.html` template found in your module. The template receives the data you pass as the second argument, plus a number of standard parameters such as `page`, `query` and `user`. Setting `req.template` to a function causes Apostrophe to invoke that function when it is time to output the page.

## Sending a 404 not found error from your page loader

This is easy too:

```javascript
req.notfound = true;
```

## Redirecting the browser from your page loader

Just set `req.redirect`:

```javascript
req.redirect = 'http://google.com';
```
