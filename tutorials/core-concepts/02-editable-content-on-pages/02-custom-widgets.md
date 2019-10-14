---
title: Custom widgets
layout: tutorial
---

# Custom widgets

You've seen a lot of the widgets that come "in the box" with Apostrophe. But you can do much more by creating your own.

## Custom navigation

Here's a common case: you want to build your own navigation menu. [Apostrophe's page tree is awesome](building-navigation.md) but sometimes you want to "cherrypick" pages from all over the tree, perhaps for a special footer.

You could use a rich text widget and just tell users to add links manually, but they'll just break each time a page is moved around the site. It's also easier for users to mess up the formatting that way. You want something more consistent.

Let's look at some custom widgets that help provide navigation. you'll start with a simple widget that adds a link in a well-formatted way.

### `link`: the simplest widget

First you'll need a folder for the module. In the terminal, from the project root, enter:

```bash
mkdir -p lib/modules/link-widgets
```

Just about everything new you create in Apostrophe will be a "module." Project-specific modules live in `lib/modules`. Apostrophe will spot them there if you list them in `app.js`. You can also publish and install modules with `npm`. Apostrophe looks in both places. Your module name **should not start with** `apostrophe`. That's reserved for our official modules. Modules almost always have plural names. The name of a module that provides widgets should end in `-widgets`.

Then you'll include the module in our `app.js` by adding the following to the `modules` object:


{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
  modules: {
    // ...,
    'link-widgets': {}
  }
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now create an `index.js` in `lib/modules/link-widgets/` and put some code in there:

{% code-tabs %}
{% code-tabs-item title="lib/modules/link-widgets/index.js" %}
```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to Anywhere',
  addFields: [
    {
      name: 'url',
      type: 'url',
      label: 'URL',
      required: true
    },
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

_"What does_ `extend` _mean here?"_ Our module is extending the `apostrophe-widgets` module, which provides almost all the code you need. Yes, `extend` is the correct spelling. Apostrophe uses [moog](https://npmjs.org/package/moog) to handle extending or "subclassing" other modules.

_"What other field types can I add?"_ The `apostrophe-schemas` module provides a powerful way to build forms and structure data with almost no work. You just pass an array of field definitions as the `addFields` option. You'll introduce the details gradually. But if you're in a hurry, check out the [schema guide](schema-guide.md).

_"What does the_ `name` _property do?"_ Each field needs to be stored in the widget under its own property name. Play around with `aposDocs.find().pretty()` in the mongodb shell to see what it looks like after you save the widget.

Next you'll need a folder to hold our widget's `widget.html` template, which renders it on the page.

1. Create a new folder:

    ```bash
    mkdir -p lib/modules/link-widgets/views
    ```

2. Now create a Nunjucks template in `lib/modules/link-widgets/views/widget.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/link-widgets/views/widget.html" %}
```markup
<h4><a href="{{ data.widget.url }}">{{ data.widget.label }}</a></h4>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

_"Hey, don't You need to escape the label before you output it as HTML?"_ No, Nunjucks does it automatically. If you need to output content that is already valid, safe markup, you must use the `| safe` filter to output it without escaping.

Now you'll want to add this widget to an area in one of our page templates, like you learned in [adding editable content to pages](adding-editable-content-to-pages.md). Let's add the following to the `main` block of our `lib/modules/apostrophe-pages/views/pages/home.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/views/pages/home.html" %}
```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {}
    }
  })
}}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

You've just created a content area in which only `link` widgets are allowed. Each one has a `url` field and a `label` field, and they are always output in the same style.

### `page-link`: using joins in widgets

The `link` widget is cool, but if the URL of a page changes, the link breaks. And if the title changes, that is not reflected in the widget.

Let's solve the problem by allowing the user to pick a page on the site instead. Then you can access information about that page programmatically.

Let's make another module and its views folder in one step:

```bash
mkdir -p lib/modules/page-link-widgets/views
```

{% hint style='info' %}
While it's good to get some experience making all the folders and files yourself, the `apostrophe-cli` pacakage that you installed earlier can easily create basic module structures for you from templates. You can learn more in the [`apostrophe-cli` README](https://github.com/apostrophecms/apostrophe-cli/blob/master/README.md).
{% endhint %}

\1. Now you this new widget to the `modules` object in our app.js:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
  modules: {
    /// ...,
    'link-widgets': {},
    'page-link-widgets': {}
  }
```
{% endcode-tabs-item %}
{% endcode-tabs %}

\2. And then write `lib/modules/page-link-widgets/index.js`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/index.js" %}
```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to a Page',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId'
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

_"What do_ `type: 'joinByOne'` _and_ `idField: 'pageId` _do?\`_ you want this widget to remember a connection to another page. To do that, you use the `joinByOne` field type and ask Apostrophe to store the MongoDB `_id` of the other page in a `pageId` property of the widget.

_"Why does the_ `name` _start with a_ `_`_?" Joins get fetched every time this widget is loaded. The relationship is dynamic_. Properties that are dynamic and should not be stored back to MongoDB as part of this widget must start with a `_` \(underscore\). Apostrophe automatically ignores them when saving the widget in the database.

Now you're ready for the Nunjucks template, `lib/modules/page-link-widgets/views/widget.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/views/widget.html" %}
```markup
<h4><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="success" %}
_Whoa! So I can access the other page in my template?"_ Yep. You can access any property of the other page. You can even make `apos.area` and `apos.singleton` calls with the other page object.
{% endhint %}

Actually using the widget in an area is just like using the first one. But this time, let's enable both kinds in our area on `home.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/views/home.html" %}
```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {},
      'page-link': {}
    }
  })
}}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now our users have a choice between do-it-yourself links that can point anywhere and "page" links that can only point to a page. Both can be useful.

{% hint style='info' %}
It is also possible to join with more than one type. And once you check out [pieces](reusable-content-with-pieces.md), the benefit of doing so will be clear. To do that, set `withType` to an array of type names, which may include `apostrophe-pages`. The user is then able to use a tabbed interface to select items of several types for the same join. These "polymorphic joins" are primarily intended for navigation widgets like this one.
{% endhint %}

### Passing options to widgets

You probably noticed that our widgets don't take any options yet. You can use options to do cool things in our templates. Let's add a simple one to choose between two presentation styles.

All you have to do is access `data.options` in your `widget.html` template for `page-link-widgets` and pass the option in the `apos.area` call and `home.html`:


\1. Add `data.options` in `widget.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/views/widget.html" %}
```markup
<h4 class="{{ 'special' if data.options.special }}"><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

\2. Then pass the option  call in `home.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/views/home.html" %}
```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {},
      'page-link': {
        special: true
      }
    }
  })
}}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now all the page links in this particular area will get the special class. You can probably think of much fancier uses for this feature.

### Giving choices to the user

You can also leave the choice up to the user by adding a `boolean` field to the schema for `page-link-widgets` in its `index.js`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/index.js" %}
```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to a Page',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId'
    },
    {
      name: 'special',
      label: 'Special',
      type: 'boolean'
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

The new bit here is the `special` field.

In your template, access it via `data.widget` rather than `data.options`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/views/widget.html" %}

```markup
<h4 class="{{ 'special' if data.widget.special }}"><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style='info' %}
`data.widget` contains the form fields the user can edit. `data.options` contains the options passed to `apos.area` or `apos.singleton` by the frontend developer.
{% endhint %}

### Performance note: limiting joins

Having access to the entire page object is a neat trick, but it can be very slow. That page might have its own widgets which load a lot of information you don't care about in this situation. Multiply that by 20 links and it starts to impact performance.

Indeed, all you really care about here is the title and the URL. So let's fetch only that information.

You can rewrite `index.js` to speed up the code:

{% code-tabs %}
{% code-tabs-item title="lib/modules/page-link-widgets/index.js" %}
```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to a Page',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId',
      filters: {
        projection: {
          title: 1,
          _url: 1
        }
      }
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

The new bit is the `filters` option. By specifying a `projection` filter, you can limit Apostrophe to loading just the `title` and `_url` properties. Apostrophe needs `_url` to figure out the URL of a page. It's almost always a good idea to limit the projection to the fields you care about.

`_url`_,_ `slug`_... what's the difference?_ For most sites, nothing. But for sites with a `prefix` option, the `_url` property might have a folder name prepended to it. And there are other ways to transform `_url` to suit your needs. So always remember to use it instead of `slug` when you output page URLs. And use `_url` in your projection to fetch all the properties Apostrophe knows might be involved in calculating the `_url` property of the page.

**Watch out for reverse joins! If you have** [**reverse joins**](schema-guide.md) **and your widget doesn't need them,** the `projection` filter can't help you avoid loading them, because they are loaded from "the other side" \(the ids are stored with the documents linking _to_ your documents\). Instead, use the `joins` filter, and specify an array of join field names your widget actually needs — if any.

_What else can I do with_ `filters`_?_ That's an intermediate topic, but you can do anything that [cursor filter methods](../intermediate/cursors.md) can do.

## Adding a JavaScript widget player on the browser side

So far you've built your widgets entirely with server-side code. But sometimes you'll want to enhance them with JavaScript on the browser side.

Sure, you could just select elements in your widget markup with jQuery, but that's no good for a widget that was just added to an existing page. There's a better way. you'll create a widget player.

Let's say you want to offer some content in a collapsible "drawer." Clicking on the title of the drawer reveals an Apostrophe area with more information.

Your module's `index.js` file looks like this:

{% code-tabs %}
{% code-tabs-item title="lib/modules/drawer-widget/index.js" %}
```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Drawer',
  addFields: [
    {
      type: 'string',
      name: 'title',
      label: 'Title'
    },
    {
      type: 'area',
      name: 'content',
      label: 'Content',
      options: {
        widgets: {
          'apostrophe-rich-text': {
            toolbar: [ 'Bold', 'Italic' ]
          },
          'apostrophe-images': {}
        }
      }
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

And your `widget.html` file looks like this:

{% code-tabs %}
{% code-tabs-item title="lib/modules/drawer-widgets/views/widget.html" %}
```javascript
<h4><a data-drawer-title class="drawer-title" href="#">{{ data.widget.title }}</a></h4>
<div data-drawer class="drawer-body">
  {{ apos.area(data.widget, 'content', { edit: false }) }}
</div>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Here you use `data.widget` where you would normally expect `data.page`. This allows access to areas nested inside the widget.

> Notice that nesting areas and singletons inside the templates of other widgets is allowed. You can use this feature to create widgets that give users flexible control over page layout, for instance a "two column" widget with two `apos.area` calls.

Now, in your default page template, let's create an area that allows a series of drawers to be created:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/views/default.html" %}
```markup
{{
  apos.area(data.page, 'drawers', {
    widgets: {
      drawer: {}
    }
  })
}}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

And in `app.js`, don't forget to configure the widget:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
// in app.js
modules: {
  // other widgets, then...
  'drawer-widgets': {}
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Even if your widget doesn't require any options, you must configure it in `app.js` to `instantiate` it. This is how Apostrophe knows that you actually want to use this module directly. In many projects, some modules only exist to be extended by other modules.

So far, so good. you can create a whole column of drawer widgets and their titles and their content areas appear. But right now the "drawer" part is visible at all times.

First, you'll need to hide the content of the drawer by default. Let's push an `always.less` stylesheet specifically for this module.

In `index.js`, you'll extend the `pushAssets` method, which is already pushing JavaScript, to push a stylesheet as well:

{% code-tabs %}
{% code-tabs-item title="lib/modules/drawer-widgets/index.js" %}
```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  addFields: [
    // ... see above ...
  ],
  construct: function(self, options) {
    var superPushAssets = self.pushAssets;
    self.pushAssets = function() {
      superPushAssets();
      self.pushAsset('stylesheet', 'always', { when: 'always' });
    };
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

In Apostrophe modules, the `construct` function is called to add methods to the module. Here you are following the "super pattern," making a note of the original method you inherited from [apostrophe-widgets](../../modules/apostrophe-widgets/index.md), creating your own replacement method, invoking the original from within it, and then pushing your own asset to the browser.

The [pushAsset method](../../modules/apostrophe-module/index.md#push-asset) can push both stylesheets and scripts. The name `always` is a convention meaning "everyone sees this stylesheet, whether logged in or not." And you make sure of that by setting the `when` option to `always`.

Now you need to supply `always.less` in the right place: the `public/css` subdirectory of your module's directory.

{% code-tabs %}
{% code-tabs-item title="lib/modules/drawer-widgets/public/css/always.less" %}
```css
.drawer-title {
  padding: 2em 0;
  text-align: center;
}

.drawer-body {
  padding: 2em 0;
  display: none;
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

With these changes, your drawers are hidden. But you still need a way to toggle them open when the titles are clicked.

For that, you'll need an `always.js` file, in your `public/js` folder:

{% code-tabs %}
{% code-tabs-item title="lib/modules/drawer-widgets/public/js/always.js" %}
```javascript
// Example of a widget manager with a play method

apos.define('drawer-widgets', {
  extend: 'apostrophe-widgets',
  construct: function(self, options) {
    self.play = function($widget, data, options) {
      $widget.find('[data-drawer-title]').click(function() {
        $widget.find('[data-drawer]').toggle();
        // Stop bubbling and default behavior for jQuery event
        return false;
      });
    };
  }
});
```
{% endcode-tabs-item %}
{% endcode-tabs %}

What's happening in this code?

* You called `apos.define` to define a [moog type](../../other/glossary.md#moog-type) for your "widget manager." A widget manager is an object that is responsible for directing everything related to widgets of that type in the browser. Think of it as the browser's half of your module.
* The first argument to `apos.define` is the name of your new type, which is the same as the name of your module. The second argument is an object that defines the type. Just like your `index.js` file on the server, it contains a `construct` function. That's because Apostrophe uses [moog](../../other/glossary.md#moog-type) to manage object-oriented programming in both places. The only difference is that on the server, Apostrophe figures out what type is being defined automatically based on the module's name. Here in browser-land, it's up to you to call `apos.define`.
* The `extend` property indicates that you want to extend \("subclass" or "inherit from"\) the `apostrophe-widgets` type, which provides most of the plumbing for managing your widget. All you need to do is supply a `play` method.
* Inside `construct`, you attach a `play` method to the widget manager. Your `play` method accepts `$widget` \(a jQuery object referring to the widget's `div` element\), `data` \(an object containing the properties of your widget, like `title`\), and `options` \(an object containing options that were passed to the widget when `apos.area` or `apos.singleton` was called\).
* Apostrophe automatically calls the `play` method at appropriate times.
* The play function takes advantage of jQuery's [find method](https://api.jquery.com/find/) to locate the title and the drawer _inside the scope of this one widget._

_"Can't I just write some jQuery in a `$(function() { ... })` block and skip all this?"_ If you do, you forfeit the ability for your player to work for widgets that were just added to the page by the user, without refreshing the page. Requiring users to refresh the page is very 2005. You might even tease you about it.

Writing widget players that scope all of their jQuery selectors with `$widget.find()` helps you avoid the temptation to write code that will install the same handler twice, fail entirely for newly-added widgets, or become a problem later when you want to publish your module in npm.

## What's available in the browser?

Now is a good time to mention highlights of what you can access in the browser by default when working with Apostrophe:

* jQuery
* lodash \(version 3.x\)
* async \(version 1.x\)
* moment
* jquery.fileupload
* jquery.cookie

And as previously mentioned, you can use LESS in your stylesheets.

_"What if I want to use browserify, gulp, grunt, etc.?"_ Sure, go nuts. Just arrange your gulpfiles to build a file that is pushed as an asset by one of your modules.

We chose not to incorporate those frontend build tools into Apostrophe's core because the core set of features needed for good CMS-driven sites doesn't usually rise to that level of complexity. But if you need to build complex in-page JavaScript experiences, go for it.

