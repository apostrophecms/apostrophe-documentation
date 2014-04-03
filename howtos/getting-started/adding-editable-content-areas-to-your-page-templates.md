# Adding editable content areas to your page templates

You'll notice that the various page templates, like `views/pages/default.html`, contain editable content areas. There are two basic types: regular areas and singletons. A regular area lets you add any number of rich text blocks, slideshows, videos, snippets, blog posts and other content types if the developer desires. A singleton displays just one "widget," such as a slideshow, of a fixed type at that particular point in the page.

## Inserting content areas

Here's an example of template code to insert a named area that lives in the current page.

```html
{{ aposArea(page, 'content1') }}
```

The `page` object is made available to your page templates by Apostrophe. The name `content1 indicates that we are addressing a particular named content area within the page. It's possible to pass options via a third parameter.

You can use that third parameter to create a text-only area:

```html
{{ aposArea(page, 'content1', { textOnly: true }) }}
```

You can also limit the set of controls offered to the user. The `controls` option takes a list of rich text editor controls and widget names as explained below:

```html
{{ aposArea(global, 'footer', {
  controls: [ 'style', 'bold', 'italic', 'createLink', 'image', 'video' ]
}) }}
```

## Apostrophe controls

There are two types of controls: those that influence the rich text editor and those that introduce "widgets" like slideshows.

### Rich text controls

* `style`: the style menu, which offers heading levels, etc.
* `bold` and `italic`: you know what these are!
* `createLink`: allows the user to add a hyperlink.
* `unlink`: breaks a hyperlink.
* `insertUnorderedList`: creates a bulleted list (a `ul` element).
* `insertTable`: creates an HTML table.

You may also [insert any standard CKEditor toolbar control](http://ckeditor.com/forums/CKEditor/Complete-list-of-toolbar-items).

### Widgets

Here's a list of widgets available in Apostrophe. Users can add these to any content area to pull in content from other places on the site and elsewhere, display slideshows and so on.

* `slideshow`: lets the user select one or more images.
* `buttons`: much like the slideshow, but suitable for creating links.
* `video`: allows video from YouTube, Vimeo and other sites to be easily embedded.
* `files`: allows the user to download files.
* `pullquote`: a "pull quote" displayed to the side of the text.
* `html`: the raw HTML widget. We do not recommend giving your users access to this unless absolutely necessary, as it can easily break your page design.
* `blog`: a feed of blog posts from your own site.
* `rss`: an RSS feed (if the `apostrophe-rss` module is in your project).
* `twitter`: a Twitter feed (if the `apostrophe-twitter` module is in your project). TODO: configuration notes re: API key.

TODO: separate HOWTO on slideshow configuration.
TODO: separate HOWTO on overriding widget rendering.
TODO: separate HOWTO on adding new widgets, with the twitter and rss modules as a model.

## Rich text styles

If the `styles` control is present, you can also adjust the elements that it offers. Each "style" must be a legitimate HTML block element name.

For example:

```html
{{ aposArea(global, 'footer', {
  styles: [ { value: 'div', label: 'Normal' }, { value: 'h3', label: 'Heading' }]
}) }}
```

We recommend that you always make `div` the first style.

TODO: link to separate HOWTO about our HTML filtering.

## Inserting singletons

Here's an example of template code to insert a standalone slideshow:

```html
{{ aposSingleton(page, 'splash', 'slideshow') }}
```

You may pass a fourth argument containing options to be passed to that particular widget.

### Next Steps

[Creating new page templates](creating-new-page-templates.html)

