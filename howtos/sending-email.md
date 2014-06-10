---
title: Sending Email
---

Need to send email? No problem. A2 provides your modules with a ready-to-rock instance of the nodemailer module, which always appears as the `email` option in your module's constructor.

A2 also provides a convenient mixin that adds an easy `email` method to your module.

## How to use the mixin

Just invoke the mixin like this in your constructor:

```javascript
self._apos.mixinModuleEmail(self);
```

Your module must also use the asset mixin. This is already in place if you are subclassing almost any of the standard A2 modules. If not, make sure you invoke it in your constructor:

```javascript
self._apos.mixinModuleAssets(self, 'mymodulename', __dirname, options);
```

Now you may send email like this throughout your module:

```javascript
return self.email(
  req,
  // from
  { fullName: 'Our Company', email: 'support@example.com' },
  // to
  req.user,
  // Nunjucks template for the subject line
  'Your request to reset your password on {{ host }}',
  // Nunjucks template in this module for the actual email.
  // Must have both .html and .txt versions
  'resetRequestEmail',
  // Data to pass to the template
  {
    url: 'http://amazing.stuff'
  },
  function(err) { ... }
);
```

## Understanding the Parameters

### Request Object

"req" is the request object and must be present.

### Sender ("from")

"from" is the full name and email address of the sender. You may
pass a string formatted like this:

```javascript
Bob Smith <bob@example.com>
```

Or an object with `email` and "fullName` properties; or an object with "email" and "title" properties; or req.user; or a `person` object from `apostrophe-people`.

**You may omit the "from" argument and set it via configuration in
app.js instead** as described below.

*If you omit it AND don't configure it, you'll get a terrible "from" address!
You have been warned!*

### Recipient ("to")

"to" works just like "from". However, it is required and there are no
options for it in app.js.

### Subject Line

The fourth argument is the subject line. It is rendered by nunjucks and can see
the data you pass in the sixth argument and other variables as described below.

It is easy to override the subject in app.js as described below.

### Template Name

The fifth argument is the template name. If it is "resetRequestEmail", then
self.email will look for the templates `resetRequestEmail.txt` and
`resetRequestEmail.html` in your module's views folder, render both of them, and build an email with both
plaintext and HTML parts for maximum compatibility. You can override these templates
at project level in `lib/modules/modulename/views` exactly as you would for any other template.

### Data

All properties passed as part of the sixth argument are passed to the templates
as nunjucks data. They are also available in the subject line.

In addition, the following variables are automatically supplied:

`host` is the hostname of the site, as determined from req.

`baseUrl` is the base URL of the site, like: `http://sitename.com`

### Absolute URLs

URLs in emails must be absolute, but most of the time in your code you use
relative URLs starting with /. As a convenience, self.email() will automatically transform properties beginning with "url" or ending in "Url" into
absolute URLs before passing your data on to the templates. This rule is
applied recursively to the data object, so an array of events will all have
their .url properties made absolute.

### Sending Email In Tasks

The req object used in tasks will generate the correct absolute URLs
only if you add a "baseUrl" property to it, which should look like:

```
http://mysite.com
```

Note there is no slash after the hostname.

### Callback

The final argument is a standard node callback function and will receive
an error if any takes place.

## Configuration: Easy Overrides

**For these features to work, your module must set self._options or
self.options** to the options object it was configured with. This happens
automatically for everything derived from apostrophe-snippets.

When you configure your module, pass an object as the "email" option, with
sub-properties as described below.

### Overriding the Subject

The subject line can be overridden in app.js when configuring your module.
If the template name (fifth argument) is "resetRequestEmail", then the
option "resetRequestEmailSubject" overrides the subject.

### Overriding the "From" Address

If the "from" option is a string or is absent, and the template name is "resetRequestEmail", then the "resetRequestEmailFrom" option determines who the email comes from, if present.

If there is no such option then the "from" option
determines who the email comes from. This allows you to set a global "from" address for all email in your module.

If this option is not set either and the "from" argument was omitted, then the email comes from:

```
Do Not Reply <donotreply@example.com>
```

But this is terrible, so make sure you set the appropriate options.

In app.js you may set the from address to a string in this format:

```
Bob Smith <donotreply@example.com>
```

Or use an object with fullName and email properties.

PLEASE NOTE: if you pass an object rather than a string as the "from" argument when calling `self.email`, configuration options are always ignored in favor of what you passed. However if you pass a string it is assumed to be a hard-coded default and options are allowed to override it.

