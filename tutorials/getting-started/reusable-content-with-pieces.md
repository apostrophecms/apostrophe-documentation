---
title: Reusable content with pieces
layout: tutorial
---

# Reusable content with pieces

We've already learned how to add editable content to pages, and how to create some new types of editable content. But sometimes we want to reuse the same content all over the site. For a job like that, widgets in pages aren't the right answer, because a page lives in one place on the site.

## A directory of people: working with pieces

Let's say we want to create a directory of people who work for a company. People are "global content": they are useful to display here and there all over the site, they aren't tied down to one page. The `apostrophe-pieces` module provides a great starting point to create many types of global content. We'll extend it to make our own `people` module. You can extend `apostrophe-pieces` many times in the same project.

> **"What about users?"** Yes, you already have a "Users" menu on your admin bar. And yes, users are powered by pieces. But we've found that confusing website editors with the publicly visible staff directory tends to cause problems in the long run. Plus, this way, it's a teachable moment. :\)

Let's create a `lib/modules/people/index.js` file:

```javascript
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  addFields: [
    {
      name: 'title',
      label: 'Full Name',
      type: 'string',
      required: true
    },
    {
      name: 'firstName',
      label: 'First Name',
      type: 'string',
      required: true
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'string',
      required: true
    },
    {
      name: 'body',
      label: 'Biography',
      type: 'area',
      options: {
        widgets: {
          'apostrophe-rich-text': {
            toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
          },
          'apostrophe-images': {}
        }
      }
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'string'
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'singleton',
      widgetType: 'apostrophe-images',
      options: {
        limit: 1,
        minSize: [ 200, 200 ],
        aspectRatio: [ 1, 1 ]
      }
    }
  ]
};
```

> **IMPORTANT: note the** `name` **property. This identifies ONE piece in the database, so it is always singular.** Remember: Modules Are Plural \(MAP\), but the things they manage may not be.

Now let's turn the module on in `app.js`. _From now on, we'll show_ `modules` _with just the modules we're adding. Of course you will have other modules in your_ `app.js` _file as well._

```javascript
modules: {
  // ... other modules ...,
  'people': {}
}
```

Just like that, you'll see a new "People" menu in the admin bar when you log into the site. Pick "New Person" and you'll find that you can give each person a full name, a first name, a last name and a phone number. Pick "Manage Person" to examine and edit existing people.

> We could have configured the module entirely in `app.js`. But that leads to giant `app.js` files, so we don't recommend it. However, some developers feel it's a good place for high-level properties like `extend` that help give you a quick overview of what the module is and does.

