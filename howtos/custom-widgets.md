---
title: Creating Custom Widgets
---

Apostrophe provides [lots of widgets out of the box](../getting-started/adding-editable-content-areas-to-your-page-templates.html). And creating new ones can be really easy. If you [subclass snippets to create a new content type](../snippets/subclassing-snippets.html), a widget to pull that content into pages is created automatically. And you can create [schema widgets](https://github.com/punkave/apostrophe-schema-widgets) with very little effort.

**Seriously: [go check out schema widgets right now](https://github.com/punkave/apostrophe-schema-widgets).** Most of the time, it's what you want.

But if you want to do something that can't be done with schema widgets, or create a widget to share with the rest of us in the npm repository, here's how to do that:

1. [Check out the `apostrophe-twitter` module](https://github.com/punkave/apostrophe-twitter). This is a very simple module that:

* Adds a new widget
* Adds server-side routes to support its AJAX calls
* Adds a browser-side JavaScript "player" for the new widget via its `content.js` file

2. [Check out the `apostrophe-rss` module](https://github.com/punkave/apostrophe-rss). This is an equally simple module that takes a slightly different approach. Rather than fetching the feed via JavaScript in the browser, the RSS module fetches it on the server before the page renders, via a `load` method. If a widget has a `load` method, it is invoked to fetch content asynchronously. We use this feature to reach out and fetch an RSS feed URL.

3. Choose either the `apostrophe-twitter` or `apostrophe-rss` module as a template for your own module, whether in npm or in `lib/modules`, and be sure to follow these recommendations:

**Your `public/js/editor.js` file must provide `preSave` and `prePreview` methods.** Usually these will call the same function, which sets `self.exists` to `true` and populates `self.data` with properties if the user's selections are good, and then invokes the provided callback.

**If you do not set `self.exists`, but do invoke the callback, `options.messages.missing` is displayed.** Set a default for that property, or tell the user their selections are not valid yet in your own way and don't invoke the callback.

**If your widget requires browser-side JavaScript to "play" its content,** just set a player in your `content.js` file:

```javascript
apos.widgetPlayers.twitter = function($widget) {
  var data = apos.getWidgetData($widget);
  var account = data.account;
  var hashtag = data.hashtag;
  // Now we talk to the server and get the feed, etc.
};
```

`$widget` will be the DOM element for one widget. **Do not use `$('.all-my-widgets')` to find your widgets.** Always set a player method as seen above, use `$widget`, and worry about just that one widget at a time. If you follow this rule everything will work perfectly, even when an editor adds a new widget to an area on the fly.

**Give any server-side AJAX routes you talk to a unique prefix** that makes it unlikely they will conflict with page slugs on the site.

**Your server-side object (in index.js) should have a `sanitize` method** for cleaning up what comes from the widget editor. We recommend following the new callback style:

```javascript
self.sanitize = function(req, item, callback) {
  var object = {};
  object.name = self._apos.sanitizeString(item.name);
  return callback(null, object);
};
```

This style allows you to make asynchronous calls, and requires you to construct a new object with only the sanitized, cleaned-up properties from the widget editor. We are in the process of migrating our older widgets to this standard.

**Think carefully before writing a server-side `load` method like the one in the RSS module.** Ask yourself: *"is this going to be slow? Could the site I'm loading content from be down? Will that make my whole site look bad?"*

If the loader might be slow or unreliable in any way, you should use a player function instead and fetch the content from an AJAX route, like the Twitter module does.

On the other hand, also ask yourself: "do I need this content to be in the page for acceptable SEO?" If the answer is yes, use a load method like the RSS module does, and **make sure you cache the response** so that you are not accessing a remote site on every single pageview.

