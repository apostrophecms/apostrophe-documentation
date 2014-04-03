# Adding editable content areas to your page templates

You'll notice that the various page templates, like `views/pages/default.html`, contain editable content areas. There are two basic types: regular areas and singletons. A regular area lets you add any number of rich text blocks, slideshows, videos, snippets, blog posts and other content types if the developer desires. A singleton displays just one "widget," such as a slideshow, of a fixed type at that particular point in the page.

Here's an example of template code to insert a named area that lives in the current page:

```html
{{ aposArea(page, 'content1') }}
```

The `page` object is made available to your page templates by Apostrophe. The name `content1 indicates that we are addressing a particular named content area within the page. It's possible to pass options via a third parameter.

You can use that third parameter to create a text-only area:

```html
{{ aposArea(page, 'content1', { textOnly: true }) }}
```

Here's an example of template code to insert a standalone slideshow:

```html
{{ aposSingleton(page, 'splash', 'slideshow') }}
```

TODO: link to more advanced documentation on areas and singletons or perhaps go into that in more detail here in this HOWTO. Spell out the available standard widgets and their options and how to pass those from both aposArea and aposSingleton. Also talk about what you can do with the `controls` option to restrict what is offered.

### Next Steps

[Creating new page templates](creating-new-page-templates.html)

