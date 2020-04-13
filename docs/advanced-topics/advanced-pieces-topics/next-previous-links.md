---
title: "Adding Next and Previous Links"
layout: tutorial
---

# Adding Next and Previous Links

Sometimes it's desirable to provide links to the "next" and "previous" piece on the "show page" for that piece (the `show.html` template).

To enable that, just configure your module that subclasses `apostrophe-pieces-pages` appropriately:

```javascript
// lib/modules/my-articles-pages/index.js
module.exports = {
  extend: 'apostrophe-pieces-pages',
  next: true,
  previous: true
  // other options, etc.
};
```

{% hint style="info" %}
Here we'e assuming that `my-articles` extends `apostrophe-pieces` directly, and `my-articles-pages` extends `apostrophe-pieces-pages`, but you can also do this trick with modules that extend `apostrophe-blog-pages`, `apostrophe-events-pages` and other existing subclasses.
{% endhint %}

Turning on these options causes Apostrophe to load the next and previous documents into `data.previous` and `data.next`, so you can output links like this, often at the bottom of `show.html`:

```markup
{# lib/modules/my-articles-pages/views/show.html #}
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
// lib/modules/my-articles-pages/index.js
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

{% hint style='info' %}
These are the minimum fields recommended. Except for `title`, all of them play a role in building the dynamic `_url` property correctly.
{% endhint %}


### "Next", "previous" and blog posts

One thing that might be confusing: for this purpose, "next" means "appears next in the list of pieces in the `index.html` view." and "previous" means "appears previously in the list of pieces in the `index.html` view."

For most types of pieces, this is intuitive. But since blogs are displayed in reverse chronological order, there it can seem a little backwards. So just keep in mind that you may need to use different language for your links on the front end.

## Fetching the `next` or `previous` piece programmatically

This feature is implemented using the `next` and `previous` cursor filter methods. You can use those yourself:

```javascript
// `doc` is a piece we already fetched
return self.find(req).previous(doc).toObject(function(err, previous) { ... });
```

The same technique can be used with `next`.
