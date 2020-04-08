---
title: "Adding new batch operations for pieces"
layout: tutorial
---

Apostrophe includes several handy batch operations on multiple pieces, such as "trash," "rescue from trash," "publish," "unpublish," "tag" and "remove tag." But sometimes you'll want a batch feature of your own.

Adding a custom batch action is not hard. For simplicity, let's pretend that the `publish` batch operation doesn't already exist, and we want to add it.

## Server side steps

### The `addBatchOperations` option

Set the addBatchOperations option, either for all `apostrophe-pieces` or for a specific subclass of pieces. Decide now, and follow the instructions below accordingly. These examples assume you want to do it for all kinds of pieces.

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/index.js" %}
```javascript
module.exports = {
  addBatchOperations: [
    {
      name: 'publish',
      label: 'Publish',
      // If the user's current filter only shows published stuff,
      // don't offer this operation
      unlessFilter: { 
        published: true
      },
      // If the schema is missing this field, don't offer this operation
      requiredField: 'publish'
    }
  ]
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

> The `requiredField` option makes sure the `publish` field hasn't been removed from the schema altogether for this type of piece. It has nothing to do with requiring the user to do something.
> The `unlessFilter` option removes this batch operation when a particular filter in the manage view has a particular value. Apostrophe's boolean filters can be `true`, `false` or `null` (not filtering right now).

### The `publish` route

Next, add a route with the same name for your pieces module. (Remember, Apostrophe can already publish things, but we're demonstrating how to create that feature from scratch.)

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/index.js" %}
```javascript
module.exports = {

  addBatchOperations: [
    ... See above ...
  ],

  construct: function(self, options) {
    // also inside `construct`
    self.route('post', 'publish', function(req, res) {
      return self.batchSimpleRoute(req, 'publish', function(req, piece, data, callback) {
        piece.published = true;
        return self.update(req, piece, callback);
      });
    });
  }
```
{% endcode-tabs-item %}
{% endcode-tabs %}

This little callback does the actual work on the piece:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/index.js" %}
```javascript
function(req, piece, callback) {
  piece.published = true;
  return self.update(req, piece, callback);
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

What you do inside that callback is up to you. In this example we publish the piece.

`batchSimpleRoute` takes care of everything else. You can pass the request, the name of the batch operation and the callback.

{% hint style='info' %}
Alternatively, you can write your own route from scratch. You'll receive the selected piece IDs via `req.body.ids`. However, keep in mind that if you try to get clever and use MongoDB `{ multi: true }` operations, Apostrophe won't know to call `docBeforeUpdate`, `docAfterSave` or any similar methods.
{% endhint %}


## Browser side steps

### Adding the `batchPublish` method to the manager modal

Let's add a method to `apostrophe-pieces-manager-modal`, the modal dialog type that gets created when we manage pieces:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/public/js/manager-modal.js" %}
```javascript
apos.define('apostrophe-pieces-manager-modal', {
  construct: function(self, options) {
    self.batchPublish = function() {
      return self.batchSimple(
        'publish',
        "Are you sure you want to publish " + self.choices.length + " items?",
        {}
      );
    };
  }
});
```
{% endcode-tabs-item %}
{% endcode-tabs %}

`batchSimple` invokes the `publish` route for you, locks the UI, displays errors, and so on. You shouldn't need to bypass it, but if you really want to, check out the `batchSimple` source code as a starting point.

> By implicitly subclassing `apostrophe-pieces-manager-modal` at the project level, we are adding this feature for *all* types of pieces. You could also do this work in the folder for a specific subclass of pieces, in which case you would define `your-module-name-manager-modal` instead. If you do that, make sure you also follow all the server-side steps in the specific module you want, not `apostrophe-pieces`.

Boom! That's it: we now have a batch operation for publishing things. (OK, we already did, but now you know how to do something similar.)

## Batch operations with forms

Sometimes you'll want to implement a batch operation that needs input from the user. For that, you can use a simple form powered by Apostrophe's schemas.

Here's how the `tag` batch operation could be implemented, if we didn't already have it:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/index.js" %}
```javascript
  addBatchOperations: [
    {
      name: 'tag',
      label: 'Add Tag to',
      buttonLabel: 'Add Tag',
      requiredField: 'tags',
      schema: [
        {
          type: 'tags',
          name: 'tags',
          label: 'Tag',
          required: true
        }
      ]
    }
  ]
```
{% endcode-tabs-item %}
{% endcode-tabs %}

> The schema seen here powers the form that appears when you select "add tag" from the batch operation dropdown menu.

Our module also needs a route to implement the operation on the back end:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/index.js" %}
```javascript
  // Inside construct, add this route
  self.route('post', 'tag', function(req, res) {
    return self.batchSimpleRoute(req, 'tag', function(req, piece, data, callback) {
      if (!piece.tags) {
        piece.tags = [];
      }
      piece.tags = _.uniq(piece.tags.concat(data.tags));
      return self.update(req, piece, callback);
    });
  });
```
{% endcode-tabs-item %}
{% endcode-tabs %}

On the browser side it's still trivial. Apostrophe's schemas do the hard work of helping the user pick a tag, and `batchSimple` delivers that information to the server for us along with the ids of the pieces.

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pieces/public/js/user.js" %}
```javascript
apos.define('apostrophe-pieces-manager-modal', {
  construct: function(self, options) {
    self.batchTag = function() {
      return self.batchSimple(
        'tag',
        "Are you sure you want to tag " + self.choices.length + " items?",
        {}
      );
    };
  }
});
```
{% endcode-tabs-item %}
{% endcode-tabs %}

And that's it! Apostrophe's support for custom batch operations makes it much esier to help your users cope with large editing jobs.

