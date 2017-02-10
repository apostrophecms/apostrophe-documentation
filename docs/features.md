---
title: "Features"
layout: "reference"
---

You and your coworkers and partners need to know what Apostrophe can do. And you need to make the case for Apostrophe in your organization. We can help.

We'll start by sharing what Apostrophe can do from a user's perspective. Then we'll dive into the juicy developer stuff. And we'll wrap up by answering some common concerns about Apostrophe.

## Features for editors and site visitors

* In-context editing: click on the page to edit; mix images, video, rich text and other content types easily
* Drag-and-drop reordering and reorganization right on the page
* Intuitive page tree helps users structure content (Apostrophe is also great for "one-pagers")
* Image library makes it straightforward to reuse images around your site
* File library delivers the same benefit for PDF, Word, Excel, etc.
* "Global" document for elements reused on every page allows shared headers, footers, etc. to be edited "in-context"
* Fast! Apostrophe's performance is driven by the right choice of document database, allowing pages to render quickly and edits to save immediately
* Powerful front and back-end search features based on MongoDB text search
* Content tagging and convenient tag management
* Easy to undo mistakes! Job-saving features like: rolling back to old versions of any page or document and rescuing pages and files from the trash
* Simple to create relationships between documents, such as blog posts and their authors
* Rich text editor, powered by the well-supported CKEditor
* Built-in, automatic image scaling; no need to resize first
* Manual cropping built right in; no need to crop before you upload
* Image widgets with slideshow features
* Easy import of content from CSV or Excel files
* Nuanced permissions features: easily "lock down" page editing for a page or many pages to particular people and groups of people
* Intranet features: straightforward to limit viewing permissions for certain pages to particular groups or individuals
* Flexible, extensible blog module
* Events module with easy navigation by year, month, etc.

## Features for developers

### The right technology choices

* 100% JavaScript, both in the browser and the server: less gear-switching = faster development
* The asynchronous nature of Node.js delivers a much faster site
* Node.js is powered by Chrome's JavaScript engine, the fastest and best-tested in the world
* Developer-friendly templates using Nunjucks (like Twig and Jinja)
* Rich, intuitive document storage model powered by MongoDB (2.6 or better)
* Built on the trusted Express framework; add custom routes to any module
* LESS stylesheet compilation is built right in
* JavaScript minification built in for best performance
* Also compatible with gulp, grunt, etc.

### Creating new types of content is easy

* Extensible "pieces:" easy to create content types like blog posts, events, map locations, companies, employees, etc.
* Add user-friendly "file attachments" to any content type
* Add your own content types and actions, then group them into custom dropdown menus in Apostrophe's admin bar
* "Dispatch" and "pieces pages" allow any page to be extended into a content browser
* Create your own Apostrophe modules with no boilerplate. Extend existing modules like "pieces" to get going with even less work. Publish them as open source via npm, or keep them local to your project
* Customize any page type, adding extra editable schema fields just for that type
* Publish your work for the community: ability to bundle Apostrophe modules in a single npm module to deliver a larger feature, such as blogging
* Rich schemas let you add new editable fields to content types with no custom code
* Object-oriented with "implicit subclassing:" easy to override and improve all aspects of the system
* Full support for joins (relationships) between all content types, including user-friendly relationship editing

### Making the front end great

* Help your users create mixed 1, 2 and 3-column layouts without new page templates: rich content areas can be nested
* Easy to generate navigation from the page tree (or build custom nav widgets)
* Helps you create simple, user-friendly filters to help site visitors browse your custom content without a full page refresh
* Built-in pagination and "infinite scroll" conveniences for browsing content on the front end
* Convenient and safe "push" mechanism for calling browser-side JavaScript from the server side
* Your custom modules can render templates and push JavaScript and CSS to the browser with minimal effort
* Easy to create custom widgets; just specify the fields you want and write your own front end template. Custom JavaScript players too
* Embed almost anything: OEmbed support for YouTube video, SoundCloud audio, all others who support the OEmbed standard
* And yes, there is a raw HTML widget *(but if you do your job right, your users will be happy editing with just our tools that respect your sweet responsive web design)*

### More developer features

* Readily extensible login system
* Support for database migrations to ensure smooth transitions to new code versions
* Powerful modal dialog types to extend and reuse in custom editing interfaces
* Rich support for command-line tasks
* Convenience API for writing migrations and command line tasks that iterate over the document store in powerful ways
* Smart filtering of user-pasted markup to protect your designs
* User and group-based security model for pages (think ACLs) with a friendly interface
* Option to use the user and group-based security model for other types of documents
* `apostrophe-pieces-import` module imports content from CSV and TSV and makes it easy to implement more formats

## Making the case for Apostrophe

You want to use Apostrophe. Others aren't so sure. We get it. Here are some frequently raised concerns and our responses.

### "Isn't Apostrophe proprietary?"

No. Apostrophe is [open source and available on github](https://github.com/punkave/apostrophe). Anyone can contribute to the project, and the MIT license guarantees its future as an independent project. See also [community support](http://apostrophecms.org/community/index.html) and the [developer directory](http://apostrophecms.org/support/directory.html), which you are [welcome to join](mailto:tom@punkave.com).

### "But the community is still small..."

Just as Wordpress is a PHP project and any PHP developer can work on it, Apostrophe is a JavaScript project and any JavaScript developer can work on it.

And JavaScript is a part of every website; *virtually every web developer is a JavaScript developer* because JavaScript is in every web browser.

In addition, there is a very large community of Node.js developers who specialize in server-side JavaScript code. Apostrophe is built on Node.js.

### "Isn't Node.js new and risky?"

No. Node.js was released in mid-2009. In the past eight years it has matured into a stable platform used in production by many major companies, including Netflix, PayPal, Medium, LinkedIn, Uber and the New York Times, among [many others](https://siftery.com/nodejs).

The core of Node.js is v8, the same open-source, free implementation of JavaScript that powers Google's Chrome, the most popular web browser in the world. That code has been "vetted" much more fiercely than PHP.

### "What about security?"

The most common security issue with PHP-powered websites, such as those built in Wordpress or Drupal, is SQL injection. Apostrophe's choice of a non-SQL database with an API design that does not mix commands and data makes this type of attack impossible.

Apostrophe's login mechanism is based on correctly hashed and salted passwords, stored in a separate database "collection" so that there is no possibility of accidental exposure when displaying information about users in a routine way.

There has recently been coverage of some security challenges faced by developers that did not correctly secure MongoDB after installing it. This was an oversight in configuring MongoDB, not a bug in the database. When properly configured to restrict connections or require a password (which Apostrophe supports), MongoDB is highly secure.

On an end user level, Apostrophe offers the ability to secure pages or entire portions of the site so that only certain users or groups of users can edit or view that content.

### "What about integration with other platforms?"

Apostrophe supports the [oEmbed standard](http://oembed.com/), an open standard for embedding third-party services. This allows Apostrophe's video and embed widgets to accommodate most accommodations you'll want to handle.

The great majority of other services offer a "generic embed code" that can be added to page templates or, if you choose to enable it, pasted into our raw HTML widget.

Since it is built on Node.js, Apostrophe is also a great starting point for integrating with third party APIs to build richer experiences.

