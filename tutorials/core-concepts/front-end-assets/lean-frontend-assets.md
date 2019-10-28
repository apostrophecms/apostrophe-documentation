---
title: "Lean frontend assets: Apostrophe without jQuery"
layout: tutorial
---

By default, Apostrophe 2.x always pushes `jQuery`, `lodash`, `async` and several other large libraries to the browser, even if no one is logged in. Beginning in Apostrophe 2.91.0, you can disable this behavior.

To activate the new lean frontend, configure `apostrophe-assets` like this:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
module.exports = {
  modules: {
    'apostrophe-assets': {
      lean: true
    }
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

With the lean frontend, **none of Apostrophe's widget players are available by default.** However, a simple video player is available if you choose to turn it on:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
module.exports = {
  modules: {
    'apostrophe-assets': {
      lean: true
    },
    'apostrophe-video-widgets': {
      player: true
    }
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Follow this convention in future when adding new lean widget players.

**Adopting the lean frontend is a good step toward Apostrophe 3.x in your projects.** Apostrophe 3.x will use the lean frontend exclusively.

## Working with the lean API: `apos.utils` methods for lightweight coding

Apostrophe does ship a very lightweight library of JavaScript utility methods for use in the lean frontend. The idea is to make sure you can still create widget players and do cross-browser programming, even as far back as Internet Explorer 9, but to do this with **very little code**. That's why the lean `apos.utils` library is under 10K, and that's before gzip compresses it further.

When you are logged out, you get a tiny `window.apos` object with key properties like `prefix` and `csrfCookieName`, plus the `lean` object which offers the methods and features below... and that's all.

### `apos.utils.post(uri, data, callback)`

Sends `data` to URI as a JSON-format request body in a POST request (note: not URL-encoded). The callback is node-style: it receives `(err, response)`. If there is no error, `response` is pre-parsed JSON data. Respects `apos.prefix` and **sends the CSRF token** so you won't get "403 Forbidden" errors.

### `apos.utils.get(uri, data, callback)`

Sends `data` to URI as a query string in a GET request. Nested objects and arrays are not supported; see `apos.post` for that. This method should be reserved for simple, intentionally cache-friendly requests. The callback is node-style: it receives `(err, response)`. If there is no error, `response` is pre-parsed JSON data. Respects `apos.prefix`.

### `apos.utils.addClass(el, className)`

Adds the specified class to the specified DOM element (NOT a jQuery object).

### `apos.utils.removeClass(el, className)`

Removes the specified class from the specified DOM element (NOT a jQuery object).

### `apos.utils.closest(el, selector)`

A wrapper for the native closest() method of DOM elements,
where available, otherwise a polyfill for IE9+. Returns the
closest ancestor of el that matches `selector`, where
`el` itself is considered the closest possible ancestor and will
be returned if it matches `selector`.

### `apos.utils.assign(obj1, obj2 /* , obj3... */)`

A wrapper for `Object.assign`, where available; otherwise provides a basic polyfill. Properties of `obj2` are copied to `obj1`, then properties of `obj3`, and so on. `obj1` is returned.

### `apos.utils.onReady(fn)`

Invokes the specified function when the DOM is ready, but no sooner than next tick. A replacement for jQuery's `ready` event. However, **always register widget players** rather than using this method yourself to enhance widgets. Otherwise they will not be enhanced when the user first adds them to the page, which looks unprofessional.

### `apos.utils.runPlayers(el)`

Runs all widget players found in `el`, or in the document if `el` is not given. `el` may also be an individual widget.

Widget players are guaranteed to never run twice, so you may safely call this more than once for the same part of the document.

See below for how to register a widget player for your widget type.

## How to register a lean widget player

In your front-end JavaScript, simply write:

```javascript
apos.utils.widgetPlayers['apostrophe-video'] = function(el, data, options) {
  // Utilize the provided `data` (properties of the widget)
  // and `options` (options passed to the singleton or area for
  // this widget) to enhance `el`, a DOM element representing the widget
};
```

Note that you register the widget's type name, i.e. `apostrophe-video`, NOT the module name.

For a complete example, see `lib/modules/apostrophe-video-widgets/public/js/lean.js`.

## How do I push my assets to the browser? "always" doesn't work!

For backwards compatibility, this module patches "always" to load only when a user is logged in.

Instead, use `when: lean` when pushing an asset in your module:

```javascript
module.exports = {
  construct: function(self, options) {
    self.pushAsset('script', 'player', { when: 'lean' });
  }
}
```
## Pushing preconfigured assets from apostrophe-assets

This just works. This module pushes js and css assets specified in your `apostrophe-assets` configuration as if `when: 'lean'` is set for them, so that these assets are available to everyone, unless `when` is explicitly set to a different value. Note that for legacy reasons, `when: 'always'` *does not* push assets to everyone in the presence of this module.

{% hint style='info' %}
**Important:** if your `site.less` refers to LESS variables that come from Apostrophe, i.e. those with an `@apos` prefix, your LESS will not compile successfully since these will not be present. If you see errors of this kind, stop using `@apos` variables in your LESS code.
{% endhint %}

### Tips

**"What about `_.each()`?"** Arrays have had a native `.forEach()` method since IE9. If you need to iterate over object properties, use `Object.keys(yourObjectHere)` to get an array of keys, then iterate over those with `.forEach()`.

**"What about $('.some-class-here')?"** Use `document.querySelectorAll('.some-class-here')`. You can also call that method on an individual DOM element to get the effect of jQuery's `find()` method.

### More resources for success

Struggling to adapt existing jQuery-based code to "vanilla JavaScript?" Check out [You Might Not Need jQuery](http://youmightnotneedjquery.com/).
