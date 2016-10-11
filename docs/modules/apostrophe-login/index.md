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

## Notable properties of apos.modules['apostrophe-login']

`passport`

Apostrophe's instance of the [passport](https://npmjs.org/package/passport) npm module.
You may access this object if you need to implement additional passport "strategies."

## Global method: loginAfterLogin

The method `loginAfterLogin` is invoked on **all modules that have one**. This method
is a good place to set `req.redirect` to the URL of your choice. If no module settings
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
### enableMiddleware()
Add Passport's initialize and session middleware.
Also add middleware to add the `req.data.user` property.
### addRoutes()
Add the `/login` route, both GET (show the form) and POST (submit the form).
Also add the `/logout` route.
### addUserToData(*req*, *res*, *next*)
Add the `user` property to `req.data` when a user is logged in.
### pushAssets()
Push the login stylesheet.
### addAdminBarItems()
Add the logout admin bar item.
