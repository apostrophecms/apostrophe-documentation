---
title: Building a contact form
---

So you want a contact form on your site. A pretty common requirement. Maybe it's not a contact form; maybe you want to accept submissions of stories, or product ideas. The same principles apply.

## Doing it your way: a note on CSRF protection

Apostrophe provides tools that can help, and we'll look at doing it that way. But first: of course you can also do your own thing. Apostrophe sites are still node and Express apps, and you still have HTML5, JavaScript, lodash and jQuery at your disposal on the browser side. Wing it if you want to, especially in "project level" code that's not part of a reusable Apostrophe module.

Just one thing you'll need to know before you wing it: "plain old form submissions" not executed by jQuery aren't going to work, not right out of the box. That's because Apostrophe adds [CSRF (Cross Site Request Forgery)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet) protection, as standard middleware.

### Submitting "plain old forms"

When you create an ordinary `form` element with the `POST` method and point it at an Express route with an `action` attribute, you'll find that you get a mysterious `403 Forbidden` error. That's because your form does not contain the CSRF token.

If you really want to use a "plain old form submission," you can configure Apostrophe to let your route through:

```javascript
// in app.js
modules: {
  apostrophe-express: {
    csrf: {
      exceptions: [ '/my-post-route-url' ]
    }
  }
}
```

### Submitting AJAX forms with jQuery

There's a better way: just use jQuery to submit your form, like this...

```javascript
$('.my-form').submit(function() {
  $.post('/my-post-route-url', $('.my-form').serialize(), function(result) {
    if (result.status === 'ok') {
      $('.my-form .thank-you').show();
    }
  });
  return false;
});
```

When you do that, a jQuery AJAX handler supplied by Apostrophe automatically sends a CSRF token with your data, and it just works.

That way you can immediately respond "in the page" rather than waiting for a full-page refresh.

*Don't forget to `return false;` or call `preventDefault` on the event.*

## Doing it our way: creating a `contact-form` module

But speaking of better ways: Apostrophe provides tools to help you render forms, sanitize the user's entries, submit them, and save them where the results can be easily viewed and managed. So let's look at how to build a really useful form submission system that way.

Let's start by creating a `contact-form` module.

```javascript
// in app.js
  modules: {
    // ... other modules ...
    'contact-form': {}
  }
```

```javascript
// in lib/modules/contact-form/index.js
var async = require('async');

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'contact-form',
  label: 'Contact Form',
  alias: 'contactForm',
  addFields: [
    {
      name: 'name',
      type: 'string',
      label: 'Your Name',
      required: true
    },
    {
      name: 'email',
      type: 'string',
      label: 'Your Email',
      required: true
    },
    {
      name: 'title',
      type: 'string',
      label: 'Subject',
      required: true
    },
    {
      name: 'body',
      type: 'string',
      label: 'Message',
      textarea: true,
    }
  ],
  permissionsFields: false,

  afterConstruct: function(self) {
    self.setSubmitSchema();
  },

  construct: function(self, options) {

    self.setSubmitSchema = function() {
      self.submitSchema = self.apos.schemas.subset(self.schema,
        [ 'name', 'email', 'title', 'body' ]
      );
    };

    self.submit = function(req, callback) {
      var piece = {};
      return async.series([
        convert,
        insert
      ], callback);
      function convert(callback) {
        return self.apos.schemas.convert(req, self.schema, 'form', req.body, piece, callback);
      }
      function insert(callback) {
        return self.insert(req, piece, { permissions: false }, callback);
      }
    };

  }
};
```

What's going on in this code?

