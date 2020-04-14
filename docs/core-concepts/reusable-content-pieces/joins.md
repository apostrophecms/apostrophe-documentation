# Joins: Connecting Piece Types to One Another

Joins are a powerful way to connect content in Apostrophe. With pieces, you can use joins to avoid duplicating work and display complex content on your site.

## Pieces and joins: relating people to their jobs

Let's say you have 100 employees, working at 10 different jobs. Many employees might have the same job description, and you don't want to duplicate that information every time you add an employee.

So we create a second pieces module, `jobs`. Here's how to set that up in `app.js`. We'll set up a `pieces-pages` module too, to let the public browse the jobs on the site:

```javascript
// app.js
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


To keep `app.js` tidy, put the rest of the configuration for `jobs` in `lib/modules/jobs/index.js`:

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


<!-- {% hint style="info" %} -->
You can output this lovely `description` rich text with an `apos.singleton` call in `lib/modules/jobs/views/show.html`. See the example of `show.html` earlier in this tutorial.
<!-- {% endhint %} -->

### Relating people to their jobs

Great, now you have jobs. But there is no relationship between pieces and jobs yet. How do you create one?

Let's add a `joinByOne` schema field to the `people` module, relating it to the new `job` pieces:

```javascript
// lib/modules/people/index.js
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

Now, when you edit a person, you see a new `Job` field in the dialog box. In that field, you can start typing the name of a job already in the system and select it. Or, you can click the "Browse" button to select a job or even create a brand new one on the fly.

### Displaying joined pieces

Now you have a join between each person and their job. But how do you display the job?

Here's what that looks like in `lib/modules/people/views/show.html`:

```django
{# As in the earlier example, then... #}
{% if data.person._job %}
  <h4>
    Position: <a href="{{ data.person._job._url }}">{{ data.person._job.title }}</a>
  </h4>
{% endif %}
```

<!-- {% hint style="info" %} -->
**"What's going on in this code?"** Once you add a join to the schema, you can access the joined piece like you would any other property. Apostrophe automatically loads the joined jobs after loading the people.

Notice that we use an `if` statement to make sure the person has a job. **Even if you set a `joinByOne` field `required: true`, it is always possible that someone has moved the job to the trash,** changed its permissions, or made it inaccessible in some other way. Never assume a join still has a value.
<!-- {% endhint %} -->

### Joins in widgets: watch out for projections

Earlier, for performance, we showed how to restrict the projection used to fetch people from the database for widgets. This is good, but if you try to access `piece._job` in that template now, you'll be disappointed.

You can fix this by adding `_job` to the projection:

```javascript
  // lib/modules/people-widgets/index.js
  module.exports = {
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

<!-- {% hint style="info" %} -->
Just like `_url`, adding `_job: 1` will fetch everything needed to populate `_job`, even though it is not a real database property. Apostrophe takes care of this "under the hood," adding the `jobId` property that contains the actual \_id of the job... and you don't have to worry about it.
<!-- {% endhint %} -->

### `joinByArray`: when people have multiple jobs

Turns out your employees can have more than one job! Oops. How do we express that?

```javascript
// lib/modules/people/index.js
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

Now when editing a person, you can select more than one job.

And in our templates, we can access the array of jobs like this:

```django
{# lib/modules/people/views/show.html #}
{% for job in data.piece._jobs %}
  <h4>
    Position: <a href="{{ job._url }}">{{ job.title }}</a>
  </h4>
{% endfor %}
```

## Filtering the list of people

Before long you'll start wanting to filter this list of people, taking advantage of joins, tags and other field types. Here's how to do that on the public-facing site. Later in this tutorial we'll also talk about how to do it in the "Manage" view.

To make it easier to browse a listing of pieces, the [apostrophe-pieces-pages](/modules/apostrophe-pieces-pages/README.md) module will *automatically permit you to filter by the value of most schema fields when submitted as query string parameters*, provided they are marked for this purpose as you'll see below.

<!-- {% hint style="info" %} -->
You can also use `q` or `search` as a query parameter to do a full-text search. *Tip:* often this is all users want.
<!-- {% endhint %} -->

Next we'll explore how to add a filter by tag. Later, we'll look at filtering by a join as well.

Add this code to `lib/modules/people-pages/index.js`. Note that earlier you added this module to `app.js`, extending `apostrophe-pieces-pages`. Now you need to add some custom configuration:

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

Here you're asking `apostrophe-pieces-pages` to automatically populate `req.data.piecesFilters.tags` with an array of choices. And, you're also asking that `tags` be accepted via the query string in the URL (for example, `/people?tags=doctors`).

Now you can take advantage of that:

```django
{# lib/modules/people/views/index.html #}
{# Link to all the tags, adding a parameter to the query string #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }}</a></li>
  {% endfor %}
</ul>
```


