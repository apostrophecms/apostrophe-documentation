---
title: "Custom widgets"
---

## Building custom widgets

You've seen a lot of the widgets that come "in the box" with Apostrophe. But you can do much more by creating your own.

### Custom navigation

A common case: you want to build your own navigation menu. [Apostrophe's page tree is awesome](building-navigation.html) but sometimes you want to "cherrypick" pages from all over the tree, perhaps for a special footer.

You could use a rich text widget and just tell users to add links manually. But they'll just break each time a page is moved around the site. And it's easier for users to mess up the formatting that way. We want something more consistent.

Let's look at some custom widgets that help provide navigation. We'll start with a simple widget that adds a link in a well-formatted way.

### `link`: the simplest widget

First we'll need a folder for the module:

```bash
mkdir -p lib/modules/link-widgets
```

> Just about everything new you create in Apostrophe will be a "module." Project-specific modules live in `lib/modules`. Apostrophe will spot them there if you list them in `app.js`.
> You can also publish and install modules with `npm`. Apostrophe looks in both places. Your module name **should not start with `apostrophe`**. That's reserved for our official modules.
> Modules almost always have plural names. The name of a module that provides widgets should end in `-widgets`.

Then we'll include the module in our `app.js` by adding the following to the `modules` object:

```javascript
  modules: {
    // ...,
    'link-widgets': {}
  }
```

Now we'll write the code for our module in `lib/modules/custom-navigation-widgets/index.js`:

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to Anywhere',
  addFields: [
    {
      name: 'url',
      type: 'url',
      label: 'URL',
      required: true
    },
    {
      name: 'label',
      type: 'string',
      label: 'Label',
      required: true
    }
  ]
};
```

> *"What does `extend` mean here?"* Our module is extending the `apostrophe-widgets` module, which provides almost all the code we need.  Yes, `extend` is the correct spelling. Apostrophe uses [moog](https://npmjs.org/modules/moog) to handle extending or "subclassing" other modules.

> *"What other field types can I add?"* The `apostrophe-schemas` module gives us a powerful way to build forms and structure data with almost no work. We just pass an array of field definitions as the `addFields` option.
> We'll introduce the details gradually. But if you're in a hurry, check out the [schema reference](../../reference/apostrophe-schemas/index.html).

> *"What does the `name` property do?"* Each field needs to be stored in the widget under its own property name. Play around with `aposDocs.find().pretty()` in the mongodb shell to see what it looks like after you save the widget.

Next we'll need a folder to hold our widget's `widget.html` template, which renders it on the page:

```bash
mkdir -p lib/modules/link-widgets/views
```

Now let's create a Nunjucks template in `lib/modules/link-widgets/views/widget.html`:

```markup
<h4><a href="{{ data.widget.url }}">{{ data.widget.label }}</a></h4>
```

> *"Hey, don't we need to escape the label before we output it as HTML?"* No, Nunjucks does it automatically. If you need to output content that is already valid, safe markup, you must use the `| safe` filter to output it without escaping.

Now we'll want to add this widget to an area in one of our page templates, like we learned in [adding editable content to pages](adding-editable-content-to-pages.html). Let's add the following to the `main` block of our `lib/modules/apostrophe-pages/views/pages/home.html`:

```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {}
    }
  })
}}
```

We've just created a content area in which only `link` widgets are allowed. Each one has a `url` field and a `label` field, and they are always output in the same style.

### `page-link`: using joins in widgets

The `link` widget is cool, but if the URL of a page changes, the link breaks. And if the title changes, that is not reflected in the widget.

Let's solve the problem by allowing the user to pick a page on the site instead. Then we can access information about that page programmatically.

Let's make another module and its views folder in one step:

```bash
mkdir -p lib/modules/page-link-widgets/views
```

Now we add this new widget to the `modules` object in our app.js:

```javascript
  modules: {
    /// ...,
    'link-widgets': {},
    'page-link-widgets': {}
  }
```

Now let's write `lib/modules/page-link-widgets/index.js`:

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to a Page',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId'
    }
  ]
};
```

> *"What do `type: 'joinByOne'` and `idField: 'pageId` do?`* We want this widget to remember a connection to another page. To do that, we use the `joinByOne` field type and ask Apostrophe to store the MongoDB `_id` of the other page in a `pageId` property of the widget.

> *"Why does the `name` start with a `_`?" Joins get fetched every time this widget is loaded. The relationship is dynamic*. Properties that are dynamic and should not be stored back to MongoDB as part of this widget must start with a `_` (underscore). Apostrophe automatically ignores them when saving the widget in the database.

Now we're ready for the Nunjucks template, `lib/modules/page-link-widgets/widget.html`:

```markup
<h4><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```

> *"Whoa! So I can access the other page in my template?"* Yep. You can access any property of the other page. You can even make `apos.area` and `apos.singleton` calls with the other page object.

Actually using the widget in an area is just like using the first one. But this time, let's enable both kinds in our area on `home.html`:

```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {},
      'page-link': {}
    }
  })
}}
```

Now our users have a choice between do-it-yourself links that can point anywhere and "page" links that can only point to a page. Both can be useful.

### Passing options to widgets

You probably noticed that our widgets don't take any options yet. We can use options to do cool things in our templates. Let's add a simple one to choose between two presentation styles.

