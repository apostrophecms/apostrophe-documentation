# Reusable content with pieces

When you create content with the rich text editor, or images widget, that content is only displayable on the page where it is created. That will work for some cases, but often you need more powerful tools to create different types of content that can be reused in different ways across your site.

## Creating a directory of people with "pieces"

Let's say you want to create a directory of people who work for a company.
"People" are a general type of content. They are useful to display in multiple
places all over the site and they aren't limited to one page. The
`apostrophe-pieces` module provides a great starting point to create many such
content types. You'll extend it to make your own `people` module. You can extend
`apostrophe-pieces` many times in the same project.

::: tip
You can use the [Apostrophe CLI](/docs/getting-started/apostrophe-cli.md). To
generate the initial pieces module structure. You could skip a few steps below
if you have it installed by running `apos create-piece person` (see the note in
the link above about pluralization). The following information is still worth
reviewing to understand what this does for you.
:::

1. Create a `lib/modules/people/index.js` file:

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

::: tip NOTE
**IMPORTANT: note the** `name` **property. This identifies ONE piece in the database, so it is always singular.** Remember: Modules Are Plural (MAP), but the things they manage may not be.
:::

2. Now turn the module on in `app.js`.

```javascript
modules: {
  // other modules ...
  'people': {}
}
```

::: tip NOTE
When code examples show sections like the `modules` section in `app.js` we're only going to show you the relevant portion that you're currently working on. In many cases you'll have a lot more in those sections, but we don't need to replicate that every time.
:::

Just like that, you'll see a new "People" menu in the admin bar when you log into the site. Pick "New Person" and you'll find that you can give each person a full name, a first name, a last name and a phone number. Pick "Manage Person" to examine and edit existing people.

::: tip
You could have configured the module entirely in `app.js`. But that leads to giant `app.js` files, so we don't recommend it. However, some developers feel it's a good place for high-level properties like `extend` that help give you a quick overview of what the module is and does.
:::

There are certain additional fields that you get by default with every piece, such as `title` \(the full name of the piece\), `slug` \(used when the piece appears as part of a URL\), and `published` \(which determines whether the public can see the piece, as you'll see below\). But in this case, you re-declared `title` in order to change its label to `Full Name` so that the "New Person" form is not confusing.

You can even add a profile photo, via the `thumbnail` field. This field has the `singleton` type, which allows you to include a widget in the [schema](/advanced-topics/schema-guide.md) for this type of piece, exactly as if you were calling `apos.singleton` in a template. You just need to specify the `widgetType` and pass any desired options to the widget via the `options` property. You can also add fields of the `area` type.

And, there's a "biography" section. This is a full-blown content area in which the editor can add rich text and images. _There's nothing to stop us from allowing more controls and widgets here. Limiting the choices just helps keep things from getting out of hand._

### Customizing the model layer: setting the `title` automatically

Right now, the `title` property \(which is always the full name of the piece\) is independent of `firstName` and `lastName`. In this example, it makes more sense for the `title` to be generated automatically from `firstName` and `lastName`.

To do this, add this `beforeSave` method in `lib/modules/people/index.js`:

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

::: tip
Methods are always added to the module in the `construct` function, which takes the module object, `self`, as its first argument. You attach methods directly to `self`. The use of `self` rather than `this` ensures that methods can make asynchronous calls and be passed as callbacks themselves without any confusion about the value of `this`. For more information about object-oriented functional programming in Apostrophe, check out [moog](https://www.npmjs.com/package/moog) and [moog-require](https://www.npmjs.com/package/moog-require).
:::

#### Using Contextual Fields to Simplify the Form

When you do this, there is still a separate prompt to enter the full name. Remove that by adding the `contextual` option to the `title` field, which keeps that field out of the modal:

```javascript
  // In the`addFields` array
  {
    name: 'title',
    label: 'Full Name',
    type: 'string',
    required: true,
    contextual: true
  }
]
```

::: tip
There are many other methods you can override or extend to change the behavior of pieces. See [the apostrophe-pieces API methods](/reference/modules/apostrophe-pieces/README.md) for more information.
:::

### Arranging fields

As you create increasingly complex [schemas](/advanced-topics/schema-guide.md) for pieces and widgets, you want to arrange the fields in the modal in a way that supports a logical workflow for editors.

You can use `arrangeFields` to break the schema into multiple tabs in the editor modal. This can be achieved by passing an array of objects, each containing a name, label, and array of fields, to `arrangeFields`:


```javascript
// lib/modules/people/index.js
module.exports = {
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
  // ...
}
```

Any non-`contextual` fields excluded from this configuration will be placed in an additional tab.
