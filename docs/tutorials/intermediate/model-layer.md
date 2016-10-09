---
title: "Apostrophe's model layer: working with the database"
layout: tutorial
---

Apostrophe provides a model layer (database layer) that gives you convenient ways to read and write docs programmatically, taking advantage of the same features that underpin modules like [apostrophe-pieces](../../modules/apostrophe-pieces/index.html). Using these features where possible ensures that permissions are respected, widgets are loaded, joins are fetched, versions are recorded for rollback... so many good things.

That being said, you can also [access the database directly](accessing-the-database-directly.html) and there's a time and place for that too, most frequently when you must use `$set`, `$inc`, `$unset`, `$push`, `$pull` or `$addToSet` and you are confident you've already determined the user should be allowed to do something. See [accessing the database directly](accessing-the-database-directly.html) for more information.

## Fetching pieces with Apostrophe

Modules that extend [apostrophe-pieces](../../modules/apostrophe-pieces/index.html) have a `find()` method which returns an [Apostrophe cursor](cursors.html) you can use to fetch documents with the benefit of support for Apostrophe's joins and other cursor filters. And **permissions are always taken into account,** so that logged-out users can't see what they shouldn't.

For instance, in a subclass of `apostrophe-pieces` you might write:

```javascript
return self.find(req, {
    age: {
      $gte: 50
    }
  })
  .search('blue')
  .toArray(function(err, pieces) {
    // use your pieces here
  });
```

That code will fetch only pieces this particular user is allowed to see, and also take into account your custom mongodb criteria object and a full-text search for the word `blue`, sorting the results by how well they match that search.

## Updating pieces

You can also update a piece fetched in this way, again taking permissions into account:

```javascript
piece.age = 60;
// Only succeeds if this user has the right to update this piece
return self.update(req, piece, callback);
```

There is an `insert` method as well, taking the same arguments. The new piece should be created with `newInstance`:

```javascript
var piece = self.newInstance();
piece.title = 'So great!';
return self.insert(req, piece, callback);
```

*This will only succeed if the current user should be allowed to create pieces of this type, based on the permissions of the groups they are a member of.*

`self.update` and `self.insert` also call `self.beforeUpdate` and `self.beforeInsert`, as well as `self.beforeSave` (called by both), which provides an easy way to add extra behavior on every save operation.

### Properties with a leading `_` are special

One important rule: any property with a leading `_`, except for `_id`, will **not be saved to the database**.

Apostrophe reserves properties starting with `_` for dynamically loaded information, such a the results of a join, or the `._url` property. These properties can change at any time and duplicate information stored elsewhere in the database. Storing them back to the database would just cause confusion and waste space.

### Working with projections

You can limit the amount of data returned just like you would with MongoDB: using the second argument.

```javascript
return self.find(req, { age: { $gte: 50 }}, { title: 1, tags: 1 })
  .search('blue')
  .toArray(function(err, pieces) { ... })
```

This projection restricts the results to the `title` and `tags` properties only. Including `tags` is a good idea if you want the `._url` property of each piece to automatically be populated, taking into account the best match with an existing pieces-page on the site (i.e. a blog that is configured to show documents with those tags).

Working with projections is great for performance. However, **do not use projections if you plan to save the doc back to the database.** You will lose information permanently. Use them for read-only operations only.

You can also set the projection with the chainable `.projection({...})` filter method.

### Fetching pieces from a different module

If your code is in a different module, then `self.find` won't be the right method. Instead, ask the `apostrophe-docs` module to give you the right module to talk to:

```javascript
return self.apos.docs.getManager('candy').find(...)
```

If there's a subclass of pieces with its `name` option set to `candy`, then this call will return it. (*Note:* this is not the same thing as the name of the module. It is the name, usually singular, of one individual piece in the database, as found in the `type` property of each piece.)

Working with the right manager in this way ensures you get the benefit of any extra behavior that may be built into cursors, `insert` and `update` for this particular type.

### More about cursors

As you may have noticed, Apostrophe's cursors — the objects returned by `find()` — are pretty great. The next tutorial is [all about cursors](cursors.html) and how you can extend them with new "filters" (i.e. chainable methods).

## Working with pages