There are certain additional fields that you get by default with every piece, such as `title` \(the full name of the piece\), `slug` \(used when the piece appears as part of a URL\), and `published` \(which determines whether the public can see the piece, as you'll see below\). But in this case, we re-declared `title` in order to change its label to `Full Name` so that the "New Person" form is not confusing.

You can even add a profile photo, via the `thumbnail` field. This field has the `singleton` type, which allows us to include a widget in the [schema](schema-guide.md) for this type of piece, exactly as if we were calling `apos.singleton` in a template. We just need to specify the `widgetType` and pass any desired options to the widget via the `options` property. You can also add fields of the `area` type.

And, there's a "biography" section. This is a full-blown content area in which the editor can add rich text and images. _There's nothing to stop us from allowing more controls and widgets here. Limiting the choices just helps keep things from getting out of hand._

### Fine-grained permissions for pieces

As you may know, you can set individual permissions for pages. You can set the view permissions to "Login Required," or even to "Certain People." And you can give out editing permissions to users and groups as well.

This feature is also available for pieces. By default, it is disabled because it is not used as often.

To enable it for your module, just set `permissionsFields: true` in `lib/modules/people/index.js`:

```javascript
module.exports = {
  extend: 'apostrophe-pieces',
  permissionsFields: true,
  // ... other settings ...
};
```

### Customizing the model layer: setting the `title` automatically

Right now, the `title` property \(which is always the full name of the piece\) is independent of `firstName` and `lastName`. For people, it makes more sense for the `title` to be generated automatically from `firstName` and `lastName`.

So let's add a `beforeSave` method in `lib/modules/people/index.js`:

```javascript
module.exports = {
  // Same configuration as before, then...

  construct: function(self, options) {
    self.beforeSave = function(req, piece, options, callback) {
      piece.title = piece.firstName + ' ' + piece.lastName;
      return callback();
    };
  }
};
```

Now the `title` property is set automatically from the first and last name.

> Methods are always added to the module in the `construct` function, which takes the module object, `self`, as its first argument. We attach methods directly to `self`. The use of `self` rather than `this` ensures that methods can make asynchronous calls and be passed as callbacks themselves without any confusion about the value of `this`. For more information about object-oriented functional programming in Apostrophe, check out [moog](https://www.npmjs.com/package/moog) and [moog-require](https://www.npmjs.com/package/moog-require).

You'll notice there is still a separate prompt to enter the full name. Let's get rid of that by adding the `contextual` option to the `title` field, which keeps that field out of the modal:

```javascript
  // In `addFields`
  {
    name: 'title',
    label: 'Full Name',
    type: 'string',
    required: true,
    contextual: true
  }
]
```

> There are many other methods you can override or extend to change the behavior of pieces. See [the apostrophe-pieces API methods](../../modules/apostrophe-pieces/README.md) for more information.

### Arranging fields

As we create increasingly complex [schemas](schema-guide.md) for pieces and widgets, we will want to arrange the fields in the modal in a way that supports a logical workflow for editors.

We can use `arrangeFields` to break the schema into multiple tabs in the editor modal. This can be achieved by passing an array of objects, each containing a name, label, and array of fields, to `arrangeFields`:

```javascript
  addFields: [ ... ],
  arrangeFields: [
    {
      name: 'contact',
      label: 'Contact',
      fields: [ 'firstName', 'lastName', 'phone' ]
    },
    {
      name: 'admin',
      label: 'Administrative',
      fields: [ 'slug', 'published', 'tags' ]
    },
    {
      name: 'content',
      label: 'Biographical',
      fields: [ 'thumbnail', 'body' ]
    }
  ],
```

Any non-`contextual` fields excluded from this configuration will be placed in an additional tab.

## Displaying pieces with widgets

We don't have a way to display these people here and there around the site yet. For that we'll need to add a second module in `app.js`, this time a widget:

```javascript
// other modules, then...
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets'
  }
// etc.
```

> `people-widgets` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-widgets` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option.

Already this is enough to let us add the new widget to any `apos.area` call in a page template, like our `home.html` or `default.html` template:

```markup
apos.area(data.page, 'body', {
    widgets: {
      'apostrophe-rich-text': {},
      'apostrophe-images': {},
      'people': {}
    }
  }
)
```

Right off the bat, we can click the `+` anywhere in this area to add a people widget, and then decide whether to display all people or just hand-pick a few by entering their names. There's an autocomplete feature to complete names quickly.

**Notice that people have to be published in order to be added to the widget.**

### An important performance warning

Pieces widgets are great, but they are powered by joins, and joins can cause trouble because they load so many things... and the things they load may load other things, like widgets... until your site is slow, or Apostrophe refuses to load more widgets to prevent an infinite loop.

To solve that, you should always add a `projection` filter when configuring a subclass of `apostrophe-pieces-widgets`:

```javascript
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets',
    filters: {
      projection: {
        title: 1,
        phone: 1,
        thumbnail: 1,
        // Not a real database property, but including it in the projection
        // fetches everything needed to populate it
        _url: 1,
      }
    }
  }
// etc.
```

This way, only the properties we really need are fetched for the widget. This can greatly speed up your site and prevent mysterious refusals to load any more data if things start joining back to themselves.

> _"Which properties do I need in my projection?"_ Just those you'll use in your `widget.html` template. However, if you try to guess on your own which properties are needed to populate `_url` correctly, you'll have a tough time. Instead, just say `_url: 1` and Apostrophe will include those for you (`slug`, `type` and `tags`, by default).

### Custom templates for widgets

Our widget isn't very satisfying yet. It just displays full names. Let's improve it by creating our own `lib/modules/people-widgets/views/widget.html` file:

```markup
{% for piece in data.widget._pieces %}
  <h4>
    {% if piece._url %}<a href="{{ piece._url }}">{% endif %}
    {{ piece.title }}
    {% if piece._url %}</a>{% endif %}
    {% if piece.phone %}
      <a href="tel:{{ piece.phone }}">
        {{ piece.phone }}
      </a>
    {% endif %}
    {{
      apos.singleton(
        piece,
        'thumbnail',
        'apostrophe-images',
        {
          edit: false,
          size: 'one-sixth'
        }
      )
    }}
  </h4>
{% endfor %}
```

> **"Where do those** `piece._url` **links go?"** Nowhere, yet. Read on to learn about `apostrophe-pieces-pages`, which provide a destination for those links.
>
> The `apostrophe-pieces-widgets` module already has a `widget.html` file. When we extend a widget and provide our own version of an existing template, our version gets rendered instead.
>
> Notice that we can pass our piece to `apos.singleton` the same way we would pass a page. Both are Apostrophe docs, and both live in the `aposDocs` MongoDB collection. Pages have a `slug` property that starts with a `/`, so they can be viewed at their own URLs. Pieces do not.

## Displaying a directory of people on a page with `apostrophe-pieces-pages`

Widgets are not the only way to display pieces. They are designed for displaying a few people here and there in the context of other pages.

For a really useful directory, we'll want to create a page that offers a paginated list of people, with the ability to filter by name. We can even create lots of those pages, "locked down" to display people with certain tags.

Let's add this new module to our `app.js`. Our new module extends the `apostrophe-pieces-pages` module:

```javascript
modules: {
  // ... other modules ...,
  'people-pages': {
    extend: 'apostrophe-pieces-pages'
  }
}
```

> `people-pages` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-pages` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option, and possibly also set the `name` option to a sensible name for the page type that displays an index of pieces. We usually just follow the pattern.

This module provides a new type of page on the site, `people-page`. This new page type displays an index of pieces. Before it can be used, we need to configure `apostrophe-pages` to add it to the menu of page types that can be given to pages. In `app.js` it might look like this:

```javascript
modules: {
  // ... other modules ...,
  'apostrophe-pages': {
    types: [
      // Ordinary page types
      {
        name: 'default',
        label: 'Default'
      },
      {
        name: 'home',
        label: 'Home'
      },
      // Our new page type for displaying people
      {
        name: 'people-page',
        label: 'People'
      }
    ]
  }
}
```

> As with other modules, it's a good idea to create `lib/modules/apostrophe-pages/index.js` and move configuration there to reduce clutter.

### Creating custom templates for our index of people

If you add a `People` page now, you'll see a plain-vanilla list of people; clicking the name of each takes you to a page that displays... just their name. Not very exciting. Let's dress it up.

First make a folder for our templates:

```bash
mkdir -p lib/modules/people-pages/views
```

Now create `index.html` in that folder. You can copy what's already in `node_modules/apostrophe/lib/modules/apostrophe-pieces-pages/views/index.html` as a starting point:

```markup
{% extends "layout.html" %}
{% block title %}{{ data.page.title }}{% endblock %}

{% block main %}
  {% for piece in data.pieces %}
    <h4><a href="{{ piece._url }}">{{ piece.title }}</a></h4>
  {% endfor %}
  {# YES, YOU NEED PAGINATION. You could set the `perPage` option to a large
     number, but eventually you will have performance issues. However, also
     see the discussion of "Load More" and infinite scroll solutions later in this
     tutorial. #}
  {% import 'apostrophe-pager:macros.html' as pager with context %}
  {{ pager.render({ page: data.currentPage, total: data.totalPages }, data.url) }}
{% endblock %}
```

First off, by now you probably have a `layout.html` template of your own that you extend in all of your page templates. So we can switch to extending that:

```markup
{% extends "layout.html" %}
```

Next, let's dress up the people with their headshots by replacing the existing `for` loop with the following:

```markup
  {% for piece in data.pieces %}
    <h4>
      {% set image = apos.images.first(piece.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% endif %}
      <a href="{{ piece._url }}">{{ piece.title }}</a>
    </h4>
  {% endfor %}
```

Add a little CSS and you've got a nice directory.

> _We could have used_ `apos.singleton` _to display the thumbnail,_ but sometimes you don't want the extra markup, editing controls, et cetera.
>
> The `apos.images.first` helper can find an image, also known as an "attachment," anywhere in the object we pass to it. You can pass the entire `piece` object if you want to. But, it's slower than than going straight to the thumbnail.
>
> You can also use `apos.images.all` to fetch an array of attachments.
>
> **Never assume the editor remembered to pick a thumbnail.** Always use an `if` statement to check.
>
> **Always specify the size.** Loading a large version of the image for an index view like this just slows down your site. See [adding editable content to pages](adding-editable-content-to-pages.md) for more information about image sizes.

### Creating custom templates for individual people

Next we'll want to override the `show.html` template of our subclass of `apostrophe-pieces` as well. The default version is very bare-bones, just enough to demonstrate the idea.

`show.html` is the template that displays just one profile in detail:

```markup
{# in lib/modules/people-pages/views/show.html #}
{% extends "layout.html" %}
{% block title %}{{ data.piece.title }}{% endblock %}

{% block main %}
<h2>{{ data.piece.title }}
{{ apos.singleton(data.piece, 'thumbnail', 'apostrophe-images') }}
</h2>

{{ apos.area(data.piece, 'body') }}
{% endblock %}
```

> _We didn't pass an options object to_ `apos.area` _or_ `apos.singleton` _because we already specified the options in the_ [_schema_](schema-guide.md)_,_ as part of `addFields`. If you _do_ pass an options object to `apos.area` or `apos.singleton`, the original options object passed to the [schema](schema-guide.md) is ignored, so be sure to repeat anything that is relevant.

**For SEO reasons, it is almost always important to have a good `show.html` page and provide `_url` links to reach it in your index pages, even if you are displaying most of the information in the index pages as well.**

### Contextual pieces: editing pieces "on the page"

Editing each person's "bio" inside the modal dialog box is okay, but it would be a lot nicer to edit it on the actual page. Indeed, we already can... but only if we deliberately head to the page.

We can make this more intuitive by setting the `contextual` flag for our pieces module:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other options, then...
  contextual: true
};
```

When we do this, _the user is automatically redirected to the_ `show.html` _page for each person as soon as they create and save it._

Note that this only makes sense if you are using `apostrophe-pieces-pages`.

Now that we've made this choice, we might want to switch to calling `apos.singleton` in the page for the profile photo as well.

We can also set `contextual: true` on each of the `body` and `thumbnail` [schema](schema-guide.md) fields so that they don't show up in the modal dialog box but are instead only editable on the page. Whether to do that is up to you, but it does help reinforce the idea that you edit this content on the page.

## Pieces and joins: relating people to their jobs

Let's say you have 100 employees, working at 10 different jobs. Many employees might have the same job description, and you don't want to duplicate that information every time you add an employee.

So we create a second pieces module, `jobs`. Here's how to set that up in `app.js`. We'll set up a `pieces-pages` module too, to let the public browse the jobs on the site:

```javascript
// in app.js
modules: {
  'jobs': {
    extend: 'apostrophe-pieces'
  },
  'jobs-pages': {
    extend: 'apostrophe-pieces-pages'
  },
  'apostrophe-pages': {
    // Don't forget to add the page type!
    types: [
      ... other page types here ...
      {
        name: 'people-page',
        label: 'People'
      },
      {
        name: 'jobs-page',
        label: 'Jobs'
      },
    ]
  }
}
```

To keep `app.js` tidy, we'll put the rest of the configuration for `jobs` in `lib/modules/jobs/index.js`:

```javascript
module.exports = {
  name: 'job',
  addFields: [
    {
      name: 'description',
      type: 'singleton',
      widgetType: 'apostrophe-rich-text',
      options: {
        toolbar: [ 'Bold', 'Italic', 'Link' ]
      }
    }
  ]  
};
```

> You can output this lovely `description` rich text with an `apos.singleton` call in `lib/modules/jobs/views/show.html`. See the example of `show.html` earlier in this tutorial.

### Relating people to their jobs

Great, now we have jobs. But there is no relationship between pieces and jobs yet. How do we create one?

Let's add a `joinByOne` schema field to the `people` module, relating it to our new `job` pieces:

```javascript
// in lib/modules/people/index.js
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  addFields: [
    ... other fields as shown earlier go here ...
    {
      // Join field names MUST start with _
      name: '_job',
      label: 'Job',
      type: 'joinByOne',
      // SINGULAR, to match the `name` option, not the module name
      withType: 'job'
    }  
  ]
};
```

Now, when we edit a person, we'll see a new `Job` field in the dialog box. In that field, we can start typing the name of a job already in the system and select it. Or, we can click the "Browse" button to select a job or even create a brand new one on the fly.

### Displaying joined pieces

Now we have a join between each person and their job. But how do we display the job?

Here's what that looks like in `lib/modules/people/views/show.html`:

```markup
{# As in the earlier example, then... #}
{% if data.person._job %}
  <h4>
    Position: <a href="{{ data.person._job._url">{{ data.person._job.title }}</a>
  </h4>
{% endif %}
```

> **"What's going on in this code?"** Once you add a join to the schema, you can access the joined piece like you would any other property. Apostrophe automatically loads the joined jobs after loading the people.
>
> Notice that we use an `if` statement to make sure the person has a job. **Even if you set a `joinByOne` field `required: true`, it is always possible that someone has moved the job to the trash,** changed its permissions, or made it inaccessible in some other way. Never assume a join still has a value.

### Joins in widgets: watch out for projections

Earlier, for performance, we showed how to restrict the projection used to fetch people from the database for widgets. This is good, but if you try to access `piece._job` in that template now, you'll be disappointed.

We can fix this by adding `_job` to the projection:

```javascript
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets',
    filters: {
      projection: {
        title: 1,
        phone: 1,
        thumbnail: 1,
        _url: 1,
        _job: 1
      }
    }
  }
