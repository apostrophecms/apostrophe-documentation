---
title: "How do I create a '404 not found' page?"
layout: tutorial
---

To get 404 not found pages to display (instead of an
error saying you don't have one), just create:

```bash
lib/modules/apostrophe-pages/views/notFound.html
```

Which works just like any page template; just remember that of course
there is no `data.page`. If you want user-editable content there use
`data.global`.