* We create a new module called `contact-form`.
* We start by extending [apostrophe-pieces](../getting-started/reusable-content-with-pieces.html), creating a new type of piece to hold our form submissions. We use (schemas)[../getting-started/schema-guide.html] to define our form fields, including the usual `title` field which we redeclare with a new label, `Subject`.
* We set the `alias` property to `contactForm`. This gives us a convenient way to access this module from other modules, as a property of the `apos` object. As a general rule, it's OK to use `alias` in project-level code. But if you're creating an npm module to share with the world, it's more polite to leave that convenience for the Apostrophe core and project-level developers. You can always access your module safely as `apos.modules['module-name-here']`.
* Next we have an `afterConstruct` function, which invokes `setSubmitSchema`. And in `construct`, we implement that method. We call it from `afterConstruct` so that if we decide to extend our own module to create another, we have a chance to override this method in our subclass before it is called. It's not necessary if you're not planning to extend your module to create more, but it's a good habit to get into.
* In `setSubmitSchema`, we use the [subset method of apostrophe-schemas](../../reference/apostrophe-schemas/index.html#subset) to fetch a trimmed-down version of our schema with just the four fields we want to let website visitors submit. Otherwise, they would be asked to enter `tags`, `published` and potentially other fields that don't make sense for them. This way we can keep those things for our own administrative use.
* In `submit`, we implement a method that takes a form submission (in `req.body`, as is normal for Express) and asks the [convert method of apostrophe-schemas](../../reference/apostrophe-schemas/index.html#convert) to sanitize it as a form submission, populating a new `piece` object with clean data. Then that method inserts it into the database with the [insert method of apostrophe-pieces](../../reference/apostrophe-pieces/index.html#insert).
* When calling `insert`, we use the `permissions: false` option to bypass the normal permissions checks. Normally, a user can only insert a particular type of piece if they are part of a group that has the right permissions. For these contact forms, we naturally want to let everyone submit them.
* The `submit` method is made up of two steps, each of which is a function that takes a callback. To coordinate them gracefully, we use the [series method of the async npm module](https://github.com/caolan/async/blob/v1.5.2/README.md#seriestasks-callback) to run them one at a time. Using the async module helps us avoid the "pyramid of doom" in which callbacks are nested one inside another.
* You'll need to use `npm install --save async` to make sure the async module is part of your project's dependencies.

**"Great, but nobody's calling `self.submit`!"** Well no, not in *this* module. We'll call it from `contact-form-widgets`.

## Displaying and submitting the form: `contact-form-widgets`

"What the heck do widgets have to do with contact forms?"

They're a pretty great way to allow users to add contact forms wherever you want them!

Of course, you'll want to manage that reasonably, by only adding the widget to appropriate areas in suitable page templates. If you really want to lock it down, you can introduce it only with `apos.singleton()`.

Widgets also have some plumbing that's really helpful for what we need to do.

```javascript
// in app.js
  modules: {
    // Other modules, then ...
    'contact-form': {},
    'contact-form-widgets': {}
  }
```

```javascript
// in lib/modules/contact-form-widgets/index.js
module.exports = {

  extend: 'apostrophe-widgets',
  label: 'Contact Form',
  contextualOnly: true,
  scene: 'user',

  construct: function(self, options) {

    self.forms = self.apos.contactForm;

    self.output = function(widget, options) {
      return self.partial(self.template, {
        widget: widget,
        options: options,
        manager: self,
        schema: self.forms.submitSchema
      });
    };

    self.pushAsset('script', 'always', { when: 'always' });
    self.pushAsset('stylesheet', 'always', { when: 'always' });

    self.route('post', 'submit', function(req, res) {
      return self.forms.submit(req, function(err) {
        return res.send({ status: err ? 'error' : 'ok' });
      });
    });

    var superGetCreateSingletonOptions = self.getCreateSingletonOptions;
    self.getCreateSingletonOptions = function(req) {
      var options = superGetCreateSingletonOptions(req);
      options.submitSchema = self.forms.submitSchema;
      options.piece = self.forms.newInstance();
      return options;
    };

  }
};
```

What's going on this code?

* We extend `apostrophe-widgets`, creating a new widget type for displaying contact forms.
* We set the `contextualOnly` flag. With this flag, the widget doesn't have the usual modal dialog box for editing its settings... because there aren't any. Most often this used when the widget's template is full of `apos.area` calls for editing it "in context," but in this case we're just using it to skip a dialog box we don't need.
* We set the `scene` option to `user`. This allows us to use browser-side JavaScript devoted to Apostrophe's schemas feature to power our form, at the cost of downloading a little more code to the browser on each page load that includes this kind of widget.t
* In `construct`, we take advantage of the alias for the contact form module to grab a reference to it as `self.forms`. If we hadn't used an alias, we could still access it as `self.apos.modules['contact-form']`.
* We override the [`self.output` method of apostrophe-widgets](../../reference/apostrophe-widgets/index.html#output). It will still render `views/widget.html`, but we want to pass some extra data.
* The first three properties are standard. The `schema` property is borrowed from the `contact-forms` module. We'll use it to render the form.
* We push a `public/js/always.js` javascript file and a `public/css/always.less` file to the browser, at all times, so the public can submit forms.
* We implement a POST route named `submit`. For Express developers, the `self.route` method is just like calling `app.post('/modules/contact-form-widgets/submit')`, and in fact that's pretty much what does happen behind the scenes. You can access `apos.app` directly, but for API routes like this it's better to use `self.route`, which allows you to override routes later and takes care of building the URL for you.
* Our `submit` route simply calls the `submit` method of the `contact-form` module we created earlier, passing on `req` so that the form data can be retrieved from `req.body`. In effect, we're using `contact-form` as a model layer.
* The `getCreateSingletonOptions` method determines the data that gets passed on to the manager for this widget type on the browser side. We want to add the `submitSchema` for our form submissions, and also `piece`, a brand-new, empty instance of a `contact-form` piece as a starting point for populating the form with defaults.
* We call it `submitSchema` to avoid conflict with the `schema` option always provided for editing the widget itself. (This widget doesn't present an editor, but most do.)
* Here we follow the [super pattern](../../glossary.html#super-pattern) to make sure we don't lose the data provided by the `apostrophe-widgets` version of `getCreateSingleton`.

Here's the markup for our form widget:

```markup
{# in lib/modules/contact-form-widgets/views/widget.html #}
{% import "apostrophe-schemas:macros.html" as schemas %}

<form class="contact-form" data-contact-form>
  <h4>Contact Us</h4>
  {{ schemas.fields(data.schema, { tabs: false }) }}
  <button>Send Message</button>
  {# Later gets hoisted out and becomes visible #}
  <div class="thank-you" data-thank-you>
    <h4>Thank you for getting in touch! We'll respond soon.</h4>
  </div>
</form>
```

What's going on in this template?

* We import some useful macros from the `apostrophe-schemas` module. This is called a *cross-module import*. By prefixing `macros.html` with a module name and a colon (`:`), we can pull it in from any module in Apostrophe.
* We render the fields from our schema with `schemas.fields`. We imported the schema macros into our Nunjucks template as the `schemas` object, and now we're calling the `fields` macro, passing the schema to it.
* The `{ tabs: false }` option is crucial here. Without it, `apostrophe-schemas` will try to visually group the fields into tabs, which would be overkill for a simple contact form.
* Our `form` element has a `data-contact-form` attribute. We'l use that in our JavaScript to grab hold of it and give it a `submit` handler.
* The "thank you" message is nested inside the form, where CSS will initially hide it. Later we'll hoist it out and replace the form with it, making it visible.

Here are some simple styles to get the form working:

```css
// in lib/modules/contact-form-widgets/css/always.less

.contact-form
{
  padding: 20px 0;
  width: 400px;
  margin: auto;
  fieldset {
    margin: 1em 0;
  }
  label {
    display: inline-block;
    width: 200px;
  }
  textarea {
    width: 200px;
    height: 5em;
  }
  .thank-you {
    // later gets hoisted out and becomes visible
    display: none;
  }
}
```

And here is the JavaScript that powers the form on the browser side. We don't want to use a plain old form submission; we want to use Apostrophe's schemas to sanitize the form first and pass on the data:

```javascript
// in lib/modules/contact-form-widgets/js/always.js

apos.define('contact-form-widgets', {

  extend: 'apostrophe-widgets',

  construct: function(self, options) {

    self.play = function($widget, data, options) {

      var $form = $widget.find('[data-contact-form]');
      var schema = self.options.submitSchema;
      var piece = _.cloneDeep(self.options.piece);

      return apos.schemas.populate($form, self.schema, self.piece, function(err) {
        if (err) {
          alert('A problem occurred setting up the contact form.');
          return;
        }
        enableSubmit();
      });

      function enableSubmit() {
        $form.on('submit', function() {
          submit();
          return false;
        });
      }

      function submit() {
        return async.series([
          convert,
          submitToServer
        ], function(err) {
          if (err) {
            alert('Something was not right. Please review your submission.');
          }
          // Replace the form with its formerly hidden thank you message
          $form.replaceWith($form.find('[data-thank-you]'));
        });
        function convert(callback) {
          return apos.schemas.convert($form, schema, piece, callback);
        }
        function submitToServer(callback) {
          return self.api('submit', piece, function(data) {
            if (data.status === 'ok') {
              // All is well
              return callback(null);
            }
            // API-level error
            return callback('error');
          }, function(err) {
            // Transport-level error
            return callback(err);
          });
        }
      }
    };
  }
});

```

What's going on in this code?

* We define a widget manager for our `contact-form` widgets, with a custom widget player method. We've [seen this before in the custom widgets tutorial.](../getting-started/custom-widgets.html#adding-a-javascript-widget-player-on-the-browser-side)
* In our player method, we use `$widget.find()` to locate the form inside our widget's markup. You should **always** use `$widget.find()` in a widget player, to scope your code to this particular widget.
* We obtain the `schema` array and the default `piece` object from the options passed to the browser-side widget manager by the server side widget manager (`self.options`). This isn't the same thing as the options passed to this specific widget by `apos.area` or `apos.singleton` (`options`, the third argument to the `play` method).
* We use the `cloneDeep` method of [lodash](https://lodash.com/docs/3.10.1) to make a safe copy of the `piece` object, so that we don't wind up changing the defaults for any other contact form submissions the user makes on this page. *OK, that's not likely, but think about other kinds of forms...*
* We call `apos.schemas.populate` to take the defaults in the `pieces` object and populate the form with them, preparing it to be edited.
* Once the form is populated, we call `enableSubmit` to set a jQuery event handler to fire when the form is submitted. We don't want a "plain old form submission" to happen, so we `return false` to stop that.
* In the `submit` function, we actually submit the form. Again we use the `async.series` method, which is always available on the browser with Apostrophe.
* The `convert` function invokes `apos.schemas.convert`, which is the opposite of `apos.schemas.populate`: it takes the fields in the form, sanitizes them, and populates the `piece` object.
* The `submitToServer` function calls the [api method of apostrophe-context](../../reference/apostrophe-ui/browser-apostrophe-context.html) to submit the data to the `submit` route we wrote on the server side. Notice that we don't have to write out the URL. Since `apostrophe-widgets` extends `apostrophe-context`, we're able to call `self.api`, which simplifies AJAX for us a great deal by building the URL, transmitting the data as [JSON](http://www.json.org/), and receiving JSON as a response. In a nutshell: we send objects, and we get back objects. No need to parse things.
* Our route follows Apostrophe's convention, sending an object with a `status: 'ok'` property when all is well and an error message as `status` if not. If we dont' see `status: 'ok'` we report an error.
* The second callback function of `api` handles "transport-level" errors, like 500 errors and network timeouts.

## Adding the widget to a page template

Now you can test it out by adding the widget to a page template:

```markup
  {{
    apos.area(data.page, 'body', {
      widgets: {
        // Other widgets perhaps...
        'contact-form': {}
      }
    })
  }}
```

You can add as many instances of the contact form around the site as you wish.

## Viewing the results

To see the submitted forms, just access "Contact Forms" via the Apostrophe admin bar. Since they are pieces, you can manage and update them as you see fit.

## More ideas: moderating submitted content

There's a lot more that we can do, now that we have a form powered by [schemas](../getting-started/schema-guide.html). The `showFields` feature of `select` fields can be used to selectively show and hide parts of the form based on the user's input so far. And we can go beyond contact forms, allowing users to submit stories and other types of content. Just set the `def` property of the `published` field to `false` and you'll be able to manage the incoming submissions via the appropriate filter in the "Manage" view.
