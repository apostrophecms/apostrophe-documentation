---
title: "apostrophe-db (module)"
layout: reference
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
This module establishes `apos.db`, the mongodb driver connection object.

## Options

### `uri`

The MongoDB connection URI.

### `user`, `host`, `port`, `name`, `password`

These options are used only if `uri` is not present.

## Command line tasks

### `apostrophe-db:reset`

Drops ALL collections in the database (including those not created by
Apostrophe), then invokes the `dbReset` method of every module that
has one. These methods may optionally take a callback.

Note that `apos.db` is the mongodb connection object, not this module.
You shouldn't need to talk to this module after startup, but you can
access it as `apos.modules['apostrophe-db']` if you wish.

If you need to change the way MongoDB connections are made,
override `connectToMongo` in `lib/modules/apostrophe-db/index.js`
in your project.


## Methods
### connectToMongo(*callback*)
Open the database connection. Always use MongoClient with its
sensible defaults. Build a URI if we need to so we can call it
in a consistent way
### keepalive()
Query the server status every 10 seconds just to prevent
the mongodb module version 2.1.19+ or better from allowing
the connection to time out... with no error messages or clues
that we need to reconnect it... because apparently that's
a feature now. -Tom
### earlyResetTask(*callback*)
Remove ALL collections from the database as part of the
`apostrophe-db:reset` task. Then Apostrophe carries out the usual
reinitialization of collection indexes and creation of parked pages, etc.

PLEASE NOTE: this will drop collections UNRELATED to apostrophe.
If that is a concern for you, drop Apostrophe's collections yourself
and start up your app, which will recreate them.
### resetFromTask(*callback*)

### dropAllCollections(*callback*)