// etc.
```

> Just like `_url`, adding `_job: 1` will fetch everything needed to populate `_job`, even though it is not a real database property. Apostrophe takes care of this "under the hood," adding the `jobId` property that contains the actual _id of the job... and you don't have to worry about it.

### `joinByArray`: when people have multiple jobs

Turns out our employees can have more than one job! Oops. How do we express that?

```javascript
// in lib/modules/people/index.js
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'person',
  label: 'Person',
  pluralLabel: 'People',
  addFields: [
    ... other fields as shown earlier go here ...
    {
      // Join field names MUST start with _
      name: '_jobs',
      label: 'Jobs',
      type: 'joinByArray',
      // SINGULAR, to match the `name` option, not the module name
      withType: 'job'
    }  
  ]
};
```

Once again we can choose jobs when we edit a person; we are now allowed to pick more than one.

And in our templates, we can access the array of jobs like this:

```markup
{% for job in data.piece._jobs %}
  <h4>
    Position: <a href="{{ job._url">{{ job.title }}</a>
  </h4>
```

## Filtering the list of people

Before long you'll start wanting to filter this list of people, taking advantage of joins, tags and other field types. Here's how to do that on the public-facing site. Later in this tutorial we'll also talk about how to do it in the "Manage" view.

To make it easier to browse a listing of pieces, the [apostrophe-pieces-pages](../../modules/apostrophe-pieces-pages/README.md) module will *automatically permit you to filter by the value of most schema fields when submitted as query string parameters*, provided they are marked for this purpose as you'll see below.

> You can also use `q` or `search` as a query parameter to do a full-text search. *Tip:* often this is all users want.

In this tutorial we'll explore how to add a filter by tag. Later, we'll look at filtering by a join as well.

Add this code to `lib/modules/people-pages/index.js`. Note that earlier in this tutorial we already added this module to `app.js`, extending `apostrophe-pieces-pages`. Now we need to add some custom configuration:

```javascript
module.exports = {
  // We already set the "extend" option in app.js, or we'd need it here
  // Specify the schema fields we want to be able to filter by
  piecesFilters: [
    {
      name: 'tags'
    }
  ]
}
```

Here we're asking `apostrophe-pieces-pages` to automatically populate `req.data.piecesFilters.tags` with an array of choices. And, we're also asking that `tags` be accepted via the query string in the URL (for example, `/people?tags=doctors`).

Now we can take advantage of that:

```markup
{# Inside lib/modules/people-pages/index.html #}

{# Link to all the tags, adding a parameter to the query string #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }}</a></li>
  {% endfor %}
</ul>
```

> **"What's going on in this code?"** On a pieces index page, `data.url` always contains the current URL. We want to add a `tags` parameter to the query string. Apostrophe's `build` filter merges new query parameters with the URL. We can also remove a query parameter by passing the empty string as its value.
>
> Notice that there are separate `tag` and `label` properties for each tag, even though they are the same. This pattern is used consistently for all fields we define filters for, including fields like joins or select fields where the value and the label can be quite different. This lets you write a single macro to handle many filters.

### Displaying counts for tags

If we wish, we can display counts for the choices, so users know how many items are available with a given tag:

```javascript
// in lib/modules/people-pages/index.js
module.exports = {
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
  ]
}
```

Now we can show the tag counts in our `index.html` template:

```markup
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }} ({{ tag.count }})</a></li>
  {% endfor %}
