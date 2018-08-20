---
title: "Apostrophe Events"
layout: reference
---

## Apostrophe Promise Events: responding to events on the server side

Need to do something every time a page is rendered... like fetching extra data from an API? How about doing something special every time a document is updated? Apostrophe's "promise events" are the solution. There are many available, a complete reference is below.

To listen to a promise event in your own server-side code:

1. Create a module, or extend an existing one with project-level code or a subclass.

2. In `index.js`, make a call to `self.on()` inside the `construct` function of your module.

3. Specify the name of the promise event you want to listen to.

4. Specify a unique name for your event **handler**, which will **become a method of your module**.

5. Pass a function containing your custom code.

Here is a **complete example**. Here we will use promise events to add the current weather forecast to every page.

If you try out this code yourself you must [register your own openweathermap api key](https://openweathermap.org/) and substitute it below.

```
# Install the request-promise module for fetching data from APIs
npm install request-promise

```javascript
// in app.js

modules: {
  // Other modules, then...
  'my-module': {}
}
```

```javascript
// In lib/modules/my-module/index.js

const request = require('request-promise');

module.exports = {
  construct: function(self, options) {
    // Add weather forecast to `req.data.forecast`, so our page templates
    // can find it in `data.forecast`. In production you would definitely
    // want to cache the API response

    // Node 8: use an async function (note the async keyword)
    self.on('apostrophe-pages:beforeSend', 'addWeather', async function(req) {
      // Node 8+: we can "await" anything that returns a promise, like
      // the request-promise module does
      const forecast = await request({
        uri: 'http://api.openweathermap.org/data/2.5/forecast?id=5205788&APPID=PUTYOUROWNAPIKEYHERE',
        json: true
      });
      req.data.forecast = forecast;
    });
  }
}
```

```markup
{# in layout.html #}

<footer>
  <h4>Current Weather: {{ data.forecast.weather.description }}</h4>
</footer>
```

> **What's going on in this code?** We use `self.on` to listen to the `apostrophe-pages:beforeSend` promise event, which is sent by the `apostrophe-pages` module just before it renders the page. This is our last chance to do any asynchronous work, like talking to an API. We name our event handler method `addWeather`, so that we can extend it later in a subclass of this module if we choose. And we pass an `async function`, taking advantage of the fact that these automatically return promises in Node 8. Apostrophe will wait for our promise to resolve before rendering the page.
>
> The other half of the `async function` dance is using `await` to wait for `request-promise` to finish its work.
>
> **"What if I don't have Node 8 yet and I can't use async/await?"** You can return a promise instead. We suggest using Bluebird promises, but built-in JavaScript promises are fine.
>
> **"What if I don't need to return a promise because I'm not doing any asynchronous work?"** That's OK. Just do what you need to do and return. But if you are fetching information from a database or API, understand that you *are* doing asynchronous work and *must* return a promise or use `async/await`.

## Relationship to the older `callAll` feature

In Apostrophe 2.x, many modules still rely on the `callAll` feature, in which Apostrophe invokes a named method on *every module that has one.* While similar to events, this feature did not support promises and led to hard-to-debug problems if a matching method were added to a superclass module later. 

Beginning with Apostrophe 2.63.0, Apostrophe also emits a promise event every time it invokes a callAll method, so there is no benefit to writing new `docBeforeSave` or `pagesBeforeSend` handlers, unless your intention is to override one in a method you are extending.

## Promise Events Reference

Here is the complete list of promise events you can listen to with "straight out of the box" Apostrophe. Each is shown with the arguments your listener will receive, if any.

### `apostrophe:destroy`

Invoked when an `apos` object is being shut down. Your handlers should clean up any custom `setTimeout`s, `setInterval`s and/or open socket or database connections you have created. This is important if you are using the [apostrophe-multisite](https://github.com/apostrophecms/apostrophe-multisite) module. You should *not* "destroy" your actual website content. Just close any remaining open connections, timeouts, etc.

### `apostrophe:modulesReady`

Invoked when all of Apostrophe's modules, including core modules, npm modules and your own project-level modules, have been completely constructed. Use this listener to avoid "chicken and egg" problems where your module has to wait for another one to be ready. 

### `apostrophe:afterInit`

Invoked after all `apostrophe:modulesReady` handlers have completed. **Note that it is too late to add Express routes at this point.** Express routes should be added no later than `apostrophe:modulesReady` and are usually added in your module's `afterConstruct` function. (Hint: remember, the route isn't actually executed until requests begin arriving, which will be safely after everything has initialized. You can access resources inside a route that don't yet exist when your module is first initializing.)

### `apostrophe-db:reset`

Invoked after Apostrophe resets the database in the `apostrophe-db:reset` command line task (drops all collections). You may wish to delete content of your own to extend this task.

### `apostrophe-docs:beforeInsert(req, doc, options)`

Invoked just before Apostrophe inserts a document into the database for the first time. **Always check doc.type first, and return right away if it is not relevant to your code.** The arguments are the same arguments that were passed to `apos.docs.insert`.

### `apostrophe-docs:beforeSave(req, doc, options)`

Invoked just before Apostrophe either inserts *or* updates a document. **Always check doc.type first, and return right away if it is not relevant to your code.** The arguments are the same arguments that were passed to `apos.docs.insert` or `apos.docs.update`.

### `apostrophe-docs:beforeUpdate(req, doc, options)`

Invoked just before Apostrophe updates an existing document in the database. **Always check doc.type first, and return right away if it is not relevant to your code.** The arguments are the same arguments that were passed to `apos.docs.insert`.

### `apostrophe-docs:afterInsert(req, doc, options)`

Invoked just **after** Apostrophe inserts a document into the database for the first time. **Always check doc.type first, and return right away if it is not relevant to your code.** The arguments are the same arguments that were passed to `apos.docs.insert`.

### `apostrophe-docs:afterSave(req, doc, options)`

Invoked just **after** Apostrophe either inserts *or* updates a document. **Always check doc.type first, and return right away if it is not relevant to your code.** The arguments are the same arguments that were passed to `apos.docs.insert` or `apos.docs.update`.

### `apostrophe-docs:afterUpdate(req, doc, options)`

Invoked just **after** Apostrophe updates an existing document in the database. **Always check doc.type first, and return right away if it is not relevant to your code.** The arguments are the same arguments that were passed to `apos.docs.insert`.

### `apostrophe-docs:afterDenormalizePermissions(req, doc, options)`

Invoked after Apostrophe "denormalizes" permissions settings, creating the `docPermissions` array, which is an array of strings made up of a permission name, a hyphen, and a user or group `_id`. Modules like [apostrophe-workflow](https://npmjs.com/package/apostrophe-workflow) respond to this event to extend Apostrophe's permissions. The arguments are the same arguments that were passed to `apos.docs.insert` or `apos.docs.update`.

### `apostrophe-docs:beforeTrash(req, doc)`

Invoked just before Apostrophe moves the specified `doc` to the trash. When `apostrophe-workflow` is in play this event is not emitted because `trash` is just another schema field.

### `apostrophe-docs:afterTrash(req, doc)`

Invoked just after Apostrophe moves the specified `doc` to the trash. When `apostrophe-workflow` is in play this event is not emitted because `trash` is just another schema field.

### `apostrophe-docs:beforeRescue(req, doc)`

Invoked just before Apostrophe rescues the specified `doc` from the trash. When `apostrophe-workflow` is in play this event is not emitted because `trash` is just another schema field.

### `apostrophe-docs:afterRescue(req, doc)`

Invoked just after Apostrophe rescues the specified `doc` from the trash. When `apostrophe-workflow` is in play this event is not emitted because `trash` is just another schema field.

### `apostrophe-docs:fixUniqueError(req, doc)`

Invoked just after Apostrophe encounters a unique key error while updating or inserting the specified document. Apostrophe will attempt to fix the error by modifying the `slug` and `path` properties as needed, then retry a small number of times. You may wish to update additional properties.

### `apostrophe-login:deserialize(user)`

Invoked on each request just after the current user, if any, has been fetched from the database. The handler for this event in `apostrophe-login` itself adds the `_permissions` convenience property. You may perform similar steps to add convenience properties to what will become `req.user`. Keep in mind it must be very fast as it runs on every reuest.

### `apostrophe-login:after(req)`

Invoked immediately after login, this handler may set `req.redirect` to any URL (this is a string property that you assign a value to). If it does, the user will be redirected there.

### `apostrophe-pages:beforeSend(req)`

Invoked just before the page is rendered, this is the most popular promise event because it is **your last chance to do any asynchronous work**, such as fetching something from a database or an API, before the page is rendered. It is common to access additional information and attach it to the `req.data` object, so that it becomes available as part of the `data` object in page templates.

> This event can also be emitted by other modules, such as `apostrophe-login`, that render complete pages such as the login form in a way that does not involve a page in the database at all. In these cases the event name to listen for is `apostrophe-login:beforeSend`, or as appropriate.

### `apostrophe-pages:serve(req)`

Similar to `apostrophe-pages:beforeSend`, but invoked before the checks for special properties like `req.redirect`, `req.statusCode`, etc. In most cases `apostrophe-pages:beforeSend` is a better fit for your needs.

### `apostrophe-pages:notFound(req)`

Invoked just before a 404 would otherwise be emitted. The last opportunity to assign an alternative value to `req.data.page` and set `req.notFound` to false. Alternatively you might use this event to add suggested alternates to `req.data` for use in your `notFound.html` template.

### `apostrophe-pages:beforeCopy(req, siblingPage, parentPage, page)`

Invoked before a page is copied. When a user elects to copy an existing page, schema properties and top-level areas introduced at the template level are copied from `siblingPage` to `page`, and then this event is invoked, creating an opportunity for special handling of copying other properties.

### `apostrophe-pages:beforeInfo(req, page)`

Invoked just before an API response is sent back by the `info` API endpoint of the `apostrophe-pages` module, a simple API which accepts an `_id` POST parameter and responds with the page as a JSON object. This is an opportunity to modify `page` before it is sent. This API is primarily used by the "reorganize" feature ("Manage Pages") and is **unrelated** to the `apostrophe-headless` module.

### `apostrophe-search:determineTypes(types)`

Invoked once at startup time by the `apostrophe-search` module to determine which document types should be included in sitewide search results. `types` is an array, and elements may be pushed onto it or `splice`d out of it. Note that you must modify the existing array; the return value is ignored.

By default, piece types are searchable unless made unsearchable with the `searchable: false` option at the module level, and all page types that are selectable via the "Types" dropdown are searchable. The resulting array is then emitted via this event and may be modified by event handlers.

If the developer explicitly sets a `types` option for the `apostrophe-search` module this event is never emitted.

### `apostrophe-service-bridge:ready`

This event is emitted when all of the core Apostrophe modules — those defined in the `apostrophe` npm module itself — have been constructed. Project level modules and other npm modules **have not** been initialized at this point. See `apostrophe:modulesReady` for an event that is invoked when **all** modules are ready.

### `apostrophe-versions:unversionedFields(req, doc, unversionedFields)`

Invoked when a change to a document is about to be recorded as a new version, for purposes of giving the user the option to roll back those changes later. `unversionedFields` will be an array of property names that **should not** be recorded or rolled back. For security reasons, a good example of a field that should not be rolled back is a field that determines permissions or ownership.

Handlers may push new field names onto the array to prevent them from being "versioned." Removing existing fields is not recommended as they were typically included for sound reasons of security or data integrity. The return value is ignored; you must modify the array given to you via `push`.

## Overriding an existing promise event handler

Since every promise event handler has a name, you may override them.

> If your new feature is completely independent of what the other handler does, just add another handler, with a new name. Overrides are only for cases where you want to change or eliminate what an existing handler does.

Consider this handler that we wrote earlier:

```javascript
// In lib/modules/my-module/index.js

const request = require('request-promise');

module.exports = {
  construct: function(self, options) {
    self.on('apostrophe-pages:beforeSend', 'addWeather', async function(req) {
      const forecast = await request('http://api.openweathermap.org/data/2.5/forecast?id=5205788&APPID=PUTYOUROWNAPIKEYHERE');
      req.data.forecast = forecast;
    });
  }
}
```

Here we gave the handler the name `addWeather`.

This is really just a convenience, and is exactly equivalent to:

```javascript
// In lib/modules/my-module/index.js

const request = require('request-promise');

module.exports = {
  construct: function(self, options) {
    // First set up the handler
    self.on('apostrophe-pages:beforeSend', 'addWeather');
    // Now attach the method to the module, matching the handler name
    self.addWeather = async function(req) {
      const forecast = await request('http://api.openweathermap.org/data/2.5/forecast?id=5205788&APPID=PUTYOUROWNAPIKEYHERE');
      req.data.forecast = forecast;
    });
  }
}
```

So we can change its behavior by applying the "super pattern" as we do in many places in Apostrophe:

```javascript
const superAddWeather = self.addWeather;
self.addWeather = function() {
  await superAddWeather(req);
  // We think the forecasted temperatures are low, adjust them
  req.data.forecast.temperature.main.temp += 2.0;
};
```

Code like this is common at project level, for instance to change what a handler in an npm module does without throwing it out altogether.

Note that we call the original version in this override. If you don't need to do that — if you are replacing its behavior entirely — just assign a new method and skip the `super` pattern. To disable a handler, assign an empty method.
