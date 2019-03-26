---
title: apostrophe-pieces-cursor (server)
layout: reference
namespace: server
---

# server-apostrophe-pieces-cursor

Cursor for fetching pieces.

## Options

_Note that_ `find` _does not take an options argument. Instead these options are usually configured in subclasses or their_ `beforeConstruct` _methods._

### `sort`

The default sort. Defaults to:

```javascript
{
 updatedAt: -1
}
```

