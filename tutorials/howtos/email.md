---
title: "Sending email from your Apostrophe project"
layout: tutorial
---

Any module in an Apostrophe project can send email easily. Here's an example. This example builds on `apostrophe-pieces`, which we have already learned about.

```javascript
// in app.js
  modules: {
    suggestions: {},
    'apostrophe-email': {
      // See the nodemailer documentation, many
      // different transports are available, this one
      // matches how PHP does it on Linux servers
      nodemailer: {
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
      }
    }
  }
```

```javascript
// in lib/modules/suggestions/index.js
module.exports = {
  name: 'suggestion',
  extend: 'apostrophe-pieces',
  email: {
    // default "from" address for this module
    from: 'example@example.com'
  },
  construct: function(self, options) {
    self.afterInsert = function(req, piece, options, callback) {
      return self.email(req, 'emailInserted', {
          piece: piece
        }, {
          // can also specify from and other
          // valid properties for nodemailer messages here
          to: 'admin@example.com',
          subject: 'A new suggestion was received'
        },
        callback
      );
    };
  }
};
```

```markup
{# In lib/modules/suggestions/views/emailInserted.html #}
<h4>A new suggestion was received</h4>

<p>A new suggestion was inserted. <a href="{{ data.piece._url }}">See it on the site.</a></p>
```

**What's happening in this code?** First, we must configure the `apostrophe-email` module. If we don't, Apostrophe doesn't know what to do with email messages. In this example we configure the `sendmail` transport, which works with Postfix, sendmail and various other common mailer daemons on Linux servers. But you can [pass any configuration, which will be passed on to the `createTransport` method of nodemailer](https://nodemailer.com/about/).

For instance you might set it up with credentials to send SMTP email via a gmail account, or via a service like Postmark or Amazon SES, to guarantee reliable delivery. And you should definitely do that if your mailserver isn't set up very carefully with both [DKIM](http://www.dkim.org/) and [SPF](https://en.wikipedia.org/wiki/Sender_Policy_Framework). Those are a lot of work, so think about letting the pros do it.

Once `apostrophe-email` is configured, we can invoke the `email` method of any module to conveniently send email, formatting it with any Nunjucks template in that module. All we have to do is provide `req`, a template name, an object with data to be exposed as `data` in the Nunjucks template, and an object with email headers such as `from`, `to` and `subject`. We can also set `from` conveniently at the module level, as shown here.

A plaintext version of the email is also automatically created, with valid URLs replacing links, so you don't have to provide a separate template for plaintext.

**You can also use promises.** If you invoke the `self.email` method of your module without a callback, a promise is returned.

**"Hey, all of my emails wound up in the spam folder!"** Staying out of the spam folder is outside the scope of Apostrophe... but see the above advice re: using a reliable delivery service like Postmark or Amazon SES, or configuring your own mailserver carefully to sign everything well.

**"Hey, a suggestions module sounds great, where's the rest of the code for that?"** We're just demonstrating email here, but check out the [apostrophe-pieces-submit-widgets](https://npmjs.org/package/apostrophe-pieces-submit-widgets) module, which is what you're looking for. Add the above `afterInsert` method to send email to the administrator when new submissions are made.