# apostrophe-login
## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
### `apos.login`
Enable users to log in via a login form on the site at `/login`.

## Options

`loginUrl`

alternative login url, if this is not present, the login route is `/login`

`localLogin`

If explicitly set to `false`, the `/login` route does not exist,
and it is not possible to log in via your username and password.
This usually makes sense only in the presence of an alternative such as
the `apostrophe-passport` module, which adds support for login via
Google, Twitter, gitlab, etc.

`passwordMinLength`

The minimum length for passwords. You should set this, as there
is no default for bc reasons (effectively the default is `1`).

`passwordRules`

An optional array of password rule names, as strings. The standard rules
available are `noSlashes`, `noSpaces`, `mixedCase`, `digits`, and
`noTripleRepeats`. The `noTripleRepeats` rule forbids repeating a
character three times in a row. By default no rules are in effect.

When this option is set, the rules are consulted when a password
is set or reset. Existing passwords that do not follow the rules
are tolerated. If you wish to enforce them for existing passwords
as well, see below.

`resetLegacyPassword`

By default, password rules are enforced only when a password is
being set or reset. If you wish, you can set `resetLegacyPassword: true`
to require users to reset their password on the spot if it is
correct but does not meet the current rules. However if you are able
to enable the email-based `passwordReset: true` option that
is slightly more secure because it requires proof of ownership of the
email address as well as the old password. You can combine that with
`passwordRulesAtLoginTime`, below.

`passwordRulesAtLoginTime`

By default, password rules are enforced only when a password is
being set or reset. Setting this option to `true` will apply
the rules at login time, so that even an existing password will
not work unless it passes the rules. This can be useful if you don't
mind a few irritated users and you have enabled
the email-based `passwordReset: true`. However this requires
email delivery to work (see below), so you may be more comfortable
with `resetLegacyPassword: true` (above).

`passwordReset`

If set to `true`, the user is given the option to reset their password,
provided they can receive a confirmation email. Not available if `localLogin` is `false`.
Email delivery must work, which requires more configuration; see [sending email with ApostropheCMS](/devops/email.md).

`passwordResetHours`

When `passwordReset` is `true`, this option controls how many hours
a password reset request remains valid. If the confirmation email is not
acted upon in time, the user must request a password reset again.
The default is `48`.

`resetKnownPassword`

This option allows the user to change their password, provided they know
their current password. This is helpful, but it does not help uers who have
forgotten their passwords. For that, you should enable `passwordReset`
(see above for concerns). You should bear in mind that this option is not as
secure as requiring confirmation via email with `passwordReset.

`throttle`

If the `throttle` option is set to `{ allowedAttempts: 3, perMinutes: 1, lockoutMinutes: 10 }` for
this module then no more than three failed attempts per minute are permitted
for the same account, after which the user is locked out for 10 minutes. If
`throttle` exists, `allowedAttempts` defaults to 3, `perMinutes` defaults to 1,
and `lockoutMinutes` also defaults to 1.

`totp`

If this option is set to `true`, the user will be required to set up two-factor
authentication via Google Authenticator or a compatible app (TOTP) on their
next successful login, and all future logins will require the verification code.

If this option is set to an object, you may specify sub-options:

`totp: { groups: true }`

The `groups` sub-option indicates that TOTP is only required for groups
for which it has been activated. This usually only makes sense when the
`groups` option for the `apostrophe-user` module is *not* set, allowing
administrators to edit the configuration for groups, make new ones, and
check the box to require TOTP.

## Notable properties of apos.modules['apostrophe-login']

`passport`

Apostrophe's instance of the [passport](https://npmjs.org/package/passport) npm module.
You may access this object if you need to implement additional passport "strategies."

## Promise events

### after

The promise event `after` is emitted after login succeeds. This
is a good place to set `req.redirect` to the URL of your choice. If no module sets
`req.redirect`, the newly logged-in user is redirected to the home page. The
event handler receives `req`.

### `before`

The promise event `before` is emitted by the `/login` route,
before any attempt is made to evaluate the login. It receives `req`. If it
throws a string as an error, that string is internationalized and reported
to the user as the login error message. This is useful to implement modules
like `apostrophe-login-recaptcha`.

### `deserialize`

The promise event `deserialize` is emitted on every HTTP request by a
logged-in user. It receives `user`, the object found in the database for
this user. This event is used, for instance, to fetch group information
related to the user. To avoid degrading the editing experience handlers
for this event should be as fast as possible.


## Methods
### enableSerializeUsers()
Set the `serializeUser` method of `passport` to serialize the
user by storing their user ID in the session.
### randomKey(*len*)

### getRandomInt(*min*, *max*)

### enableDeserializeUsers()
Set the `deserializeUser` method of `passport` to
deserialize the user by locating the appropriate
user via the [apostrophe-users](/reference/modules/apostrophe-users)
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
[apostrophe-users](/reference/modules/apostrophe-users) module.
Users with the `disabled` property set to true may not log in.
Passwords are verified via the `verifyPassword` method of
[apostrophe-users](/reference/modules/apostrophe-users), which is
powered by the [credential](https://npmjs.org/package/credential) module.
### enableTotp()

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
### verifyPassword(*user*, *password*, *callback*)
Verify the given password by checking it against the
hash in the safe. The callback is invoked with an error
on failure, otherwise with `null`.

`user` is an `apostrophe-user` doc. If `options.throttle` is set to
`{ allowedAttempts: 3, perMinutes: 1, lockoutMinutes: 10 }` for this module then no more than three failed
attempts per minute are permitted for the same account, after which the user is locked out
for 10 minutes. If `options.throttle` exists, `perMinutes` defaults to
1 minute, `lockoutMinutes` also defaults to 1 minute, and `allowedAttempts` must
be specified.
### verifyTotp(*user*, *done*)

### disableIfInactive(*user*)

### checkIfActive(*user*, *callback*)

### enableMiddleware()
Add Passport's initialize and session middleware.
Also add middleware to add the `req.data.user` property.
Now works via the expressMiddleware property, allowing
control of timing relative to other modules.
### requireTotp(*req*, *res*, *next*)
If the user is logged in, require that they also have
totp, otherwise kick them over to get it
### totpNeeded(*req*)

### getLoginUrl()
return the loginUrl option
### addRoutes()
Add the `/login` route, both GET (show the form) and POST (submit the form).
Also add the `/logout` route.
### getPasswordResetLifetimeInMilliseconds()

### sendPasswordResetEmail(*req*, *user*)
Send a password reset email, with a magic link to a one-time-use
form to reset the password, to the given `user`. Returns
a promise; when that promise resolves the email has been
handed off for delivery (not necessarily received).

NOTE: the promise will be rejected if the user has no
`email` property to which to send an email.
### addUserToData(*req*, *res*, *next*)
Add the `user` property to `req.data` when a user is logged in.
### pushAssets()
Push the login stylesheet.
### addAdminBarItems()

### afterLogin(*req*, *res*)
Invoked by passport after an authentication strategy succeeds
and the user has been logged in. Invokes `loginAfterLogin` on
any modules that have one and redirects to `req.redirect` or,
if it is not set, to `/`.
### checkPasswordRules(*req*, *password*)
Returns an array of error messages, which will be
empty if there are no errors. The error messages
will be internationalized for you.
### addPasswordRule(*name*, *test*, *message*)
Register a password validation rule. Does not
activate it, see the passwordRules option.
`name` is a unique name to be included in the
`passwordRules` option array, `test` is a function
that accepts the password and returns `true` only
if the password passes the rule, and `message`
is a short message to be shown to the user in the
event the rule fails, which will automatically be
internationalized for you.
### modulesReady()

