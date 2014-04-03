# Snippets

* [Using snippets directly](1-using-snippets-directly.html)
* [Custom content types: subclassing snippets](2-subclassing-snippets.html)
* [Joins in schemas](3-joins.html)
* [Advanced server-side topics](4-advanced-server-side-topics.html)
* [Overriding methods](5-overriding-methods.html)
* [Extending the widget](6-extending-the-widget.html)
* [Advanced browser-side topics](7-advanced-browser-side-topics.html)
* [Misc](8-misc.html)
* [RSS feed options](9-rss-feed-options.html)


TODO: 30,000ft explanation of snippets for dummies (include a simple & an advanced use case)

`apostrophe-snippets` adds a repository of reusable content snippets to the [Apostrophe](http://github.com/punkave/apostrophe) content management system. Just as important, `apostrophe-snippets` provides a base on which the `apostrophe-blog`, `apostrophe-events` and other modules are built, among other modules that introduce new types of content. One can add a page to the site that displays a collection of snippet titles in alphabetical order and click on these to access individual snippets at their own "permalink" URLs. The blog and events modules extend this behavior to achieve similar goals with a minimum of code duplication.

In addition, snippets can be inserted into any content area via the snippet widget. This is the most common direct use of the snippets module: inserting, for instance, driving directions in many places on the site, while maintaining the ability to edit that content in just one place.

So there are four main ways a snippet might appear to the end user:

* Via a *snippet widget*, which can be used to insert one or more snippets into any content area. The snippet widget appears as an icon in the content editor's toolbar. The snippet widget can also be used as a singleton (via `aposSingleton`). This is the most common direct use for the snippets module.
* On an *index page*, providing a way to browse many snippets, potentially filtered by tag. Snippet index pages are part of Apostrophe's page tree; you can change the type of any page to a "snippets" page via the "page settings" menu. You might use them to display a collection of related documents which don't fit into your tree of pages. You can lock down the snippets that will be displayed on a particular snippet index page by entering specific tags via "Page Settings" on the "Pages" menu. Although available directly, this feature is most often used in subclasses of snippets, such as the blog module.
* On a *show page*, featuring that snippet by itself at its own URL. As far as the `apostrophe-pages` module and Apostrophe's page tree are concerned, a "show page" is actually just an extension of an index page. The snippets module spots the slug of the index page in the URL, then takes the remainder of the URL and looks for a snippet with that slug. "Subclasses" of snippets, like the blog module, may easily alter the way the remainder of the URL is used to accommodate displaying a publication date in the URL.
* Via an RSS feed. Adding `?feed=rss` to the URL of a snippet index page automatically generates an RSS feed. Methods of the snippets module can be easily overridden and extended to support more feed types.