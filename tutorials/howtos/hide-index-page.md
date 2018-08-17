---
title: "How can I disable a pieces index page?"
layout: tutorial
---

Occasionally you might want pieces that have their own show pages, but you don't need the index page. One case that's come up a few times is that pieces are listed in widgets across the site based on various criteria, but the organization doesn't have need for a central listing.

Even if you don't create an `index.html` in your piece's pages module, one will exist by default anyway, likely looking completely unstyled. Bummer.

For example, let's say we have a `cats` piece type. In my `cats-pages` module (extending `apostrophe-pieces-pages`), my `views` directory has a single `show.html` template file for the cat profile pages. So Oscar the cat can have his page at `example.com/cats/oscar`. If someone decides to try visiting `example.com/cats` we don't want that page to exist, but it will be there, listing cats, probably not looking that great.

The solution is pretty simple! To get `example.com/cats` to return a 404 error (effectively no longer existing), we'll make a small addition to the [`beforeIndex`](../../modules/apostrophe-pieces-pages/index.html#before-index) method.

In `lib/modules/cats-pages/index.js`, add the following to your `construct` method:

```javascript
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    req.notFound = true;

    return callback(null);
  };
}
```

See what we did there? Since `beforeIndex` runs before the index page is loaded, and by setting the request's `notFound` property to `true`, it'll return a 404 error rather than loading the page. This is the case even for site admins, so make sure the `apostrophe-pages` configuration doesn't give admins an option to create those pieces index pages.

You might want to allow site admins to create and access those index pages, though. In that case, do [include it as an option in `apostrophe-pages` configuration](../../modules/apostrophe-pages/index.html), and make an adjustment to the `beforeIndex` method:

```javascript
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    if (!req.data.page._edit) {
      req.notFound = true;
    }

    return callback(null);
  };
}
```

With the `!req.data.page._edit` conditional we're allowing people with edit permissions to access the pages.
