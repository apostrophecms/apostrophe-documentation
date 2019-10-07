---
title: Reusable content with pieces
layout: tutorial
---

# Reusable content with pieces

We've already learned how to add editable content to pages, and how to create some new types of editable content. But sometimes we want to reuse the same content all over the site. For a job like that, widgets in pages aren't the right answer, because a page lives in one place on the site.

## A directory of people: working with pieces

Let's say we want to create a directory of people who work for a company. People are "global content": they are useful to display here and there all over the site, they aren't tied down to one page. The `apostrophe-pieces` module provides a great starting point to create many types of global content. We'll extend it to make our own `people` module. You can extend `apostrophe-pieces` many times in the same project.

{% hint style="info" %}
**"What about users?"** Yes, you already have a "Users" menu on your admin bar. And yes, users are powered by pieces. But we've found that confusing website editors with the publicly visible staff directory tends to cause problems in the long run. Plus, this way, it's a teachable moment. :\)
{% endhint %}

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

{% hint style="info" %}
**IMPORTANT: note the** `name` **property. This identifies ONE piece in the database, so it is always singular.** Remember: Modules Are Plural \(MAP\), but the things they manage may not be.
{% endhint %}

Now let's turn the module on in `app.js`. _From now on, we'll show_ `modules` _with just the modules we're adding. Of course you will have other modules in your_ `app.js` _file as well._

```javascript
modules: {
  // ... other modules ...,
  'people': {}
}
```

Just like that, you'll see a new "People" menu in the admin bar when you log into the site. Pick "New Person" and you'll find that you can give each person a full name, a first name, a last name and a phone number. Pick "Manage Person" to examine and edit existing people.

{% hint style="info" %}
We could have configured the module entirely in `app.js`. But that leads to giant `app.js` files, so we don't recommend it. However, some developers feel it's a good place for high-level properties like `extend` that help give you a quick overview of what the module is and does.
{% endhint %}

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

{% hint style="info" %}
Methods are always added to the module in the `construct` function, which takes the module object, `self`, as its first argument. We attach methods directly to `self`. The use of `self` rather than `this` ensures that methods can make asynchronous calls and be passed as callbacks themselves without any confusion about the value of `this`. For more information about object-oriented functional programming in Apostrophe, check out [moog](https://www.npmjs.com/package/moog) and [moog-require](https://www.npmjs.com/package/moog-require).
{% endhint %}

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

{% hint style="info" %}
There are many other methods you can override or extend to change the behavior of pieces. See [the apostrophe-pieces API methods](../../modules/apostrophe-pieces/README.md) for more information.
{% endhint %}

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

