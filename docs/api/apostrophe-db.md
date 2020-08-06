# apostrophe-db
## Inherits from: [apostrophe-module](./apostrophe-module/README.md)

## Methods
### connectToMongo(*callback*)
Open the database connection. Always use MongoClient with its
sensible defaults. Build a URI if we need to, so we can call it
in a consistent way.

One default we override: if the connection is lost, we keep
attempting to reconnect forever. This is the most sensible behavior
for a persistent process that requires MongoDB in order to operate.
### keepalive()
Query the server status every 10 seconds just to prevent
the mongodb module version 2.1.19+ or better from allowing
the connection to time out. That module provides no error messages or clues
that we need to reconnect it.
### earlyResetTask(*callback*)
Remove ALL collections from the database as part of the
`apostrophe-db:reset` task. Then Apostrophe carries out the usual
reinitialization of collection indexes and creation of parked pages, etc.

PLEASE NOTE: this will drop collections UNRELATED to apostrophe.
If that is a concern for you, drop Apostrophe's collections yourself
and start up your app, which will recreate them.
### bcPatch()
Just a bc wrapper now that we are using emulate-mongo-2-driver,
which already adds findWithProjection as a synonym.
### resetFromTask(*callback*)

### dropAllCollections(*callback*)

### apostropheDestroy(*callback*)
Invoked by `callAll` when `apos.destroy` is called.
Closes the database connection and the keepalive
interval timer. Sets `apos.db.closed` to true,
allowing detection of the fact that the database
connection is no longer available by code that
might still be in progress.
### trace()

