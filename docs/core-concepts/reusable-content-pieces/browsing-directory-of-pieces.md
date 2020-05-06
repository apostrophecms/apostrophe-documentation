# Using Pieces Pages to Create a Directory

Widgets are not the only way to display pieces. They are designed for displaying a few people here and there in the context of other pages.

For a really useful directory, you want to create a page that offers a paginated list of people, with the ability to filter by name. You can even create lots of those pages, "locked down" to display people with certain tags.

## Displaying a directory of people on a page with `apostrophe-pieces-pages`

Let's add this new module to your `app.js`. Your new module extends the `apostrophe-pieces-pages` module:


```javascript
// app.js
modules: {
  // ... other modules ...,
  'people-pages': {
    extend: 'apostrophe-pieces-pages'
  }
}
```

::: tip NOTE
`people-pages` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-pages` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option, and possibly also set the `name` option to a sensible name for the page type that displays an index of pieces. We usually just follow the pattern.
:::

This module provides a new type of page on the site, `people-page`. This new page type displays an index of pieces. Before it can be used, you need to configure `apostrophe-pages` to add it to the menu of page types that can be given to pages. In `app.js` it might look like this:


```javascript
// app.js
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

::: tip
As with other modules, it's a good idea to create `lib/modules/apostrophe-pages/index.js` and move configuration there to reduce clutter.
:::

### Creating custom templates for the index of people

If you add a `People` page now, you'll see a plain-vanilla list of people; clicking the name of each takes you to a page that displays... just their name. Not very exciting. Let's dress it up.

1. First make a folder for your templates:

    ```bash
    mkdir -p lib/modules/people-pages/views
    ```

2. Now create `index.html` in that folder. You can copy what's already in `node_modules/apostrophe/lib/modules/apostrophe-pieces-pages/views/index.html` as a starting point:

    ```django
    {# lib/modules/people-pages/views/index.html #}
    {% extends "layout.html" %}
    {% block title %}{{ data.page.title }}{% endblock %}

    {% block main %}
      {% for piece in data.pieces %}
        <h4><a href="{{ piece._url }}">{{ piece.title }}</a></h4>
      {% endfor %}
      {# YES, YOU NEED PAGINATION. You could set the `perPage` option to a large
         number, but eventually you will have performance issues. However, also
         see the discussion of "Load More" and infinite scroll solutions later in this
         tutorial. #}
      {% import 'apostrophe-pager:macros.html' as pager with context %}
      {{ pager.render({ page: data.currentPage, total: data.totalPages }, data.url) }}
    {% endblock %}
    ```

3.  You probably have a `layout.html` template of your own that you extend in all of your page templates. So you can switch to extending that:

    ```django
    {# lib/modules/people-pages/views/index.html #}
    {% extends "your-project/layout.html" %}
    ```

