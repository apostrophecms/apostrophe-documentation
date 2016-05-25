---
title: "Setting up the map module"
---

To include the map module in your project, add it to the `modules` section of your `app.js` configuration:

```javascript
modules: {
  'apostrophe-map': { }
}
```

As with all snippet types, you must also add the maps menu to your apostrophe admin menu bar. This can be found in `views/global/outerLayout.html` in the [Apostrophe Sandbox](https://github.com/punkave/apostrophe-sandbox).

```nunjucks
{{ aposMapMenu(permissions) }}
```

To load the Google Maps frontend API, add the Google API `<script>` tag to your base layout (`base.html` in the [Apostrophe Sandbox](https://github.com/punkave/apostrophe-sandbox)). For more on this, and for instructions on obtaining a Google Maps API key, check out the [Maps V3 API Documentation](https://developers.google.com/maps/documentation/javascript/tutorial).
