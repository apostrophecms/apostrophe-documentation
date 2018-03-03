---
title: How Apostrophe handles requests
layout: tutorial
---

This HOWTO describes how Apostrophe handles requests, and in the process, introduces many ways you can intercept that process and modify the response sent to the browser.

### Middleware

Apostrophe's response to any request begins with [Express middleware](https://expressjs.com/en/guide/using-middleware.html).

When an HTTP request is made, the standard middleware added by the `apostrophe-express` module runs first, followed by the middleware supplied via the `expressMiddleware` property of individual modules. Middleware is added in the order the modules are initialized. `expressMiddleware` can be either a single function or an array of functions.

  An upcoming feature: pending merge of the `workflow-accommodations-1` branch, `expressMiddleware` can also be an object with a `before` property indicating the name of another module. In this case the `middleware` property is run *before* any middleware added by that other module. The `middleware` property can be a single function or an array of functions.

### Express Routes

Any module can add Express routes, either via `self.apos.app.get`, `self.apos.app.post` and friends (note that `self.apos.app` is the Express app object), or via `self.route('get', 'verb', function(req, res) { ... })`. Note that if you use `self.route`, the path of the module is prepended to your `verb` automatically. So the URL is:

`/modules/my-module-name/verb`

Note that on the browser side, any object that extends `apostrophe-context` or `apostrophe-module` can take advantage of the `self.html` and `self.api` methods to conveniently invoke the routes of a specific module without typing these URL prefixes everywhere.

Express routes are considered after the middleware, in the order added. They are typically added in `afterConstruct`. The best strategy is to implement a method such as `addRoutes` in `construct`, so it can be overridden by subclasses, but invoke it in `afterConstruct`.

### Page requests

At the last possible moment, in the `afterInit` method of the `apostrophe-pages` module, a wildcard route (matching `*`) is added to Express, which triggers the `serve` method of the `apostrophe-pages`module. This is how requests for pages are handled, if no other route matches the request. 

The `server` method of `apostrophe-pages` loads `req.data.bestPage`, which is the page matching at least a prefix component of the URL; it will always be the home page at the very least. 

`apostrophe-pages` then invokes the `pageServe` method of every module that has one, via `self.apos.callAll`. The most important implementation is in the `apostrophe-custom-pages` module. Every page type has a "manager" object which is an instance of a subclass of this module. Even "ordinary" page types like `home` and `default` automatically receive a subclass of this module.

### Ordinary page templates

By default, the `pageServe` method of `apostrophe-custom-pages` checks whether the slug of `req.data.bestPage` is an exact match for the request. If the page is an exact match, `req.data.page` is set accordingly.

The `apostrophe-pages` module then notes that `req.template` has not been set, and falls back to using `pages/PAGE-TYPE.html`, where `PAGE-TYPE` is the value of `req.data.page.type`.

### Dispatch: handling prefix URL matches with `apostrophe-custom-pages`

As mentioned, every page type is managed by a module that extends `apostrophe-custom-pages`. That module can call `self.dispatch` to add "dispatch routes" that match the URL, even if the page slug is only a prefix to that URL.

For instance, you might implement a module that displays an index if you request its URL exactly, and displays an individual document if you match the URL of the page plus the slug of the document:

```
// in app.js
modules: {
  'home-pages': {}
}

// in lib/modules/home-pages/index.js

module.exports = {
  afterConstruct: function(self) {
    self.addDispatchRoutes();
  },
  construct: function(self, options) {
    self.addDispatchRoutes = function() {
      self.dispatch('/', self.indexPage);
      self.dispatch('/:slug', self.showPage);
    };
    self.indexPage = function(req, callback) {
      req.template = self.renderer('index');
    };
    self.showPage = function(req, callback) {
      return goFindSomethingBySlug(req.params.slug, function(err, doc) {
        // handle err, if no err...
        if (!doc) {
          // Let Apostrophe render the 404 page
          req.notFound = true;
          return callback(null);
        }
        req.template = self.renderer('show', { doc: doc });
      });
    };
  }
};
```

Here we are setting `req.template` to a function. When we do that, Apostrophe calls that function later when it is ready to render the page.

To help us do this conveniently, Apostrophe provides every module with a `renderer` method that returns such a function.

We just provide a template name and, optionally, data to be passed to the function.

