---
title: "apostrophe-express (module)"
layout: reference
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
This module initializes the Express framework, which Apostrophe
uses and extends to implement both API routes and page-serving routes.
The Express `app` object is made available as `apos.app`, and
the `express` object itself as `apos.express`. You can add
Express routes directly in your modules via `apos.app.get`,
`apos.app.post`, etc., however be sure to also check
out the [route method](../apostrophe-module/index.html#route) available
in all modules for a cleaner way to implement API routes. Adding
routes directly to the Express app object is still sometimes useful when
the URLs will be public.

This module also adds a number of standard middleware functions
and implements the server side of CSRF protection for Apostrophe.

## Options

### `baseUrl`

As a convenience, `req.absoluteUrl` is set to the absolute URL of
the current request. If the `baseUrl` option is set to a string
such as `http://mysite.com`, any site-wide prefix and `req.url` are
appended to that. Otherwise the absolute URL is constructed based
on the browser's request.

### `address`

Apostrophe listens for connections on all interfaces (`0.0.0.0`)
unless this option is set to another address.

In any case, if the `ADDRESS` environment variable is set, it is
used instead.

### `port`

Apostrophe listens for connections on port `3000` unless this
option is set to another port.

In any case, if the `PORT` environment variable is set, it is used
instead.

### `prefix` *(a global option, not a module option)*

This module implements parts of the sitewide `prefix` option, which is a global
option to Apostrophe not specific to this module. If a `prefix` such
as `/blog` is present, the site responds with its home page
at `/blog` rather than `/`. All calls to `res.redirect` are adjusted
accordingly, and supporting code in other modules adjusts AJAX calls
made by jQuery as well, so that your code does not have to be
"prefix-aware" in order to work.

### `afterListen` *(a global option, not a module option)*

If Apostrophe was configured with an `afterListen` option, that
function is invoked after the site is ready to accept connections.
An error will be passed if appropriate.

### `session`

Properties of the `session` option are passed to the
[express-session](https://npmjs.org/package/express-session) module.
If each is not otherwise specified, Apostrophe enables these defaults:

```javascript
{
  // Do not save sesions until something is stored in them.
  // Greatly reduces aposSessions collection size
  saveUninitialized: false,
  // The mongo store uses TTL which means we do need
  // to signify that the session is still alive when someone
  // views a page, even if their session has not changed
  resave: true,
  // Always update the cookie, so that each successive
  // access revives your login session timeout
  rolling: true,
  secret: 'you should have a secret',
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    // Default login lifetime between requests is one day
    maxAge: 86400000
  },
  store: // creates an instance of connect-mongo/es5
}
```

### `csrf`

By default, Apostrophe implements Angular-compatible [CSRF protection](https://en.wikipedia.org/wiki/Cross-site_request_forgery)
via an `XSRF-TOKEN` cookie. The `apostrophe-assets` module pushes
a call to the browser to set a jQuery `ajaxPrefilter` which
adds an `X-XSRF-TOKEN` header to all requests, which must
match the cookie. This is effective because code running from
other sites or iframes will not be able to read the cookie and
send the header.

All non-safe HTTP requests (not `GET`, `HEAD`, `OPTIONS` or `TRACE`)
automatically receive this proection via the csrf middleware, which
rejects requests in which the CSRF token does not match the header.

If the `csrf` option is set to `false`, CSRF protection is
disabled (NOT RECOMMENDED).

If the `csrf` option is set to an object, you can configure
individual exceptions:

```javascript
csrf: {
  exceptions: [ '/cheesy-post-route' ]
}
```

Exceptions may use minimatch wildcards (`*` and `**`). They can
also be regular expression objects.

You may need to use this feature when implementing POST form submissions that
do not use AJAX and thus don't send the header. We recommend using
`$.post` or `$.jsonCall` for your forms, which eliminates this issue.

There is also a `minimumExceptions` option, which defaults
to `[ /login ]`. The login form is the only non-AJAX form
that ships with Apostrophe. XSRF protection for login forms
is unnecessary because the password itself is unknown to the
third party site; it effectively serves as an XSRF token.

### middleware

If a `middleware` array is present, those functions are added
as Express middleware by the `requiredMiddleware` method, immediately
after Apostrophe's standard middleware.

## Optional middleware: `apos.middleware`

This module adds a few useful but optional middleware functions
to the `apos.middleware` object for your use where appropriate:

### `apos.middleware.files`

This middleware function accepts file uploads and makes them
available via `req.files`. See the
[connect-multiparty](https://npmjs.org/package/connect-multiparty) npm module.
This middleware is used by [apostrophe-attachments](../apostrophe-attachments/index.html).


## Methods
### createApp()
Create Apostrophe's `apos.app` and `apos.express` objects
### prefix()
Patch Express so that all calls to `res.redirect` honor
the global `prefix` option without the need to make each
call "prefix-aware"
### createData(*req*, *res*, *next*)
Standard middleware. Creates the `req.data` object, so that all
code wishing to eventually add properties to the `data` object
seen in Nunjucks templates may assume it already exists
### sessions()
Establish Express sesions. See [options](#options)
### requiredMiddleware()
Install all standard middleware:

* Create the `req.data` object on all requests
* Implement Express sessions
* Add the cookie parser
* Angular-style CSRF protection
* Extended body parser (`req.body` supports nested objects)
* JSON body parser (useful with `$.jsonCall`)
* Flash messages (see [connect-flash](https://github.com/jaredhanson/connect-flash))
* Internationalization (see [apostrophe-i18n](../apostrophe-i18n/index.html))
* `req.absoluteUrl` always available (also see [baseUrl](#baseUrl))

### enableCsrf()

### compileCsrfExceptions()
Compile CSRF exceptions, which may be regular expression objects or
"minimatch" strings using the * and ** wildcards
### csrf(*req*, *res*, *next*)
Angular-compatible CSRF protection. On safe requests (GET, HEAD, OPTIONS, TRACE),
set the XSRF-TOKEN cookie if missing. On unsafe requests (everything else),
make sure our jQuery `ajaxPrefilter` set the X-XSRF-TOKEN header to match the
cookie.

This works because if we're running via a script tag or iframe, we won't
be able to read the cookie.

[See the Angular docs for further discussion of this strategy.](https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection)
### optionalMiddleware()
Establish optional middleware functions as properties
of the `apos.middleware` object. Currently just `apos.middleware.files`.
### addListenMethod()
Establish the `apos.listen` method, which Apostrophe will invoke
at the end of its initialization process.
### absoluteUrl(*req*, *res*, *next*)
Standard middleware. Sets the `req.absoluteUrl` property for all requests,
based on the `baseUrl` option if available, otherwise based on the user's
request headers. The global `prefix` option and `req.url` are then appended.
