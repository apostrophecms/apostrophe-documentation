# Sending user notifications

Apostrophe has very good support for sending notifications to users. This is useful whenever something happens, either in the browser or on the server, that should be called to the user's attention.

It is especially useful as a way of calling attention to something that happens on the server without creating new API routes and browser-side JavaScript just to convey that information.

Whether a notification is "born" on the browser or on the server, the user has the same experience: a notice appears in the lower right corner, and stays there until dismissed by the user, unless configured otherwise.

Note that notifications persist from page to page until the user deals with them.

## Sending a server-side notification to the current user

### The basics

Just call:

```javascript
self.apos.notify(req, 'This is a message!', { type: 'error' });
```

`type` may be `error`, `warn` or `success`. If it is not given, a plain style is used.

If the notification should dismiss itself automatically after a few seconds, add `dismiss: true` to the options object.

You can substitute strings into your message using `%s`. Pass additional strings to substitute for each placeholder, before the options object.

### Detailed example

Here is a `products` module that extends `apostrophe-pieces`. Each product is joined to a `specialist` piece. If a product is saved without a specialist, a default specialist is set for the product, and the user editing the product is notified that this happened.

```javascript
// lib/modules/products/index.js

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product',
  addFields: [
    {
      type: 'joinByOne',
      name: '_specialist',
      idField: 'specialistId'
    }
  ],
  construct: function(self, options) {
    self.on('apostrophe-docs:beforeSave', async function(req, doc) {
      if (doc.type !== self.options.name) {
        // IMPORTANT: not our type of piece, leave it alone
        return;
      }
      if (doc.specialistId) {
        // User already picked one
        return;
      }
      const defaultSpecialist = await self.apos.specialists.find(req, {}).limit(1).toObject();
      if (defaultSpecialist) {
        doc.specialistId = defaultSpecialist._id;
        if (req.user) {
          self.apos.notify(req, 'The product %s was assigned to the specialist %s.', doc.title, defaultSpecialist.title, { type: 'warn' });
        }
      }
    });
  }
};
```

## Sending a server-side notification to a different user

### The basics

```javascript
self.apos.notify(user._id, 'This is a message for another user.', { type: 'success' });
```

### Detailed example

Here is an example of a module that updates the `weather` property of `req.data.global` once an hour, for convenient display on every page, by talking to a fictional web API.

If it is unable to reach that API, it sends a notification to the user named `admin`.

It does this by passing the `_id` of the `admin` user in lieu of the usual `req` object.

```javascript
// lib/modules/weather/index.js

const rp = require('request-promise');

module.exports = {
  address: '1168 E. Passyunk Ave. Philadelphia, PA 19147',
  afterConstruct: function(self) {
    self.monitor();
  }
  construct: function(self, options) {
    self.monitor = function() {
      setInterval(self.ping, 1000 * 60 * 60);
    };
    self.ping = async function() {
      try {
        const weather = await rp('http://some/weather/api/somewhere?address=' + options.address);
        await self.apos.docs.db.update({
          type: 'apostrophe-global'
        }, {
          $set: {
            weather: weather.report
          }
        });
      } catch (e) {
        const admin = await self.apos.users.find({ username: admin' }).toObject();
        self.apos.utils.error(e);
        self.apos.notify(admin._id, 'Unable to fetch weather data: %s', e.toString());
      }
    };
  }
};
```

### Sending server-side notifications in tasks

Sending a notification in a [command-line task](/advanced-topics/command-line-tasks.md) works just as shown above. However, if you wish to send one at the *end* of the task, you should `await` the `apos.notify` call. This ensures that the notification reaches the database before the task process exits.

Under other circumstances, you don't need to `await` when calling `apos.notify`. It will take care of itself.

> If you haven't already started, write your tasks as `async` functions. It is much easier than the callback-driven approach.

## Sending browser-side notifications

### The basics

Browser-side notifications are exactly the same, except that you do not have to pass `req`:

```javascript
apos.notify('Hello, current user!', { type: 'success' });
```

> Fun fact: this example works in the Chrome developer console! Just paste it in when logged into Apostrophe.

As before, `type` may be `error`, `warn` or `success`. If it is not given, a plain style is used.

If the notification should dismiss itself automatically after a few seconds, add `dismiss: true` to the options object.

You can substitute strings into your message using `%s`. Pass additional strings to substitute for each placeholder, before the options object.

> Browser-side notifications are only available when a user is logged into Apostrophe. They may only be sent to the current user.

### Detailed example

The [apostrophe-workflow module](https://github.com/apostrophecms/apostrophe-workflow/blob/master/public/js/export-modal.js) uses `apos.notify` calls to display error messages in many situations. See the source code for [export-modal.js](https://github.com/apostrophecms/apostrophe-workflow/blob/master/public/js/export-modal.js).
