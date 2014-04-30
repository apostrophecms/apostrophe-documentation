---
title: Database Migrations
---

Sometimes you'll want to change the way you store data on your site and you'll need a reliable way to apply that change to existing data. Database migrations are a great way to solve this problem. Apostrophe uses database migrations internally to upgrade existing sites when we make schema changes.

You can add your own database migrations to your project. For instance, you might do this in `afterInit` in your `app.js` file:

```javascript
site.apos.addMigration('paintTheFences', function(callback) {
  return site.apos.forEachPage({ type: 'fence', title: /gray/i }, {}, function(page, callback) {
    page.title = page.title.replace(/gray/gi, 'white');
    return site.apos.pages.update({ _id: page._id }, page, callback);
  }, callback);
});
```

This migration will now run in the order it was registered. Core Apostrophe migrations run first, followed by those registered by each module in your project, followed by those registered in `afterInit`.

There are many helper methods defined in `migrationTools.js`, such as the `apos.forEachPage` module used here, that can help you when you need to iterate over everything in the site. Also keep in mind that `apos.pages` is the `aposPages` MongoDB collection object.

Your migration must:

* Tolerate being run more than once on the same database. If you cannot guarantee a "safe" migration, write a separate task instead and use it only once.

* Tolerate being run on a brand-new site.

* Do something asynchronous before invoking its callback, except in the event of an error. If everything is great and you have no async work to do, use `return setImmediate(callback)`.

Yes, there is a cache that remembers which migrations have been run, but you must treat it as a performance optimization only and assume that your migration might get run again.

