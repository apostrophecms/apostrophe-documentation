# Migrating from Apostrophe 0.5

Version 2.x is a complete rewrite of Apostrophe. There is some effort involved in moving from 0.5 to 2.x as a developer.

However, you'll quickly discover that the underlying patterns have been preserved.

Basically: *we got rid of the cruft*. The minimum `index.js` file for a module used to be around 40 lines; now there is no boilerplate at all.

0.5 developers should definitely [check out the tutorials](/README.md) as well as the [glossary](/other/glossary.md) first! After you've done that, here's a guide to making the jump.

[Our content migration tool is currently in beta and you can use it today.](https://www.npmjs.com/package/apostrophe-legacy-import) So far it has been tested primarily on cases such as importing snippets like blog posts as pieces for 2.x. This tool will continue to improve and grow more complete as our needs and yours indicate. Pull requests are warmly welcome.

We will obviously be supporting 0.5 for a long time. It might not be necessary to bring every project to 2.x.

Right now, we are focusing on rolling out new projects on 2.x, but we have a long history of upgrade projects, and so this is a priority for us.

### The `apostrophe-site` module is gone

There are far fewer npm modules in general. Everything you need to build a website ships with the `apostrophe` npm module, which contains all of the core Apostrophe modules.

Your `app.js` file will look much the same; you're just configuring `apostrophe` rather than `apostrophe-site`.

### `req.extras` has been replaced by `req.data`

Everything you attach to `req.data` is now visible as the `data` object in Nunjucks templates.

This is one of the bigger changes: get used to typing `data.page` rather than just `page` in your templates. Our frontend team asked for this feature because it makes it easy to `apos.log` the `data` object.

### "Hey, where did `page` go in my template?"

It bears repeating: it's `data.page` now. Everything you (or we) attach to `req.data` shows up as a property of the `data` object in templates.

### HTML escaping is automatic!

No more need to use the `| e` (escape) filter in your Nunjucks templates.

*"Hey, what's the `| e` filter?" Congratulations, you have a lot of insecure sites. Go read the Nunjucks docs and fix your 0.5 projects.*

On the flip side, if you write a Nunjucks helper that returns markup that is *already safe*, you'll want to use `return self.apos.templates.safe(s)` to mark it as safe so it does not get escaped twice. *Note that if your helper just invokes `self.partial()` this has already been done for you.*

### CSRF protection is automatic (but you must use AJAX or set exceptions)

2.x automatically provides CSRF protection for all POST requests (and DELETE, UPDATE, etc; all the change verbs).

The CSRF protection inspired by and compatible with that implemented by Angular.

However this protection is only automatic for AJAX calls made via jQuery (`$.post`, `$.ajax`, [`$.jsonCall`](https://github.com/punkave/jquery-json-call)).

**Generally speaking, using AJAX is a better idea these days than a conventional `<form action="..."></form>` submission.** However, if you wish to use one, you'll just need to configure the `apostrophe-express` module to let your submission through:

```javascript
// in app.js
modules: {
  'apostrophe-express': {
    csrf: {
      exceptions: [
        '/my-form-submission-post-url'
      ]
    }
  }
}
```

### "Why the heck don't my form submissions work?"

It bears repeating: CSRF protection is automatic in 2.0, but you need to add an exception if you are not using jQuery to submit your forms. See the previous item.

### `browserify` is not standard (but feel free to use it)

Our 0.5 sandbox shipped with browserify as part of the front-end code, but we found this greatly increased the time and RAM requirements of `npm install` and was not being used effectively in our own modules.

However, if you wish to use browserify in your own projects, you can!

Simply create and run your own `gulp` recipes and push the output `.js` file with Apostrophe.

### There is no `assets` option in `app.js`

There is no top-level "assets" option for pushing CSS and JS files.

A good practice is to create a new module in your project, then push assets from its `public/js` and `public/css` folders like this:

```javascript
// app.js
var apos = require('apostrophe')({
  shortName: 'mysite',
  modules: {
    'my-assets': {}
  }
});
```

```javascript
// lib/modules/my-assets/index.js

module.exports = {
  construct: function(self, options) {
    self.pushAsset('script', 'site');
    self.pushAsset('stylesheet', 'site');
  }
};
```

But you can just as easily push assets from any module, so we encourage you to think about breaking them up by topic.

### `aposArea` is now `apos.area`; most helpers are namespaced

All of Apostrophe's "Nunjucks helpers" for use in your templates are now sensibly namespaced. The very frequently used `apos.log`, `apos.area` and `apos.singleton` helpers are available directly as properties of `apos`. All other helpers are grouped under the alias of their module. An example:

```markup
{% set image = apos.images.first(data.piece.thumbnail) %}
{% if image %}
  <img src="{{ apos.attachments.url(image, { size: 'one-half' }) }}')">
{% endif %}
```

*If you can't guess what module it belongs to, that helper is probably in apos.utils.* That's where common utilities borrowed from [lodash](http://lodash.com) are typically found.

### Adding Nunjucks helpers got easier and better

We no longer use the confusing word "locals" to refer to helpers. Modules can call `addHelpers` to add Nunjucks helpers to their own namespace. You might put this code in the `construct` function of your own module:

```javascript
// lib/modules/my-module/index.js
module.exports = {
  // Set the alias for this module so it's convenient in templates
  alias: 'myModule',
  construct: function() {
    self.addHelpers({
      cash: function(n) {
        return '$' + n.toFixed(2);
      }
    });
  }
};
```

Now you can write:

```markup
<h4>That will be {{ apos.myModule.cash(data.price) }}</h4>
```

In a template.

### `apostrophe-schema-widgets` is dead, long live `apostrophe-widgets`

In 0.5, making a new type of widget was a pain. So we created `apostrophe-schema-widgets`, which allowed you to whip up a bunch of custom widgets... but you could only take it so far.

In 2.x, [every widget is powered by a module that extends `apostrophe-widgets`](/modules/apostrophe-widgets/README.md). You can do that too. And all widgets support schemas "out of the box."

See the [custom widget tutorial](/core-concepts/editable-content-on-pages/custom-widgets.md) for an example.

### The `slideshow` widget is now the `apostrophe-images` widget

Just for clarity's sake, and for parallelism with the [apostrophe-images](/modules/apostrophe-images/README.md) subclass of [apostrophe-pieces](/modules/apostrophe-pieces/README.md), which it partners with.

### The `file` widget is now the `apostrophe-files` widget... you get the idea

All of our official widgets now have names prefixed with `apostrophe-` to avoid conflicts with your own project-level widgets.

### Widget player functions have changed

Now that every widget is powered by a module that extends `apostrophe-widgets`, we have a more mature pattern for creating widget player functions.

A widget player function is invoked every time a widget is part of a freshly loaded page, and also when a widget is added to the page or modified via the editor.

Let's pretend Apostrophe already use our jQuery Projector plugin for slideshows, and we wanted to enable that.

In 0.5 you might write:

```javascript
// In site.js, perhaps
apos.widgetPlayers.slideshow = function($el)
{
  // Use our jQuery projector slideshow plugin (pretend it's not standard...)
  var data = apos.getWidgetData($el);
  $el.projector({
    noHeight: data.noHeight,
    delay: data.delay
  });
};
```

In 2.x, you would write:

```javascript
// In lib/modules/apostrophe-images/public/js/always.js

apos.define('apostrophe-images-widgets', {
  construct: function(self, options) {
    self.play = function($widget, data, options) {
      $widget.projector(options);
    };
  }
});
```

**We don't have to call `pushAsset`** because `apostrophe-widgets` always pushes `always.js` for any of its subclasses.

**Seem a little magical? Read more about object oriented programming in Apostrophe.** See the glossary entries on [implicit subclassing](/other/glossary.md#implicit-subclassing) and on [moog types in general](/other/glossary.md#moog-type).

### `snippets` are now `pieces`

The `apostrophe-snippets` module has been renamed and broken up into three pieces:

1. `apostrophe-pieces` provides the core feature of creating a new content type with a schema and managing them through an admin interface.

2. `apostrophe-pieces-pages` provides "index pages" that allow you to view those pieces on a page, browse them by tag, etc.

3. `apostrophe-pieces-widgets` implements a widget to display a type of piece anywhere on the site.

See the [resuable content with pieces](/core-concepts/reusable-content-pieces/reusable-content-with-pieces.md) tutorial for more information.

### `apostrophe-fancy-page` is now `apostrophe-custom-pages`

We renamed this module and baked it into the core. We also added an amazing `dispatch` method that lets you set up Express-style routes to handle "the rest of the URL" when the start of a URL matches your custom page. You don't have to use it, but it's a lot nicer than matching URLs yourself.

### `apostrophe-blog-2` has no exact counterpart (yet), but check out `contextual` pieces

In 0.5, the `apostrophe-blog-2` module provided an option for creating "blogs" and other content types that live "in context" at a particular point in the page tree. This had two main advantages:

1. Editing is more contextual. You edit each blog post right "on the page."

2. You can grant editing permissions to a particular blog like you would to any other page, and that allows the correct person to post to that blog without accidentally causing content to appear on other blogs simply because something was tagged differently.

In 2.x, the first problem is easily solved by setting the `contextual` option to `true` when extending `apostrophe-pieces` to create your own module. When you set `contextual: true`, you are redirected to the "show page" for a particular piece as soon as you finish setting its title, et cetera. You can then use `apos.area` calls in the `show.html` template to present an interface for editing the actual body of the blog post "in context."

The second problem has no "baked-in" solution yet in 2.x. We will certainly be examining the issue as we encounter projects that call for it. However, note that you can use [apostrophe-custom-pages](/modules/apostrophe-custom-pages/README.md) to build your own solutions, especially with the new `dispatch` method.

### The `minify` option has moved

Now it looks like:

```javascript
modules: {
  'apostrophe-assets': {
    minify: true
  }
}
```

In 2.0, *Almost everything is in a module.*

### The list of page types has moved

In 2.0:

```javascript
modules: {
  'apostrophe-pages': {
    types: [
      { name: 'default', label: 'Default Page' },
      { name: 'home', label: 'Home' },
      { name: 'styleguide', label: 'Styleguide' }
    ]
  }
}
```

Again... it's always part of configuring a module.

Currently every valid page type *must* appear for the `types` option.

Also check out the new `park` option for the [apostrophe-pages](/modules/apostrophe-pages/README.md) module:

```javascript
  park: [
    {
      title: 'Styleguide',
      type: 'styleguide',
      slug: '/styleguide',
      published: true
    }
  ]
```

Pages listed here are automatically created at startup time if needed.

### You don't need the `apostrophe-blocks` module

In 2.x, the `widget.html` template for any widget may contain `apos.area` calls. So you can create your own "block-level" widgets, such as a "two-column" widget. This makes blocks obsolete as a separate feature, and it's a lot more readable when you peek at a page in the database.

Just use the `data.widget` as the "page" for purposes of calling `apos.area`.

### Lockups are gone (but you don't need them)

In 2.x, lockups are also gone. Again, just create widgets that contain their own `apos.area` calls in their templates; you can drag things in and out of those as needed. Eliminating lockups dramatically simplified the codebase by removing a very hairy special case.

### There are a lot more modules (but fewer npm modules)

Because every module now does exactly one job, there are many more Apostrophe modules than there used to be. But, almost all of them are packaged in the core `apostrophe` npm module.

As a rule of thumb, if you need it to have a website, it's in there, and will automatically configure itself if you don't specify any options explicitly.

### Browser-side JavaScript is... pretty close to the same

Except for the removal of browserify (which you can use on your own via gulp), the front end browser world is very, very similar. However many modules offer a singleton on the browser side, similar to the singleton on the server and in Nunjucks templates. For instance, you can access `apos.attachments.url` in browser-side JavaScript if you have an `attachment` object to work with.

The `apos.on('ready', function() {})` mechanism is much like before. It is called properly both for new page loads and when the `apos-refreshable` div is refreshed due to a content update. It is still the right place to attach event handlers to specific elements in the DOM. Of course you can also use jQuery event delegation from `body`, in which case you should set that up on DOMready. Doing it in response to the `ready` event would create redundant event handlers.

### `data/local.js` works much the same

The `data/local.js` file, which is traditionally excluded from deployment, is still loaded by Apostrophe and then merged with the configuration object being passed to the Apostrophe module. You can still use it for server-specific overrides.

### The source code is pretty

[Take a look.](https://github.com/punkave/apostrophe) It's a whole lot prettier than 0.5!
