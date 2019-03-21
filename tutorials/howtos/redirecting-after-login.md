---
title: Redirecting the user after they log in
layout: tutorial
---

# redirecting-after-login

By default, after a user logs in, they are redirected to the homepage.

It is possible to customize this behavior.

You can implement a `loginAfterLogin` method in any module. This method takes `req` and an optional callback.

Setting req.redirect will cause Apostrophe to redirect the user to that location.

```javascript
// lib/modules/my-module/index.js

module.exports = {
  construct: function(self, options) {
    self.loginAfterLogin = function(req) {
      if (req.user.isSpecialInSomeWay) {
        req.redirect = '/special';
      } else {
        // Just let them go go the home page
      }
    };
  }
};
```

_Don't forget to enable your module in_ `app.js`_._

If you do not set `req.redirect`, the user is redirected to the home page.

For a complete example, check out the [apostrophe-second-chance-login](https://npmjs.org/package/apostrophe-second-chance-login) module, which turns 404's into an opportunity to log in, if a page exists that the user might have the privilege of seeing after logging in.

