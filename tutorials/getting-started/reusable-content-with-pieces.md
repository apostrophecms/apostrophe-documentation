---
title: "Reusable content with pieces"
layout: tutorial
---

We've already learned how to add editable content to pages, and how to create some new types of editable content. But sometimes we want to reuse the same content all over the site. For a job like that, widgets in pages aren't the right answer, because a page lives in one place on the site.

## A directory of people: working with pieces

Let's say we want to create a directory of people who work for a company. People are "global content": they are useful to display here and there all over the site, they aren't tied down to one page. The `apostrophe-pieces` module provides a great starting point to create many types of global content. We'll extend it to make our own `people` module. You can extend `apostrophe-pieces` many times in the same project.

> **"What about users?"** Yes, you already have a "Users" menu on your admin bar. And yes, users are powered by pieces. But we've found that confusing website editors with the publicly visible staff directory tends to cause problems in the long run. Plus, this way, it's a teachable moment. :)

Let's create a `lib/modules/people/index.js` file:

```javascript
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  addFields: [
    {
      name: 'title',
      label: 'Full Name',
      type: 'string',
      required: true
    },
    {
      name: 'firstName',
      label: 'First Name',
      type: 'string',
      required: true
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'string',
      required: true
    },
    {
      name: 'body',
      label: 'Biography',
      type: 'area',
      options: {
        widgets: {
          'apostrophe-rich-text': {
            controls: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
          },
          'apostrophe-images': {}
        }
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'string'
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      options: {
        limit: 1,
        minSize: [ 200, 200 ],
        aspectRatio: [ 1, 1 ]
      }
    }
  ]
};
```

> **IMPORTANT: note the `name` property. This identifies ONE piece in the database, so it is always singular.** Remember: Modules Are Plural (MAP), but the things they manage may not be.

Now let's turn the module on in `app.js`. *From now on, we'll show `modules` with just the modules we're adding. Of course you will have other modules in your `app.js` file as well.*

```javascript
modules: {
  // ... other modules ...,
  'people': {}
}
```

Just like that, you'll see a new "People" menu in the admin bar when you log into the site. Pick "New Person" and you'll find that you can give each person a full name, a first name, a last name and a phone number. Pick "Manage Person" to examine and edit existing people.

> We could have configured the module entirely in `app.js`. But that leads to giant `app.js` files, so we don't recommend it. However, some developers feel it's a good place for high-level properties like `extend` that help give you a quick overview of what the module is and does.

