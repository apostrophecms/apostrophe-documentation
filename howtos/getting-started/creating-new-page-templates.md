# Creating new page templates

Apostrophe offers a choice of page templates to the user when adding a page via the "Pages" menu. Adding a new one is straightforward. Just copy the `default.html` template in the `views/pages` folder. Let's assume you call your template `myPage.html`.

Next, edit `app.js`. This file is the entry point for your project. It consists mostly of options to be passed to `apostrophe-site`, a convenient way of configuring an Apostrophe-powered website.

Look for the `pages` option, and the `types` option nested within that:

```javascript
pages: {
  types: [
    { name: 'default', label: 'Default (Two Column)' },
    { name: 'onecolumn', label: 'One Column' },
    { name: 'marquee', label: 'Marquee' },
    { name: 'home', label: 'Home Page' },
    { name: 'blog', label: 'Blog' },
    { name: 'map', label: 'Map' },
    { name: 'sections', label: 'Sections' }
  ]
},
```

You can add a new entry like this:

```javascript
pages: {
  types: [
    { name: 'default', label: 'Default (Two Column)' },
    { name: 'onecolumn', label: 'One Column' },
    { name: 'marquee', label: 'Marquee' },
    { name: 'home', label: 'Home Page' },
    { name: 'blog', label: 'Blog' },
    { name: 'map', label: 'Map' },
    { name: 'sections', label: 'Sections' },
    { name: 'myPage', label: 'My Page' }
  ]
},
```

As usual you'll need to restart the app or use `nodemon` to do it automatically.

Now you'll find that "My Page" is an option when adding a new page via the "Page" menu. You can also switch an existing page to the "My Page" type via "Page Settings."

