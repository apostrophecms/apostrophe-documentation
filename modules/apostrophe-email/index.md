---
title: "apostrophe-email (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### emailForModule(*req*, *templateName*, *data*, *options*, *module*, *callback*)
Implements the `email` method available in all modules.

See `apostrophe-module` for coverage of the `email` method that
every module has. You won't need to call `emailForModule` directly.
### getTransport()
Fetch the nodemailer-compatible transport object. The default
implementation creates a transport via `nodemailer.createTransport`
on the first call, passing it the value of the `nodemailer` option
configured for the `apostrophe-email` module. If there is none,
a fatal error is thrown.
