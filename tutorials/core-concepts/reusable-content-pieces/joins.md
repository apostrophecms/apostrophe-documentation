---
title: Connecting Piece Types to One Another
layout: tutorial
---

# Joins: Connecting Piece Types to One Another

Joins are a powerful way to connect content in Apostrophe. With pieces, you can use joins to avoid duplicating work and display complex content on your site.

## Pieces and joins: relating people to their jobs

Let's say you have 100 employees, working at 10 different jobs. Many employees might have the same job description, and you don't want to duplicate that information every time you add an employee.

So we create a second pieces module, `jobs`. Here's how to set that up in `app.js`. We'll set up a `pieces-pages` module too, to let the public browse the jobs on the site:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
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
{% endcode-tabs-item %}
{% endcode-tabs %}


To keep `app.js` tidy, put the rest of the configuration for `jobs` in `lib/modules/jobs/index.js`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/jobs/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}


{% hint style="info" %}
You can output this lovely `description` rich text with an `apos.singleton` call in `lib/modules/jobs/views/show.html`. See the example of `show.html` earlier in this tutorial.
{% endhint %}

### Relating people to their jobs

Great, now you have jobs. But there is no relationship between pieces and jobs yet. How do you create one?

Let's add a `joinByOne` schema field to the `people` module, relating it to the new `job` pieces:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
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
{% endcode-tabs-item %}
{% endcode-tabs %}

Now, when you edit a person, you see a new `Job` field in the dialog box. In that field, you can start typing the name of a job already in the system and select it. Or, you can click the "Browse" button to select a job or even create a brand new one on the fly.

### Displaying joined pieces

Now you have a join between each person and their job. But how do you display the job?

Here's what that looks like in `lib/modules/people/views/show.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/views/show.html" %}
```markup
{# As in the earlier example, then... #}
{% if data.person._job %}
  <h4>
    Position: <a href="{{ data.person._job._url }}">{{ data.person._job.title }}</a>
  </h4>
{% endif %}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
**"What's going on in this code?"** Once you add a join to the schema, you can access the joined piece like you would any other property. Apostrophe automatically loads the joined jobs after loading the people.

Notice that we use an `if` statement to make sure the person has a job. **Even if you set a `joinByOne` field `required: true`, it is always possible that someone has moved the job to the trash,** changed its permissions, or made it inaccessible in some other way. Never assume a join still has a value.
{% endhint %}

### Joins in widgets: watch out for projections

Earlier, for performance, we showed how to restrict the projection used to fetch people from the database for widgets. This is good, but if you try to access `piece._job` in that template now, you'll be disappointed.

You can fix this by adding `_job` to the projection:

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
Just like `_url`, adding `_job: 1` will fetch everything needed to populate `_job`, even though it is not a real database property. Apostrophe takes care of this "under the hood," adding the `jobId` property that contains the actual \_id of the job... and you don't have to worry about it.
{% endhint %}

### `joinByArray`: when people have multiple jobs

Turns out your employees can have more than one job! Oops. How do we express that?

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
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
{% endcode-tabs-item %}
{% endcode-tabs %}


Now when editing a person, you can select more than one job.

And in our templates, we can access the array of jobs like this:

```markup
{% for job in data.piece._jobs %}
  <h4>
    Position: <a href="{{ job._url">{{ job.title }}</a>
  </h4>
```

## Next Steps

This section covered the key information that you need to create your own pieces types to use on your site, but there's a lot more depth to what you can do with pieces. To continue this example and take the next steps in becoming an Apostrophe master, see the [Advanced Pieces section](/tutorials/advanced-development/advanced-pieces-topics/README.md).