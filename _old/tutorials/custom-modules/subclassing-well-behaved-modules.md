---
title: Subclassing well-behaved modules
---

You can subclass any [well-behaved module](a-simple-module.html), in much the way you would [subclass snippets](../snippets/subclassing-snippets.html).

We've made subclassing easier for the common case where you want to change the behavior of an existing module for this particular project. Just create an `index.js` file in your `lib/modules/mymodulename` folder, where `mymodulename` is the full name of the npm module you're subclassing.

Here's a really simple subclass that changes the way the `index` method of the `apostrophe-blog` module behaves, so that a featured story is available to the `index.html` template as the `featured` variable in nunjucks:

```javascript
module.exports = stories;

function stories(options, callback) {
  return new stories.Construct(options, callback);
}

stories.Construct = function(options, callback) {
  var self = this;

  module.exports.Super.call(this, options, null);

  var superIndex = self.index;
  self.index = function(req, snippets, callback) {
    self.get(req, { tags: 'featured' }, { limit: 1 }, function(err, results) {
      if(err) {
        callback(err);
      }
      if(results.total > 0) {
        req.extras.featured = results.snippets[0];
      }
      superIndex(req, snippets, callback);
    });
  };

  // Must wait at least until next tick to invoke callback!
  if (callback) {
    process.nextTick(function() { return callback(null); });
  }

};
```

Note the use of `module.exports.Super`. This automatically points to the base class constructor.

Confused? Just remember to follow this pattern and place your method overrides after the call to `module.exports.Super`.

[Apostrophe follows the "self pattern," rather than the prototype pattern.](http://justjs.com/posts/this-considered-harmful) Those who are used to implementing inheritance with the `prototype` keyword will find it slightly different. We prefer this pattern because it eliminates several common sources of bugs.
