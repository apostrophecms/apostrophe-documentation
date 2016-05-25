---
title: Creating custom widgets
---

Apostrophe provides [lots of widgets out of the box](../getting-started/adding-editable-content-areas-to-your-page-templates.html). And creating new ones can be really easy. If you [subclass snippets to create a new content type](../snippets/subclassing-snippets.html), a widget to pull that content into pages is created automatically. And you can create [schema widgets](https://github.com/punkave/apostrophe-schema-widgets) with very little effort.

**Seriously: [go check out schema widgets right now](https://github.com/punkave/apostrophe-schema-widgets).** Most of the time, it's what you want.

But if you want to do something that can't be done with schema widgets, or create a widget to share with the rest of us in the npm repository, here's how to do that.

## Choose Your Role Model

There are two great modules that provide simple implementations of widgets. You should study them both and decide which one is the best template for creating your own.

### Get familiar with the Twitter widget

[Check out the `apostrophe-twitter` module](https://github.com/punkave/apostrophe-twitter). This is a very simple module that:

  * Adds a new widget
  * Adds server-side routes to support its AJAX calls
  * Adds a browser-side JavaScript "player" for the new widget via its `content.js` file

### Get familiar with the RSS widget

[Check out the `apostrophe-rss` module](https://github.com/punkave/apostrophe-rss). This is an equally simple module that takes a slightly different approach. Rather than fetching the feed via JavaScript in the browser, the RSS module fetches it on the server before the page renders, via a `load` method. If a widget has a `load` method, it is invoked to fetch content asynchronously. We use this feature to reach out and fetch an RSS feed URL.

**Important update:** since fetching content server-side via a loader delays the rendering of the entire page, we have changed the RSS widget to use an AJAX request unless that particular feed has already been cached. But the RSS widget still does have a `load` method, which still demonstrates how to attach additional content asynchronously at page load time.

### Create your own module

Choose either the `apostrophe-twitter` or `apostrophe-rss` module as a template for your own module, whether in npm or in `lib/modules`. Copy that code and globally replace `twitter` or `rss` as appropriate. In the `views` folder, you'll need to rename `twitter.html` to `mything.html`, and `twitterEditor.html` to `mythingEditor.html`.

### Review the editor template

Review the `twitterEditor.html` file. This is where your widget is edited. Rename it to match the new name in your `index.js` file. Replace the `account` and `hashcode` fields with the fields you want.

### Review the public view template

Review the `twitter.html` file. This is where your widget is displayed to the public. Rename it to match the new name in your `index.js` file. Alter it to display your content appropriately.

### Review the editor's JavaScript on the browser side

Review the `editor.js` file. Change all references to Twitter's fields, like `account`, to the fields you need in your form.

**Make sure your `editor.js` file provides `preSave` and `prePreview` methods.** Usually these will call the same function, which sets `self.exists` to `true` and populates `self.data` with properties if the user's selections are good, and then invokes the provided callback.

### Remember to set self.exists

**If you do not set `self.exists` in `preSave`, but you do invoke the callback, `options.messages.missing` is displayed.** If you are happy with what the editor typed in, always set `self.exists` after populating `self.data` with the user's selections. If you don't want to use `options.messages.missing` to tell editors that their entries are incomplete, just tell them in your own way and don't invoke the callback.

### "Players:" JavaScript for the public view

**If your widget requires browser-side JavaScript to "play" its content,** much as our slideshow player does, just set a player function in your `content.js` file:

  ```javascript
  apos.widgetPlayers.twitter = function($widget) {
    var data = apos.getWidgetData($widget);
    var account = data.account;
    var hashtag = data.hashtag;
    // Now we talk to the server and get the feed, etc.
  };
  ```

In your player, `$widget` will be the DOM element for one widget. **Do not use `$('.all-my-widgets')` to find your widgets.** Always set a player method as seen above, use `$widget`, and worry about just that one widget at a time. If you follow this rule everything will work perfectly, even when an editor adds a new widget to an area on the fly.

### AJAX routes on the server side

Often players will need to fetch content from the server. Add any custom routes you need on the server side in `index.js`. Give the URLs a unique prefix that makes it unlikely they will conflict with pages editors create on the site.

### Sanitizing your content

Your server-side object (in index.js) will have a `sanitize` method for cleaning up what comes from the widget editor. We recommend following the new callback style:

```javascript
self.sanitize = function(req, item, callback) {
  var object = {};
  object.name = self._apos.sanitizeString(item.name);
  return callback(null, object);
};
```

This style allows you to make asynchronous calls, and requires you to construct a new object with only the sanitized, cleaned-up properties from the widget editor. We are in the process of migrating our older widgets to this standard.

### Loading content on the server side

Think carefully before writing a server-side `load` method like the one in the RSS module. Ask yourself: *"is this going to be slow? Could the site I'm loading content from be down? Will that make my whole site look bad?"*

If the loader might be slow or unreliable in any way, you should use a player function instead and fetch the content from an AJAX route, like the Twitter module does.

On the other hand, also ask yourself: "do I need this content to be in the page for acceptable SEO?" If the answer is yes, use a load method like the RSS module does, and **make sure you cache the response** so that you are not accessing a remote site on every single pageview.

A valid `load` method might look like this. Here I assume your widget editor allows the user to paste in a "feed URL," and that you have a `getOurFeed` function that actually fetches feeds and returns a nice array of content.

**You should definitely include caching in your `getOurFeed` function.**

```javascript
self.load = function(req, item, callback) {
  // Go get a feed from there
  return getOurFeed(item.feedUrl, function(err, feedItems) {
    if (err) {
      // Tell our widget template that the feed didn't load.
      // DON'T report an error to the callback, unless you
      // want the whole page to be a 500 error.
      item._failed = true;
      return setImmediate(callback);
    }
    item._feedItems = feedItems;
    return setImmedaite(callback);
  });
};
```

Notice that we add properties to `item`, so that the `mything.html` template can see them. When we do that, we always prefix them with `_` to signify that they are temporary and should not be stored in MongoDB.

### Take over the world

Take over the world! Your widget is ready for the masses.

