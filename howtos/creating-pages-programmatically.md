---
title: Creating pages programmatically
---

## Creating pages in the page tree programmatically

Most of the time, people create pages in the page tree, typically via the "New Page" option on the context menu. This makes sense. The point of having a page tree is to allow your users to lay out the site's structure.

However sometimes you'll want to add a page to the page tree on the fly from your own code.

You can do that via the `insertPage` method of the `site.pages` object. This object is also passed to all modules as the `pages` option.

**This is NOT the same thing as `apos.pages`, which is the actual MongoDB collection. In most cases you will not need to access that directly.**

The `insertPage` method requires a `req` object. If you are writing an Express route then you already have one, and permissions are automatically checked for the current user. If you need a `req` object with unlimited privileges, use `apos.getTaskReq()`.

The second argument to `insertPage` is an object with at least these properties:

`title`, `parent` (slug of parent page), `type` (page template name)

You may also supply:

`tags`, `published`

And also any fields specific to a particular page type.

Currently there is no `slug` option. The slug is automatically determined based on the slug of the parent page and the title given. (TODO: consider permitting this.) The slug is automatically made unique.

The third argument is the callback. The new `page` object is passed to the callback as the second argument.

Here's a simple example that guarantees there is always a child of the home page with the slug "/about-us". Just set the `afterInit` callback like this in `app.js`.

```javascript
// Part of your apostrophe-site configuration...

afterInit: function(callback) {
  // Get a request object with unlimited privileges
  var req = site.apos.getTaskReq();
  // If /about-us doesn't exist, we'll create it
  return site.apos.getPage(req, '/about-us', function(err, page) {
    if (err) {
      return callback(err);
    }
    if (page) {
      // Already exists, we're done
      return callback(null);
    }
    // Use a title that leads to the slug /about-us. TODO: it
    // would be nice to accept a slug property here
    return site.pages.insertPage(req, {
      title: 'About Us',
      parent: '/',
      type: 'default',
      tags: [ 'nifty' ]
    }, function(err) {
      return callback(err);
    });
  });
}
```

## Creating snippets programmatically

Start by creating the snippet with `snippets.newInstance()`. Then use `snippets.putOne(req, slug, options, snippet, callback)` to store it. See the snippets module source code for examples.


