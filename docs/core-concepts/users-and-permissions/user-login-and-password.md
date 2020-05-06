# User Login and Password Help

There are three things that are inevitable in life, death, taxes, and that someone will forget their password. While Apostrophe can't help you with the first two, it does provide features to help when a user forgets their password or has been locked out of their account.

## Password Reset

Apostrophe includes a "password reset" feature for your users. This feature follows a familiar pattern: the user must prove they control the email address associated with their account.

For security reasons, and because most sites don't have the [apostrophe-email](/devops/email.md) module configured yet, this option must be turned on for your site:


```javascript
// app.js
//...
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
},
//...
```

Once you enable the feature, the user will automatically see a "Reset My Password" link at the bottom of the login form at `/login`. If you don't see that link, make sure you haven't previously overridden your `loginBase.html` template.

## What to do when you are locked out of Apostrophe

As hard as we work to make Apostrophe intuitive and user friendly, you may find a way to "lock yourself out". Sometimes this creates a "chicken and egg" problem where you need to log in to fix the reason that you're locked out, but don't worry! We have solutions!

### 1. You forgot the password for your account

If your site has the "forgot password" feature enabled,

1. Go to `/login` and click the "forgot password" link.

2. Complete the form to receive an email with the password recovery instructions.

3. Follow the instructions in the email to recover your password.

::: tip NOTE
If it doesn't come right away be sure to check your spam folder.
:::

If this feature is not enabled for your site or does not work for you, reach out to a coworker whose account is still functioning. If they have the `admin` permission, they will be able to edit your user via the "Users" dropdown and set a new password.

If this option does not work for you, it is possible for you (or your developer) to change your password or add a new admin account via the command line. See #2 below.

### 2. Your only `admin` account is in the trash

Maybe you accidentally moved it to the trash, maybe another admin user did. Oops! Now how do you log in?

If you have terminal access to Apostrophe you can create a new admin account at the command line:

``` bash
node app apostrophe-users:add admin admin
```

The first argument is the username, the second argument is the group name.

**If you get a duplicate key error,** an admin user may still exist after all. Running this command will prompt you for a new password for the `admin` user:

``` bash
node app apostrophe-users:change-password admin
```

**If you get an error saying there is no `admin` group,** it is possible that you do not have a group by that name. Maybe the group was moved to the trash too. You can create a new `admin` group:

``` bash
node app apostrophe-groups:add admin admin
```

The first argument is the group name, the second is the permission you wish to give the group.

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

::: warning NOTE
The following are common problems that embed code developers need to be aware of:

1. Do not use `document.write` in an embed code. This will break any website that loads your markup "on the fly" after the page is first rendered.

2. Do not install `jQuery` globally (do not overwrite `window.$`). Similarly, do not overwrite `lodash` (`window._`). It is easy to wrap your JavaScript in a closure in which it can still see a convenient `$` variable without breaking other versions of these libraries.
:::
