---
title: "Building Navigation"
layout: reference
---

## Building Navigation

Apostrophe pages are part of a "tree" in which every page is a child of another page, except for the home page. That makes it very easy to build navigation links for common cases.

### Linking to the home page

OK, you can probably guess the URL for that! But let's ask Apostrophe:

```markup
<h2><a href="{{ data.home._url }}">{{ data.home.title }}</a></h2>
```

There are real advantages to doing it this way. If the site has a `prefix` option, you'll still get the right URL. And the title of the home page can change.

> **"Why `_url`?"** The URL isn't a permanent part of the page object that lives in the database. Anything that is dynamically set and not part of the database starts with `_`, so it doesn't get accidentally stored back to mongodb.

### Linking to the subpages of the home page ("tab" navigation)

Lots of sites have a row of "tabs" at the top. Want to display those no matter where in the site you are?

```markup
<ul class="tabs">
  {% for tab in data.home._children %}
    <li><a href="{{ tab._url }}">{{ tab.title }}</a></li>
  {% endfor %}
</ul>
```

Now let's add a CSS class indicating the current tab (the one that is the current page, or an ancestor of it):

```markup
<ul class="tabs">
  {% for tab in data.home._children %}
    <li class="
      {% if data.page and
        (apos.pages.isAncestorOf(tab, data.page) or tab._id == data.page._id)
      %}
        current
      {% endif %}
    "><a href="{{ tab._url }}">{{ tab.title }}</a></li>
  {% endfor %}
</ul>
```

### Dropdown menus

Sometimes you'll want to display dropdown menus. Each menu represents a child of the home page, and each item on each menu represents a child of *that* page.

First, in `app.js`, let's configure `apostrophe-pages` to retrieve two levels of children when fetching ancestors of the current page:

```javascript
modules: {

  // ... other configuration ...

  'apostrophe-pages': {
    filters: {
      // Grab our ancestor pages, with two levels of subpages
      ancestors: {
        children: {
          depth: 2
        }
      },
      // We usually want children of the current page, too
      children: true
    }
    // other apostrophe-pages options like `types` ...
  },

  // ... other configuration ...
}
```

Now we can easily output all the markup we'd need for dropdown menus:

```markup
<ul class="tabs">
  {% for tab in data.home._children %}
    <li><a href="{{ tab._url }}">{{ tab.title }}</a>
      {% if tab._children.length %}
        <ul>
          {% for child in tab._children %}
            <li><a href="{{ child._url }}">{{ child.title }}</a></li>
          {% endfor %}
        </ul>
      {% endif %}
    </li>
  {% endfor %}
</ul>
```

### Breadcrumb trails

The current page is `data.page`, and by default, `data.page._ancestors` is available:

```markup
{% if data.page %}
  <ul class="breadcrumbs">
    {% for ancestor in data.page._ancestors %}
      <li><a href="{{ ancestor._url }}">{{ ancestor.title }}</a></li>
    {% endfor %}
  </ul>
{% endif %}
```

> **Always check whether `data.page` exists** when using it in a layout template that might also be extended by `login.html`, `notFound.html` and other places where there is no CMS "page."

### "Accordion" navigation

Want to list the ancestors of the current page along with their subpages? Sure:

```markup
{% if data.page %}
  <ul class="accordion">
    {% for ancestor in data.page._ancestors %}
      <li><a href="{{ ancestor._url }}">{{ ancestor.title }}</a>
        {% if ancestor._children.length %}
          <ul>
            {% for child in ancestor._children %}
              <li><a href="{{ child._url }}">{{ child.title }}</a></li>
            {% endfor %}
          </ul>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
{% endif %}
```

### Children of the current page

That's another easy one:

```markup
{% if data.page %}
  <ul class="children">
    {% for child in data.page._children %}
      <li><a href="{{ child._url }}">{{ child.title }}</a></li>
    {% endfor %}
  </ul>
{% endif %}
```

### Custom navigation

"The page tree is very nice, but how do I build a custom navigation menu with hand-picked pages from all over the tree?" That's a good question. To accomplish it we'll create a custom widget in the next tutorial.
