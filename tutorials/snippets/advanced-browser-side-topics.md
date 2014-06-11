---
title: "Advanced Browser Side Topics"
---

### Implementing Custom Fields on the Browser Side

*NOTE: in most cases you can avoid the need for these techniques by [using schemas](subclassing-snippets.html). Also check out the [apostrophe-schemas module](https://github.com/punkave/apostrophe-schemas) for coverage of how to add custom schema field types to your project.*

Sometimes we'll want to send extra properties to the server when a snippet is saved. Until this point all of the code we've looked at has been on the server side. But of course snippets also have browser-side JavaScript code to implement the "new," "edit" and "manage" dialogs. You can find that code in `apostrophe-snippets/public/js/editor.js`.

Just like the server side code, this browser side code can be subclassed and extended. In fact, we must extend it for our new subclass of snippets to work. Here's how to do that:

1. Create a `public` folder in your module. This is where static assets meant to be served to the browser will live for your module.

2. Create a `js` subdirectory of that folder for your browser-side JavaScript files.

3. Create an `editor.js` file and a `content.js` file in that folder.

`editor.js` will house all of the logic for subclassing snippets and is only loaded in the browser if a user is logged in. `content.js` is always loaded, giving us a convenient way to split up the logic between the _editing_ interface of the blog and the javascript related to showing it. We won't be making use of `content.js` for our Blog, but if we were making a widget such as a slideshow that required some logic this is where we would put it.

Here's what `editor.js` looks like in the simplest case in which you have one at all:

```javascript
function Stories(options) {
  var self = this;
  AposSnippets.call(self, options);
  // Override some methods of snippets/editor.js here
}
```

Here we have a constructor to create the module's browser-side manager object.

The snippet module's server-side code will automatically push a JavaScript call into a block of browser-side calls at the end of the `body` element that creates and initializes the browser-side object for us.

(For a simple subclass created via configuration in `app.js` which has its own instance name, the name of your constructor is the same as the name of your module, with the first letter capitalized. However, if you are subclassing a core Apostrophe module with the same name, prefix it with `My` to clearly distinguish it. If your module lives in `npm`, then the constructor's name should be prefixed with `Apos`. The `apostrophe-site` module makes sure these conventions work.)

Your constructor receives many of the same options that the server side manager object has access to, including `name`, `instance`, `css`, `typeCss`, `instanceLabel` and `pluralLabel`.

The `css` property is a CSS-friendly name for the instance type. The `typeCss` property is a CSS-friendly name for the index page type. These CSS-friendly names are very useful when manipulating DOM elements with jQuery.

A note to prospective authors of npm modules: *please do not use the Apos prefix or the `apostrophe-` prefix for your own modules*. Just to avoid confusion, we ask that third-party developers use their own prefix. You don't want your code to stop working when we release a module of the same name. We don't even use the prefix ourselves if we are writing project-specific code that won't be published in the npm repository.

"But if I use my own prefix, how will the server push the right call to construct my object?" Good question. You can fix that by adding one more property when you initialize your module on the server side as shown earlier:

```javascript
_.defaults(options, {
  instance: 'blogPost',
  name: options.name || 'blog',
  ...
  browser: {
    construct: 'XYZCoBlog'
  }
});
```

Now the server will push a call to create an `XYZCoBlog' object instead.

But we still haven't seen how to override methods on the browser side. So let's look at that code from `editor.js` in the blog module:

```javascript
var superBeforeSave = self.beforeSave;

self.beforeSave = function($el, data, callback) {
  data.publicationDate = $el.find('[name="publication-date"]').val();
  return superBeforeSave($el, data, callback);
}
```

 `$el` is a jQuery reference to the modal dialog in which the blog post is being edited or created.

*IMPORTANT: we ALWAYS use `$el.find` to locate the field we want within the context of the dialog. We NEVER use `$('[name="our-field"]')`. Otherwise your code WILL eventually conflict with unrelated code. Scope is a good thing. In the presence of array fields you may need to be even more careful with scoping your selectors.*

Again, if you need to treat new and updated snippets differently, you can write separate `beforeInsert` and `beforeUpdate` methods.

We also need to initialize these fields when the dialog is first displayed. We do that by extending the `afterPopulatingEditor` method. Note the use of the `super` technique to invoke the original version. We'll let the original version invoke the callback when it's done:

```javascript
var superAfterPopulatingEditor = self.afterPopulatingEditor;
self.afterPopulatingEditor = function($el, snippet, callback) {
  $el.find('[name="publication-date"]').val(snippet.publicationDate);
  return superAfterPopulatingEditor.call(self, $el, snippet, callback);
};
```

### Other methods to consider overriding on the browser side

There are other methods you can override or extend. `addingToManager` is called before a snippet is added to the "manage blog posts" list view. The blog module overrides this method to add the publication date and tags of the snippet to fields that have been customized in each row of the `manage.html` template. (Note this method does not take a callback, as a reminder to keep it light and fast; loading something asynchronously for every row in the list view is just too slow.)

```javascript
  self.addingToManager = function($el, $snippet, snippet) {
    $snippet.find('[data-date]').text(snippet.publicationDate);
    if (snippet.tags !== null) {
      $snippet.find('[data-tags]').text(snippet.tags);
    }
  };
```

### Validating Snippets

All forms of validation supported by [apostrophe-schemas](https://github.com/punkave/apostrophe-schemas) are supported by snippets. However, that's currently not a terribly long list. And there will always be a few complex cases where custom validation code in the browser is nice to have.

You can write your own validator callback. Here's the default version:

```javascript
self.validate = function($el, data, action, callback) {
  return callback(null);
};
```

You can override this method to inspect anything in the DOM via `$el`, which contains all of the editable fields. And you can also inspect the properties of `data`, which has already been populated with the user's input by this point. In most cases the latter is the easiest way to go.

If you don't like what you find, make the user aware of the validation problem, then invoke the callback with an error. This error is not displayed to the user and simply prevents the save operation from completing for now.

If the validation problem concerns a particular field, you can use `aposSchemas` to call attention to the error:

```javascript
// I don't like what is in the title
aposSchemas.addError($el, 'title');
```

If all is well invoke the callback with `null`.
