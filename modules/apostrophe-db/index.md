---
title: apostrophe-db (module)
layout: reference
module: true
namespaces: null
children: null
---

# index

## Inherits from: [apostrophe-module](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-module/index.html)

## Methods

### connectToMongo\(_callback_\)

Open the database connection. Always use MongoClient with its sensible defaults. Build a URI if we need to, so we can call it in a consistent way.

One default we override: if the connection is lost, we keep attempting to reconnect forever. This is the most sensible behavior for a persistent process that requires MongoDB in order to operate.

### keepalive\(\)

Query the server status every 10 seconds just to prevent the mongodb module version 2.1.19+ or better from allowing the connection to time out... with no error messages or clues that we need to reconnect it... because apparently that's a feature now. -Tom

### earlyResetTask\(_callback_\)

Remove ALL collections from the database as part of the `apostrophe-db:reset` task. Then Apostrophe carries out the usual reinitialization of collection indexes and creation of parked pages, etc.

PLEASE NOTE: this will drop collections UNRELATED to apostrophe. If that is a concern for you, drop Apostrophe's collections yourself and start up your app, which will recreate them.

### bcPatch\(\)

Makes a `findWithProjection` method available on all collections, which is just an alias for `find` because the MongoDB 2.x driver already allows a projection as the second argument. This is useful because the `apostrophe-db-mongo-3-driver` module provides the same method while allowing you to use the newer MongoDB 3.x driver. All existing Apostrophe code that directly calls MongoDB's `find()` is being migrated to use `findWithProjection` for forwards and backwards compatibility.

### resetFromTask\(_callback_\)

### dropAllCollections\(_callback_\)

### apostropheDestroy\(_callback_\)

Invoked by `callAll` when `apos.destroy` is called. Closes the database connection and the keepalive interval timer. Sets `apos.db.closed` to true, allowing detection of the fact that the database connection is no longer available by code that might still be in progress.

