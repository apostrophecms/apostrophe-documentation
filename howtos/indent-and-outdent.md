---
title: Indent and Outdent in the rich text editor
---

By default, the "Indent" and "Outdent" controls are not enabled in Apostrophe's rich text editor (which is CKEditor). However the necessary plugins are now standard so it can optionally be enabled.

To enable "Indent" and "Outdent" first add them to the `controls` array for one of your areas:

```
aposArea(page, 'content', { controls: [ 'Bold', 'Italic', 'Indent', 'Outdent' ] })
```

Note that `Indent` and `Outdent` must be capitalized. These are standard CKEditor control names.

Second, make sure you add styles in your `less` files for the following classes, which represent different levels of indentation:

```css
.apos-indent1 {
  margin-left: 10px;
}
.apos-indent2 {
  margin-left: 20px;
}
```

Using classes for these ensures that responsive design is still possible and allows us to continue filtering rich text editor markup to keep the design from being ruined by bad markup.

Third, you *must add these classes to your `allowedClasses`* so that Apostrophe's markup filter does not reject them. In `app.js`, in your `apostrophe-site` configuration, add a `sanitizeHtml` property if you do not already have one:

```javascript
sanitizeHtml: {
  allowedClasses: {
    'p': ['apos-indent1', 'apos-indent2']
  }
}
```
