---
title: How do I enable site-wide full text search?
layout: tutorial
---

Apostrophe has full-text search capabilities built in. You just need to enable the `apostrophe-search` module, and create a "parked page" with the type `apostrophe-search` so that there is a place to display search results.

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
// ... other code, then ...

  modules: {
    'apostrophe-search': {},
    'apostrophe-pages': {
      // other configuration, then ...
      park: [
        {
          title: 'Search',
          slug: '/search',
          type: 'apostrophe-search',
          label: 'Search',
          published: true
        }
      ]
    }
  }
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Now you get a search page at /search; it's very bare bones in appearance, so copy the index.html template from the `apostrophe` npm module's `lib/modules/apostrophe-search/views` folder to your own project-level `lib/modules/apostrophe-search/views` folder, and modify the markup as needed.

You can create your own "mini" search forms anywhere on the site. Just make sure they target your search page (`/search` in this case) and have the `q` query string variable set to the user's search. It's simple to do with a plain old GET-method form:

```markup
<form method="GET" action="/search">
  <input type="text" name="q" /><input type="submit" value="Search" />
</form>
```

{% hint style='info' %}
We do not use the POST method for search. Searches are intentionally visible in the address bar so that they are easily bookmarked and shared.
{% endhint %}


## "What can I access for each search result in the `index.html` template?"

Everything, basically. Joins and widgets are loaded normally for each result on the page. The `._url` property contains the best available URL for that item, if there is one. Pieces without pieces-pages will not have a URL.

## Limiting search results

You may notice search results for documents that don't have URLs, or are simply of piece types you don't want to be included. Obviously, this isn't ideal.

The simplest way to limit the results is to set the `types` option to an array containing all of the piece and page types that you *do* want results for:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
'apostrophe-search': {
  types: [
    'home',
    'default',
    'apostrophe-blog'
  ]
},
```
{% endcode-tabs-item %}
{% endcode-tabs %}

When you do this, *no* other types will be included in the results. So be sure to extend the list appropriately if you add new page or piece types you would like to see.

**Alternatively**, you can set a `searchable` property to `false` on piece or page types that you want to exclude from search. Core piece types such as `apostrophe-users` that are not necessarily meant to be public have this set by default.

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
'my-piece': {
  searchable: false
},
```
{% endcode-tabs-item %}
{% endcode-tabs %}


**For piece types, there must be corresponding pieces-pages** in order for a valid URL to be provided. For instance, you have a `product` type powered by a `products` module that extends `apostrophe-pieces`, and you want to include it in search results, you must also create a `products-pages` module that extends `apostrophe-pieces-pages`, providing `index.html` and `show.html` templates for it, and create at least one such page on the site. For more information, see [reusable content with pieces](/tutorials/core-concepts/03-reusable-content-with-pieces/README.md).

{% hint style='info' %}
The type name must correspond to the `name` option for a pieces module, which is what the `type` property is set to for each individual piece... **not** the name of the module itself. Think singular, not plural.
{% endhint %}

## Filtering search results

You can also provide the user with convenient filters, for instance to view only the blog posts, just the events, etc.

To do that, configure the `filters` option. The `name` property must match the

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
'apostrophe-search': {
  filters: [
    {
      name: 'apostrophe-blog',
      label: 'Blog Posts'
    },
    {
      name: 'apostrophe-event',
      label: 'Events'
    }
  ]
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

**When you do this, Apostrophe automatically adds one more choice labeled "Everything Else."** This makes sense because many page types and piece types may come up occasionally but aren't interesting enough to deserve their own filter.

However, you can change the label of that extra filter choice by configuring one with the special name `__else`:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
'apostrophe-search': {
  filters: [
    {
      name: 'apostrophe-blog',
      label: 'Blog Posts'
    },
    {
      name: 'apostrophe-event',
      label: 'Events'
    },
    {
      name: '__else',
      label: 'Pages'
    }
  ]
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}
