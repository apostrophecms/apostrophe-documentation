---
title: "Fancy pages"
children:
  - custom-properties
  - restricting-child-page-types
  - custom-rendering
  - greedy-pages
  - two-pages-in-one-module
---

The `apostrophe-fancy-page` module is designed to extend a regular page, allowing you to add custom properties and functionality without relying on the `apostrophe-snippets` module.

### Should I be using pages or snippets?

Pages and snippets are two different approaches to content in Apostrophe. If you're unsure of which to use, go through this quick checklist:

* **Are you making a type of content that should be managed globally?** If so, you want to take advantage of snippets.

* **Do your pages need to have child pages?** If so, you should use pages. Snippets cannot have subpages.

* **Does your page need to have a permanent url?** If so, you should use pages. Snippets may have different URLs depending on where they are used and accessed.

* **Do you want separate "blogs," "calendars" or "companies" with separate permissions for who can edit the "posts," "events" or "products" of each one?** Fancy pages are the way to go, and we've already done it! So check out [apostrophe-blog-2](https://github.com/punkave/apostrophe-blog-2) and consider subclassing it to save yourself some work. That module uses two subclasses of `apostrophe-fancy-page` to represent blogs and individual blog posts.

