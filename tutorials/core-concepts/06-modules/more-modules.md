---
title: More modules
layout: reference
---

# More on Modules

_This page is about optional modules for Apostrophe. For the standard modules, see the_ [_reference_](/modules/index.html)_._

## More official modules for Apostrophe

[**Check out our official list of optional modules from the Apostrophe team.**](https://apostrophecms.org/extend) The modules available cover everything: workflow, internationalization, localization, single sign-on \(SSO\), Twitter feeds, redirects, Redis caching, headless APIs for your native, React, Vue and Angular applications, sitemaps and a great deal more.

## Publishing your own npm modules for Apostrophe

Please do! It's easy. A few things to know:

* You can take any Apostrophe module \(`lib/modules/my-module`\), move that to the root of its own repository and package it up as an npm module and it will Just Work, as long as all of your dependencies are part of the module. For instance, don't rely on including templates that are in a module you're not publishing.
* **Do not use the** `apostrophe-` **prefix for your module, or the** `apos-` **prefix for your styles** without consulting us first. These are reserved for the official P'unk Avenue Apostrophe modules \(which you are welcome to collaborate on\). To avoid confusion, you can pick your own prefix. It's polite to use a prefix so that you don't conflict with project-level modules.
* You should take advantage of the `afterConstruct: function(self) { ... }` function in your `index.js` and invoke any methods that need to be called at startup there, rather than actually _doing things_ in your `construct: function(self, options) { ... }` function. This allows project-level developers to extend your module and override your methods before `afterConstruct` runs and it's too late.
* Speaking of which, `afterConstruct` can optionally take a callback if you need to do async stuff there.
* Don't add fields directly with the `addFields` option. Instead, manipulate `options.addFields` in a `beforeConstruct: function(self, options) { ... }` function. And make sure you append any values that are _already_ in `options.addFields`, if it exists. This allows "project level" developers to add more fields to your pieces modules, widgets, etc.
* Add `apostrophe`, `apostrophecms` and `apostrophe-cms` to your keywords in `package.json` to increase discoverability of your module.

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
* As long as the user configures your "lead module" \(the one the npm module is named after\), Apostrophe will automatically recognize it as a bundle. Of course the user must still configure each of your bundles, unless they use the `improve` keyword to implicitly subclass other modules, in which case they are loaded automatically for simplicity's sake.