All we have to do is access `data.options` in our `widget.html` template for `page-link-widgets`:

```markup
<h4 class="{{ 'special' if data.options.special }}"><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```

And pass the option in our `apos.area` call on `home.html`:

```markup
{{
  apos.area(data.page, 'navigation', {
    widgets: {
      link: {},
      'page-link': {
        special: true
      }
    }
  })
}}
```

Now all the page links in this particular area will get the special class. You can probably think of much fancier uses for this feature.

### Giving choices to the user

We can also leave the choice up to the user by adding a `boolean` field to the schema for `page-link-widgets` in its `index.js`:

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to a Page',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId'
    },
    {
      name: 'special',
      label: 'Special',
      type: 'boolean'
    }
  ]
};
```

The new bit here is the `special` field.

In our template, we just access it via `data.widget` rather than `data.options`:

```markup
<h4 class="{{ 'special' if data.widget.special }}"><a href="{{ data.widget._page._url }}">{{ data.widget._page.title }}</a></h4>
```

>`data.widget` contains the form fields the user can edit. `data.options` contains the options passed to `apos.area` or `apos.singleton` by the frontend developer.

### Performance note: limiting joins

Having access to the entire page object is a neat trick, but it can be very slow. That page might have its own widgets which load a lot of information we don't care about in this situation. Multiply that by 20 links and it starts to impact performance.

Indeed, all we really care about here is the title and the URL. So let's fetch only that information.

Here's how we can speed up the code:

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to a Page',
  addFields: [
    {
      name: '_page',
      type: 'joinByOne',
      withType: 'apostrophe-page',
      label: 'Page',
      required: true,
      idField: 'pageId',
      filters: {
        projection: {
          title: 1,
          slug: 1
        }
      }
    }
  ]
};
```

The new bit is the `filters` option. By specifying a `projection` filter, we can limit Apostrophe to loading just the `title` and `slug` properties. Apostrophe needs the `slug` to figure out the URL of the page.

It's almost always a good idea to limit the projection to the fields you care about.

>*`_url`, `slug`... what's the difference?* For most sites, nothing. But for sites with a `prefix` option, the `_url` property might have a folder name prepended to it. And there are other ways to transform `_url` to suit your needs. So always remember to use it instead of `slug` when you output page URLs.

>*What else can I do with `filters`?* That's an advanced topic, but you can do anything that [page cursors](../../reference/apostrophe-pages/pageCursor.html) can do. Check those out if you're in a rush.

### Editing widgets in-context

If we look at the widgets we've created so far, they all prompt a user to configure them through a modal. However, there are certain fields which can be edited contextually, which means we can take advantage of Apostrophe's in-context editing capabilities to allow users to edit widgets as they appear on the page.

To demonstrate this, create a new widget: the `content-block` widget. This widget will contain "Title" field, which will be an `apostrophe-rich-text` singleton, and a "Body" field, which will be an area that can contain rich text and images.

In order to create this widget, we'll add a `lib/modules/content-block-widgets/index.js`:

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Link to Anywhere',
  addFields: [
    {
      name: 'title',
      label: 'Title',
      type: 'singleton',
      widgetType: 'apostrophe-rich-text'
    },
    {
      name: 'body',
      label: 'Body',
      type: 'area',
      contextual: true,
      options: {
        widgets: {
          'apostrophe-rich-text': { toolbar: [ 'Bold', 'Italic' ] },
          'apostrophe-images': {}
        }
      }
    }
  ]
};
```

Note the `contextual: true` flag in the 'body' field configuration: this tells Apostrophe to exclude this field from the editor modal, so that it is exclusively edited in context.

Now we add this new widget to the `modules` object in our app.js:

```javascript
  modules: {
    /// ...,
    'link-widgets': {},
    'page-link-widgets': {},
    'content-block-widgets': {}
  }
```

In order to display this new field, we'll also need to modify our `views/widget.html` for `content-block-widgets`:

```markup
<div class="content-block">
  {{ apos.singleton(data.widget, 'title', 'apostrophe-rich-text') }}
  {{ apos.area(data.widget, 'body') }}
</div>
```

**TODO** add to an area

> **It's important to note** that contextually edited areas and singletons (or other fields) within a widget **MUST** be included in the schema for that widget. Otherwise, Apostrophe won't know to autosave the field.

#### Widgets without modals

Our `content-block` widget still currently generates an editor modal, where we edit the "Title" field. However, that field is already a singleton, and as such can be edited in-context. If that field is edited in-context, we can do away with the modal altogether by modifying the `index.js` of `content-block-widgets`

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Content Block',
  contextualOnly: true, // Don't open an editor modal when
                        // creating a new widget, because
                        // all fields can be edited contextually
  addFields: [
    {
      name: 'title',
      label: 'Title',
      type: 'singleton',
      contextual: true, // Make this field edited contextually
                        // instead of in the modal
      widgetType: 'apostrophe-rich-text'
    },
    // ...
  ]
};
```

> **"Why would I want to use `contextualOnly` widgets?" These types of widgets are very useful for creating building blocks for layout on a site. For example, you might have a "One Column", "Two Column", and "Three Column" widgets on your site, each of which are full-width widgets containing a number of content areas (with their own set of widgets) that corresponds to their number of columns. This can be used to give an editor a lot of editing flexibility with fewer templates.