</ul>
```

### Showing the current state of the filter

Usually we want to indicate the tag the user has already chosen. And, we'd like a way to remove the filter and go back to seeing all of the people.

How can we do that? Again, in `index.html`:

```markup
{# Link to all the tags, adding a parameter to the query string #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li>
      {% if data.query.tags == tag.value %}
        <a href="{{ data.url | build({ tags: '' }) }}" class="current">
      {% else %}
        <a href="{{ data.url | build({ tags: tag.value }) }}">
      {% endif %}
        {{ tag.label }}
      </a>
    </li>
  {% endfor %}
</ul>
```

> **"What's going on in this code?"** The current query string is automatically unpacked to `data.query` for you as an object. So just compare `data.query.tags` to the value of each of the choices.
>
> We add a `current` CSS class to the link to remove the current filter. It's up to you to style that; for instance, you might use an `::after` pseudo-element to add an "x."

### Filtering on joins and other schema field types

Tags are the simplest example, but we can filter on most schema field types, notably including [`select`](schema-guide.md#select) fields and [`joinByOne`](schema-guide.md#joinByOne) or [`joinByArray`](schema-guide.md#joinByArray) fields.

Let's add a filter on the `_jobs` schema field we saw earlier:

```javascript
// in lib/modules/people-pages/index.js
module.exports = {
  piecesFilters: [
    {
      name: 'jobs'
    }
  ]
}
```

> "Why is the filter named `jobs`, even though the field is named `_jobs`?" It works like this: if we specify `_jobs` for the filter, then the value in the query string will be the `_id` property of the job. This works, and it is stable no matter what gets edited later. But it isn't pretty. If we remove the `_` from the filter name, the value in the query string will be the *slug* of the job, which is more user-friendly and good for SEO.
>
> However, keep in mind that if you change the slug someone's bookmarked links might break. So it's up to you whether to use `_jobs` (for the `_id`) or `jobs` (for the `slug`).
 
Now we can filter people by job:

```markup
{# Inside lib/modules/people-pages/index.html #}

{# Link to all the tags, adding a parameter to the query string #}
<ul class="job-filters">
  {% for job in data.piecesFilters.jobs %}
    <li><a href="{{ data.url | build({ jobs: job.value }) }}">{{ job.label }}</a></li>
  {% endfor %}
</ul>
```

> Notice that this template looks exactly like the one for tags. That's intentional. You could use a single Nunjucks macro for both.

### Filtering on multiple values

You're not restricted to filtering on a single value for a join, or for a `tags` field. If the query string looks like this:

```
?jobs[]=anointer&jobs[]=flosser
```

You'll see people with *either* job.

> If you want to be more restrictive and only display results that have *all* of the specified values, just add `And` to the filter name. As before, you can do this with `_` for `_id`, or without for `slug`. For instance, `_jobsAnd` expects ids, while `jobsAnd` expects slugs. However, **keep in mind this usually is very frustrating for users because they will rarely get any matches.** We recommend the default "or" behavior.

Here's how to build query strings that contain arrays in your template:

```markup
{# Inside lib/modules/people-pages/index.html #}

<ul class="job-filters">
  {% for job in data.piecesFilters.jobs %}
    {% if apos.utils.contains(data.query.jobs, job.value %}
      <a href="{{ data.url | build({ jobs: { $pull: job.value } }) }}" class="current">
    {% else %}
      <a href="{{ data.url | build({ jobs: { $addToSet: job.value } }) }}">
    {% endif %}
      {{ job.label }}
    </a>
  {% endfor %}
</ul>
```

> **"What's going on in this code?"** Like before, we are using the `build` filter to add and remove query parameters. However, this time, we are using the special `$pull` operator to remove a job from the array without removing the others, and using the special `$addToSet` operator to add a job to the array. In this way, we can manage filter URLs like `/people?jobs[]=doctor&jobs[]=technician` with very little effort.

### Filtering without reloading the page: using AJAX to enhance filters

Apostrophe offers an general-purpose, extremely easy solution for AJAX refreshes.

"What the heck is an AJAX refresh?" Right now, if you click on a filter, the whole page reloads. Instead, an AJAX refresh only updates the relevant part of the page.

Here's how you do it:

Just add a `data-apos-ajax-context="name"` attribute to the outer div that should be refreshed when any link or form submission inside it takes place and has a URL that points back to the same page.

_The value of the attribute must be unique on the page._

Next, refactor your `index.html` template so that the actual list of people and any filters are in an `indexAjax.html` template, which is included at the appropriate point, wrapped in a div that has the `data-apos-ajax-context` attribute:

```markup
{# index.html #}
{% extends "layout.html" %}
<h2>People</h2>
<div data-apos-ajax-context="people">
  {% include "indexAjax.html" %}
</div>
```

```markup
{# indexAjax.html, which does NOT extend anything #}
{% for piece in data.pieces %}
  <h4>
    {% set image = apos.images.first(piece.thumbnail) %}
    {% if image %}
      <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
    {% endif %}
    <a href="{{ piece._url }}">{{ piece.title }}</a>
  </h4>
{% endfor %}
```

That's it! Really. And it automatically works with the filters that we saw earlier.

**Tip:** you'll want to include your filter links and forms in `indexAjax.html` so that they too can be refreshed automatically, narrowing down the choices based on the other filters already in use. Any input elements or textareas that currently have the focus will not be refreshed, so if you are using form elements, you can even implement typeahead by triggering a submit of the form via JavaScript as the user types. (Keep in mind the accessibility consequences.)

#### Combining a "Load More..." button with AJAX

There's one catch with the ajax solution above: it doesn't yet account for a "Load More" button that appends to, rather than replacing, the current page's worth of content.

But this isn't hard to accommodate. All you have to do is:

1. Wrap a new element _inside_ your `data-apos-ajax-context` element around the content that makes up the current "page" of results. This should _not_ wrap around filter links or the "Load More" button itself.
2. Give that element the `data-apos-ajax-append` attribute.
3. Add `append=1` to the query string of your `Load More` button.

Here's an example. Here we assume you already set up the `piecesFilters` option as described earlier in this tutorial to enable filtering people by tag.

```markup
{# index.html #}
{% extends "layout.html" %}
<h2>People</h2>
<div data-apos-ajax-context="people">
  {% include "indexAjax.html" %}
</div>
```

```markup
{# indexAjax.html #}

{# Filter by tag. Note this is OUTSIDE data-apos-ajax-append, so it gets REFRESHED #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }}</a></li>
  {% endfor %}
</ul>

{# New stuff gets appended to this element #}
<div data-apos-ajax-append>
  {% for piece in data.pieces %}
    <h4>
      {% set image = apos.images.first(piece.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% endif %}
      <a href="{{ piece._url }}">{{ piece.title }}</a>
    </h4>
  {% endfor %}
</div>

{# Load More button. Also outside data-apos-ajax-append, so it gets refreshed #}
{% if data.currentPage < data.totalPages %}
  {# "Load More" button with the "append=1" flag #}
  <a href="{{ data.url | build({ page: data.currentPage + 1, append: 1 }) }}">Load More...</a>
{% endif %}
```

#### Infinite scroll with AJAX

"Load More" is nice, but what about infinite scroll? Can't we just load the next page when the user scrolls close to the bottom of the last one?

It's often a great idea. But first, ask yourself if it fits into your site design! If your "footer" contains anything important, remember that users will often never reach it.

That being said, here's how to make it work:

1. Implement the "Load More" button, above.
2. Add a `data-apos-ajax-infinite-scroll` attribute to the button itself:

```markup
{# Load More button. Also outside data-apos-ajax-append, so it gets refreshed #}
{% if data.currentPage < data.totalPages %}
  {# "Load More" button with the "append=1" flag #}
  <a data-apos-ajax-infinite-scroll href="{{ data.url }} | build({ page: data.currentPage + 1, append: 1 })">Load More...</a>
{% endif %}
```

Apostrophe will hide the button with JavaScript, but you can do it with CSS also to avoid seeing it momentarily.

That's it! Apostrophe will detect the button, hide it, and convert it to a scroll position sensor that automatically triggers the appending of the next page exactly as if the button had been clicked.

"Why do we still need to add the link?" If the link doesn't exist... how will Google index your content? It won't. And that would be a significant SEO failure. That's why we "progressively enhance" it to create the infinite scroll feature.

### Filters for the "manage" modal

In the "manage" modal, enabling a "tags" filter for admins is often handy:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags'
    }
  ]
};
```

You can also allow multiple tags to be selected, in which case pieces with at least one of those tags are displayed:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags',
      multiple: true
    }
  ]
};
```

The same approach works for most types of schema fields, including joins. We do not recommend using it if the number of items in the dropdown will be very large. However, adding options to support filters that employ typeahead and avoid sending a large list of options to the browser is on our roadmap for the future.

### Custom columns and sortable columns for the "manage" modal

By default, the "manage" modal displays just a few columns: "title," "last updated," and "published." The "title" and "updated at" columns support sorting on that column, by clicking on the column heading.

You can extend this list and even specify your own sortable columns. Here's how to do that:

```javascript
// in lib/modules/people/index.js
module.exports = {
  // Other configuration options, then...
  addColumns: [
    // These are the standard columns, we would not add
    // them twice, just using them as an example
    {
      name: 'title',
      label: 'Title',
      sort: {
        // Sort on this property. The `1` is required
        title: 1
      }
    },
    {
      name: 'updatedAt',
      label: 'Last Updated',
      sort: {
        // Sort on this property. The `1` is required
        updatedAt: 1
      },
      // Use a custom nunjucks template to output the
      // value, rather than outputting the value simply
      // as a string. The value of the property shows up
      // as `data.value` in the template
      partial: function(value) {
        if (!value) {
          // Don't crash if updatedAt is missing
          return '';
        }
        return self.partial('manageUpdatedAt.html', { value: value });
      }
    }
  ]
```

> Notice that for `sort` you specify an object exactly like what you'd pass to MongoDB's
`sort()` method, or Apostrophe's `sort()` cursor filter. In particular, the actual property
you sort on does not have to match the property name displayed in the column. For example,
when working with people's names you might sort on `{ lastName: 1, firstName: 1 }` rather
than `title`.

**If you want to change one of the standard columns, override `defaultColumns`** rather
than setting `addColumns`.


