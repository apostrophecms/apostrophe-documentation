---
title: Building Navigation
layout: tutorial
---

# Building Navigation

The Vikings believed that all of life all connected back to the world tree Yggrasil. Much like Viking mythology, all pages in Apostrophe are part of a "tree" in which every page is a child of another page and all the branches connect back to the Home page. The connection between pages with Home at the root is what makes visualizing and building navigation in Apostrophe work.

Below you can find examples for several core navigation components. To test them out, add them to the `home.html` template of an existing Apostrophe project.

## Linking to the home page

The first and most important link you need is the home page. Most of the time, you'll have a pretty good guess at what your home URL is, however, you want to ask Apostrophe rather than hardcode the actual URL.

You can use this code retreive the home URL from any page in Apostrophe:

```markup
<h2><a href="{{ data.home._url }}">{{ data.home.title }}</a></h2>
```

There are real advantages to doing it this way. If the site has a `prefix` option, you'll still get the right URL. And the title of the home page can change.

**"Why** `_url`**?"** The URL isn't a permanent part of the page object that lives in the database. Anything that is dynamically set and not part of the database starts with `_`, so it doesn't get accidentally stored back to mongodb.

## Linking to the subpages of the home page \("tab" navigation\)

A common navigation design is to have a row of "tabs" at the top. Want to display those no matter where in the site you are? Add this to your `home.html`:


```markup
<ul class="tabs">
  {% for tab in data.home._children %}
    <li><a href="{{ tab._url }}">{{ tab.title }}</a></li>
  {% endfor %}
</ul>
```

Now let's add a CSS class indicating the current tab \(the one that is the current page, or an ancestor of it\):


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

## Dropdown menus

Sometimes you'll want to display dropdown menus. Each menu represents a child of the home page, and each item on each menu represents a child of _that_ page.

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

Now you can easily output all the markup you'd need for dropdown menus. Add this code to `home.html`:


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

## Breadcrumb trails

The current page is `data.page`, and by default, `data.page._ancestors` is available. This will add a breadcrumb link to the page:


```markup
{% if data.page %}
  <ul class="breadcrumbs">
    {% for ancestor in data.page._ancestors %}
      <li><a href="{{ ancestor._url }}">{{ ancestor.title }}</a></li>
    {% endfor %}
  </ul>
{% endif %}
```

{% hint style='info' %}
**Always check whether** `data.page` **exists** when using it in a layout template that might also be extended by `login.html`, `notFound.html` and other places where there is no CMS "page."
{% endhint %}

## "Accordion" navigation

Want to list the ancestors of the current page along with their subpages? Sure. You can replace your current navigation with this "accordion" nav:


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

## Children of the current page

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

## Custom navigation

For further navigation examples, you can see the [Custom Widgets](/tutorials/core-concepts/editable-content-on-pages/custom-widgets.md) article, or continue reading to learn more about Widgets in general first.

