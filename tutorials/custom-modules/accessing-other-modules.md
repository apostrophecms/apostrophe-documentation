---
title: Accessing other modules
---

After all modules have been initialized, `apostrophe-site` calls the `setBridge` method on each module object that has one. This method receives an object containing all of the module objects as properties named after the module. For instance:

```javascript
self.setBridge = function(bridge) {
  // We want to invoke methods of the blog module;
  // grab a reference to it
  self._blog = bridge['apostrophe-blog'];
}
```

Note that `setBridge` is not called until after all modules have invoked their initialization callback.

Modules that manage a page type or snippet type can also be accessed via `_pages.getManager`:

```javascript
self._pages.getManager('blogPost').getOne(
  req, { _id: blogPostId }, {}, function(err, blogPost) { ... }
);
```

`getManager` is useful when you know what type of page or snippet you want. It allows developers to substitute a different module that implements the same type.
