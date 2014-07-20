---
title: "Creating Your Own Content Types: Subclassing Snippets (The Basics)"
---

It's possible to create your own content types based on snippets. This has many advantages. All of the tools to manage snippets have already been built for you and are easily extended without code duplication to accommodate new content. The snippets module also implements an Apostrophe page loader function for you, ready to display "index pages" and "show pages" out of the box. And of course a widget for reusing snippets anywhere on the site is built in. All of this functionality is easily obtained for your new content type as well.

Absolutely nothing is preventing you from implementing your own page loader functions and your own admin tools for managing content, and sometimes this may be desirable. But in most cases subclassing snippets is the right way to go.

Subclasses of snippets can extend their behavior on both the server side and the browser side. Most of the job can be done simply through configuration in `app.js`, but you may need to extend the code on the server side as well to add custom features. And extra browser-side code is also desirable at times. We'll see below how to do both.

The `apostrophe-blog`, `apostrophe-events` and `apostrophe-map` modules are all simple subclasses of `apostrophe-snippets` and they make good examples if you wish to learn how to package your work as an npm module for the benefit of the community.

### Configuring New Content Types

You can create a new content type just by configuring it in `app.js` along with other modules. Let's invent a new content type called "stories":

```javascript
modules: {
  ... other modules ...
  'stories': {
    extend: 'apostrophe-snippets',
    name: 'stories',
    label: 'Stories',
    instance: 'story',
    instanceLabel: 'Story',
    addFields: [
      {
        name: 'year',
        type: 'integer',
        label: 'Year',
        def: '2013'
      },
      {
        name: 'publisher',
        type: 'string',
        label: 'Publisher',
      }
    ]
  }
}
```

The `extend` property tells Apostrophe what module you're subclassing. You can subclass `apostrophe-blog` or `apostrophe-events` instead if they are closer to what you need.

The `instance` property is a singular word for one item - one story, in this case. `name` is a name for data type as a whole and is usually plural (like "snippets" or "events" or "blog"). `label` and `instanceLabel` are publicly visible versions of these and should be capitalized.

`addFields` allows us to add new fields to our content type. We'll examine it in more detail below.

**You must also create `lib/modules/stories` in your project.** Soon we'll add custom templates there, but it must exist even before you do that.

**Edit `outerLayout.html`** and add a line to insert the menu for managing stories:

```jinja2
  {{ aposStoryMenu({ edit: permissions.admin }) }}
```

And... that's actually enough to get started! With just this much code, you can already create, edit and manage stories, including the custom fields `year` and `publisher`. All the plumbing is automatic. Nice, yes?

### Custom Templates

Your code automatically inherits its templates from the snippets module. But the bare-bones templates we supply for the `index` and `show` views of snippets are not very exciting. So, create your own! Just copy those templates to `lib/modules/stories/views/index.html` and `lib/modules/stories/views/show.html` and modify them as you see fit.

We recommend creating your own, additional `storyMacros.html` file and including it in your templates. *Don't override snippetMacros.html in your module*. We frequently improve that file and you don't want to lose access to those improvements.

### Adding New Properties To Your Snippets Using the Schema

*There is a very easy way to do this.* Snippets now support a simple JSON format for creating a schema of fields. Both the browser side and the server side understand this, so all you have to do is add them to the dialogs as described below and set up the schema. You can still do it the hard way, however, if you need custom behavior.

Here is a super-simple example of a project-level subclass of the people module (itself a subclass of snippets) that adds new fields painlessly. Here I assume you are using `apostrophe-site` to configure your site (you should be).

```javascript
... Configuring other modules ...
'apostrophe-people': {
  addFields: [
    {
      name: 'workPhone',
      type: 'string',
      label: 'Work Phone'
    },
    {
      name: 'workFax',
      type: 'string',
      label: 'Work Fax'
    },
    {
      name: 'department',
      type: 'string',
      label: 'Department'
    },
    {
      name: 'isRetired',
      type: 'boolean',
      label: 'Is Retired'
    },
    {
      name: 'isGraduate',
      type: 'boolean',
      label: 'Is Graduate'
    },
    {
      name: 'classOf',
      type: 'string',
      label: 'Class Of'
    },
    {
      name: 'location',
      type: 'string',
      label: 'Location'
    }
  ]
}, ... more modules ...
```

