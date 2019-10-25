# Command line tasks

Sometimes, you'll want to do something to your Apostrophe site's content
via the command line. And there are plenty of built-in command line tasks
for this purpose. You ran one the day you created your site:

```
node app apostrophe-users:add admin admin
```

But how do we create our own command line tasks? Let's take a look.

## Complete, working example

See the [apostrophe-samples project](https://github.com/apostrophecms/apostrophe-samples) for a complete, working example of command line tasks in a project. Take a look in the `lib/modules/products/index.js` file. This is a module that extends `apostrophe-pieces`. Below we'll describe what these tasks do.

## A task to list products: using apostrophe cursors in a task

Here's a task that lists all the public, published `product` pieces on the site, with their URLs:

```javascript
// in lib/modules/products/index.js, inside `construct`
// You can see this code in context in the apostrophe-samples project!

self.addTask('list', 'Lists public, published products and their URLs', (apos, argv) => {

  // We need a `req` object, but we're in a task. So
  // ask the tasks module for an "anon" req that can
  // do only what the public can do. We could also call
  // `apos.tasks.getReq()`, which lets us do anything (admin).

  const req = apos.tasks.getAnonReq();

  // Let's use apostrophe cursors, so that we only get public,
  // published products, and the _url property is dynamically set.

  return self.find(req).toArray().then(products => {
    products.forEach(product => {
      console.log(product.title + ': ' + product._url);
    });
  });

  // We don't need to "catch" here because the task runner will
  // catch and display any error that rejects the promise

});
```

This task returns a promise. You can also write tasks that
accept a callback, as seen in the next example. It's up to you.

This code uses [Apostrophe cursors](/tutorials/advanced-development/database/cursors.md) to fetch information like
a member of the public would. It doesn't see anything unpublished
or in the trash, and it can see the `_url` property of each product,
which is set for us dynamically when we fetch products with a cursor.

For more information, see [Apostrophe cursors](/tutorials/advanced-development/database/cursors.md) and [Apostrophe's model layer: working with the database](/tutorials/advanced-development/database/model-layer.md).

### Running our task

To run the task, type:

```
node app products:list
```

To list all the tasks available, type:

```
node app help
```

### Obtaining a `req` object for a task

Lots of Apostrophe APIs require a `req` object, but we're not handling
an Express request. How do we get a `req` inside a task?

As seen above, our code can ask the `apostrophe-tasks` module 
for a `req` object like this:

`self.apos.tasks.getAnonReq()`

This `req` object is anonymous: it can **only do what the public can
do**.

If your task needs to call `self.insert` and `self.update`,
call `self.apos.tasks.getReq()` instead. This gives you an "admin"
`req` object that can do anything an administrator can do on the site.

## A task to cut prices: fast tasks with the migration API and MongoDB

We can also write tasks that use Apostrophe's migration API to iterate
over every document that matches a query. And, we can use MongoDB's APIs
directly to gain access to features like MongoDB's `$set`. Here's
how we do it:

```javascript
// This time we are using the migrations API, which only supports
// callbacks (so far), so we'll accept a callback to our task function

self.addTask('discount', 'Lowers prices by the specified percentage.', (apos, argv, callback) => {

  // Let's use the migrations and mongodb APIs to do this very quickly.
  // Note this will impact every product, even those in the trash, and
  // ignore permissions (unpublished products, etc)
  return apos.migrations.eachDoc({ type: 'product' }, (product, callback) => {
    if (!product.price) {
      // Don't overflow the stack - let node invoke the callback
      // after this function returns
      return setImmediate(callback);
    }
    if (!parseFloat(argv._[1])) {
      // Use a plain string as the error to avoid a stack trace since
      // this is just a user error.
      return callback('You must specify a discount percentage, such as 10. Do not use a % sign.');
    }
    product.price = product.price - (product.price * argv._[1] / 100);
    return apos.docs.db.update({
      _id: product._id
    }, {
      $set: {
        price: product.price
      }
    }, callback);
    // Don't forget to pass the callback after the iterator function!
    // Otherwise it'll do the work, then just hang
  }, callback);
});
```

> **When should I use the migrations API?** When you are absolutely sure
you want to iterate over **everything, including the trash**... and
when you need to operate quickly on thousands of objects without running
> out of memory. 
>
> In this example, we could have used cursors and the `update` method of
> the products module instead. This code is faster, but it ignores permissions
> and lowers prices on products that are currently in the trash. We could
> adjust our query to account for that, but that takes extra work.
> So the best choice depends on your use case.
>
> **Where can I learn more about using the MongoDB API directly?**
> See [accessing the database directly](/tutorials/advanced-development/database/accessing-the-database-directly.md) and, of course,
> the [MongoDB documentation for NodeJS](http://mongodb.github.io/node-mongodb-native/).
