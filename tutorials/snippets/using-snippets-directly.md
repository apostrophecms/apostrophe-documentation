---
title: "Using Snippets Directly"
---

Snippets are quite useful by themselves. Quite often, the snippet widget is enabled in a project to allow reuse of frequently-changing content displayed in a variety of places at the end user's discretion, rather than hardcoding a shared area or singleton into the page templates.

To enable snippets in a project, just add the `apostrophe-snippets` module to your `app.js` configuration:

```javascript
  modules: {
    'apostrophe-snippets': {},
    ... other modules ...
  }
```

(Here we assume you are using the [apostrophe-site](http://github.com/punkave/apostrophe-site) module to organize your project in `app.js`. You should be.)

### Overriding Snippet Templates

If you'd like to just create custom templates for the snippets module or one of its derivatives, you can create a project-specific override of that module. The current Apostrophe "best-practice" for this involves creating a top-level directory named "lib" (i.e. `/my-project/lib/`), and then creating custom versions of the template there (i.e. `/my-project/lib/modules/apostrophe-snippets`).

Your "project level overrides" will automatically be picked up as long as the folder you add to `lib/modules` has the same name as the npm module (`apostrophe-snippets`).

Now we can create a "views" directory in our `lib/modules/apostrophe-snippets` folder and customize the templates for our project (i.e. `/lib/modules/apostrophe-snippets/views/index.html`). You can copy any or all files from the "views" directory of the original module, but note that to add any extra fields or extend the functionality of the module, you'll need to subclass that particular snippet (or simply create your own content type). Read on below about subclassing a snippets module.

### Inserting the Snippets Admin Menu

The above code sets up snippets both as a page type (for creating snippet index pages) and as a widget, and also provides a "snippets" admin dropdown menu which can be included in your `outerLayout.html` template via the following nunjucks code:

```twig
{{ aposSnippetMenu({ edit: editSnippet }) }}
```

See `outerLayout.html` in the sandbox project for the best way of handling the admin menus.

### Enabling Snippets As A Page Type

To allow snippets to be publicly browsed via a page on your site, just make sure you include the page type `snippets` in your `pages` configuration in `app.js`:

```javascript
  pages: {
    types: [
      { name: 'default', label: 'Default (Two Column)' },
      { name: 'home', label: 'Home Page' },
      { name: 'snippets', label: 'Snippets' },
    ]
  }, ... more configuration ...
```

Most of the time you won't want to do this, since snippets are usually inserted into the middle of other pages instead, appearing like a natural part of it. But you'll do this quite often with other content types that are subclassed from snippets, like the blog and events modules.
