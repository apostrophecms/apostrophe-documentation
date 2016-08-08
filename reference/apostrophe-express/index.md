---
title: "apostrophe-express (module)"
layout: module
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### createApp()

### prefix()

### createData(*req*, *res*, *next*)
Now everyone can rely on this property already existing and just add to it
### sessions()

### requiredMiddleware()

### compileCsrfExceptions()
Allows us to accept both '/api/**' and /^\/api\/.*$/
### csrf(*req*, *res*, *next*)
Angular-compatible. Send the csrftoken cookie as the X-CSRFToken header.
This works because if we're running via a script tag or iframe, we won't
be able to read the cookie.

https://docs.angularjs.org/api/ng/service/$http#cross-site-request-forgery-xsrf-protection

We use Angular's cookie name although CSRF is a more common spelling. -Tom
### optionalMiddleware()

### addListenMethod()

### absoluteUrl(*req*, *res*, *next*)

