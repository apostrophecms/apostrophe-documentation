---
title: When two fancy pages share a module
---

Sometimes you might find it convenient for two fancy pages to share the same module. After all, nothing stops you from constructing two objects that subclass fancy pages inside a single module's constructor function. However, there's a catch: they would both render the same `pageSettings.html` and load the same `editor.js` and `content.js`.

You can address this by passing these options to the fancy pages constructor:

```
  pageSettingsTemplate: 'indexPageSettings',
  editorScript: 'indexEditor',
  contentScript: 'indexContent'
```

The [apostrophe-blog-2](http://github.com/punkave/apostrophe-blog-2) module relies on this approach and can be referred to as a reference on this technique.

