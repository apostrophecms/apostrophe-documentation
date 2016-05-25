---
title: Pushing assets to the browser
---

Your constructor can invoke the mixinModuleAssets method to "mix in" the `pushAssets` method:

```javascript
// Mix in the ability to serve assets and templates
self._apos.mixinModuleAssets(self, 'mymodule', __dirname, options);
````

*Note: never call this method if you're just extending a module that already calls it.*

This adds a `pushAsset` method to your module, which you can use to add more client-side JavaScript to the project:

```javascript
self.pushAsset('script', 'editor', { when: 'user' });
```

This will cause the browser to load the `editor.js` file found in the `public/js` subdirectory of your module, whenever a user is logged in.

To load a javascript file *all* the time, use:

```javascript
self.pushAsset('script', 'content', { when: 'always' });
```

To load a LESS file from your `public/css` folder, just use:

```javascript
self.pushAsset('stylesheet', 'content', { when: 'always' });
```

You can also push templates into the DOM so they become part of the page at the very end of the body, where you can clone them and put them to use with jQuery. Here we're pushing `views/interface.html` into the DOM:

```javascript
self.pushAsset('template', 'interface', { when: 'user' });
```

. You should use this feature sparingly, and almost never with `{when: 'always' }`, because it adds to the size of every page that Apostrophe delivers.

*If you're subclassing a module that already pushes `editor`, then your own `editor.js` will be pushed too.* This makes it easier to extend modules on the browser side. This is also true for stylesheets.
