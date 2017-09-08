---
title: "Custom widgets"
layout: tutorial
---

## Building custom widgets

You've seen a lot of the widgets that come "in the box" with Apostrophe. But you can do much more by creating your own.

### Custom navigation

A common case: you want to build your own navigation menu. [Apostrophe's page tree is awesome](building-navigation.html) but sometimes you want to "cherrypick" pages from all over the tree, perhaps for a special footer.

You could use a rich text widget and just tell users to add links manually. But they'll just break each time a page is moved around the site. And it's easier for users to mess up the formatting that way. We want something more consistent.

Let's look at some custom widgets that help provide navigation. We'll start with a simple widget that adds a link in a well-formatted way.

#### `link`: the simplest widget

First we'll need a folder for the module:

```bash
mkdir -p lib/modules/link-widgets
```

> Just about everything new you create in Apostrophe will be a "module." Project-specific modules live in `lib/modules`. Apostrophe will spot them there if you list them in `app.js`.
> You can also publish and install modules with `npm`. Apostrophe looks in both places. Your module name **should not start with `apostrophe`**. That's reserved for our official modules.
> Modules almost always have plural names. The name of a module that provides widgets should end in `-widgets`.

Then we'll include the module in our `app.js` by adding the following to the `modules` object:

```javascript
  modules: {
    // ...,
    'link-widgets': {}
  }
```

Now we'll write the code for our module in `lib/modules/link-widgets/index.js`:

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

> *"What does `extend` mean here?"* Our module is extending the `apostrophe-widgets` module, which provides almost all the code we need.  Yes, `extend` is the correct spelling. Apostrophe uses [moog](https://npmjs.org/packages/moog) to handle extending or "subclassing" other modules.

> *"What other field types can I add?"* The `apostrophe-schemas` module gives us a powerful way to build forms and structure data with almost no work. We just pass an array of field definitions as the `addFields` option.
> We'll introduce the details gradually. But if you're in a hurry, check out the [schema guide](schema-guide.html).

> *"What does the `name` property do?"* Each field needs to be stored in the widget under its own property name. Play around with `aposDocs.find().pretty()` in the mongodb shell to see what it looks like after you save the widget.

Next we'll need a folder to hold our widget's `widget.html` template, which renders it on the page:

```bash
mkdir -p lib/modules/link-widgets/views
```

Now let's create a Nunjucks template in `lib/modules/link-widgets/views/widget.html`:

```markup
<h4><a href="{{ data.widget.url }}">{{ data.widget.label }}</a></h4>
```

> *"Hey, don't we need to escape the label before we output it as HTML?"* No, Nunjucks does it automatically. If you need to output content that is already valid, safe markup, you must use the `| safe` filter to output it without escaping.

Now we'll want to add this widget to an area in one of our page templates, like we learned in [adding editable content to pages](adding-editable-content-to-pages.html). Let's add the following to the `main` block of our `lib/modules/apostrophe-pages/views/pages/home.html`:

```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {}
    }
  })
}}
```

We've just created a content area in which only `link` widgets are allowed. Each one has a `url` field and a `label` field, and they are always output in the same style.

#### `page-link`: using joins in widgets

The `link` widget is cool, but if the URL of a page changes, the link breaks. And if the title changes, that is not reflected in the widget.

Let's solve the problem by allowing the user to pick a page on the site instead. Then we can access information about that page programmatically.

Let's make another module and its views folder in one step:

```bash
mkdir -p lib/modules/page-link-widgets/views
```

Now we add this new widget to the `modules` object in our app.js:

```javascript
  modules: {
    /// ...,
    'link-widgets': {},
    'page-link-widgets': {}
  }
```

Now let's write `lib/modules/page-link-widgets/index.js`:

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

> *"What do `type: 'joinByOne'` and `idField: 'pageId` do?`* We want this widget to remember a connection to another page. To do that, we use the `joinByOne` field type and ask Apostrophe to store the MongoDB `_id` of the other page in a `pageId` property of the widget.

> *"Why does the `name` start with a `_`?" Joins get fetched every time this widget is loaded. The relationship is dynamic*. Properties that are dynamic and should not be stored back to MongoDB as part of this widget must start with a `_` (underscore). Apostrophe automatically ignores them when saving the widget in the database.

Now we're ready for the Nunjucks template, `lib/modules/page-link-widgets/views/widget.html`:

```markup
<h4><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```

> *"Whoa! So I can access the other page in my template?"* Yep. You can access any property of the other page. You can even make `apos.area` and `apos.singleton` calls with the other page object.

Actually using the widget in an area is just like using the first one. But this time, let's enable both kinds in our area on `home.html`:

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

Now our users have a choice between do-it-yourself links that can point anywhere and "page" links that can only point to a page. Both can be useful.

#### Passing options to widgets

You probably noticed that our widgets don't take any options yet. We can use options to do cool things in our templates. Let's add a simple one to choose between two presentation styles.

All we have to do is access `data.options` in our `widget.html` template for `page-link-widgets`:

```markup
<h4 class="{{ 'special' if data.options.special }}"><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```

And pass the option in our `apos.area` call on `home.html`:

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

Now all the page links in this particular area will get the special class. You can probably think of much fancier uses for this feature.

#### Positioning Widget Controls

Depending on the your site design, you may want to position your widget controls to your liking. You can do this with options as well.

```markup
{{
  apos.singleton(data.page, 'footer', 'my-footer', { position: "bottomLeft" })
}}
```
The available options are:

`bottomLeft`

`bottomRight`

`topRight`

`topLeft` (this is the default position, but you may use it for granularity)



#### Giving choices to the user

We can also leave the choice up to the user by adding a `boolean` field to the schema for `page-link-widgets` in its `index.js`:

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

The new bit here is the `special` field.

In our template, we just access it via `data.widget` rather than `data.options`:

```markup
<h4 class="{{ 'special' if data.widget.special }}"><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```

>`data.widget` contains the form fields the user can edit. `data.options` contains the options passed to `apos.area` or `apos.singleton` by the frontend developer.

#### Performance note: limiting joins

Having access to the entire page object is a neat trick, but it can be very slow. That page might have its own widgets which load a lot of information we don't care about in this situation. Multiply that by 20 links and it starts to impact performance.

Indeed, all we really care about here is the title and the URL. So let's fetch only that information.

Here's how we can speed up the code:

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
          slug: 1
        }
      }
    }
  ]
};
```

The new bit is the `filters` option. By specifying a `projection` filter, we can limit Apostrophe to loading just the `title` and `slug` properties. Apostrophe needs the `slug` to figure out the URL of the page.

It's almost always a good idea to limit the projection to the fields you care about.

>*`_url`, `slug`... what's the difference?* For most sites, nothing. But for sites with a `prefix` option, the `_url` property might have a folder name prepended to it. And there are other ways to transform `_url` to suit your needs. So always remember to use it instead of `slug` when you output page URLs.

>*What else can I do with `filters`?* That's an intermediate topic, but you can do anything that [ cursors](../intermediate/cursors.html) can do. Check those out if you're in a rush.

### Adding a JavaScript widget player on the browser side

So far we've built our widgets entirely with server-side code. But sometimes we'll want to enhance them with JavaScript on the browser side.

Sure, we could just select elements in our widget markup with jQuery, but that's no good for a widget that was just added to an existing page. There's a better way. We'll create a widget player.

Let's say we want to offer some content in a collapsible "drawer." Clicking on the title of the drawer reveals an Apostrophe area with more information.

Our module's `index.js` file looks like this:

```javascript
// in lib/modules/drawer-widgets/index.js

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

