---
title: "Custom Page Rendering"
---

By default, you'll just write a `company.html` in your project's `views/pages` folder, like you would with regular page types.

However, the `apostrophe-fancy-pages` module is all hooked up to let you override the `dispatch` method to change this behavior.

To do that you'll need an `index.js` file in your `lib/modules/company` folder, with a constructor for your module. After you invoke the superclass constructor you can provide an override of the dispatch method. See examples below (commented out at the moment). The default behavior is to render the usual template for the page from `views/pages`.

```javascript
module.exports = company;

function company(options, callback) {
  return new company.Company(options, callback);
}

company.Company = function(options, callback) {
  var self = this;

  module.exports.Super.call(this, options, null);

  self.dispatch = function(req, callback) {
    // Now we know it's of the right type.

    // If I want to, I can override this to render via
    // a custom method. If I use self.renderer I can render
    // teplates that live in this module's views folder,
    // rather than templates in the project-level views/pages folder:

    // req.template = self.renderer('index')

    // I could also send a 404:
    // req.notfound = true;

    // Or redirect somewhere:
    // req.redirect = 'http://somewhere....';

    // The default behavior is to render the page template matching
    // the module name.

    return callback(null);
  };

  if (callback) {
    process.nextTick(function() { return callback(null); });
  }
};
```

