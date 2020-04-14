## Inherits from: [apostrophe-module](./apostrophe-module/README.md)

## Methods
### emailForModule(*req*, *templateName*, *data*, *options*, *module*, *callback*)
Implements the `email` method available in all modules.

See `apostrophe-module` for coverage of the `email` method that
every module has. You won't need to call `emailForModule` directly.
### getContent(*req*, *templateName*, *data*, *options*, *module*)
Compute the content of the email. This is an interesting override point
to add properties that will be passed to nodemailer transport when
sending the email.
### getTransport(*req*, *data*, *options*)
Fetch the nodemailer-compatible transport object, that is going to be
used to send the email. It may be a convenient override point to decide
which transport to use according to the parameters passed. The default
implementation creates a transport via `nodemailer.createTransport`
on the first call, passing it the value of the `nodemailer` option
configured for the `apostrophe-email` module. If there is none,
a fatal error is thrown.
