---
title: Adding nunjucks filters and functions
---

## Adding Functions for All Templates

Apostrophe provides a number of handy functions like [aposArea](../tutorials/getting-started/adding-editable-content-areas-to-your-page-templates.html) that can be called from any Nunjucks template. Sometimes you'll want to add your own.

You can do that with the `apos.addLocal` method, which is easy to call from `afterInit` in your `app.js` file, like so:

```javascript
    afterInit: function(callback) {
      site.apos.addLocal('doubleIt', function(a) {
        return a * a;
      });
      return callback(null);
    }
```

Now you can call `doubleIt` in a template:

```markup
    Two times four is {{ doubleIt(4) }}.
```

Notice that locals do not take a callback. If you need to do something asynchronous you must do it *before* the rendering of the page begins. Check out [page loader functions](../tutorials/custom-modules/page-loader-functions.html) for more information.

## Adding Filters for Nunjucks

Here's a simple example of a Nunjucks filter at work in a page template:

    ```markup
    <h1>{{ page.title | e }}</h1>
    ```

The `e` filter escapes plaintext as HTML. Apostrophe provides several more [really handy nunjucks filters](../api-reference/nunjucks-filters.html), but it doesn't cover everything. Sometimes you'll want to add your own filters.

To add your own filters, provide a `configureNunjucks` function in `app.js`. Here you can manipulate each Nunjucks environment before it is used. Here's an example:

```javascript
    configureNunjucks: function(env) {
      env.addFilter('repeat', function(s, n) {
        var r = '';
        while (n--) {
          r += s;
        }
        return r;
      });
    }
```

Now we can repeat something any number of times in Nunjucks templates anywhere in our Apostrophe project:

```markup
    {{ page.title | repeat(3) }}
```

Asynchronous filters are **not** supported. Use [page loader functions](../tutorials/custom-modules/page-loader-functions.html) to fetch data before your page templates start rendering.

