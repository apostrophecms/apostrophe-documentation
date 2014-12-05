---
title: "Snippets"
children:
  - using-snippets-directly
  - subclassing-snippets
  - arrays-in-schemas
  - joins
  - advanced-server-side-1
  - advanced-server-side-2
  - advanced-browser-side-topics
  - extending-the-widget
  - exporting-snippets
  - misc
  - rss-feed-options
---

## Introducing snippets: reusable content types for Apostrophe

Lots of projects need a way to store, edit, and display custom data. For instance, you might need to keep track of companies, products, suppliers and the relationships between them. These content types don't necessarily lend themselves to being represented as "pages" on the site; they stand on their own as independent concepts. But it may make sense to display them on various pages around the site. This is where `apostrophe-snippets` comes to the rescue.

As a fringe benefit, `apostrophe-snippets` can be used directly as a repository of reusable bits of text and media to display in multiple places around your site.

## How snippets are used in Apostrophe

`apostrophe-snippets` provides a base on which `apostrophe-map`, `apostrophe-events`, `apostrophe-people` and other modules are built, among other modules that introduce new types of content. One can add a page to the site that displays a collection of snippet titles in alphabetical order and click on these to access individual snippets at their own "permalink" URLs. Various modules extend and change this behavior to achieve similar, slightly different goals without duplicating code.

In addition, snippets can be inserted into any content area via the snippet widget. This is the most common direct use of the snippets module: inserting, for instance, driving directions in many places on the site, while maintaining the ability to edit that content in just one place.

So there are four main ways a snippet might appear to the end user:

* Via a *snippet widget*, which can be used to insert one or more snippets into any content area. The snippet widget appears as an icon in the content editor's toolbar. The snippet widget can also be used as a singleton (via `aposSingleton`). This is the most common direct use for the snippets module.

* On an *index page*, providing a way to browse many snippets, potentially filtered by tag. Snippet index pages are part of Apostrophe's page tree; you can change the type of any page to a "snippets" page via the "page settings" menu. You might use them to display a collection of related documents which don't fit into your tree of pages. You can lock down the snippets that will be displayed on a particular snippet index page by entering specific tags via "Page Settings" on the "Pages" menu. Although available directly, this feature is most often used in subclasses of snippets, such as the blog module.

* On a *show page*, featuring that snippet by itself at its own URL. As far as the `apostrophe-pages` module and Apostrophe's page tree are concerned, a "show page" is actually just an extension of an index page. The snippets module spots the slug of the index page in the URL, then takes the remainder of the URL and looks for a snippet with that slug. "Subclasses" of snippets, like the blog module, may easily alter the way the remainder of the URL is used to accommodate displaying a publication date in the URL.

* Via an RSS feed. Adding `?feed=rss` to the URL of a snippet index page automatically generates an RSS feed. Methods of the snippets module can be easily overridden and extended to support more feed types.
