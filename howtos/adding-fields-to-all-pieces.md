Apostrophe's schemas are a powerful way to add fields to any type of piece or page. But sometimes you'll have a field you want to add to every type of piece. Here's how to do that.

## Adding a field to all pieces

As explained in the tutorials, the [apostrophe-pieces](../reference/apostrophe-pieces/index.html) module is a great way to create reusable content that appears all over the site — both on [apostrophe-pieces-pages](../reference/apostrophe-pieces-pages/index.html) and in [apostrophe-pieces-widgets](../reference/apostrophe-pieces-widgets/index.html).

We've seen how we can add fields to these by using the `addFields` option when configuring each module. But sometimes we want to add a field to `every` type of piece. We can do that by configuring the `apostrophe-pieces` module itself.

*Any configuration we set for `apostrophe-pieces` becomes part of the configuration for all of the modules that extend it.*

Our first idea might be to do this in `app.js`:

```javascript
// THIS WON'T WORK

modules: {
  'apostrophe-pieces': {
    addFields: [
      {
        type: 'string',
        name: 'author',
        label: 'Author'
      }
    ]
  }
}
```

**This won't quite work.** The reason is that the `addFields` option set for each subclass overrides it.

Instead, we'll write a `beforeConstruct` function in `lib/modules/apostrophe-pieces/index.js`. The great thing about `beforeConstruct` is that it is *called for the subclasses first*. That means that by the time it is called for us, *all the fields for the subclass are already in `addFields`*. We can simply prepend our own:

```javascript
// THIS WILL WORK!

// lib/modules/apostrophe-pieces/index.js in your project

module.exports = {

  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        type: 'string',
        name: 'author',
        label: 'Author'
      }
    ].concat(options.addFields || [])
  }
}
```

### Making exceptions

If one of your subclasses of pieces doesn't need the `author` field, just use the `removeFields` option in that module.