### What Field Types Are Available?

Currently:

`string`, `boolean`, `integer`, `float`, `select`, `checkboxes`, `url`, `date`, `time`, `slug`, `tags`, `password`, `area`, `singleton`

Except for `area`, all of these types accept a `def` option which provides a default value if the field's value is not specified.

The `string` type accepts the `textarea` option, which causes the input to appear as a textarea in the new and edit menus when set to `true`.

The `integer` and `float` types also accept `min` and `max` options and automatically clamp values to stay in that range.

The `select` and `checkboxes` types accept a `choices` option which should contain an array of objects with `value` and `label` properties. An optional `showFields` property in each choice object is an array of field names you wish to toggle on when this choice is selected (they are hidden when the choice is not selected). See [conditional fields](#conditional-fields) for more info.

The `date` type pops up a jQuery UI datepicker when clicked on, and the `time` type tolerates many different ways of entering the time, like "1pm" or "1:00pm" and "13:00".

The `url` field type is tolerant of mistakes like leaving off `http:`.

The `password` field type stores a salted hash of the password via `apos.hashPassword` which can be checked later with the `password-hash` module. If the user enters nothing the existing password is not updated.

When using the `area` and `singleton` types, you may include an `options` property which will be passed to that area or singleton exactly as if you were passing it to `aposArea` or `aposSingleton`.

When using the `singleton` type, you must always specify `widgetType` to indicate what type of widget should appear.

Joins are also supported as described below.

### Removing Fields

Two fields come standard with snippets: `thumbnail` and `body`. `thumbnail` is a singleton with widget type `slideshow`, and `body` is an area.

If either of these is of no use to you, just remove it:

```javascript
'my-own-thing': {
  removeFields: [ 'thumbnail', 'body' ]
}
```

### Changing the Order of Fields

When adding fields, you can specify where you want them to appear relative to existing fields via the `before`, `after`, `start` and `end` options:

```javascript
addFields: [
  {
    name: 'favoriteCookie',
    type: 'string',
    label: 'Favorite Cookie',
    after: 'title'
  }
]
```

Any additional fields after `favoriteCookie` will be inserted with it, following the title field.

Use the `before` option instead of `after` to cause a field to appear before another field.

Use `start: true` to cause a field to appear at the top.

Use `start: end` to cause a field to appear at the end.

If this is not enough, you can explicitly change the order of the fields with `orderFields`:

```javascript
'apostrophe-people': {
  orderFields: [ 'year', 'specialness' ]
}
```

Any fields you do not specify will appear in the original order, after the last field you do specify (use `removeFields` if you want a field to go away).

### <a name="conditional-fields"></a>Making Fields Conditional

You can use a `select` field to create sets of conditional fields in your snippet. For example, if you have a type `select` field which requires different sets of fields depending on what type of your snippet class you are creating (e.g. eventType `select` for different kinds of events), or if you want to add additional fields only if a snippet `select` field is a certain value. 

Keep in mind if your sets of fields are very different, they should be two different subclasses of snippets, not conditional fields. This is more to create different sets of options for the same snippet subclass.

To make fields conditional, all you need to do is add them to the `showFields` property of a choice array on a `select` field.

```javascript
'apostrophe-events': {
  addFields: [
    {
      name: 'host',
      label: 'Host',
      type: 'string'
    },
    {
      name: 'dj',
      label: 'DJ',
      type: 'string'
    },
    {
      name: 'bands',
      label: 'Bands Playing',
      type: 'string'
    },
    {
      name: 'eventType',
      label: 'Event Type',
      type: 'select',
      choices: [
        {
          value: 'party',
          label: 'Party',
          showFields: ['host', 'dj']
        },
        {
          value: 'concert',
          label: 'Concert',
          showFields: ['bands']
        }
      ]
    }
  ]
}
```

This will toggle between showing the party fields (host and dj) and the concert fields (bands) depending on the value of the eventType `select` field. You can also specify `showFields` in only one of the choices to show those fields only when that choice is selected, and hide them otherwise.

It's recommended to keep any fields that are included in a `showFields` array `req: false`, as conditional requirements is not yet supported, and this feature only affects the display of the fields.

Additionally, this feature works not just on snippets, but anything that uses [apostrophe-schemas](http://github.com/punkave/apostrophe-schemas) to display a form.

### Altering Fields: The Easy Way

It's easy to replace a field that already exists, such as the "body" field, for instance in order to change its type. Just pass it to `addFields` with the same name as the existing field:

```javascript
'my-own-thing': {
  addFields: [
    {
      name: 'body',
      type: 'string',
      label: 'Body'
    }
  ]
}
```

#### Altering Fields: The Hard Way

There is also an `alterFields` option available. This must be a function which receives the fields array as its argument and modifies it. Most of the time you will not need this option; see `removeFields`, `addFields` and `orderFields`. It is mostly useful if you want to make one small change to a field that is already rather complicated. Note you must modify the existing array of fields in place.

### Adding Properties to the New and Edit Dialogs

This is not your problem! The latest versions of the `new.html` and `edit.html` templates invoke `snippetAllFields`, a macro which outputs all of the fields in your schema, in order.

However, if you want to, or you need to because you are implementing extra fields without using the schema, then you can copy `new.html` to `lib/modules/modulename/views/new.html`. Since your template starts by extending the `newBase.html` template, you can be selective and just override the `insideForm` block to do something a little different with the fields, but not rewrite the entire template:

```jinja2
{% block insideForm %}
{{ snippetAllFields(fields, { before: 'shoeSize' }) }}
<p>Here comes the shoe size kids!</p>
{{ snippetText('shoeSize', 'Shoe Size') }}
<p>Wasn't that great?</p>
{{ snippetAllFields(fields, { from: 'shoeSize' }) }}
{% endblock %}
```

See `snippetMacros.html` for all the macros available to render different types of fields.

This example code outputs most of the fields in a long schema, then outputs one field directly, then outputs the rest of the fields.

In addition to `before` and `from`, you may also use `after` and `to`. `before` and `after` are exclusive, while `from` and `to` are inclusive. Combining `before` and `from` let us wrap something around a specific field without messing up other fields or even having to know what they are.

Of course you can also override `new.html` completely from scratch, provided you produce markup with the same data attributes and field names.

You usually won't need to touch `edit.html` because it gracefully extends whatever you do in `new.html`.

Note that the name of each property must match the name you gave it in the schema. weLikeMongoDb, soPleaseUseIntercap, not-hyphens_or_underscores.

Note that you do not need to supply any arguments that can be inferred from the schema, such as the `choices` list for a `select` property, or the widget type of a singleton. The real initialization work happens in browser-side JavaScript powered by the schema.

#### Search and Schema Fields

By default, all schema fields of type `string`, `select`, `area` and (in certain cases) `singleton` are included in the search index. You can shut this off by setting the `search` option to `false` for a particular field. You can also reduce the search index weight of the field by setting `weight` to a lower value. The built-in search engine prioritizes results with a weight greater than `10` over "plain old rich text." By default the weight for schema fields is `15`.

Actually displaying your field as part of the summary shown when a snippet qualifies as a search result is usually not desirable, so by default this is not done. However you can include it in the summary text by setting the `silent` option to `false`.

### Custom Field Types

You can define custom field types to be included in schemas. For this advanced topic, see the [apostrophe-schemas](http://github.com/punkave/apostrophe-schemas) documentation. The `apostrophe-snippets` module is based upon `apostrophe-schemas`, so everything that can be done there is also supported with snippets.