And our `widget.html` file looks like this:

```javascript
{# in lib/modules/drawer-widgets/views/widget.html #}
<h4><a data-drawer-title class="drawer-title" href="#">{{ data.widget.title }}</a></h4>
<div data-drawer class="drawer-body">
  {{ apos.area(data.widget, 'content', { edit: false }) }}
</div>
```

Here we use `data.widget` where you would normally expect `data.page`. This allows us to access areas nested inside the widget.

> Notice that nesting areas and singletons inside the templates of other widgets is allowed. You can use this feature to create widgets that give users flexible control over page layout, for instance a "two column" widget with two `apos.area` calls.

Now, in our default page template, let's create an area that allows a series of drawers to be created:

```markup
{# in lib/modules/apostrophe-pages/views/default.html #}
{{
  apos.area(data.page, 'drawers', {
    widgets: {
      drawer: {}
    }
  })
}}
```

And in `app.js`, don't forget to configure the widget:

```javascript
// in app.js
modules: {
  // other widgets, then...
  'drawer-widgets': {}
}
```

> Even if our widget doesn't require any options, we must configure it in `app.js` to `instantiate` it. This is how Apostrophe knows that we actually want to use this module directly. In many projects, some modules only exist to be extended by other modules.

So far, so good. We can create a whole column of drawer widgets and their titles and their content areas appear. But right now the "drawer" part is visible at all times.