4. Next, let's dress up the people with their headshots by replacing the existing `for` loop with the following:

    ```django
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

Your final result should look like this:


```django
{# lib/modules/people-pages/views/index.html #}
{% extends "your-project/layout.html" %}
{% block title %}{{ data.page.title }}{% endblock %}

{% block main %}
 {% for piece in data.pieces %}
    <h4>
      {% set image = apos.images.first(piece.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% endif %}
      <a href="{{ piece._url }}">{{ piece.title }}</a>
    </h4>
  {% endfor %}
  {# YES, YOU NEED PAGINATION. You could set the `perPage` option to a large
     number, but eventually you will have performance issues. However, also
     see the discussion of "Load More" and infinite scroll solutions later in this
     tutorial. #}
  {% import 'apostrophe-pager:macros.html' as pager with context %}
  {{ pager.render({ page: data.currentPage, total: data.totalPages }, data.url) }}
{% endblock %}
```


Add a little CSS and you've got a nice directory.

::: tip
_We could have used_ `apos.singleton` _to display the thumbnail,_ but sometimes you don't want the extra markup, editing controls, et cetera.

The `apos.images.first` helper can find an image, also known as an "attachment," anywhere in the object you pass to it. You can pass the entire `piece` object if you want to. But, it's slower than than going straight to the thumbnail.

You can also use `apos.images.all` to fetch an array of attachments.

**Never assume the editor remembered to pick a thumbnail.** Always use an `if` statement to check.

**Always specify the size.** Loading a large version of the image for an index view like this just slows down your site. See [adding editable content to pages](/core-concepts/editable-content-on-pages/standard-widgets.html#apostrophe-images) for more information about image sizes.
:::

### Creating custom templates for individual people

Next you want to override the `show.html` template of your subclass of `apostrophe-pieces` as well. The default version is very bare-bones, just enough to demonstrate the idea.

`show.html` is the template that displays just one profile in detail:


```django
{# lib/modules/people-pages/views/index.html #}
{% extends "layout.html" %}
{% block title %}{{ data.piece.title }}{% endblock %}

{% block main %}
<h2>{{ data.piece.title }}
{{ apos.singleton(data.piece, 'thumbnail', 'apostrophe-images') }}
</h2>

{{ apos.area(data.piece, 'body') }}
{% endblock %}
```

::: tip
_We didn't pass an options object to_ `apos.area` _or_ `apos.singleton` _because you already specified the options in the_ [_schema_](/advanced-topics/schema-guide.md)_,_ as part of `addFields`. If you _do_ pass an options object to `apos.area` or `apos.singleton`, the original options object passed to the schema is ignored, so be sure to repeat anything that is relevant.
:::

**For SEO reasons, it is almost always important to have a good `show.html` page and provide `_url` links to reach it in your index pages, even if you are displaying most of the information in the index pages as well.**

### Contextual pieces: editing pieces "on the page"

Editing each person's "bio" inside the modal dialog box is okay, but it would be a lot nicer to edit it on the actual page. Indeed, you already can... but only if you deliberately head to the page.

You can make this more intuitive by setting the `contextual` flag for your pieces module:



```javascript
// lib/modules/people/index.js
module.exports = {
  // Other options, then...
  contextual: true
};
```

When you do this, _the user is automatically redirected to the_ `show.html` _page for each person as soon as they create and save it._

Note that this only makes sense if you are using `apostrophe-pieces-pages`.

Now that you've made this choice, you might want to switch to calling `apos.singleton` in the page for the profile photo as well.

You can also set [`contextual: true`](/reference/field-properties/README.md) on each of the `body` and `thumbnail` schema fields so that they don't show up in the modal dialog box but are instead only editable on the page. Whether to do that is up to you, but it does help reinforce the idea that you edit this content on the page.

## Disabling a Pieces Index Page

Occasionally you might want pieces that have their own show pages, but you don't need the index page. One case that's come up a few times is that pieces are listed in widgets across the site based on various criteria, but the organization doesn't have need for a central listing.

Even if you don't create an `index.html` in your piece's pages module, one will exist by default anyway, likely looking completely unstyled. Bummer.

For example, let's say you have a `cats` piece type. In my `cats-pages` module (extending `apostrophe-pieces-pages`), my `views` directory has a single `show.html` template file for the cat profile pages. So Oscar the cat can have his page at `example.com/cats/oscar`. If someone decides to try visiting `example.com/cats` you don't want that page to exist, but it will be there, listing cats, probably not looking that great.

The solution is pretty simple! To get `example.com/cats` to return a 404 error (effectively no longer existing), make a small addition to the [`beforeIndex`](/reference/modules/apostrophe-pieces-pages/README.md#beforeindex-req-callback) method.

In `lib/modules/cats-pages/index.js`, add the following to your `construct` method:


```javascript
// lib/modules/cats-pages/index.js
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    req.notFound = true;

    return callback(null);
  };
}
```


See what we did there? Since `beforeIndex` runs before the index page is loaded, and by setting the request's `notFound` property to `true`, it'll return a 404 error rather than loading the page. This is the case even for site admins, so make sure the `apostrophe-pages` configuration doesn't give admins an option to create those pieces index pages.

You might want to allow site admins to create and access those index pages, though. In that case, do [include it as an option in `apostrophe-pages` configuration](/reference/modules/apostrophe-pages/README.md), and make an adjustment to the `beforeIndex` method:


```javascript
// lib/modules/apostrophe-pages/index.js
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    if (!req.data.page._edit) {
      req.notFound = true;
    }

    return callback(null);
  };
}
```

With the `!req.data.page._edit` conditional you're allowing people with edit permissions to access the pages.
