# Custom Page Rendering

By default, you'll just write a `company.html` in your project's `views/pages` folder, like you would with regular page types.

However, the `apostrophe-fancy-pages` module is all hooked up to let you override the `dispatch` method to change this behavior.

To do that you'll need an `index.js` file in your `lib/modules/company` folder, with a constructor for your module. After you invoke the superclass constructor you can provide an override of the dispatcher:

```javascript
module.exports = company;

function company(options, callback) {
  return new company.Company(options, callback);
}

company.Company = function(options, callback) {
  var self = this;

  module.exports.Super.call(this, options, null);

  self.dispatcher = function(req, callback) {
    return self.renderer('index.html');
  };

  if (callback) {
    process.nextTick(function() { return callback(null); });
  }
};
```

In this example, the dispatcher has been overridden to render `lib/modules/company/views/index.html` instead of `views/pages/company.html`.

You can do other nifty tricks in your dispatcher:

```javascript
// Let's turn it into a 404
req.notfound = true;

// Or, redirect somewhere
req.redirect = 'http://somewhere';
```