<!-- {% hint style="info" %} -->
**"What's going on in this code?"** On a pieces index page, `data.url` always contains the current URL. We want to add a `tags` parameter to the query string. Apostrophe's `build` filter merges new query parameters with the URL. We can also remove a query parameter by passing the empty string as its value.

Notice that there are separate `value` and `label` properties for each tag, even though they are the same. This pattern is used consistently for all fields we define filters for, including fields like joins or select fields where the value and the label can be quite different. This lets you write a single macro to handle many filters.
<!-- {% endhint %} -->

### Displaying counts for tags

You can display counts for the choices, so users know how many items are available with a given tag.

1. Add the `counts: true;` property to the `piecesFilters` in `index.js`

::: v-pre
2. Add `({{ tag.count }})` inside of the `href` tag in `index.html`.
:::


```javascript
// lib/modules/people-pages/index.js
module.exports = {
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
  ]
}
```

```django
{# lib/modules/people-pages/index.html #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }} ({{ tag.count }})</a></li>
  {% endfor %}
</ul>
```

### Showing the current state of the filter

Usually you want to indicate the tag the user has already chosen. And, you want a way to remove the filter and to see the full results.

How can we do that? Again, in `index.html`:

```django
{# lib/modules/people-pages/index.html #}
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

<!-- {% hint style="info" %} -->
**"What's going on in this code?"** The current query string is automatically unpacked to `data.query` for you as an object. So just compare `data.query.tags` to the value of each of the choices.

We add a `current` CSS class to the link to remove the current filter. It's up to you to style that; for instance, you might use an `::after` pseudo-element to add an "x."
<!-- {% endhint %} -->

### Filtering on joins and other schema field types

Tags are the simplest example, but you can filter on most schema field types, notably including [`select`](../../schema-guide/schema-guide.md#select) fields and [`joinByOne`](/tutorials/schema-guide/schema-guide.md#joinByOne) or [`joinByArray`](/tutorials/schema-guide/schema-guide.md#joinByArray) fields.

Add a filter on the `_jobs` schema field we saw earlier:

```javascript
// lib/modules/people-pages/index.js
module.exports = {
  piecesFilters: [
    {
      name: 'jobs'
    }
  ]
}
```

<!-- {% hint style="info" %} -->
"Why is the filter named `jobs`, even though the field is named `_jobs`?" It works like this: if we specify `_jobs` for the filter, then the value in the query string will be the `_id` property of the job. This works, and it is stable no matter what gets edited later. But it isn't pretty. If we remove the `_` from the filter name, the value in the query string will be the *slug* of the job, which is more user-friendly and good for SEO.

However, keep in mind that if you change the slug someone's bookmarked links might break. So it's up to you whether to use `_jobs` (for the `_id`) or `jobs` (for the `slug`).
<!-- {% endhint %} -->

Now you can filter people by job:

```django
{# lib/modules/people-pages/index.html #}
{# Link to all the tags, adding a parameter to the query string #}
<ul class="job-filters">
  {% for job in data.piecesFilters.jobs %}
    <li><a href="{{ data.url | build({ jobs: job.value }) }}">{{ job.label }}</a></li>
  {% endfor %}
</ul>
```

<!-- {% hint style="info" %} -->
Notice that this template looks exactly like the one for tags. That's intentional. You could use a single Nunjucks macro for both.
<!-- {% endhint %} -->

### Filtering on multiple values

You're not restricted to filtering on a single value for a join, or for a `tags` field. If the query string looks like this:

```
?jobs[]=anointer&jobs[]=flosser
```

You'll see people with *either* job.

<!-- {% hint style="info" %} -->
If you want to be more restrictive and only display results that have *all* of the specified values, add `And` to the filter name&mdash;in both the `piecesFilters` array (in the module's `index.js`) and the template references. As before, you can do this with `_` for `_id`, or without for `slug`.For instance, `_jobsAnd` expects ids, while `jobsAnd` expects slugs.

However, **keep in mind this usually is very frustrating for users because they will rarely get any matches.** We recommend the default "or" behavior.
<!-- {% endhint %} -->

Here's how to build query strings that contain arrays in your template:

```django
{# lib/modules/people-pages/index.html #}
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

<!-- {% hint style="info" %} -->
**"What's going on in this code?"** Like before, we are using the `build` filter to add and remove query parameters. However, this time, we are using the special `$pull` operator to remove a job from the array without removing the others, and using the special `$addToSet` operator to add a job to the array. In this way, we can manage filter URLs like `/people?jobs[]=doctor&jobs[]=technician` with very little effort.
<!-- {% endhint %} -->

Pieces are very powerful and have a lot of depth, for more pieces topics and code samples, see the [Advanced Pieces section](/tutorials/advanced-development/advanced-pieces-topics/README.md).
