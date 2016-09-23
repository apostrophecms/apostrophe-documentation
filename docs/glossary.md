---
title: "Glossary"
menu: "Documentation"
children: []
---

First, check out the [tutorials](tutorials/index.html) if you haven't already. They explain all of these concepts in greater depth.

### Module

Apostrophe sites are powered by Apostrophe modules. Each module is responsible for providing one feature, such as a type of widget, a type of customized page, or a service like pushing assets to the browser. Apostrophe has many [standard modules](reference/index.html) which provide its core features.

A module can extend ("subclass") another module, and most of the modules you create at "project level" will. All modules implicitly extend [apostrophe-module](reference/apostrophe-module/index.html), which provides a rich set of core conveniences, like rendering templates or pushing assets relative to your module's folder.

Modules created at "project level" live in subdirectories of `/lib/modules`. Code and configuration for a module lives in `/lib/modules/MODULE-NAME/index.js` and can be overridden in `app.js` via the `modules` property of the main Apostrophe configuration object. It is also common to override a few settings on a per-server basis via `data/local.js`, which is merged with that object if it exists.

Apostrophe modules can also be distributed as npm modules, whether by themselves or as [moog bundles](https://github.com/punkave/moog-require). Bundling allows you to distribute several related Apostrophe modules as one npm module. The `apostrophe` npm module itself is a bundle.

Each module may have its own `views` folder and easily render templates from it or push CSS and JS assets from `public/css` and `public/js` folders.

### Doc

A document in Apostrophe's database. Each doc is a MongoDB document in the `aposDocs` collection.

Docs may contain [areas](#area), and may also contain other properties, often as described by a schema configured by a doc type manager, such as a module that extends [apostrophe-pieces](reference/apostrophe-pieces/index.html), [apostrophe-custom-pages](reference/apostrophe-custom-pages/index.html) or [apostrophe-pieces-pages](reference/apostrophe-pieces-pages/index.html).

At a minimum, a doc has unique `_id` and `slug` properties. The `type` property determines what other behaviors it might have. The [apostrophe-docs](reference/apostrophe-docs/index.html) module provides methods for working with docs, including the `apos.docs.getManager(doc.type)` method, which returns a reference to the module suited to working with that type of document.

### Piece

A doc which does not have a permanent home of its own in the page tree. Pieces are managed by modules that extend [apostrophe-pieces](reference/apostrophe-pieces/index.html). The `apostrophe-pieces` module is an "abstract base class;" you never use it directly, you always extend it, creating a module that defines a new type of piece.

See also [apostrophe-pieces-pages](reference/apostrophe-pieces-pages/index.html), which provides a way to create an "index page" that acts as a public view of pieces. These index pages can be locked down to display only certain pieces based on tags, et cetera.

Think of it this way: the index page is the "calendar," the individual piece is the "event." It may be appropriate to display that event on one or more calendars around the site.

Also see [apostrophe-pieces-widgets](reference/apostrophe-pieces-widgets/index.html), which makes it easy to introduce widgets on any page that display one or more pieces. Think of a "callout" that displays upcoming events on the home page.

The schema of each piece can be easily customized with extra fields, and even with "joins" to other types of docs.

### Page

A doc which is part of the page tree. It may potentially have child pages. The `slug` begins with `/`, which is only true for pages. A page also has `path`, `rank` and `depth` properties that help make its relationship to other pages in the tree clear.

`path` differs from `slug` in that it always reflects the true parent-child relationships between pages in the tree, while `slug` can be edited and shortened if desired so that URLs don't have to contain a lot of slashes to reach a deep page.

All page types that are allowed on the site must be listed as part of the `types` option of the [apostrophe-pages](reference/apostrophe-pages/index.html) module.

Often page types are given extra behavior via the [apostrophe-custom-pages](reference/apostrophe-custom-pages/index.html) module, which allows the developer to handle the rest of the URL if a page matches just the beginning of a URL. This module is extended by [apostrophe-pieces-pages](reference/apostrophe-pieces-pages/index.html), used to power blogs and other index views of [apostrophe-pieces](reference/apostrophe-pieces/index.html).

### global doc

There is a doc with the slug `global` which is always loaded and available to your page templates as `data.global`. This is useful for shared, site-wide headers and footers that are editable, etc. It is managed by the [apostrophe-global](reference/apostrophe-global/index.html) module. There is no rule against creating other specialized docs if pieces, pages and `global` don't cover your use cases.

### Widget

A widget is a single item of content that can be edited, such as a block of rich text, a slideshow, or an RSS feed widget. You can create entirely new types of widgets by extending the [apostrophe-widgets](reference/apostrophe-widgets/index.html) module. You can also easily create widgets that display a particular type of piece by extending [apostrophe-pieces-widgets](reference/apostrophe-pieces-widgets/index.html).

### Area

An area is simply a column in which you can add as many widgets as you like. Each individual widget might be a rich text block, a Twitter feed, a slideshow, etc. Users can add, edit, move and remove widgets from the area freely. Usually they are stacked vertically but nothing prevents you from using CSS to float the widgets, etc.

Areas are inserted into your templates using the `apos.area` nunjucks helper function.

Areas are implemented by the [apostrophe-areas](reference/apostrophe-areas/index.html) module.

### Singleton

A singleton is like an [area](#area) but only allows exactly one widget, of exactly one type. This is helpful if you want to ensure there is exactly one video or exactly one slideshow at a specific place in your design. Singletons are inserted with `apos.singleton`. "Under the hood," a singleton is just an area with `limit: 1`.

### Block

In Nunjucks templates, [a block is a portion of a template that can be overridden in a template that extends it](https://mozilla.github.io/nunjucks/templating.html#block). This is a useful technique in page templates and when overriding just part of a modal's template.

In older versions of Apostrophe, blocks were a special feature for creating a higher level of organization on the page, above widgets, in order to allow users to alternate between two- and one-column sections of a page and so on.

In Apostrophe 2.0, a widget template can contain its own `apos.area` calls in which the widget itself is passed in place of a `doc`, creating nested areas. So there is no need for a separate "blocks" feature.

### Template

Apostrophe uses the [Nunjucks template language](https://mozilla.github.io/nunjucks/) to render webpages and smaller pieces of pages, such as widgets and blocks. Nunjucks shares a syntax with the Jinja and Twig languages which are popular in the Python and PHP worlds, respectively.

### Schema

A schema allows you to specify the fields that are part of a particular type of `doc`. Schemas can also be used to specify the fields for widgets and other kinds of objects.

Apostrophe's schemas are used both to automatically create an editing interface and to sanitize and save data on the server side. Commonly used field types include strings, integers, floats, select elements and "joins," which allow relationships with other doc types to be defined.

Schemas are built by using the `addFields`, `removeFields`, `arrangeFields` and `alterFields` options when configuring any module that extends [apostrophe-pieces](reference/apostrophe-pieces/index.html), [apostrophe-custom-pages](reference/apostrophe-custom-pages/index.html) or [apostrophe-widgets](reference/apostrophe-widgets/index.html).

Here is a simple example in which we add a required "author" string field to the schema for "stories," a module that extends [apostrophe-pieces](#pieces):

```javascript
// lib/modules/stories/index.js in our project
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'story',
  addFields: [
    {
      name: 'author',
      label: 'Author',
      type: 'string',
      required: true
    }
  ]
}
```

See the [apostrophe-schemas](reference/apostrophe-schemas/index.html) module documentation for more information.

### Join

In [Apostrophe schemas](reference/apostrophe-schemas/index.html), a "join" describes a relationship with another type of doc. Here is an example of a "by array" join, also known as a "one to many" relationship.

Let's say we're implementing a module for a creative agency called "services," a subclass of [apostrophe-pieces](reference/apostrophe-pieces/index.html) in which each piece represents a service that the agency offers.

But not every service is offered in every office. So we define a join from services to offices via the `addFields` option:

```javascript
addFields: [
  {
    type: 'joinByArray',
    name: '_offices',
    label: 'Offices',
    idsField: 'officeIds',
    withType: 'office'
  }
]
```

The editing interface for this join allows the user to pick offices to associate with this service.

When writing templates, the developer is then able to access a `._offices` array as a property of each service.

See the [apostrophe-schemas](reference/apostrophe-schemas/index.html) module documentation for more information about joins.

### Moog type

"Moog types" (think "classes" in other systems) provide a clean way to implement object-oriented code when asynchronous callbacks are in play, as they nearly always are in both server-side and browser-side JavaScript. With Moog, all methods are written inside a single closure where `self` always means the right thing, even in callbacks. This allows methods to be passed freely as callbacks and reduces "cognitive load" for async developers.

[moog](https://github.com/punkave/moog) is an implementation of **object-oriented functional programming** used throughout Apostrophe. In server-side code, Apostrophe depends on the [moog-require](https://github.com/punkave/moog-require) module.

Moog provides separate `beforeConstruct`, `construct` and `afterConstruct` stages for each object.

`beforeConstruct(self, options)` is called from the "bottom up," subclasses first, allowing them a chance to modify the `options` passed when creating a module or other object before base classes like `apostrophe-pieces` see them.

`construct(self, options)` is called next and is typically where methods are attached to the `self` object. It is considered bad form to actually invoke methods in `construct`, because this prevents subclasses from overriding those methods first.

`afterConstruct(self)` is called last, but often appears first in the source code, which allows for "top-down programming" in which you can easily read what a module or other type does when "starting up" before you delve into the guts of all of its methods. Unlike the other two, **afterConstruct does not take `options` as a second argument.** Forgetting this is a common source of bugs.

`beforeConstruct`, `construct` and `afterConstruct` can optionally take a callback. But there is no requirement that all or any of them take a callback. This allows developers to write `afterConstruct` methods that need to reach out to MongoDB and create a connection or do something similar without inconveniencing the authors of other types that don't need to do anything asynchronous. You can mix and match between asynchronous and synchronous code even when extending another type.

On the server side, simply configuring a module is enough to make a new moog type. For types that are not modules, you can also make moog types explicitly on the server side by calling `apos.define`, which is a convenience wrapper for `apos.synth.define`. This is done to define types like [cursors](#cursor). `apos.synth` is the server's instance of moog.

On the browser side, `apos.define` is the norm, and is used to define types for modals and the like. `apos.create` is used to create actual instances of a type.

### Subclass

In Apostrophe, the term "subclass" refers to a module or other [moog type](#moog-type) that uses the `extend` property to extend another module, creating a new module that inherits the features of the first module. Almost every module extends another module. Those that don't set the `extend` property default to extending [apostrophe-module](reference/apostrophe-module/index.html), the "base class" of all modules.

### Base class

A [moog type](#moog-type) that is extended by another, whether explicitly (using the `extend` property) or by default (on the server side, [apostrophe-module](reference/apostrophe-module/index.html) is the default base class of all modules that don't specify one).

### Implicit subclassing

Frequently used in Apostrophe, implicit subclassing or "anonymous subclassing"  is a feature of [moog](#moog-type) that makes extending modules and other types much more convenient.

Let's say we want to extend every [piece](#piece) in our project with a special "approved by Bob" checkbox field.

We'll just create `lib/modules/apostrophe-pieces/index.js`:

```javascript
module.exports = {
  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        name: 'approvedByBob',
        label: 'Approved by Bob',
        type: 'boolean'
      }
    ].concat(options.addFields || []);
  }
}
```

When we do this, Apostrophe asks Moog to define `apostrophe-pieces` again.

Moog recognizes that there is already a definition, creates a new subclass of it with our code, and ensures that **anyone extending `apostrophe-pieces` will extend our new subclass, not the original.**

*This is similar to the "categories" feature of Objective C.*

While this feature is very useful, on rare occasions you might want to avoid it and completely throw out the implementation of a type, or extend a different type. You can do that by explicitly setting `extend`. You should never set `extend` if what you want is an implicit subclass.

### Cursor

Apostrophe cursors, like MongoDB cursors, help us get docs from the database using convenient, chainable methods. The syntax is very similar to MongoDB, with a few changes for consistency and extensibility.

New chainable methods ("filters") for cursors can be conveniently added using the `addFilter` method of cursors. This should be done in a constructor for a subclass. As a convenience, definitions for cursor subclasses are **automatically autoloaded** from the `lib/cursor.js` file of any module that extends [apostrophe-pieces](reference/apostrophe-pieces/index.html), [apostrophe-pieces-pages](reference/apostrophe-pieces-pages/index.html) or [apostrophe-doc-type-manager](reference/apostrophe-doc-type-manager/index.html).

Cursors can also be called automatically. Many cursor filters provide a `sanitize` function and have a `safeFor: 'public'` setting. This allows them to be called automatically by the index view of [apostrophe-pieces-pages](reference/apostrophe-pieces-pages/index.html) when the appropriate query string parameters appear. Often this is the main motivation for adding a filter.

A cursor is always an instance of [apostrophe-cursor](reference/apostrophe-docs/server-apostrophe-cursor.html) or one of its subclasses. The right way to obtain one is via the `find` method of a doc type manager, such as a module that extends pieces.

See [working with cursors](tutorials/intermediate/cursors.md) for more information.

### `req.data` and the `data` object in Nunjucks

Anything attached to the `req.data` object becomes visible as the `data` object in Nunjucks templates when rendering pages, etc. Interesting properties that are usually or always present include:

* `outerLayout`: will be either `apostrophe-templates:outerLayout.html` (for normal page rendering) or `apostrophe-templates:refreshLayout.html` (when refreshing the main content area via AJAX)
* `permissions`: will be the contents of `req.user._permissions`, with boolean properties for permissions such as `admin` and `edit`, or `{}` if there is no user
* `refreshing`: true if an AJAX refresh of the main content area is taking place
* `query`: the contents of `req.query`
* `url`: the current URL
* `page`: the current page object (if appropriate; certain routes, like `/login`, render HTML pages but are not tied to any page in Apostrophe)
* `home`: the home page, typically with a populated `._children` property
* `global`: a doc which may be used for elements common to all pages, like global footers

### `super` pattern

In any object-oriented language, it's common to inherit methods from the type you're extending. Sometimes you want to override those methods... but you don't want to completely discard or duplicate them. Instead, you want to call them and then change the result, or call them first before carrying out some action of your own.

In Apostrophe, we follow the "`super` pattern" to do this. For instance, let's say we're extending a module that extends `apostrophe-pieces`. Both modules might have a `beforeShow` method, and we don't want to lose it. So let's capture the old one, call it from the new one, and then do our own work:

var superBeforeShow = self.beforeShow;

```javascript
self.beforeShow = function(req, callback) {
  return superBeforeShow(req, function(err) {
    if (err) {
      return callback(err);
    }
    // DO OUR OWN WORK HERE, then eventually...
    return callback(null);
  });
};
```

