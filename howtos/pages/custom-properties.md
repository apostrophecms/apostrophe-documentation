---
title: "Custom Page Properties"
---

Let's say we already have a page type called "Company," set up with the rest of our page types in `app.js`:

```javacript
  pages: [
    'home',
    'default',
    'company'
  ]
```

This is fine but we want to know the year each company was incorporated.

So let's subclass `apostrophe-fancy-page`:

```javascript
modules: {
  // Other modules go here
  company: {
    extend: 'apostrophe-fancy-page',
    name: 'company',
    label: 'Company',
    addFields: [
      {
        name: 'incorporated',
        label: 'Incorporated',
        type: 'integer'
      }
    ]
  }
}
```

**We also must create the folder `lib/modules/company` in our project.** This folder can start out empty and often stays that way.

Now restart your site and add a page with the "Company" page type. Boom! There's an "Incorporated" field in "Page Settings."

You can access this field in your templates:

    {{ page.typeSettings.incorporated }}

"OK, but what other field types are there?" `apostrophe-fancy-page` uses Apostrophe schemas. You can do anything that is [supported by Apostrophe schemas](http://github.com/punkave/apostrophe-schemas). It's exactly like adding fields to snippet subclasses like `apostrophe-blog` and `apostrophe-events`.

## Passing Extra Information to Templates

You can pass extra information to the page template by adding it as properties of the `req.extras` object. Any properties of that object are automatically visible to Nunjucks when the page is rendered. They appear as top-level variables, so `req.extras.myThing` becomes `myThing` in the template.

## Adding Joins

You can add joins too. They work [exactly as documented here](http://github.com/punkave/apostrophe-schemas). You can join with other fancy page types, or with snippet instance types like `blogPost`.
