---
title: Nested module folders
layout: tutorial
---

# nested-module-folders

Apostrophe 2.x has optional support for nested subdirectories of modules, tucked inside `lib/modules`.

You must set the `nestedModuleSubdirs` option to `true` in `app.js`, like this:

```javascript
// in app.js

require('apostrophe')({
  shortName: 'my-project',
  nestedModuleSubdirs: true
  // etc., you may have additional options here as always
  modules: {
    // You can still configure some modules here, or move it all to modules.js
    // files in subdirectories, as seen below
  }
});
```

Now you can nest modules in subdirectories, like this. We'll start with a `modules.js` file in the parent `lib/modules/products` folder. Here we'll activate all of the modules that relate to products, making `app.js` shorter:

```javascript
// in lib/modules/products/modules.js

module.exports = {
  'products': {},
  'products-pages': {},
  'products-widgets': {}
};
```

And then we can implement those modules in their own sub-subdirectories:

```javascript
// in lib/modules/products/products/index.js

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product'
};
```

```javascript
// in lib/modules/products/products-pages/index.js

module.exports = {
  extend: 'apostrophe-pieces-pages',
  label: 'Products Page'
};
```

```javascript
// in lib/modules/products/products-widgets/index.js

module.exports = {
  extend: 'apostrophe-pieces-widgets',
  label: 'Products'
};
```

The resulting directory tree looks like this:

```text
/app.js
/lib/modules
/lib/modules/products (modules.js lives here, activates three modules)
/lib/modules/products/products (index.js for the product pieces lives here)
/lib/modules/products/product-pages (index.js, views/show.html, etc.)
/lib/modules/products/product-widgets (index.js, views/widget.html, etc.)
```

Just remember: **the names of the parent folders do not matter, and the names of the actual module folders at the bottom MUST still match the name of each module.**

By following through with this approach you can make `app.js` much shorter.