Now we can access that data in `views/show.html` within our module.

  "Where is the `goFindSomethingBySlug` function?" That depends on you! The purpose of `apostrophe-custom-pages` is to let you do custom work based on "the rest" of the URL. If you are just looking to display pieces, there is already a great subclass of `apostrophe-custom-pages` for you. Check out [reusable content with pieces](../getting-started/reusable-content-with-pieces.html) and [apostrophe-pieces-pages](../../modules/apostrophe-pieces-pages/index.html).

### `pageBeforeSend`: your last chance to do async work for a page

When Apostrophe renders a page, the last thing it does is invoke the `pageBeforeSend` method of every module that has one.

This is your last chance to attach information to `req.data` and your last chance to do anything that requires a callback.

Your `pageBeforeSend` method will receive `req` and, if you define it with both arguments, `callback` also.

  **Note that `req.data.page` will not always exist in a `pageBeforeSend` handler. Be sure to handle this gracefully.** `pageBeforeSend` is invoked for all full HTML page responses, including the login "page," which does not correspond to an Apostrophe page. 

### Template helpers: invoking synchronous JavaScript code from your template

You have one more chance to write JavaScript that is part of the rendering of a page.

Apostrophe provides many "template helpers" you've seen before, like `apos.area` or `apos.attachments.url`. Adding helpers is a good way to provide code that would be too ugly, complicated or unmaintainable written in Nunjucks.

Just remember that the code must be synchronous — it must not involve callbacks. If you need callbacks to do your work, use a `pageBeforeSend` method.

Here's how to add a helper via your module:

```javascript
// in lib/modules/your-module/index.js
module.exports = {
  alias: 'myModule',
  construct: function(self, options) {
    self.addHelpers({
      clap: function(s) {
        // Replace spaces with claps
        return s.replace(/ /g, '👏');
      }
    });
  }
}
```

```
{# in any template #}
{{ apos.clap(data.page.title) }}
```

#### Rendering HTML inside a helper

By default, the output of your helper will be automatically escaped, so that `<` becomes `&lt;` and so on, in order to prevent XSS attacks.

If you need to output markup, you can do that with `self.apos.templates.safe`. When you do so, escaping any user-entered text becomes **your responsibility**:

```javascript
// in lib/modules/your-module/index.js
module.exports = {
  alias: 'myModule',
  construct: function(self, options) {
    self.addHelpers({
      header: function(s) {
        // Encapsulate in an h1 tag. Escape
        // the string as HTML!
        return self.apos.templates.safe('<h1>' + self.apos.utils.escapeHtml(s) + '</h1>');
      }
    });
  }
}
```

#### Accessing `req` inside a helper

If you need to, you can access `req` inside a helper function as:

```
self.apos.templates.contextReq
```

This is safe because template rendering is synchronous. There is no possibility that this value will change until the page template is completely rendered.

#### Rendering another template from inside a helper

Sometimes it's convenient to render another template from inside a helper. And you can. Just remember that you must use `self.partial`, not `self.render`. `self.render` requires a `req` object, while `self.partial` automatically uses `self.apos.templates.contextReq`. An example:

```javascript
// inside lib/modules/your-module/index.js
self.addHelpers({
  address: function(piece) {
    return self.partial('address', { piece: piece });
  }
});
```

```
{# inside any template #}
{% for piece in data.pieces %}
  {{ address(piece) }}
{% endfor %}
```

This will render the `views/address.html` template of your module, passing the piece as `data.piece`.

### Rendering a full HTML page from a route

Thinking about rendering a full HTML page from an Express route? Most of the time, you'll want to use `apostrophe-custom-pages` instead, as described above. The `dispatch` feature gives you everything you need to respond to URLs in creative ways.

However, you can also call `self.sendPage` to render a full HTML page via Apostrophe:

```javascript
self.apos.app.get('/special-url', function(req, res) {
  // Get some data first, then...
  return self.sendPage(req, self.renderer('special'), { ... optional data here ... });
});
```

Note that `pageBeforeSend` methods are invoked first before the template is rendered.

  `sendPage` completes your response to the Express request. There is no need to call `res.send` afterwards and it will not work if you try. If you need to do anything special to the Express `res` object before the response is sent, do that first, accessing it via `req.res`.
