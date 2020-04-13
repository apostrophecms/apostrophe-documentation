# Building Forms with Apostrophe

So you want a contact form on your site---a pretty common requirement. Maybe it's not a contact form; maybe you want to accept submissions of stories, or product ideas. The same principles apply. Apostrophe provides several ways to accomplish this.

## The easy way: `apostrophe-forms`

The **[Apostrophe Forms module](https://www.npmjs.com/package/apostrophe-forms)** was more recently updated to work with modern Apostrophe projects. This is your simplest way to create forms in your projects. After installing and configuring the module as directed, you and your website users can create and update forms as you would any other piece of content. That form can be placed on any page or pages using the forms widget. This allows for a single form to live many places on a website if needed.

`apostrophe-forms` is a great solution for most cases, but if you would like form submissions to directly translate into pieces in apostrophe, there is an alternative better suited to that use case.

The primary case where this is not desirable is if the website needs only one or two forms and those forms should *never* (or almost never) change. For example, if a form is very tightly coupled to a third-party API, it might be too risky to let website editors change the form. Even this could mostly be avoided by limiting access to forms with [user group permissions](https://docs.apostrophecms.org/apostrophe/tutorials/intermediate/permissions).

## Creating pieces via forms: `apostrophe-pieces-submit-widgets`

A module is available that allows users to submit any type of piece you wish to permit. You can specify the subset of fields that are appropriate for them, and avoid the work of building your own solution. Then just add the widget to the appropriate pages, and site visitors will see forms.

This works well for contact forms, since you can just define a piece type with an appropriate schema. So [check out the apostrophe-pieces-submit-widgets module](https://npmjs.org/package/apostrophe-pieces-submit-widgets) before doing anything more complex! Even if your needs *are* more complex, extending that widget is often the right way to go.

## Doing it your way

In your own project-level code, you may have reasons to create forms of your own. Apostrophe sites are still node and Express apps, and you still have HTML5, JavaScript, lodash and jQuery at your disposal on the browser side.

### A note on CSRF protection

Just one thing you'll need to know before you wing it: "plain old form submissions" not executed by jQuery aren't going to work, not right out of the box. That's because Apostrophe adds [Cross Site Request Forgery (CSRF)](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_&#40;CSRF&#41;_Prevention_Cheat_Sheet) protection, as standard middleware. Let's look at how to make that work for your code too.

### Submitting "plain old forms"

When you create an ordinary `form` element with the `POST` method and point it at an Express route with an `action` attribute, you'll find that you get a mysterious `403 Forbidden` error. That's because your form does not contain the CSRF token.

If you really want to use a "plain old form submission," you can configure Apostrophe to let your route through:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
modules: {
  apostrophe-express: {
    csrf: {
      exceptions: [ '/my-post-route-url' ]
    }
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Submitting AJAX forms with jQuery

There's a better way, though. Just use jQuery to submit your form, like this...

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

This way you can immediately respond "in the page" rather than waiting for a full-page refresh.

*Don't forget to `return false;` or call `preventDefault` on the event.*

### Adding routes for your custom form handlers

Either way, you'll want an [Express](https://npmjs.org/express) route on the server side to process the data. In any module, you might write:

```javascript
self.route('post', 'submit', function(req, res) {
  // Access req.body here
  // Send back an AJAX response with `res.send()` as you normally do with Express
});
```

That creates a route at `/modules/your-module-name/submit`.

Or you can use Express directly:

```javascript
self.apos.app.post('/my-post-route-url', function(req, res) {
  // Access req.body here
  // Send back an AJAX response with `res.send()` as you normally do with Express
});
```

{% hint style='info' %}
If you are allowing "plain old form submissions," you'll want to use `res.redirect` afterwards to bring the user back to a useful page. You might want to send along `data.url` in a hidden field in your form for this purpose.
{% endhint %}
