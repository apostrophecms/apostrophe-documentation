# Understanding and overriding piece URLs

Pieces have slugs, but they don't have hard-coded URLs. The slug of the piece is a version of the title, made more unique if necessary. But the URL of the piece, which you see in the `_url` property of the piece when working in templates, is dynamic.

That URL can be overridden to suit your needs. But first, let's look at what the default behavior is.

## How URLs for pieces are determined by default

Let's consider an example. If you have an apostrophe-pieces subclass module called `products` and an `apostrophe-pieces-pages` subclass module called `products-pages`, then:

* If there are no `products-page` pages ("products pages") on the site, `_url` is not set at all for each piece, because there is nowhere to go to view the piece on the front end of the site.
* If there is only one products page on the entire site, then the `_url` of each product will be the current URL of that page, plus `/`, plus the `slug` of the piece.
* If there is more than one `products-page`, then the `_url` depends on the tags of the product, and the "with these tags" settings of each of the "products pages." Each page gets two points for a tag in common, and loses one point for a tag on the piece that is *not* on the "with these tags" list. A products page with no "with these tags" setting at all always gets at least one point.

It is recommended that you have a products page without a "with these tags" setting, so that all products can be found under a "general purpose" index page if they do not have a better match. Otherwise, if you have no "cats page," users will be confused when cat toys show up on the "dogs page."

> "Why does it work this way?" Marrying pieces to a single pieces-page reduces the flexibility of the system. Instead, we allow pieces to be grouped dynamically to the pieces-page that currently makes the most sense. We also allow products to be browsed via more than one "products page" that is relevant, while still having a `_url` "permalink" that points to the best place.

## Overrides: picking a "products page" in your own way

The easiest way to change this behavior is to override the `chooseParentPage` method of our `products-pages` module, like this. Let's say all we care about is the custom `color` schema field of both thee pieces and the pages:

```javascript
// in lib/modules/products-pages/index.js
module.exports = {
  extend: 'apostrophe-pieces-pages',
  // we would also have an addFields option here with a "color" select field,
  // and in the products module as well
  construct: (self, options) => {
    self.chooseParentPage = (pages, piece) => {
      return pages.find(piece => page.color === piece.color);
    };
  }
};
```

Now pieces with their `color` set to `red` appear beneath the page with its `color` set to `red`. If
a piece has no color, or no page matches, it will have no `_url` at all.

This kind of override is easy to write because all we have to do is look at the "products pages" and choose one that suits the piece. All the hard stuff, including finding the pages in the database, has already been done for us.

## Advanced overrides: setting `_url` without any "products page"

What if we don't want to use `apostrophe-pieces-pages` at all, but our products still need URLs
of some kind?

It's up to you to decide why you want that. For instance, you might need to point to an
external website.

In that case, you'll override the `addUrls` method of your `products` module:

```javascript
// in lib/modules/products/index.js

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product',
  construct: (self, options) => {
    self.addUrls = (req, pieces, callback) => {
      for (const piece of pieces) {
        piece._url = `https://external-site.com/products/$piece.slug`;
      }
    };
    return callback(null);
  }
};
```

> Since this method takes a callback, we can invoke APIs to figure out the `_url` if
we really need to. Notice that we add URLs to many pieces at once, so we must iterate
over the array, not just set one.
