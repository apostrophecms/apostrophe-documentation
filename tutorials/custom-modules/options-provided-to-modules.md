---
title: Options provided to modules
---

In addition to the options you specify for each module in `app.js` when [configuring your project](../configuration/index.html), all modules receive:

`apos`: the `apos` object, a singleton which provides core methods for content management. See the [apostrophe](http://github.com/punkave/apostrophe) module documentation.

`app`: the Express app object. You can add routes via `app.get`, `app.post`, etc. at any time in your module's constructor. Our convention is to prefix routes with `/apos/modulename`, where modulename is a short name for the module (`blog`, not `apostrophe-blog`). This prevents conflicts with URLs used for pages.

`pages`: the `pages` object, a singleton which provides methods for dealing with the page tree. See the [apostrophe-pages](http://github.com/punkave/apostrophe-pages) module documentation.

`schemas`: the `schemas` object, a singleton which provides methods for dealing with schemas. You may wish to use this if your module handles form submissions and would like the same conveniences that [fancy pages](../pages/index.html) and [snippets](../snippets/index.html) have. See the [apostrophe-schemas](http://github.com/punkave/apostrophe-schemas) module documentation.

`mailer`: a `nodemailer` transport object, ready to send email as needed. See the [nodemailer](http://www.nodemailer.com/) documentation.

`site`: an object containing `title`, `shortName` and `hostName` properties, as configured in `app.js`. We suggest using `shortName` to name databases and other resources specific to your project.

`modules`: this is not what you think. See [accessing other modules](accessing-other-modules.html) for the right way to access other modules.