There are certain additional fields that you get by default with every piece, such as `title` (the full name of the piece), `slug` (used when the piece appears as part of a URL), and `published` (which determines whether the public can see the piece, as you'll see below). But in this case, we re-declared `title` in order to change its label to `Full Name` so that the "New Person" form is not confusing.

You can even add a profile photo, via the `thumbnail` field. This field has the `singleton` type, which allows us to include a widget in the [schema](schema-guide.html) for this type of piece, exactly as if we were calling `apos.singleton` in a template. We just need to specify the `widgetType` and pass any desired options to the widget via the `options` property. You can also add fields of the `area` type.

And, there's a "biography" section. This is a full-blown content area in which the editor can add rich text and images. *There's nothing to stop us from allowing more controls and widgets here. Limiting the choices just helps keep things from getting out of hand.*

### Customizing the model layer: setting the `title` automatically

Right now, the `title` property (which is always the full name of the piece) is independent of `firstName` and `lastName`. For people, it makes more sense for the `title` to be generated automatically from `firstName` and `lastName`.

So let's add a `beforeSave` method in `lib/modules/people/index.js`:


```javascript
module.exports = {
  // Same configuration as before, then...

  construct: function(self, options) {
    self.beforeSave = function(req, piece, options, callback) {
      piece.title = piece.firstName + ' ' + piece.lastName;
      return callback();
    };
  }
};
```

Now the `title` property is set automatically from the first and last name.

> Methods are always added to the module in the `construct` function, which takes the module object, `self`, as its first argument. We attach methods directly to `self`. The use of `self` rather than `this` ensures that methods can make asynchronous calls and be passed as callbacks themselves without any confusion about the value of `this`. For more information about object-oriented functional programming in Apostrophe, check out [moog](https://www.npmjs.com/package/moog) and [moog-require](https://www.npmjs.com/package/moog-require).

You'll notice there is still a separate prompt to enter the full name. Let's get rid of that by adding the `contextual` option to the `title` field, which keeps that field out of the modal:

```javascript
  // In `addFields`
  {
    name: 'title',
    label: 'Full Name',
    type: 'string',
    required: true,
    contextual: true
  }
]
```

> There are many other methods you can override or extend to change the behavior of pieces. See [the apostrophe-pieces API methods](../../modules/apostrophe-pieces/index.html) for more information.

### Arranging fields

As we create increasingly complex [schemas](schema-guide.html) for pieces and widgets, we will want to arrange the fields in the modal in a way that supports a logical workflow for editors.

We can use `arrangeFields` to break the schema into multiple tabs in the editor modal. This can be achieved by passing an array of objects, each containing a name, label, and array of fields, to `arrangeFields`:

```javascript
  addFields: [ ... ],
  arrangeFields: [
    {
      name: 'contact',
      label: 'Contact',
      fields: [ 'firstName', 'lastName', 'phone' ]
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: [ 'slug', 'published', 'tags' ]
    },
    {
      name: 'content',
      label: 'Biographical',
      fields: [ 'thumbnail', 'body' ]
    }
  ],
```

Any non-`contextual` fields excluded from this configuration will be placed in an additional tab.

## Displaying pieces with widgets

We don't have a way to display these people here and there around the site yet. For that we'll need to add a second module in `app.js`, this time a widget:

```javascript
// other modules, then...
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets'
  }
// etc.
```

> `people-widgets` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-widgets` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option.

Already this is enough to let us add the new widget to any `apos.area` call in a page template, like our `home.html` or `default.html` template:

```markup
apos.area(data.page, 'body', {
    widgets: {
      'apostrophe-rich-text': {},
      'apostrophe-images': {},
      'people': {}
    }
  }
)
```

Right off the bat, we can click the `+` anywhere in this area to add a people widget, and then decide whether to display all people or just hand-pick a few by entering their names. There's an autocomplete feature to complete names quickly.

**Notice that people have to be published in order to be added to the widget.**

### An important performance warning

Pieces widgets are great, but they are powered by joins, and joins can cause trouble because they load so many things... and the things they load may load other things, like widgets... until your site is slow, or Apostrophe refuses to load more widgets to prevent an infinite loop.

To solve that, you should always add a `projection` filter when configuring a subclass of `apostrophe-pieces-widgets`:

```javascript
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets',
    filters: {
      projection: {
        slug: 1,
        title: 1,
        type: 1,
        tags: 1
      }
    }
  }
// etc.
```

This way, only the properties we really need are fetched for the widget. This can greatly speed up your site and prevent mysterious refusals to load any more data if things start joining back to themselves.

> *"Which properties do I need in my projection?"* Just those that matter to you. However, `slug`, `title`, `type` and `tags` are a good minimum set. `slug` helps build URLs, `tags` usually helps determine which page is the best match for the piece, `type` makes it easier to decide how to work with each one, and `title` is self-explanatory.

### Custom templates for widgets

Our widget isn't very satisfying yet. It just displays full names. Let's improve it by creating our own `lib/modules/people-widgets/views/widget.html` file:

```markup
{% for piece in data.widget._pieces %}
  <h4>
    {% if piece._url %}<a href="{{ piece._url }}">{% endif %}
    {{ piece.title }}
    {% if piece._url %}</a>{% endif %}
    {% if piece.phone %}
      <a href="tel:{{ piece.phone }}">
        {{ piece.phone }}
      </a>
    {% endif %}
    {{
      apos.singleton(
        piece,
        'thumbnail',
        'apostrophe-images',
        {
          edit: false,
          size: 'one-sixth'
        }
      )
    }}
  </h4>
{% endfor %}
```

> **"Where do those `piece._url` links go?"** Nowhere, yet. Read on to learn about `apostrophe-pieces-pages`, which provide a destination for those links.

> The `apostrophe-pieces-widgets` module already has a `widget.html` file. When we extend a widget and provide our own version of an existing template, our version gets rendered instead.

> Notice that we can pass our piece to `apos.singleton` the same way we would pass a page. Both are Apostrophe docs, and both live in the `aposDocs` MongoDB collection. Pages have a `slug` property that starts with a `/`, so they can be viewed at their own URLs. Pieces do not.

## Displaying a directory of people on a page with `apostrophe-pieces-pages`

Widgets are not the only way to display pieces. They are designed for displaying a few people here and there in the context of other pages.

For a really useful directory, we'll want to create a page that offers a paginated list of people, with the ability to filter by name. We can even create lots of those pages, "locked down" to display people with certain tags.

Let's add this new module to our `app.js`. Our new module extends the `apostrophe-pieces-pages` module:

```javascript
modules: {
  // ... other modules ...,
  'people-pages': {
    extend: 'apostrophe-pieces-pages'
  }
}
```

> `people-pages` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-pages` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option, and possibly also set the `name` option to a sensible name for the page type that displays an index of pieces. We usually just follow the pattern.

This module provides a new type of page on the site, `people-page`. This new page type displays an index of pieces. Before it can be used, we need to configure `apostrophe-pages` to add it to the menu of page types that can be given to pages. In `app.js` it might look like this:

```javascript
modules: {
  // ... other modules ...,
  'apostrophe-pages': {
    types: [
      // Ordinary page types
      {
        name: 'default',
        label: 'Default'
      },
      {
        name: 'home',
        label: 'Home'
      },
      // Our new page type for displaying people
      {
        name: 'people-page',
        label: 'People'
      }
    ]
  }
}
```

> As with other modules, it's a good idea to create `lib/modules/apostrophe-pages/index.js` and move configuration there to reduce clutter.

### Creating custom templates for our index of people

If you add a `People` page now, you'll see a plain-vanilla list of people; clicking the name of each takes you to a page that displays... just their name. Not very exciting. Let's dress it up.

First make a folder for our templates:

```bash
mkdir -p lib/modules/people-pages/views
```

Now create `index.html` in that folder. You can copy what's already in `node_modules/apostrophe/lib/modules/apostrophe-pieces-pages/views/index.html` as a starting point:

```markup
{% extends data.outerLayout %}
{% block title %}{{ data.page.title }}{% endblock %}

{% block main %}
  {% for piece in data.pieces %}
    <h4><a href="{{ piece._url }}">{{ piece.title }}</a></h4>
  {% endfor %}
  {% import 'apostrophe-pager:macros.html' as pager with context %}
  {{ pager.render({ page: data.currentPage, total: data.totalPages }, data.url) }}
{% endblock %}
```

First off, by now you probably have a `layout.html` template of your own that you extend in all of your page templates. So we can switch to extending that:

```markup
{% extends "layout.html" %}
```

Next, let's dress up the people with their headshots by replacing the existing `for` loop with the following:

```markup
  {% for piece in data.pieces %}
    <h4>
      {% set image = apos.images.first(piece.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% endif %}
      <a href="{{ piece._url }}">{{ piece.title }}</a>
    </h4>
  {% endfor %}
```

Add a little CSS and you've got a nice directory.

> *We could have used `apos.singleton` to display the thumbnail,* but sometimes you don't want the extra markup, editing controls, et cetera.
>
> The `apos.images.first` helper can find an image, also known as an "attachment," anywhere in the object we pass to it. You can pass the entire `piece` object if you want to. But, it's slower than than going straight to the thumbnail.
>
> You can also use `apos.images.all` to fetch an array of attachments.
>
> **Never assume the editor remembered to pick a thumbnail.** Always use an `if` statement to check.
>
> **Always specify the size.** Loading a large version of the image for an index view like this just slows down your site. See [adding editable content to pages](adding-editable-content-to-pages.html) for more information about image sizes.
>

### Filtering the list of people

Before long you'll start wanting to filter this list of people, taking advantage of joins, tags and other field types. On the public-facing site, this is easy to do thanks to the new built-in [cursor filters for most schema fields](../intermediate/cursors.html). `apostrophe-pieces-pages` offers a `piecesFilters` option that automatically takes advantage of these. This is a fine time to read the [cursors tutorial](../intermediate/cursors.html) to learn all about it.

### Using AJAX to enhance filters

Apostrophe offers an general-purpose, extremely easy solution for AJAX refreshes.

"What the heck is an AJAX refresh?" Right now, if you click on a filter, the whole page reloads. Instead, an AJAX refresh only updates the relevant part of the page.

Here's how you do it:

Just add a `data-apos-ajax-context="name"` attribute to the outer div that should be refreshed when any link or form submission inside it takes place and has a URL that points back to the same page.

*The value of the attribute must be unique on the page.*

Next, refactor your `index.html` template so that the actual list of people and any filters are in an `indexAjax.html` template, which is included at the appropriate point, wrapped in a div that has the `data-apos-ajax-context` attribute:

```markup
{# index.html #}
{% extend data.outerLayout %}
<h2>People</h2>
<div data-apos-ajax-context="people">
  {% include "indexAjax.html" %}
</div>
```

```markup
{# indexAjax.html, which does NOT extend anything #}
{% for piece in data.pieces %}
  <h4>
    {% set image = apos.images.first(piece.thumbnail) %}
    {% if image %}
      <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
    {% endif %}
    <a href="{{ piece._url }}">{{ piece.title }}</a>
  </h4>
{% endfor %}
```

That's it! Really.

Combine this with the [techniques in the cursors tutorial](../intermediate/cursors.html) and you'll get very modern results without the need to pull React or Angular into your project. 

**Tip:** you'll want to include your filter links and forms in `indexAjax.html` so that they too can be refreshed automatically, narrowing down the choices based on the other filters already in use. Any input elements or textareas that currently have the focus will not be refreshed, so you can even implement typeahead by triggering a submit of the form via JavaScript as the user types. (TODO: a good example of this with proper debouncing.)

### Filters for the "manage" modal

In the "manage" modal, enabling a "tags" filter for admins is even easier:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags'
    }
  ]
};
```

You can also allow multiple tags to be selected, in which case pieces with at least one of those tags are displayed:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags',
      multiple: true
    }
  ]
};
```


