---
title: "Custom schema fields for pages"
layout: "tutorial"
---

If you've read [reusable content with pieces](../getting-started/reusable-content-with-pieces.html), then you know about [apostrophe schemas](../getting-started/schema-guide.html). You have already experienced the flexibility of adding new fields to your own piece types. But what about pages?

Here's the good news: you can do the same trick with pages. The right way to do it depends on whether you want to enhance *just one* page type with extra fields in "Page Settings," or add those fields to *all* page types.

## Adding custom schema fields to "Page Settings" for one type

Let's say our site has a `gallery` page type. We want to add a `vendor` field to Page Settings, so we can access it as `data.page.vendor` in `gallery.html`.

Here's how we do that:

```javascript
// in app.js
modules: {
  'gallery-pages': {
    extend: 'apostrophe-custom-pages',
    // Must match the `name` given when configuring `types`
    // for apostrophe-pages
    name: 'gallery',
    addFields: [
      {
        name: 'vendor',
        type: 'string',
        label: 'Vendor'
      }
    ]
  }
}
```

> The field becomes available in `Page Settings`. If you don't spot it right away, look in the `Info` tab.

Now, in `gallery.html`, we can write:

```markup
<h4>Vendor: {{ data.page.vendor }}</h4>
```

You can add other field types too, of course. And you can use `arrangeFields` to group them into tabs in Page Settings, just like you would for pieces.

> "Do I have to add all of my page's areas to the schema? Or is calling `apos.area` in the template enough?" For top-level areas in the document, calling `apos.area` or `apos.singleton` is good enough, unless you are using the [apostrophe-headless](https://npmjs.org/package/apostrophe-headless) module or simply wish to edit that content via tabs in Page Settings.

> "What about apostrophe-pieces-pages?" These already have a module! So please don't declare a second, redundant module that will only break the operation of that page type. Instead, just use `addFields` when configuring your module that extends `apostrophe-pieces-pages`.

## Adding custom schema fields to "Page Settings" for all types

It's possible to add a field to *all* page types too. This is a very cool trick, especially when you have a need similar to our [apostrophe-seo](https://npmjs.org/package/apostrophe-seo) module... but it doesn't already exist.

For this maneuver, we'll need to extend the `apostrophe-custom-pages` module itself. That module serves as the parent class of all "page manager" modules.

> Even "ordinary" page types have a page manager module, which is created implicitly for you. And yes, it extends `apostrophe-custom-pages`.

To do that, just create `lib/modules/apostrophe-custom-pages/index.js` at project level (do NOT modify `node_modules/apostrophe`):

```javascript
// in lib/modules/apostrophe-custom-pages/index.js
module.exports = {
  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        type: 'boolean',
        name: 'approved',
        label: 'Approved'
      }
    ].concat(options.addFields || []);
  }
};
```

> You should **not** declare `apostrophe-custom-pages` in `app.js`. That would attempt to make an instance of it, and it is just a "virtual base class" for real page types, something they can extend to get the features they need.

**What's going on in this code?** We could just configure `addFields` the normal way, but if we do, our configuration will just get overwritten by every page module that adds its own fields.

Instead, we use `beforeConstruct` to manipulate the options **after** our subclasses have had a chance to set their own. And we use `concat()` to append any array of fields provided by the subclass to our own array.

> `beforeConstruct` is unique in that it runs "bottom first:" the deepest subclass, for instance the `gallery-pages` module we saw above, gets to run it first, and then its parent class, and so on. That's how we are able to see fields that come from our subclasses in this method, and combine them with fields of our own. This technique should always be used when you expect your module to be extended by other people.
>
> By creating an `index.js` file in `lib/modules/apostrophe-custom-pages`, at "project level," we have "implicitly subclassed" the core implementation of `apostrophe-custom-pages` that comes from the `apostrophe` module. That means we can add new functionality to it, and other modules will automatically see it.
>
> If you want to ship functionality like this in an npm module, then things can't be quite so implicit. You'll need to use the `improve` option. Check out the [apostrophe-seo module source code](https://github.com/apostrophecms/apostrophe-seo) for a very straightforward example of a "bundle" module that improves several core Apostrophe modules.

## Custom schema fields for ALL document types

It is possible to add fields to ALL document types, not just pages. To do that, just use the technique described above for adding fields to all page types. But, extend `apostrophe-doc-type-manager`, rather than `apostrophe-custom-pages`.

`apostrophe-doc-type-manager` is the "base class" of both `apostrophe-pieces` and `apostrophe-custom-pages`.

Of course you should use this power carefully. "Opt in" is a good policy. Consider crafting your `beforeConstruct` code to look for an `option` that turns on adding the fields, so they are not attached to things like `apostrophe-users` that almost certainly won't need them.
