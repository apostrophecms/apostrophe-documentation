---
title: apostrophe-doc-type-manager-cursor (server)
layout: reference
namespace: server
---

# server-apostrophe-doc-type-manager-cursor

Cursor for fetching docs of this specific type. The `afterConstruct` method locks the results down to this type by calling the `self.type` filter for us. Subclasses frequently add new filters.

