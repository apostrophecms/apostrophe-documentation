---
title: "apostrophe-login (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.login`
Enable users to log in via a login form on the site at `/login`.

## Options

`localLogin`

If explicitly set to `false`, the `/login` route does not exist,
and it is not possible to log in via your username and password.
This usually makes sense only in the presence of an alternative such as
the `apostrophe-passport` module, which adds support for login via
Google, Twitter, gitlab, etc.

`passwordReset`

If set to `true`, the user is given the option to reset their password,
provided they can receive a confirmation email. Not available if `localLogin` is `false`.

`passwordResetHours`

When `passwordReset` is `true`, this option controls how many hours
a password reset request remains valid. If the confirmation email is not
acted upon in time, the user must request a password reset again.
The default is `48`.

## Notable properties of apos.modules['apostrophe-login']

`passport`

Apostrophe's instance of the [passport](https://npmjs.org/package/passport) npm module.
You may access this object if you need to implement additional passport "strategies."

## callAll method: loginAfterLogin

The method `loginAfterLogin` is invoked on **all modules that have one**. This method
is a good place to set `req.redirect` to the URL of your choice. If no module sets
`req.redirect`, the newly logged-in user is redirected to the home page. `loginAfterLogin`
is invoked with `req` and may also optionally take a callback.


## Methods
### enableSerializeUsers()
Set the `serializeUser` method of `passport` to serialize the
user by storing their user ID in the session.
### enableDeserializeUsers()
Set the `deserializeUser` method of `passport` to
deserialize the user by locating the appropriate
user via the [apostrophe-users](../apostrophe-users/index.html)
module. Then invokes the `loginDeserialize` method of
every module that has one, passing the `user` object. These
methods may optionally take a callback.
### deserializeUser(*id*, *callback*)
Given a user's `_id`, fetches that user via the login module
and, if the user is found, invokes the `loginDeserialize`
method of all modules that have one via `callAll`.
Then invokes the callback with `(null, user)`.

If the user is not found, invokes the callback with
`(null, null)` (NOTE: no error in the first argument).

If another error occurs, it is passed as the first argument.

This method is passed to `passport.deserializeUser`.
It is also useful when you wish to load a user exactly
as Passport would.
### loginDeserialize(*user*)
On every request, immediately after the user has been fetched,
build the `user._permissions` object which has a simple
boolean property for each permission the user possesses.

Permissions can be obtained either via the group or via the
user object itself, although there is currently no interface for
adding permissions directly to a user.

`admin` implies `edit`, and `edit` implies `guest`. These
are populated accordingly.

If you have `admin-` rights for any specific content types,
you are also granted `guest` and `edit` (create) permissions for other
types that are not restricted to admins only.
### enableLocalStrategy()
Adds the "local strategy" (username/email and password login)
to Passport. Users are found via the `find` method of the
[apostrophe-users](../apostrophe-users/index.html) module.
Users with the `disabled` property set to true may not log in.
Passwords are verified via the `verifyPassword` method of
[apostrophe-users](../apostrophe-users/index.html), which is
powered by the [credential](https://npmjs.org/package/credential) module.
### verifyLogin(*username*, *password*, *callback*)
Verify a login attempt. `username` can be either
the username or the email address (both are unique).

If a system-level failure occurs, such that we don't
know if the user's login should have succeeded,
then the first argument to the callback is an error.

If the user's login FAILS, the first argument is
is `null`, and the second argument is `false` (no user).

If the user's login SUCCEEDS, the first argument
is `null` and the second argument is the user object.

PLEASE NOTE THAT A USER FAILING TO LOG IN
**DOES NOT** REPORT AN ERROR as the first callback
argument. You MUST check the second argument.

The convention is set this way for compatibility
with `passport`.
### enableMiddleware()
Add Passport's initialize and session middleware.
Also add middleware to add the `req.data.user` property.
Now works via the expressMiddleware property, allowing
control of timing relative to other modules.
### addRoutes()
Add the `/login` route, both GET (show the form) and POST (submit the form).
Also add the `/logout` route.
### getPasswordResetLifetimeInMilliseconds()

### addUserToData(*req*, *res*, *next*)
Add the `user` property to `req.data` when a user is logged in.
### pushAssets()
Push the login stylesheet.
### addAdminBarItems()
Add the logout admin bar item.
### afterLogin(*req*, *res*)
Invoked by passport after an authentication strategy succeeds
and the user has been logged in. Invokes `loginAfterLogin` on
any modules that have one and redirects to `req.redirect` or,
if it is not set, to `/`.
