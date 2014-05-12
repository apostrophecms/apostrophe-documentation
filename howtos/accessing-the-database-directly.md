---
title: Accessing the database directly
---

## Working with your own collections

Sometimes you'll want to work with your own MongoDB collections.

You can do that by accessing the `db` property of the `apos` object. Here's a simple example of obtaining a reference to a collection called `candies`:

```javascript
return apos.db.collection('candies', function(err, collection) {
  if (err) {
    // Well, darn.
    return callback(err);
  }
  self.candies = collection;
  return callback(null);
});
```

For more information, [see the mongodb-native module documentation](http://mongodb.github.io/node-mongodb-native/).

## Working with Apostrophe's collections

Most of the time, you don't need to work with Apostrophe's collections directly. To store a page you should be using `apos.putPage`. To fetch pages you should be using `apos.get`, or relying on the mechanisms that automatically fetch descendants and ancestors of the current page. To fetch snippets of a particular type you should be using the `get` methods of those modules. And so on.

These mechanisms ensure that the user's permissions are checked, perform joins, load the rest of the data associated with slideshows and other widgets and do other things it's tedious to do on your own.

However, once in a while you may want access to the `aposPages` collection object itself. And that's easy to get.

Just ask yourself: "do I care about permissions here? Or do I already know the user has the right to do this? Is there a performance concern, like updating 500 objects, that warrants writing a little Mongo code of my own?"

Here's a simple example. Let's turn all the purple pages blue:

```javascript
return apos.pages.update(
  { color: 'purple' },
  { $set: { color: 'blue' } },
  { multi: true },
  callback
);
```

*It's not our job to teach you MongoDB, but... don't forget to use `$set` if you're only trying to update a few properties. Without `$set`, you replace the entire object.*

You can directly access `apos.files`, `apos.versions` and `apos.videos` in the same way.

## Making your own connections

Maybe you don't want to work with `mongodb-native` connections. Maybe you'd like to use Mongoose. Maybe you don't even want to use MongoDB. That's okay. Nobody's stopping you from making your own database connection for your project-specific code.

Just open your own database connections in your modules or in the `afterInit` callback of your `app.js` file.

Opening two connections to MongoDB might seem wasteful, but keep in mind that since node apps are typically single-process, you now have... two connections, which is no big deal. You do *not* have 2x the number of threads or processes you'd be running if this were PHP or a similar language.

