---
title: Example: Pieces with Joins
layout: tutorial
---

# Example: Pieces with Joins

To better understand pieces and get some familiarity with joins, you can try out this additional pieces example. This example is standalone and doesn't require any of the work or configuration from the previous example.

## A directory of people: working with pieces

Let's say you want to create a directory of people who work for a company. People are "global content": they are useful to display here and there all over the site, they aren't tied down to one page. The `apostrophe-pieces` module provides a great starting point to create many types of global content. You'll extend it to make your own `people` module. You can extend `apostrophe-pieces` many times in the same project.

{% hint style="info" %}
**"What about users?"** Yes, you already have a "Users" menu on your admin bar. And yes, users are powered by pieces. But we've found that confusing website editors with the publicly visible staff directory tends to cause problems in the long run. Plus, this way, it's a teachable moment. :\)
{% endhint %}

1\. Create a `lib/modules/people/index.js` file:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
**IMPORTANT: note the** `name` **property. This identifies ONE piece in the database, so it is always singular.** Remember: Modules Are Plural \(MAP\), but the things they manage may not be.
{% endhint %}

2\. Now turn the module on in `app.js`.

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
modules: {
  // ... other modules ...,
  'people': {}
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
**Note:** When code examples show sections like the `modules` section in `app.js` we're only going to show you the relevant portion that you're currently working on. In many cases you'll have a lot more in those sections, but we don't need to replicate that every time.
{% endhint %}

Just like that, you'll see a new "People" menu in the admin bar when you log into the site. Pick "New Person" and you'll find that you can give each person a full name, a first name, a last name and a phone number. Pick "Manage Person" to examine and edit existing people.

{% hint style="info" %}
You could have configured the module entirely in `app.js`. But that leads to giant `app.js` files, so we don't recommend it. However, some developers feel it's a good place for high-level properties like `extend` that help give you a quick overview of what the module is and does.
{% endhint %}

There are certain additional fields that you get by default with every piece, such as `title` \(the full name of the piece\), `slug` \(used when the piece appears as part of a URL\), and `published` \(which determines whether the public can see the piece, as you'll see below\). But in this case, you re-declared `title` in order to change its label to `Full Name` so that the "New Person" form is not confusing.

You can even add a profile photo, via the `thumbnail` field. This field has the `singleton` type, which allows you to include a widget in the [schema](/tutorials/schema-guide/schema-guide.md) for this type of piece, exactly as if you were calling `apos.singleton` in a template. You just need to specify the `widgetType` and pass any desired options to the widget via the `options` property. You can also add fields of the `area` type.

And, there's a "biography" section. This is a full-blown content area in which the editor can add rich text and images. _There's nothing to stop us from allowing more controls and widgets here. Limiting the choices just helps keep things from getting out of hand._

### Customizing the model layer: setting the `title` automatically

Right now, the `title` property \(which is always the full name of the piece\) is independent of `firstName` and `lastName`. In this example, it makes more sense for the `title` to be generated automatically from `firstName` and `lastName`.

To do this, add this `beforeSave` method in `lib/modules/people/index.js`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

Now the `title` property is set automatically from the first and last name.

{% hint style="info" %}
Methods are always added to the module in the `construct` function, which takes the module object, `self`, as its first argument. You attach methods directly to `self`. The use of `self` rather than `this` ensures that methods can make asynchronous calls and be passed as callbacks themselves without any confusion about the value of `this`. For more information about object-oriented functional programming in Apostrophe, check out [moog](https://www.npmjs.com/package/moog) and [moog-require](https://www.npmjs.com/package/moog-require).
{% endhint %}

#### Using Contextual Fields to Simplify the Form

When you do this, there is still a separate prompt to enter the full name. Remove that by adding the `contextual` option to the `title` field, which keeps that field out of the modal:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
There are many other methods you can override or extend to change the behavior of pieces. See [the apostrophe-pieces API methods](/modules/apostrophe-pieces/README.md) for more information.
{% endhint %}

### Arranging fields

As you create increasingly complex [schemas](/tutorials/schema-guide/schema-guide.md) for pieces and widgets, you want to arrange the fields in the modal in a way that supports a logical workflow for editors.

You can use `arrangeFields` to break the schema into multiple tabs in the editor modal. This can be achieved by passing an array of objects, each containing a name, label, and array of fields, to `arrangeFields`:


{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

Any non-`contextual` fields excluded from this configuration will be placed in an additional tab.


## Displaying Pieces

So you created pieces, but you don't have a way to display them on your site yet. For that you'll need to add a second module in `app.js`, this time a widget:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
// other modules, then...
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets'
  }
// etc.
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
`people-widgets` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-widgets` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option.
{% endhint %}

Already this is enough to let us add the new widget to any `apos.area` call in a page template, like your `home.html` or `default.html` template:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/views/default.html" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

Right off the bat, you can click the `+` anywhere in this area to add a people widget, and then decide whether to display all people or just hand-pick a few by entering their names. There's an autocomplete feature to complete names quickly.

**Notice that people have to be published in order to be added to the widget.**

### An important performance warning

Pieces widgets are great, but they are powered by joins, and joins can cause trouble because they load so many things... and the things they load may load other things, like widgets... until your site is slow, or Apostrophe refuses to load more widgets to prevent an infinite loop.

To solve that, you should always add a `projection` filter when configuring a subclass of `apostrophe-pieces-widgets`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/views/default.html" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

This way, only the properties you really need are fetched for the widget. This can greatly speed up your site and prevent mysterious refusals to load any more data if things start joining back to themselves.

{% hint style="info" %}
_"Which properties do I need in my projection?"_ Just those you'll use in your `widget.html` template. However, if you try to guess on your own which properties are needed to populate `_url` correctly, you'll have a tough time. Instead, just say `_url: 1` and Apostrophe will include those for you (`slug`, `type` and `tags`, by default).
{% endhint %}

### Custom templates for widgets

Your widget isn't very satisfying yet. It just displays full names. Let's improve it by creating your own `lib/modules/people-widgets/views/widget.html` file to provide a more detailed display:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/views/widget.html" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
**"Where do those** `piece._url` **links go?"** Nowhere, yet. Read on to learn about `apostrophe-pieces-pages`, which provide a destination for those links.

The `apostrophe-pieces-widgets` module already has a `widget.html` file, but when you extend a widget and provide your own version of an existing template, your version gets rendered instead.

Notice that you can pass your piece to `apos.singleton` the same way you would pass a page. Both are Apostrophe docs, and both live in the `aposDocs` MongoDB collection. However, pages have a `slug` property that starts with a `/`, so they can be viewed at their own URLs. Pieces do not.
{% endhint %}

Widgets are not the only way to display pieces. They are designed for displaying a few people here and there in the context of other pages.

For a really useful directory, you want to create a page that offers a paginated list of people, with the ability to filter by name. You can even create lots of those pages, "locked down" to display people with certain tags.

## Displaying a directory of people on a page with `apostrophe-pieces-pages`

Let's add this new module to your `app.js`. Your new module extends the `apostrophe-pieces-pages` module:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
modules: {
  // ... other modules ...,
  'people-pages': {
    extend: 'apostrophe-pieces-pages'
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
`people-pages` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-pages` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option, and possibly also set the `name` option to a sensible name for the page type that displays an index of pieces. We usually just follow the pattern.
{% endhint %}

This module provides a new type of page on the site, `people-page`. This new page type displays an index of pieces. Before it can be used, you need to configure `apostrophe-pages` to add it to the menu of page types that can be given to pages. In `app.js` it might look like this:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
As with other modules, it's a good idea to create `lib/modules/apostrophe-pages/index.js` and move configuration there to reduce clutter.
{% endhint %}

### Creating custom templates for the index of people

If you add a `People` page now, you'll see a plain-vanilla list of people; clicking the name of each takes you to a page that displays... just their name. Not very exciting. Let's dress it up.

1. First make a folder for your templates:

    ```bash
    mkdir -p lib/modules/people-pages/views
    ```

2. Now create `index.html` in that folder. You can copy what's already in `node_modules/apostrophe/lib/modules/apostrophe-pieces-pages/views/index.html` as a starting point:

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

3.  You probably have a `layout.html` template of your own that you extend in all of your page templates. So you can switch to extending that:

    ```markup
    {% extends "your-project/layout.html" %}
    ```

4. Next, let's dress up the people with their headshots by replacing the existing `for` loop with the following:

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

Your final result should look like this:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/views/index.html" %}
```markup
{% extends "your-project/layout.html" %}
{% block title %}{{ data.page.title }}{% endblock %}

{% block main %}
 {% for piece in data.pieces %}
    <h4>
      {% set image = apos.images.first(piece.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% endif %}
      <a href="{{ piece._url }}">{{ piece.title }}</a>
    </h4>
  {% endfor %}
  {# YES, YOU NEED PAGINATION. You could set the `perPage` option to a large
     number, but eventually you will have performance issues. However, also
     see the discussion of "Load More" and infinite scroll solutions later in this
     tutorial. #}
  {% import 'apostrophe-pager:macros.html' as pager with context %}
  {{ pager.render({ page: data.currentPage, total: data.totalPages }, data.url) }}
{% endblock %}
```
{% endcode-tabs-item %}
{% endcode-tabs %}


Add a little CSS and you've got a nice directory.

{% hint style="info" %}
_We could have used_ `apos.singleton` _to display the thumbnail,_ but sometimes you don't want the extra markup, editing controls, et cetera.

The `apos.images.first` helper can find an image, also known as an "attachment," anywhere in the object you pass to it. You can pass the entire `piece` object if you want to. But, it's slower than than going straight to the thumbnail.

You can also use `apos.images.all` to fetch an array of attachments.

**Never assume the editor remembered to pick a thumbnail.** Always use an `if` statement to check.

**Always specify the size.** Loading a large version of the image for an index view like this just slows down your site. See [adding editable content to pages](../editable-content-on-pages/standard-widgets.md) for more information about image sizes.
{% endhint %}

### Creating custom templates for individual people

Next you want to override the `show.html` template of your subclass of `apostrophe-pieces` as well. The default version is very bare-bones, just enough to demonstrate the idea.

`show.html` is the template that displays just one profile in detail:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/views/show.html" %}
```markup
{% extends "layout.html" %}
{% block title %}{{ data.piece.title }}{% endblock %}

{% block main %}
<h2>{{ data.piece.title }}
{{ apos.singleton(data.piece, 'thumbnail', 'apostrophe-images') }}
</h2>

{{ apos.area(data.piece, 'body') }}
{% endblock %}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
_We didn't pass an options object to_ `apos.area` _or_ `apos.singleton` _because you already specified the options in the_ [_schema_](../../schema-guide/schema-guide.md)_,_ as part of `addFields`. If you _do_ pass an options object to `apos.area` or `apos.singleton`, the original options object passed to the schema is ignored, so be sure to repeat anything that is relevant.
{% endhint %}

**For SEO reasons, it is almost always important to have a good `show.html` page and provide `_url` links to reach it in your index pages, even if you are displaying most of the information in the index pages as well.**

### Contextual pieces: editing pieces "on the page"

Editing each person's "bio" inside the modal dialog box is okay, but it would be a lot nicer to edit it on the actual page. Indeed, you already can... but only if you deliberately head to the page.

You can make this more intuitive by setting the `contextual` flag for your pieces module:


{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
```javascript
module.exports = {
  // Other options, then...
  contextual: true
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

When you do this, _the user is automatically redirected to the_ `show.html` _page for each person as soon as they create and save it._

Note that this only makes sense if you are using `apostrophe-pieces-pages`.

Now that you've made this choice, you might want to switch to calling `apos.singleton` in the page for the profile photo as well.

You can also set `contextual: true` on each of the `body` and `thumbnail` [schema](../../schema-guide/schema-guide.md) fields so that they don't show up in the modal dialog box but are instead only editable on the page. Whether to do that is up to you, but it does help reinforce the idea that you edit this content on the page.

## Disabling a Pieces Index Page

Occasionally you might want pieces that have their own show pages, but you don't need the index page. One case that's come up a few times is that pieces are listed in widgets across the site based on various criteria, but the organization doesn't have need for a central listing.

Even if you don't create an `index.html` in your piece's pages module, one will exist by default anyway, likely looking completely unstyled. Bummer.

For example, let's say you have a `cats` piece type. In my `cats-pages` module (extending `apostrophe-pieces-pages`), my `views` directory has a single `show.html` template file for the cat profile pages. So Oscar the cat can have his page at `example.com/cats/oscar`. If someone decides to try visiting `example.com/cats` you don't want that page to exist, but it will be there, listing cats, probably not looking that great.

The solution is pretty simple! To get `example.com/cats` to return a 404 error (effectively no longer existing), make a small addition to the [`beforeIndex`](/modules/apostrophe-pieces-pages/README.md#beforeindex-req-callback) method.

In `lib/modules/cats-pages/index.js`, add the following to your `construct` method:

{% code-tabs %}
{% code-tabs-item title="lib/modules/cats-pages/index.js" %}
```javascript
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    req.notFound = true;

    return callback(null);
  };
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}


See what we did there? Since `beforeIndex` runs before the index page is loaded, and by setting the request's `notFound` property to `true`, it'll return a 404 error rather than loading the page. This is the case even for site admins, so make sure the `apostrophe-pages` configuration doesn't give admins an option to create those pieces index pages.

You might want to allow site admins to create and access those index pages, though. In that case, do [include it as an option in `apostrophe-pages` configuration](/modules/apostrophe-pages/README.md), and make an adjustment to the `beforeIndex` method:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/index.js" %}
```javascript
construct: function (self, options) {
  self.beforeIndex = function (req, callback) {
    if (!req.data.page._edit) {
      req.notFound = true;
    }

    return callback(null);
  };
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

With the `!req.data.page._edit` conditional you're allowing people with edit permissions to access the pages.



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
    Position: <a href="{{ job._url }}">{{ job.title }}</a>
  </h4>
```

## Filtering the list of people

Before long you'll start wanting to filter this list of people, taking advantage of joins, tags and other field types. Here's how to do that on the public-facing site. Later in this tutorial we'll also talk about how to do it in the "Manage" view.

To make it easier to browse a listing of pieces, the [apostrophe-pieces-pages](/modules/apostrophe-pieces-pages/README.md) module will *automatically permit you to filter by the value of most schema fields when submitted as query string parameters*, provided they are marked for this purpose as you'll see below.

{% hint style="info" %}
You can also use `q` or `search` as a query parameter to do a full-text search. *Tip:* often this is all users want.
{% endhint %}

Next we'll explore how to add a filter by tag. Later, we'll look at filtering by a join as well.

Add this code to `lib/modules/people-pages/index.js`. Note that earlier you added this module to `app.js`, extending `apostrophe-pieces-pages`. Now you need to add some custom configuration:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

Here you're asking `apostrophe-pieces-pages` to automatically populate `req.data.piecesFilters.tags` with an array of choices. And, you're also asking that `tags` be accepted via the query string in the URL (for example, `/people?tags=doctors`).

Now you can take advantage of that:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
```markup
{# Link to all the tags, adding a parameter to the query string #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }}</a></li>
  {% endfor %}
</ul>
```
{% endcode-tabs-item %}
{% endcode-tabs %}


{% hint style="info" %}
**"What's going on in this code?"** On a pieces index page, `data.url` always contains the current URL. We want to add a `tags` parameter to the query string. Apostrophe's `build` filter merges new query parameters with the URL. We can also remove a query parameter by passing the empty string as its value.

Notice that there are separate `value` and `label` properties for each tag, even though they are the same. This pattern is used consistently for all fields we define filters for, including fields like joins or select fields where the value and the label can be quite different. This lets you write a single macro to handle many filters.
{% endhint %}

### Displaying counts for tags

You can display counts for the choices, so users know how many items are available with a given tag.

1. Add the `counts: true;` property to the `piecesFilters` in `index.js`

2. Add `({{ tag.count }})` inside of the `href` tag in `index.html`.


{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.js" %}
```javascript
module.exports = {
  piecesFilters: [
    {
      name: 'tags',
      counts: true
    }
  ]
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
```markup
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }} ({{ tag.count }})</a></li>
  {% endfor %}
</ul>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

### Showing the current state of the filter

Usually you want to indicate the tag the user has already chosen. And, you want a way to remove the filter and to see the full results.

How can we do that? Again, in `index.html`:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
**"What's going on in this code?"** The current query string is automatically unpacked to `data.query` for you as an object. So just compare `data.query.tags` to the value of each of the choices.

We add a `current` CSS class to the link to remove the current filter. It's up to you to style that; for instance, you might use an `::after` pseudo-element to add an "x."
{% endhint %}

### Filtering on joins and other schema field types

Tags are the simplest example, but you can filter on most schema field types, notably including [`select`](../../schema-guide/schema-guide.md#select) fields and [`joinByOne`](/tutorials/schema-guide/schema-guide.md#joinByOne) or [`joinByArray`](/tutorials/schema-guide/schema-guide.md#joinByArray) fields.

Add a filter on the `_jobs` schema field we saw earlier:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.js" %}
```javascript
module.exports = {
  piecesFilters: [
    {
      name: 'jobs'
    }
  ]
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
"Why is the filter named `jobs`, even though the field is named `_jobs`?" It works like this: if we specify `_jobs` for the filter, then the value in the query string will be the `_id` property of the job. This works, and it is stable no matter what gets edited later. But it isn't pretty. If we remove the `_` from the filter name, the value in the query string will be the *slug* of the job, which is more user-friendly and good for SEO.

However, keep in mind that if you change the slug someone's bookmarked links might break. So it's up to you whether to use `_jobs` (for the `_id`) or `jobs` (for the `slug`).
{% endhint %}

Now you can filter people by job:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
```markup
{# Link to all the tags, adding a parameter to the query string #}
<ul class="job-filters">
  {% for job in data.piecesFilters.jobs %}
    <li><a href="{{ data.url | build({ jobs: job.value }) }}">{{ job.label }}</a></li>
  {% endfor %}
</ul>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

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

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
```markup
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
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="info" %}
**"What's going on in this code?"** Like before, we are using the `build` filter to add and remove query parameters. However, this time, we are using the special `$pull` operator to remove a job from the array without removing the others, and using the special `$addToSet` operator to add a job to the array. In this way, we can manage filter URLs like `/people?jobs[]=doctor&jobs[]=technician` with very little effort.
{% endhint %}

Pieces are very powerful and have a lot of depth, for more pieces topics and code samples, see the [Advanced Pieces section](/tutorials/advanced-development/advanced-pieces-topics/README.md).
