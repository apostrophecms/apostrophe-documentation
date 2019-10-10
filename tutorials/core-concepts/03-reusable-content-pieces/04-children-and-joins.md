---
title: Joins: Connecting Piece Types to One Another
layout: tutorial
---

# Joins: Connecting Piece Types to One Another

Joins are a powerful way to connect content in Apostrophe. With pieces, you can use joins to avoid duplicating work and display complex content on your site.

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

{% hint style="info" %}
You can output this lovely `description` rich text with an `apos.singleton` call in `lib/modules/jobs/views/show.html`. See the example of `show.html` earlier in this tutorial.
{% endhint %}

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

{% hint style="info" %}
**"What's going on in this code?"** Once you add a join to the schema, you can access the joined piece like you would any other property. Apostrophe automatically loads the joined jobs after loading the people.

Notice that we use an `if` statement to make sure the person has a job. **Even if you set a `joinByOne` field `required: true`, it is always possible that someone has moved the job to the trash,** changed its permissions, or made it inaccessible in some other way. Never assume a join still has a value.
{% endhint %}

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

{% hint style="info" %}
Just like `_url`, adding `_job: 1` will fetch everything needed to populate `_job`, even though it is not a real database property. Apostrophe takes care of this "under the hood," adding the `jobId` property that contains the actual _id of the job... and you don't have to worry about it.
{% endhint %}

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

{% hint style="info" %}
You can also use `q` or `search` as a query parameter to do a full-text search. *Tip:* often this is all users want.
{% endhint %}

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

{% hint style="info" %}
**"What's going on in this code?"** On a pieces index page, `data.url` always contains the current URL. We want to add a `tags` parameter to the query string. Apostrophe's `build` filter merges new query parameters with the URL. We can also remove a query parameter by passing the empty string as its value.

Notice that there are separate `value` and `label` properties for each tag, even though they are the same. This pattern is used consistently for all fields we define filters for, including fields like joins or select fields where the value and the label can be quite different. This lets you write a single macro to handle many filters.
{% endhint %}

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

{% hint style="info" %}
**"What's going on in this code?"** The current query string is automatically unpacked to `data.query` for you as an object. So just compare `data.query.tags` to the value of each of the choices.

We add a `current` CSS class to the link to remove the current filter. It's up to you to style that; for instance, you might use an `::after` pseudo-element to add an "x."
{% endhint %}

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

{% hint style="info" %}
"Why is the filter named `jobs`, even though the field is named `_jobs`?" It works like this: if we specify `_jobs` for the filter, then the value in the query string will be the `_id` property of the job. This works, and it is stable no matter what gets edited later. But it isn't pretty. If we remove the `_` from the filter name, the value in the query string will be the *slug* of the job, which is more user-friendly and good for SEO.

However, keep in mind that if you change the slug someone's bookmarked links might break. So it's up to you whether to use `_jobs` (for the `_id`) or `jobs` (for the `slug`).
{% endhint %}

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

{% hint style="info" %}
Notice that this template looks exactly like the one for tags. That's intentional. You could use a single Nunjucks macro for both.
{% endhint %}

### Filtering on multiple values

You're not restricted to filtering on a single value for a join, or for a `tags` field. If the query string looks like this:

```
?jobs[]=anointer&jobs[]=flosser
```

You'll see people with *either* job.

{% hint style="info" %}
If you want to be more restrictive and only display results that have *all* of the specified values, add `And` to the filter name&mdash;in both the `piecesFilters` array (in the module's `index.js`) and the template references. As before, you can do this with `_` for `_id`, or without for `slug`.For instance, `_jobsAnd` expects ids, while `jobsAnd` expects slugs.

However, **keep in mind this usually is very frustrating for users because they will rarely get any matches.** We recommend the default "or" behavior.
{% endhint %}

Here's how to build query strings that contain arrays in your template:

```markup
{# Inside lib/modules/people-pages/index.html #}

<ul class="job-filters">
  {% for job in data.piecesFilters.jobs %}
    {% if apos.utils.contains(data.query.jobs, job.value) %}
      <a href="{{ data.url | build({ jobs: { $pull: job.value } }) }}" class="current">
    {% else %}
      <a href="{{ data.url | build({ jobs: { $addToSet: job.value } }) }}">
    {% endif %}
      {{ job.label }}
    </a>
  {% endfor %}
</ul>
```

{% hint style="info" %}
**"What's going on in this code?"** Like before, we are using the `build` filter to add and remove query parameters. However, this time, we are using the special `$pull` operator to remove a job from the array without removing the others, and using the special `$addToSet` operator to add a job to the array. In this way, we can manage filter URLs like `/people?jobs[]=doctor&jobs[]=technician` with very little effort.
{% endhint %}

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

{% hint style="info" %}
Notice that for `sort` you specify an object exactly like what you'd pass to MongoDB's `sort()` method, or Apostrophe's `sort()` cursor filter. In particular, the actual property you sort on does not have to match the property name displayed in the column. For example, when working with people's names you might sort on `{ lastName: 1, firstName: 1 }` rather than `title`.
{% endhint %}

**If you want to change one of the standard columns, override `defaultColumns`** rather
than setting `addColumns`.


[Joins](../getting-started/schema-guide.md#joinbyone) are one of Apostrophe's best features:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds'
  }
]
```

But if you try to access the `_children` property of those pages, you'll be disappointed at first.

Child pages get fetched only if the `children()` filter is called on the cursor that fetches those docs. This takes extra time and does extra work, and most joins don't need them. So by default, they are not fetched.

Fortunately, you can turn on extra cursor filters yourself in any join:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: true
    }
  }
]
```

## Fetching thumbnails

By default, `children` will not load any widgets present in the child pages, again for performance reasons.

Here's how to turn it on for just one area, a singleton widget called `thumbnail`:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: {
        areas: [ 'thumbnail' ]
      }
    }
  }
]
```

> If we pass an object to `children`, its properties are invoked as cursor filters when fetching the children. The same trick works with `ancestors`.

## Projections and children

If you are using the `projection` filter to load just the absolute minimum information about those pages, `children` won't work, because it requires a little more information about the original pages to understand their place in the page tree.

Here is the absolute minimum `projection` needed for use with `children`:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: true,
      projection: {
        title: 1,
        slug: 1,
        rank: 1,
        level: 1,
        path: 1
      }
    }
  }
]
```

But while using projections is fastest, you can improve performance quite a lot just by not loading areas:

```javascript
addFields: [
  {
    name: '_pages',
    type: 'joinByArray',
    withType: 'apostrophe-page',
    label: 'Pages',
    idsField: 'pageIds',
    filters: {
      children: true,
      areas: false
    }
  }
]
```

