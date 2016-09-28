---
title: "apostrophe-service-bridge (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
This module is always the last module loaded by default by Apostrophe,
before any modules added by the user. It invokes the
`servicesReady` method of all modules that have one. This may
optionally take a callback.


