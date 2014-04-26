---
title: "Custom modules"
children:
  - a-simple-module
  - options-provided-to-modules
  - pushing-assets-to-the-browser
  - page-loader-functions
  - rendering-templates-in-your-own-routes
  - accessing-other-modules
  - subclassing-well-behaved-modules
  - allowing-others-to-subclass-your-module
  - preparing-your-module-for-npm
---

It's not hard to write your own Apostrophe modules. And it's not hard to let others subclass the modules you write.

But first, [consider subclassing the snippets module](../snippets/subclassing-snippets.html). If what you want is a new data type with some fields and the ability to display them here and there around the site, that's probably all you need. Also consider extending the [fancy pages](http://github.com/punkave/fancy-pages) module.

If you want to add a new widget, check out the [RSS](http://github.com/punkave/apostophe-rss) and [Twitter](http://github.com/punkave/apostrophe-twitter) modules as examples you can copy and learn from. Actually they are pretty good examples in general.

For the remainder of this article we'll assume you're doing something different!

