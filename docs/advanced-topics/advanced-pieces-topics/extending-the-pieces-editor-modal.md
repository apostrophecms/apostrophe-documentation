# Extending the pieces editor modal

Let's look at adding a custom button for use when editing a particular subclass of `apostrophe-pieces`.

*If all you want is an extra field in the form, there's a much easier way. Just use `addFields` to add more schema fields to your subclass of pieces. See the tutorials!*

For starters, you'll want to override `editorModal.html` for your module.

```markup
{% extends "editorBase.html" %}
{% import 'apostrophe-ui:components/buttons.html' as buttons with context %}

{%- block controls -%}
  {# The standard controls #}
  {{ super() }}
  {# Custom button #}
  {{ buttons.major('My Label', { action: 'mything' }) }}
{%- endblock -%}
```

*You will want to do exactly the same thing for `createModal.html` if your button also makes sense when creating new pieces.*

Next check out `editor-modal.js`, where the pieces module overrides `beforeShow` to add a bunch of jquery click handlers.

`self.link('mything', function() { ... })` calls that function when a `data-mything` attribute is found in the context of `self.$el` (the modal).

You can extend this by creating your own `editor-modal.js` file in your own module's `public/js` folder. Since you are extending `apostrophe-pieces`, which already pushes `editor-modal.js`, your own version automatically gets pushed to the browser too.

To extend beforeShow at project level you'll want to follow the "super pattern":

```javascript
apos.define('mymodule-editor-modal', {
  extend: 'apostrophe-pieces-editor-modal',
  construct: function(self, options) {
    var superBeforeShow = self.beforeShow;
    self.beforeShow = function(callback) {
      self.link('mything', self.doMyThing);
      return superBeforeShow(callback);
    };
    self.doMyThing = function() {
      ... up to you! ...
    };
  }
});
```

If you want to talk to an API route provided by the same module you can call:

```javascript
self.api('apiname', { POST object for req.body }, function(result) {
   ... do something with result ...
});
```

self.api will invoke the URL `/modules/modulename/apiname` as a POST and submit the data object as `req.body`, using the JSON content type.

On the server side, you'll need to extend your module to implement the API:

```javascript
module.exports = {
  construct: function(self, options) {
    self.route('apiname', function(req, res) {
      // Validate things with the launder module
      var name = self.apos.launder.string(req.body.name);
      ... Do more with that ...
      // Deliver a JSON resposne
      return res.send({ status: 'ok', moreInfo: 'something' });
    });
  }
};
```

Calling `self.route('apiname'...)` is similar to calling `self.apos.app.post('/modules/mymodulename/apiname', ...)`, but it's a lot less work, and you can call again with the same apiname to override it, which you can't do with `app.post`.
