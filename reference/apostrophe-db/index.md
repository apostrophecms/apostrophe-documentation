---
title: "apostrophe-db (module)"
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

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
reset task
let's all the modules start up, then destroys them bwhaha
the default is to remove everything.
TODO: --safe clears only collections that apostrophe cares about
- Tom & Sam
### resetFromTask(*callback*)

### dropAllCollections(*callback*)

