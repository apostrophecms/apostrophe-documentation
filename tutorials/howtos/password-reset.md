---
title: Activating the "password reset" feature of Apostrophe
layout: tutorial
---

# password-reset

Apostrophe includes a "password reset" feature for your users. This feature follows the usual pattern: the user must prove they control the email address associated with their account.

For security reasons, and because most sites don't have the [apostrophe-email](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/howtos/email.html) module configured yet, this option must be turned on for your site:

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

