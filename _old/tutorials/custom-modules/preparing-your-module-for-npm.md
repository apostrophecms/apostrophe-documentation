---
title: Preparing your module for npm
---

Releasing a module via npm isn't much different from creating one in `lib/modules`.

The main difference is that, if you are subclassing another module, you will have to `require` that module and invoke its constructor directly as part of your constructor. `module.exports.Super` is not available.

A second difference is that you are responsible for adding your module to the `options.modules` chain, which is a list of module directories used to resolve template overrides and ensure that all versions of pushed assets are delivered.

Here's how the events module does it when subclassing snippets:

```javascript
var snippets = require('apostrophe-snippets');

module.exports = events;

function events(options, callback) {
  return new events.Events(options, callback);
}

events.Events = function(options, callback) {
  var self = this;

  ... Add our own defaults to options, etc ...

  // Add ourselves to the "options.modules" chain
  options.modules = (options.modules || []).concat([ { dir: __dirname, name: 'events' } ]);

  // Invoke the superclass constructor
  snippets.Snippets.call(this, options, null);

  ... Override various methods, etc ...

  // Invoke callback on next tick if we receive one
  if (callback) {
    process.nextTick(function() { return callback(null); });
  }
};
```
