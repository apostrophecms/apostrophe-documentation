---
title: "Creating a Blog"
layout: tutorial
---

The following tutorial shows you a basic implementation of extending `apostrophe-blog` to create your own blogging platform within the Apostrophe system.

## Installation

```
$ npm install apostrophe-blog
```

This NPM bundle consists of three Apostrophe modules (in a single npm module):

The `apostrophe-blog` module provides the ability to create and edit blog posts and manage their publication dates.

The `apostrophe-blog-pages` module displays blog posts on a page. It extends the apostrophe-pieces-pages module. A blog page displays only blog posts whose publication date has arrived.

The `apostrophe-blog-widgets` module provides an apostrophe-blog widget, which you can use to select blog posts to appear anywhere on your site. Posts do not appear until their publication date.

## Basic Setup

Inside your regular `app.js` configuration:

```javascript
// in app.js

bundles: [ 'apostrophe-blog' ],
modules: {
  'apostrophe-blog': {},
  'apostrophe-blog-pages': {},
  'apostrophe-blog-widgets': {}
}
```
Inside our `index.js` for `apostrophe-blog`:
```javascript
// in lib/modules/apostrophe-blog/index.js

module.exports = {
  label: 'Post',
  pluralLabel: 'Posts',
  contextual: true,
  addFields: [
    {
      name: 'body',
      label: 'Body',
      type: 'area',
      contextual: true
    },
    {
      name: '_author',
      label: 'Author',
      type: 'joinByOne',
      idField: 'authorId',
      withType: 'author'
    }
  ],
  arrangeFields: [
    {
      name: 'basics',
      label: 'Basics',
      fields: [
        'title',
        '_author',
        'slug',
        'tags',
        'publishedAt',
        'published'
      ]
    }
  ]
}
```

## Managing the View

`apostrophe-blog-pages` provides views for both an `index` and `show` pages. Additionally, `data.pieces` and `data.piece` are automatically available to you in both your `index` and `show` pages, respectively.

#### Contextual Editing

You can set the `contextual: true` option for the apostrophe-blog module if you prefer to allow the end user to edit the content of the article "in context" on the `show.html` page. This is generally the preferred way to go.

You can also set `contextual: true` for individual schema fields like `body` so that they don't appear in the modal at all.

When `contextual: true` is set for the module, the user is redirected to the "show page" for that blog post as soon as they click "save" so that they can edit further.

In addition, the "context menu" (the "Page menu") is enhanced with blogging-related choices when on a blog index page or show page.

## Filtering Blog Posts

*For a more detailed explanation on cursor filters, there is a great [tutorial](http://apostrophecms.org/docs/tutorials/intermediate/cursors.html) that will make this next section a bit more clear.*

By default in `apostrophe-blog-pages`, you're given `day`, `month`, and `year` filters that are accessible through `data.piecesFilters` in your template.

`apostrophe-blog-pages` extends `apostrophe-pieces-pages`, which creates filters automatically based on properties in your schema. In order to expose these filters to the public, we'll need to configure the `piecesFilters` option seen below:

```javascript
'apostrophe-blog-pages': {
    piecesFilters: [
      {
        name: 'author'
      }
    ]
  }
```

This will expose a public filter that will allow us to query blog posts based on the author.

In general, `_author` is a method automatically created that expects an id, while the `author` method expects a slug (this will make your query strings look nicer). Visiting your blog index with the query string `&author=jane-doe` will automatically be passed to the mongo query that loads the pieces for the page.

Back in your `index`, we're asking `apostrophe-blog-pages` to automatically populate `req.data.piecesFilters.author` with an array of choices.

```html
{# Somewhere in lib/modules/apostrophe-blog-pages/index.html #}
{# Link to all the authors, adding a parameter to the query string #}
<ul class="tag-filters">
  {% for author in data.piecesFilters.author %}
    <li><a href="{{ data._url | build({ author: author.value }) }}">{{ author.name }}</a></li>
  {% endfor %}
</ul>
```

If you want to be more restrictive and only display results that have all of the specified values, just add  `And` to the filter name. For instance, `_authorAnd()` expects ids, and `authorAnd()` expects slugs.

*More on custom cursors, and writing your own filters not automatically defined by your schema properties can be found [here](http://apostrophecms.org/docs/tutorials/intermediate/cursors.html#custom-filters).*

#### Using AJAX to enhance filtering Blog posts

By default, clicking on a filter refreshes the entire page. Using AJAX will refresh updates only relevant to filtering the blog posts.

*You may also reference this [tutorial](http://apostrophecms.org/docs/tutorials/getting-started/reusable-content-with-pieces.html#using-a-j-a-x-to-enhance-filters) which explains this feature in reference to general `apostrophe-pieces`.*

Configuring this for our blog is simple:

Add a `data-apos-ajax-context="name"` attribute to the outer div that would ultimately need to be refreshed when a form submission inside it takes place.

*The value of the attribute must be unique on the page.*

Next, we'll need to refactor our `index.html` template so that the list of blog posts and filters are in a separate `indexAjax.html` template file.

In our new `indexAjax.html`:
```html
{# indexAjax.html #}
  <ul class="tag-filters">
    {% for author in data.piecesFilters.author %}
      <li><a href="{{ data._url | build({ author: author.value }) }}">{{ author.name }}</a></li>
    {% endfor %}
  </ul>
{% for post in data.pieces %}
  <div class="blog-post">
    <a href="post._url"><h2>{{ post.title }}</h2></a>
    <h6>Published On {{ post.publishedAt | date('MMMM Do, YYYY') }}</h6>
  </div>
{% endfor %}
```

And back in our `index.html`:
```html
{# index.html #}
{% extend data.outerLayout %}
<h4>Blog Posts</h4>
<div data-apos-ajax-context="blogposts">
  {% include "indexAjax.html" %}
</div>
```

And that'll do it.

## Apostrophe Blog Widget

The widget for the blog extends our standard [`apostrophe-pieces-widget`](http://apostrophecms.org/docs/tutorials/getting-started/reusable-content-with-pieces.html#displaying-pieces-with-widgets), which allows you to display all the posts, limit the number of posts, filter by tag, or display individual posts.

The view for this can be extended, or overridden in it's corresponding `views/widget.html`. Within the `widget.html` template, You have access to `data.widget._pieces`, where you would likely iterate over to display all the blog posts.

To display the widget as a [singleton](http://apostrophecms.org/docs/tutorials/getting-started/adding-editable-content-to-pages.html) on the page, follow the standard syntax below for initiating a singleton:

```html
{{ apos.singleton(data.page, 'blog', 'apostrophe-blog') }}
```




## Multiple blogs

One way to create two or more blogs is to create separate blog pages on the site, and use the "with these tags" feature to display only posts with certain tags.

Another approach is to extend the modules, creating new modules and a completely separate admin bar item for managing the content. If you take this approach, you must set a distinct name property when configuring your subclass of apostrophe-blog, such as article. This will be value of type in the database for each blog post of this subclass.

The latter approach is often best as it requires less user training to avoid confusion. The former approach has its own advantages, notably that it is easier to aggregate content and have it appear in multiple places intentionally.
