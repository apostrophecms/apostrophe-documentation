---
title: "Glossary"
children: []
---

First, check out the [tutorials](tutorials/index.html) if you haven't already. They explain all of these concepts in greater depth.

**Module:** an Apostrophe module can be packaged as an npm module, or as a subdirectory of lib/modules in your project. These are singleton objects that can have their own "views" folder and easily render templates from it or push CSS and JS assets from a "public" folder, provided they use the assets mixin. They typically provide one complete service with all of its trimmings, such as blogging, or Twitter widgets. In short, they are containers for complete features.

There is no rule that says a module can't implement many widgets and doc types, but they ought to have a related purpose.

It is possible to subclass a module ("apostrophe-blog" subclasses "apostrophe-snippets"). The apostrophe-site module's README has pretty good coverage of how to create a new module, or subclass one. In most projects at least one module subclassing apostrophe-snippets appears, with a custom schema describing custom properties of each item.

**Doc:** anything in the "aposPages" MongoDB collection (which will be renamed aposDocs in 0.6). A doc is represented by a single MongoDB document. At a minimum, it has unique `_id` and `slug` properties. The `type` property determines what other behaviors it might have.

Docs may contain areas, and may also contain other properties, often as described by a schema.

**Snippet:** a doc which might be displayed as part of a page, but does not have a permanent home of its own in the page tree. Snippets are managed by the apostrophe-snippets module or, more typically, a subclass of it such as apostrophe-map or apostrophe-events. Typical practice is always to subclass apostrophe-snippets and set your own instance name and index name unless you're using a ready-made subclass like apostrophe-events or apostrophe-map which already does this. Occasionally, snippets are used directly for their original purpose: reusing short chunks of text around a site.

The apostrophe-snippets module also defines an "index page" type (see "pages," below) which acts as a public view of the snippets. These index pages can be locked down to display only certain snippets based on tags, etc. Think of it this way: the index page is the "calendar," the individual snippet is the "event." It may be appropriate to display that event on one or more calendars around the site.

The schema of each snippet can be easily customized with extra fields, and even with joins to other types of docs. Less often, the schema of the index page is also customized.

**Page:** a doc which is part of the page tree. It may potentially have child pages. The `slug` begins with `/`, and this is only true for pages. Page types can be defined in your configuration of the `pages` key in app.js. Page types can also be added dynamically by modules. A page also has `path`, `rank` and `depth` properties that help make its relationship to other pages in the tree clear.

`path` differs from `slug` in that it always reflects the true relationship between pages in the tree, while `slug` can be edited and shortened if desired so that URLs don't have to contain a lot of slashes to reach a deep page.

**Other types of docs:** there is a doc with the slug `global` which is always loaded and available to your page templates. This is useful for shared headers and footers that are editable, etc. There is no rule against creating other specialized docs if snippets, pages and global don't cover your use cases.

**Widget:** a widget is a single item of content that can be edited, such as a block of rich text, a slideshow, or an RSS feed widget. You can create new types of widgets. It is easiest to do this with the apostrophe-schema-widgets module, which makes it very easy to describe the properties of the widget you want and also supply a template to render it. But you can also define new widgets and publish them in npm modules. See the apostrophe-rss and apostrophe-twitter modules for simple examples.

**Area:** an area is simply a column in which you can add as many widgets as you like. Each individual widget might be a rich text block, a Twitter feed, a slideshow, etc. Users can add, edit, move and remove widgets from the area frely. Usually they are stacked vertically but nothing prevents you from using CSS to float the widgets, etc.

Areas are inserted into your templates using the `aposArea` nunjucks helper function.

**Singleton:** a singleton is like an area but only allows exactly one widget, of exactly one type. This is helpful if you want to ensure there is exactly one video or exactly one slideshow at a specific place in your design.

**Block:** areas and singletons are very powerful, but sometimes you'll want to go beyond that and allow users to alternate between two-column and one-column sections of a page, and render either two areas or one area inside each section, and so on. Blocks give you this capability by adding another layer of structure above areas. Each block has its own template.

Blocks add complexity and you may be better off giving your users a wider selection of page templates with different layouts. But, if your client needs a lot of flexibility it can be worthwhile to teach them about blocks. See the [apostrophe-blocks](https://github.com/punkave/apostrophe-blocks) module.

**Template:** Apostrophe uses the [Nunjucks template language](https://mozilla.github.io/nunjucks/) to render webpages and smaller pieces of pages, such as widgets and blocks. 