The same approach works for most types of schema fields, including joins. We do not recommend using it if the number of items in the dropdown will be very large. However, adding options to support filters that employ typeahead and avoid sending a large list of options to the browser is on our roadmap.

### Creating custom templates for individual people

Next we'll want to override the `show.html` template as well. This is the template that displays just one profile in detail:

```markup
{% extends "layout.html" %}
{% block title %}{{ data.piece.title }}{% endblock %}

{% block main %}
<h2>{{ data.piece.title }}
{{ apos.singleton(data.piece, 'thumbnail', 'apostrophe-images') }}
</h2>

{{ apos.area(data.piece, 'body') }}
{% endblock %}
```

> *We didn't pass an options object to `apos.area` or `apos.singleton` because we already specified the options in the [schema](schema-guide.html),* as part of `addFields`. If you *do* pass an options object to `apos.area` or `apos.singleton`, the original options object passed to the [schema](schema-guide.html) is ignored, so be sure to repeat anything that is relevant.

### Contextual pieces: editing pieces "on the page"

Editing each person's "bio" inside the modal dialog box is okay, but it would be a lot nicer to edit it on the actual page. Indeed, we already can... but only if we deliberately head to the page.

We can make this more intuitive by setting the `contextual` flag for our pieces module:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other options, then...
  contextual: true
};
```

When we do this, *the user is automatically redirected to the `show.html` page for each person as soon as they create and save it.*

Note that this only makes sense if you are using `apostrophe-pieces-pages`.

Now that we've made this choice, we might want to switch to calling `apos.singleton` in the page for the profile photo as well.

We can also set `contextual: true` on each of the `body` and `thumbnail` [schema](schema-guide.html) fields so that they don't show up in the modal dialog box but are instead only editable on the page. Whether to do that is up to you, but it does help reinforce the idea that you edit this content on the page.
