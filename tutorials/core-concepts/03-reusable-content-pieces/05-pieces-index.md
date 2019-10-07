---
title: "How can I disable a pieces index page?"
layout: tutorial
---

Occasionally you might want pieces that have their own show pages, but you don't need the index page. One case that's come up a few times is that pieces are listed in widgets across the site based on various criteria, but the organization doesn't have need for a central listing.

Even if you don't create an `index.html` in your piece's pages module, one will exist by default anyway, likely looking completely unstyled. Bummer.

For example, let's say we have a `cats` piece type. In my `cats-pages` module (extending `apostrophe-pieces-pages`), my `views` directory has a single `show.html` template file for the cat profile pages. So Oscar the cat can have his page at `example.com/cats/oscar`. If someone decides to try visiting `example.com/cats` we don't want that page to exist, but it will be there, listing cats, probably not looking that great.

The solution is pretty simple! To get `example.com/cats` to return a 404 error (effectively no longer existing), we'll make a small addition to the [`beforeIndex`](../../modules/apostrophe-pieces-pages/README.md#beforeindex-req-callback) method.

In `lib/modules/cats-pages/index.js`, add the following to your `construct` method:

```javascript
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    req.notFound = true;

    return callback(null);
  };
}
```

See what we did there? Since `beforeIndex` runs before the index page is loaded, and by setting the request's `notFound` property to `true`, it'll return a 404 error rather than loading the page. This is the case even for site admins, so make sure the `apostrophe-pages` configuration doesn't give admins an option to create those pieces index pages.

You might want to allow site admins to create and access those index pages, though. In that case, do [include it as an option in `apostrophe-pages` configuration](../../modules/apostrophe-pages/README.md), and make an adjustment to the `beforeIndex` method:

```javascript
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    if (!req.data.page._edit) {
      req.notFound = true;
    }

    return callback(null);
  };
}
```

With the `!req.data.page._edit` conditional we're allowing people with edit permissions to access the pages.


---
title: "\"Next\" and \"previous\" links for pieces"
layout: tutorial
---

Sometimes it's desirable to provide links to the "next" and "previous" piece on the "show page" for that piece (the `show.html` template).

To enable that, just configure your module that subclasses `apostrophe-pieces-pages` appropriately:

```
// in my-articles-pages/index.js

module.exports = {
  extend: 'apostrophe-pieces-pages',
  next: true,
  previous: true
  // other options, etc.
};
```

> Here we'e assuming that `my-articles` extends `apostrophe-pieces` directly, and `my-articles-pages` extends `apostrophe-pieces-pages`, but you can also do this trick with modules that extend `apostrophe-blog-pages`, `apostrophe-events-pages` and other existing subclasses.

Turning on these options causes Apostrophe to load the next and previous documents into `data.previous` and `data.next`, so you can output links like this, often at the bottom of `show.html`:

```markup
{% if data.previous %}
  <h4>
    <a href="{{ data.previous._url }}">Back to {{ data.previous.title }}</a>
  </h4>
{% endif %}

{% if data.next %}
  <h4>
    <a href="{{ data.next._url }}">Next: {{ data.next.title }}</a>
  </h4>
{% endif %}
```

By default you can access any property of `data.previous` or `data.next`. For better performance, you may want to limit them with a projection, much as you would for a join:

```javascript
// in my-articles-pages/index.js

module.exports = {
  extend: 'apostrophe-pieces-pages',
  previous: {
    projection: {
      title: 1,
      slug: 1,
      tags: 1,
      type: 1
    }
  },
  next: {
    projection: {
      title: 1,
      slug: 1,
      tags: 1,
      type: 1
    }
  }
  // other options, etc.
};
```

> These are the minimum fields recommended. Except for `title`, all of them play a role in building the dynamic `_url` property correctly.

## "Next", "previous" and blog posts

One thing that might be confusing: for this purpose, "next" means "appears next in the list of pieces in the `index.html` view." and "previous" means "appears previously in the list of pieces in the `index.html` view."

For most types of pieces, this is intuitive. But since blogs are displayed in reverse chronological order, there it can seem a little backwards. So just keep in mind that you may need to use different language for your links on the front end.

## Fetching the `next` or `previous` piece programmatically

This feature is implemented using the `next` and `previous` cursor filter methods. You can use those yourself:

```javascript
// `doc` is a piece we already fetched
return self.find(req).previous(doc).toObject(function(err, previous) { ... });
```

The same technique can be used with `next`.


---
title: "How can I remove pieces from an index listing?"
layout: tutorial
---

In Apostrophe, you'll often display a nice single page or paginated list of pieces, using a module that extends `apostrophe-pieces-pages`. That could include official modules such as `apostrophe-blog-pages` as well as custom modules you create. We refer to these special pages as "index pages."

It's common for an index page to have a featured piece, such as a news listing with featured article. It might then make sense to remove that featured piece from the main list so it doesn't appear duplicated on the page. To do this you'll want to add a filter to the index cursor so that it never makes it into your data object.

In your module extending `apostrophe-pieces-pages`, extend `indexCursor` with the `super` pattern. You'll need to get the IDs of the pieces you're excluding, dropping them into an array. Then in the final return, use the `.and()` cursor method to add the additional MongoDB filter to only call for pieces that don't share those IDs.

Example:
```javascript
construct: function (self, options) {
  var superIndexCursor = self.indexCursor;
  self.indexCursor = function (req) {
    // 1. Establish an array to omit later. This is just one way to do this part.
    var omitIds = [];

    // 2. Do stuff to populate the array with IDs. This is based on a real example, but it'll vary based on your use case.
    var features = _.filter(req.data.page.['name-of-feature-area'].items, function (obj) {
      return obj.type === 'blog'; // Set this to the widget type name.
    });

    if (features.length > 0) {
      _.forEach(features, function (widget) {
        _.forEach(widget._pieces, function (piece) {
          omit.push(piece._id);
        });
      });
    }

    // 3. Return `superIndexCursor` filtering out pieces with the IDs. This is the key.
    return superIndexCursor(req).and({_id: {$nin: omitIds}});
  };
}
```