`apos.pages` has a `find` method too. It's very similar, but the cursors that it returns support some very useful chainable filter methods specific to pages, like `ancestors(true)` and `children(true)`, which attach an array of `_ancestors` and an array of `_children` to each page retrieved.

```javascript
return self.apos.pages.find(req, { slug: '/about' })
  .ancestors(true)
  .children(true)
  .toArray(function(err, pages) {
    // Each page in `pages` has `._ancestors` and `._children` properties
  });
```

You can even pass an object to each of these filters, in which case it is used to invoke filters on the cursor used to get the ancestors or children.

`apos.pages` also provides an `insert` method, which takes additional arguments to add the page to the page tree:

```javascript
var child = apos.pages.newChild(parentPage);
child.title = 'something nifty';
return apos.pages.insert(req, parentPage, newPage, function(err) { ... }
```

You should fetch the parent of the page first, to pass as `parentPage`.

## Fetching mixed doc types

Sometimes we're interested in many types of docs, both pieces and pages. We still want Apostrophe's permissions features, but we don't want to be locked down to one type of piece, or to just pages. The [apostrophe-search](../../modules/apostrophe-search/index.html) module is a good example.

Fetching mixed doc types works like this:

```javascript
return self.apos.docs.find(req)
  .search('blue')
  .toArray(function(err, docs) {
    ...
  }
);
```

When you find docs in this way, you'll get a surprising amount of information that is specific to each doc type, including joins and `._url` properties when appropriate. Just keep in mind that some doc types have additional filters available only when you call the `find()` method for the appropriate module, which you can always obtain via `getManager()` as seen earlier.

*The `docs` module also has `insert` and `update` methods. These work just like the `insert` and `update` methods of pieces, but they won't invoke the `beforeInsert`, etc. methods of pieces. So use the method of the appropriate module unless you're bypassing this intentionally.*

## `skip`, `limit`, `page` and `perPage`: paginating results

If you just call `toArray`, you can get a lot of data. A *lot*. Especially if there are thousands of, for instance, blog posts. Fetching it all every time is not scalable.

You can use `skip` and `limit` like you would with raw MongoDB:

```javascript
return self.find(req)
  .skip(100)
  .limit(10)
  .toArray(
    function(err, pages) {
      // Use your pages here ...
    }
  );
```

And you can use `toCount` to figure out how many documents there are in total:

```javascript
return self.find(req).toCount(function(err, count) { ... })
```

But, consider using the built-in `perPage` and `page` filters, which are simpler:

```javascript
return self.find(req).perPage(10).page(11).toArray(function(err, pages) { ... })
```

*Tip: the [apostrophe-pieces-pages](../../modules/apostrophe-pieces-pages/index.html) module uses all this stuff already, and it's pretty easy to follow. Check out the source code. And consider whether you should just be using it to display your pieces. It's pretty flexible and extensible.*

## Adding special behavior when a piece is saved

To change Apostrophe's behavior when a particular type of piece is saved, just override the `beforeSave` method in your code for that module:

```javascript
var superBeforeSave = self.beforeSave;
self.beforeSave = function(req, piece, callback) {
  piece.title = piece.firstName + ' ' + piece.lastName;
  return superBeforeSave(req, piece, callback);
};
```

This works for all insert and update operations that go through the module's `insert` and `update` operations, which includes all of the normal UI for editing pieces.

*Here I'm invoking the original, "super" or "parent" version of the method after my own, to make sure I don't lose any existing useful `beforeSave` behavior.*

## Adding special behavior when *anything* is saved

You can also extend Apostrophe's behavior for saving all types of docs. This is really useful if you're implementing something like a custom search engine.

A custom search engine module might have an `index.js` file a little like this:

```javascript

var coolSearch = require('made-up-search-engine');

module.exports = {
  construct: function(self, options) {
    self.docBeforeSave = function(req, doc, callback) {
      return coolSearch.addToIndex(doc.title, callback);
    };
  }
};
```

Here's the magic: *Apostrophe will call `docBeforeSave` for every module that has one.*

Note that the callback is optional. If your `docBeforeSave` handler doesn't need to do anything async, it can declare just `req, doc` as parameters.

**Performance warning:** `docBeforeSave` handlers should be as fast as possible. Always begin by asking, "is this doc any of my business?" Usually a peek at `doc.type` tells you. If the answer is no... just invoke the callback and return immediately!

