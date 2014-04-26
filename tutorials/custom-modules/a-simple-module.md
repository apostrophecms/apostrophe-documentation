---
title: A simple module
---

Here's the simplest module you can create without subclassing something else.

Create `lib/modules/mymodule/index.js` and populate it with this code:

```javascript
module.exports = factory;

function factory(options, callback) {
  return new Construct(options, callback);
}

function Construct(options, callback) {
  var self = this;
  // Add a bunch of methods to self here, then...

  // Invoke the callback. This must happen on next tick or later!
  if (callback) {
    return process.nextTick(function() {
      return callback(null);
    });
  }
}

// Export the constructor so others can subclass
factory.Construct = Construct;
```

In a nutshell: you must export a factory function, and it must have a constructor as its `Construct` property. That constructor must do any needed initialization, then wait for next tick before invoking its callback, if one was given to it.

[Please note that Apostrophe follows the "self pattern," rather than the prototype pattern.](http://justjs.com/posts/this-considered-harmful) Those who are used to implementing inheritance with the `prototype` keyword will find it slightly different. We prefer this pattern because it eliminates several common sources of bugs.
