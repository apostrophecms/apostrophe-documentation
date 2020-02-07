---
title: Page Templates
layout: tutorial
---

# Pages

## How to create new pages

In Apostrophe, new pages are created from the page administration interface. When you create a new page, you can select from any of the available templates.

Out of the box, Apostrophe provides one template, but you can create any number of custom templates to meet your needs.


### How to create page templates

The page template determines the page’s layout and what kind of content can be added to a page. You can create a new page template in two steps:

1. Create a new template in `lib/modules/apostrophe-pages/views/pages` which contains the code to define your page layout.

![](/.gitbook/assets/pages-directory-tree.png)

2. Register the template in `app.js`

{% hint style="info" %}
Apostrophe uses the [Nunjucks templating language](https://mozilla.github.io/nunjucks/). Nunjucks uses a mix of standard HTML and CSS with Nunjucks specific tags. You can learn more about using Nunjucks with Apostrophe in the  [Nunjucks Helper Functions](/tutorials/core-concepts/working-with-templates/nunjucks-helper-functions.md) and [Nunjucks Filters](/tutorials/core-concepts/working-with-templates/nunjucks-filters.md) references.
{% endhint %}

### How to create pages with your new templates

As soon as a template is registered in `app.js` you can use it to create new pages. All of the templates registered in `app.js` are available from the list of templates when you create a new page.

{% hint style="info" %}
Note: Every time you update your module configuration in app.js you will need to restart Apostrophe for the changes to take effect.
{% endhint %}

![](/.gitbook/assets/pages-template-options.png)

After you create pages, any edits to a templates will be propagated to all pages created from that template.

## The page tree

All the pages you create are connected through the page tree. There are two types of relationships between pages: **child** and **ancestor**. Within the page tree, Home is the root. \

*   Every page you create is a **child** of Home.
*   Home is the **ancestor** of every page.
*   When you create a new page nested under another page, those are **child** pages, and the page they’re nested under are **ancestors**. \

When you build the navigation for your site, you’ll use this connection that all pages have through the page tree to dynamically link between pages. Now, let's look at an example of these concepts in action.
