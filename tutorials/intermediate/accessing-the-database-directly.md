# Accessing the database directly

## Working with your own collections

Sometimes you'll want to work with your own MongoDB collections.

Assuming your code is part of an Apostrophe module, you can do that by accessing `self.apos.db`, which is Apostrophe's the `mongodb` driver connection object.

Here's a simple example of obtaining a reference to a collection called `candies`:

```javascript
return self.apos.db.collection('candies', function(err, collection) {
  if (err) {
    // Well, darn.
    return callback(err);
  }
  self.candies = collection;
  return callback(null);
});
```

For more information, [see the mongodb-native module documentation](http://mongodb.github.io/node-mongodb-native/).

## Raw access to Apostrophe's docs

Most of the time, you should [use Apostrophe's model layer](model-layer.md) to access Apostrophe's content. That gives you the benefit of permissions, sensible default sorting orders, widget loaders, joins... so, so many good things.

But once in a while, that's *exactly what you don't want.*

A good example is updating a "hit counter" on a piece. You don't care about permissions for this; you don't want any overhead. You don't want to needlessly update the entire object. Or create nasty race conditions. You just need to increment that counter. Fast.

Here's an example of how to do that job in a subclass of `apostrophe-pieces-pages`. We'll take advantage of the convenient `beforeShow` method, which exists to let us do fancy things before displaying a single piece at its own URL:

```javascript
self.beforeShow = function(req, callback) {
  return self.apos.docs.db.update({
    _id: req.data.piece._id
  }, {
    $inc: {
      hits: 1
    }
  }, callback);
}
```

`self.apos.docs.db` gives you direct access to the `aposDocs` MongoDB collection object. *Note:* this is not the same thing as `self.apos.db`, which is the main MongoDB connection object, useful for starting new collections.

In general, if you need to use `$set`, `$pull`, `$push`, `$addToSet`, `$unset` or `$inc`, using MongoDB directly makes sense, because *Apostrophe's model layer only writes complete docs*. For read operations it usually does not make sense to skip the model layer.

Often a good strategy is to use Apostrophe for read operations, which allows you to check `._edit` to see if the current user is allowed to write to something, before writing to it directly with MongoDB. Just keep in mind you're bypassing any useful `beforeInsert`, `beforeUpdate` and `beforeSave` handlers that might exist. Sometimes, that's exactly what you want.

## Making your own database connections

Maybe you don't want to work with the mongodb native module. Maybe you'd like to use Mongoose. Maybe you don't even want to use MongoDB at all. That's okay. Nobody's stopping you from making your own database connection for your project-specific code.

Just open your own database connections. There's an npm module for everything!

Opening two connections to MongoDB might seem wasteful, but keep in mind that since node apps typically run very few processes, typically one per CPU core at most, you're not actually wasting scarce resources. Two connections total really isn't a big deal.