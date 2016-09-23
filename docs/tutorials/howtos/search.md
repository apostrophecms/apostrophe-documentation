---
title: How do I enable site-wide full text search?
---

Apostrophe has full-text search capabilities built in. You just need to enable the `apostrophe-search` module, and create a "parked page" with the type `apostrophe-search` so that there is a place to display search results.

```javascript
// in app.js

// ... other code, then ...

  modules: {
    'apostrophe-search': {},
    'apostrophe-pages': {
      // other configuration, then ...
      park: [
        {
          slug: '/search',
          type: 'apostrophe-search',
          label: 'Search',
          published: true
        }
      ]
    }
  }
```

Now you get a search page at /search; it's very bare bones in appearance, so copy the index.html template from the `apostrophe` npm module's `lib/modules/apostrophe-search/views` folder to your own project-level `lib/modules/apostrophe-search/views` folder, and modify the markup as needed.

You can create your own "mini" search forms anywhere on the site. Just make sure they target your search page (`/search` in this case) and have the `q` query string variable set to the user's search. It's simple to do with a plain old GET-method form:

```markup
<form method="GET" action="/search">
  <input type="text" name="q" /><input type="submit" value="Search" />
</form>
```

> We do not use the POST method for search. Searches are intentionally visible in the address bar so that they are easily bookmarked and shared.

## "What can I access for each search result in the `index.html` template?"

Everything, basically. Joins and widgets are loaded normally for each result on the page. The `._url` property contains the best available URL for that item, if there is one. Pieces without pieces-pages will not have a URL.


## TODO: document the `types` and `filters` options
