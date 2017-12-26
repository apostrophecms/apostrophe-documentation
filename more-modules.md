---
title: "More modules"
layout: "reference"
---

*This page is about optional modules for Apostrophe. For the standard modules, see the [reference](modules/index.html).*

The modules you see documented on this site are the standard Apostrophe modules that ship as part of the `apostrophe` npm module — everything you absolutely need to make a website. But there are more. And you can create more.

Here is a list of optional official Apostrophe modules you can `npm install` to enhance your site:

* [apostrophe-twitter-widgets](https://npmjs.org/package/apostrophe-twitter-widgets)
* [apostrophe-blog](https://npmjs.org/package/apostrophe-blog)
* [apostrophe-events](https://npmjs.org/package/apostrophe-events)
* [apostrophe-pieces-submit-widgets](https://npmjs.org/package/apostrophe-pieces-submit-widgets), which lets you set up public contact forms, event submission forms, etc.
* [apostrophe-second-chance-login](https://npmjs.org/package/apostrophe-second-chance-login)
* [apostrophe-redirects](https://npmjs.org/package/apostrophe-redirects)
* [apostrophe-legacy-import](https://npmjs.org/package/apostrophe-legacy-import)
* [apostrophe-pieces-import](https://npmjs.org/package/apostrophe-pieces-import)
* [apostrophe-site-map](https://npmjs.org/package/apostrophe-site-map)
* [apostrophe-override-options](https://npmjs.org/package/apostrophe-override-options)
* [apostrophe-workflow](https://npmjs.org/package/apostrophe-workflow), which covers both workflow and localization / internationalization
* [apostrophe-caches-redis](https://npmjs.org/package/apostrophe-caches-redis)
* [apostrophe-passport](https://npmjs.org/package/apostrophe-passport), which provides single sign-on via Facebook, Twitter, Google, Gitlab, etc.
* [apostrophe-headless](https://npmjs.org/package/apostrophe-headless) offers a headless REST interface to `apostrophe-pieces`, useful for native apps, React/Vue apps, etc.

## Publishing your own npm modules for Apostrophe

Please do! It's easy. A few things to know:

* You can take any Apostrophe module (`lib/modules/my-module`) and package it up as an npm module and it will Just Work, as long as all of your dependencies are part of the module. For instance, don't rely on including templates that are in a module you're not publishing.
* **Do not use the `apostrophe-` prefix for your module, or the `apos-` prefix for your styles** without consulting us first. These are reserved for the official P'unk Avenue Apostrophe modules (which you are welcome to collaborate on). To avoid confusion, you can pick your own prefix. It's polite to use a prefix so that you don't conflict with project-level modules.
* You should take advantage of the `afterConstruct: function(self) { ... }` function in your `index.js` and invoke any methods that need to be called at startup there, rather than actually *doing things* in your `construct: function(self, options) { ... }` function. This allows project-level developers to extend your module and override your methods before `afterConstruct` runs and it's too late.
* Speaking of which, `afterConstruct` can optionally take a callback if you need to do async stuff there.

## Packaging Apostrophe modules together: creating bundles

If you need to package up several related modules that only make sense together, you can distribute them as a single npm module. Here is how that works:

* The name of your npm module should be the name of your "lead" Apostrophe module, the one with the most obvious name for what you're doing, much like `apostrophe-blog`.
* You must include a `moogBundle` property in the definition of your lead module, like this:

```javascript
module.exports = {
  name: 'apostrophe-blog',
  alias: 'blog',
  label: 'Article',
  extend: 'apostrophe-pieces',

  moogBundle: {
    modules: ['apostrophe-blog-pages', 'apostrophe-blog-widgets'],
    directory: 'lib/modules'
  },

  // ... etc ...
};
```

* The rest of your modules should live in the `lib/modules` subdirectory of your npm module.
* As long as the user configures your "lead module" (the one the npm module is named after), Apostrophe will automatically recognize it as a bundle. Of course the user must still configure each of your bundles, unless they use the `improve` keyword to implicitly subclass other modules, in which case they are loaded automatically for simplicity's sake.

