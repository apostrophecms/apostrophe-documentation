# Writing database migrations

Database migrations are used to handle changes or corrections to your database schema that need to be applied across many or all documents.

In systems built on SQL databases, migrations are needed even for simple tasks like adding a new field. Since ApostropheCMS is built on MongoDB, there is no need for a migration in those cases. You can add, rename and remove fields without encountering any database errors.

However, if you are removing or renaming a field, you may want to remove or move the existing data. Here is a simple example of how to write a migration to handle renaming a field.

In this example, we'll assume the field used to be named `feline` and the new name is `cat`.

```javascript
// in lib/modules/pet-owners/index.js

module.exports = {
  extend: 'apostrophe-pieces',
  name: 'pet-owner',
  addFields: [
    {
      name: 'cat',
      label: 'Cat',
      type: 'string'
    }
  ],
  construct(self, options) {
    self.apos.migrations.add('renameFelineField', async () => {
      await self.apos.migrations.eachDoc({
        // This is a raw mongo query, we must take care to leave other piece types alone
        type: 'pet-owner',
        // Don't bother with docs that never had a feline field
        feline: { $exists: 1 }
      }, async (doc) => {
        // Raw mongodb update so we can use $set and $unset and avoid race conditions
        await self.apos.docs.db.updateOne({
          _id: doc._id
        }, {
          $set: {
            cat: doc.feline
          },
          $unset: {
            feline: 1
          }
        });
      });
    });
  };
};
```

Notice that:

* **The migration must be given a name when calling `apos.migrations.add`.** This distinguishes it from all other migrations and allows Apostrophe to make sure it is only invoked once.
* **`self.apos.migrations.eachDoc` iterates over every doc in the database,** filtered by the MongoDB criteria object you supply.
* **`apos.docs.db.updateOne` is used to do a direct MongoDB update on each doc.** This has performance benefits and the use of [`$set`](https://docs.mongodb.com/manual/reference/operator/update/set/) and [`$unset`](https://docs.mongodb.com/manual/reference/operator/update/unset/) avoids race conditions if other fields change between the read operation and the write operation.

You can find [other migration-related convenience methods in the apostrophe-migrations module documentation](/reference/modules/apostrophe-migrations). Notable examples include `eachWidget`, which can be used to iterate over every occurrence of a particular kind of widget in the entire database.

::: tip
Methods of `apos.migrations` should never be used in the normal process of serving a web request. They have no security provisions and are exclusively for use in migrations and [command line tasks](../command-line-tasks).
:::
