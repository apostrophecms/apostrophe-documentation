---
title: Activating the "password reset" feature of Apostrophe
layout: tutorial
---

## Password Reset

Apostrophe includes a "password reset" feature for your users. This feature follows the usual pattern: the user must prove they control the email address associated with their account.

For security reasons, and because most sites don't have the [apostrophe-email](email.md) module configured yet, this option must be turned on for your site:

```javascript
// in app.js
modules: {
  'apostrophe-email': {
    // See the nodemailer documentation, many
    // different transports are available, this one
    // matches how PHP does it on Linux servers
    nodemailer: {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail'
    }
  },
  'apostrophe-login': {
    passwordReset: true,
    // The default: you have 48 hours to use a password reset link,
    // once it is sent to you
    passwordResetHours: 48,
    email: {
      from: 'password-reset@example.com'
    }
  }
}
```

Once you enable the feature, the user will automatically see a "Reset My Password" link at the bottom of the login form at `/login`. If you don't see that link, make sure you haven't previously overridden our `loginBase.html` template.

## User Redirects on Login

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

*Don't forget to enable your module in `app.js`.*

If you do not set `req.redirect`, the user is redirected to the home page.

For a complete example, check out the [apostrophe-second-chance-login](https://npmjs.org/package/apostrophe-second-chance-login) module, which turns 404's into an opportunity to log in, if a page exists that the user might have the privilege of seeing after logging in.

---
title: What to do when you are locked out of Apostrophe
layout: tutorial
---

Apostrophe is a user-friendly system. But every now and then, you may find a way to "lock yourself out" of Apostrophe. Chicken and egg problems can be frustrating, but don't worry! Here's how to resolve these situations.

### 1. You forgot the password for your account

If your site has the "forgot password" feature enabled, you can go to `/login` and click the "forgot password" link. After completing the form be patient and be sure to check your spam folder.

If this feature is not enabled for your site or does not work for you, reach out to a coworker whose account is still functioning. If they have the `admin` permission, they will be able to edit your user via the "Users" dropdown and set a new password. 

> If this option does not work for you, it is possible for you (or your developer) to change your password or add a new admin account via the command line. See #2 below.

### 2. Your only `admin` account is in the trash

Maybe you accidentally moved it to the trash, maybe another admin user did. Oops! Now how do you log in?

If you are the developer of the site, or you are in communication with them, you can create a new admin account at the command line:

```
node app apostrophe-users:add admin admin
```

The first argument is the username, the second argument is the group name.

**If you get a duplicate key error,** an admin user may still exist after all. Running this command will prompt you for a new password for the `admin` user:

```
node app apostrophe-users:change-password admin
```

**If you get an error saying there is no `admin` group,** it is possible that you do not have a group by that name. Maybe the group was moved to the trash too. You can create a new `admin` group:

```
node app apostrophe-groups:add admin admin
```

The first argument is the group name, the second is the permission we wish to give the group. The `admin` permission grants full access to everything.

> If you're reading this and you do not have access to the command line or recognize it, make sure no one else you work with has access to a working admin account first. Then reach out to the developer responsible for your site.

### 3. You pasted a bad embed code into an HTML widget

Apostrophe offers a raw HTML widget. It's handy for embed codes, but also risky because many websites offer poor quality embed codes that don't "play nicely with others." Some of these can break Apostrophe's version of the `jQuery` library, which wrecks the editing experience on that page. That is especially serious if it is the home page.

Fortunately, Apostrophe has a built-in workaround to disable raw HTML widgets on the page.

If you are currently looking at this URL (just an example):

```
https://www.example.com/
```

And the editing interface does not respond, try this URL:

```
https://www.example.com/?safemode=1
```

Once you gain editing access, look for the HTML widget on the page. It will be easy to find because it will be temporarily displaying the HTML embed source code. Click the icon to edit the widget, and make sure you pasted the embed code correctly.

If you did paste it correctly, it is most likely incompatible with Apostrophe. Click the icon to delete the widget, or edit it and erase the markup it contains. Then find a better embed code, or work with the provider of the embed code to fix its "antisocial" characteristics.

> The following are common problems that embed code developers need to be aware of:
> 
> 1. Do not use `document.write` in an embed code. This will break any website that loads your markup "on the fly" after the page is first rendered.
> 
> 2. Do not install `jQuery` globally (do not overwrite `window.$`). Similarly, do not overwrite `lodash` (`window._`). It is easy to wrap your JavaScript in a closure in which it can still see a convenient `$` variable without breaking other versions of these libraries.