First, we'll need to hide the content of the drawer by default. Let's push an `always.less` stylesheet specifically for this module.

In `index.js`, we'll extend the `pushAssets` method, which is already pushing JavaScript for us, to push a stylesheet as well:

```javascript
// in lib/modules/drawer-widgets/index.js

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

In Apostrophe modules, the `construct` function is called to add methods to the module. Here we are following the "super pattern," making a note of the original method we inherited from [apostrophe-widgets](../../modules/apostrophe-widgets/index.html), creating our own replacement method, invoking the original from within it, and then pushing our own asset to the browser.

The [pushAsset method](../../modules/apostrophe-module/index.html#push-asset) can push both stylesheets and scripts. The name `always` is a convention meaning "everyone sees this stylesheet, whether logged in or not." And we make sure of that by setting the `when` option to `always`.

Now we need to supply `always.less` in the right place: the `public/css` subdirectory of our module's directory.

```css
// in lib/modules/drawer-widgets/public/css/always.less

.drawer-title {
  padding: 2em 0;
  text-align: center;
}

.drawer-body {
  padding: 2em 0;
  display: none;
}
```


With these changes, our drawers are hidden. But we still need a way to toggle them open when the titles are clicked.

For that, we'll need an `always.js` file, in our `public/js` folder:

```javascript
// in lib/modules/drawer-widgets/public/js/always.js

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

What's happening in this code?

* We called `apos.define` to define a [moog type](../../glossary.html#moog-type) for our "widget manager." A widget manager is an object that is responsible for directing everything related to widgets of that type in the browser. Think of it as the browser's half of our module.

* The first argument to `apos.define` is the name of our new type, which is the same as the name of our module. The second argument is an object that defines the type. Just like our `index.js` file on the server, it contains a `construct` function. That's because Apostrophe uses [moog](../../glossary.html#moog-type) to manage object-oriented programming in both places. The only difference is that on the server, Apostrophe figures out what type is being defined automatically based on the module's name. Here in browser-land, it's up to us to call `apos.define`.

* The `extend` property indicates that we want to extend ("subclass" or "inherit from") the `apostrophe-widgets` type, which provides most of the plumbing for managing our widget. All we need to do is supply a `play` method.

* Inside `construct`, we attach a `play` method to the widget manager. Our `play` method accepts `$widget` (a jQuery object referring to the widget's `div` element), `data` (an object containing the properties of our widget, like `title`), and `options` (an object containing options that were passed to the widget when `apos.area` or `apos.singleton` was called).

* Apostrophe automatically calls the `play` method for us at appropriate times.

* Our play function takes advantage of jQuery's [find method](https://api.jquery.com/find/) to locate the title and the drawer *inside the scope of this one widget.*

> "Can't I just write some jQuery in a `$(function() { ... })` block and skip all this?" If you do, you forfeit the ability for your player to work for widgets that were just added to the page by the user, without refreshing the page. Requiring users to refresh the page is very 2005. We might even tease you about it.
>
> Writing widget players that scope all of their jQuery selectors with `$widget.find()` helps you avoid the temptation to write code that will install the same handler twice, fail entirely for newly-added widgets, or become a problem later when you want to publish your module in npm.

### What's available in the browser?

Now is a good time to mention highlights of what you can access in the browser by default when working with Apostrophe:

* jQuery
* lodash (version 3.x)
* async (version 1.x)
* moment
* jquery.fileupload
* jquery.cookie

And as previously mentioned, you can use LESS in your stylesheets.

> *"What if I want to use browserify, gulp, grunt, etc.?"* Sure, go nuts. Just arrange your gulpfiles to build a file that is pushed as an asset by one of your modules.
>
> We chose not to incorporate those frontend build tools into Apostrophe's core because the core set of features needed for good CMS-driven sites doesn't usually rise to that level of complexity. But if you need to build complex in-page JavaScript experiences, go for it.
