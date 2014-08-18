---
title: "Scene upgrades: when anonymous visitors need access to fancy features"
---

Apostrophe refrains from loading most of its JavaScript and CSS for logged-out users. This is a good thing because it renders pages faster.

However sometimes those features are really useful for anonymous users. For instance, our `apostrophe-moderator` module lets the public submit new events, articles and so forth. That depends on the ability to present schema-powered forms and edit content the same way a logged-in user would.

To do that in your own code, just use the `apos.requireScene` method in your browser-side JavaScript code. The code in your callback is guaranteed to have access to all the JavaScript, CSS and DOM template assets that logged-in users see:

```javascript
apos.requireScene('user', function() {
  // Do great stuff like using `apostrophe-schemas` to process forms
});
```

It won't take long to for Apostrophe to load the extra assets and start running your callback. However, always make sure you have set `minify: true` in `data/local.js` on your production server so that your CSS and JavaScript are as compact as possible.

