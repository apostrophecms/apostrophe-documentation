---
title: "Configuring CKEditor in Apostrophe"
---

Apostrophe uses [CKEditor](http://docs.ckeditor.com/) for rich text editing. It's a great rich text editor that seriously addresses the many cross-browser compatibility issues that come up due to the fact that each browser has its own unique implementation of the underlying rich text edit functionality.

You've [seen how to add a rich text widget to a page and configure styles and toolbar controls](../tutorials/getting-started/adding-editable-content-to-pages.html), but sometimes you'll want to go beyond that and configure CKEditor in ways we didn't anticipate. Here's how you can do that.

## Global CKeditor configuration

The [apostrophe-areas](../reference/apostrophe-areas/index.html) module is responsible for initially loading CKEditor. On the browser side, the [enableCkeditor method](../reference/apostrophe-areas/browser-apostrophe-areas.html#enable-ckeditor) is responsible for setting global CKEditor properties like `disableAutoinline` and calling `CKEditor.plugins.addExternal` to add our `split` plugin, which allows a toolbar control for splitting a rich text widget into two rich text widgets.

So extending that method at the project level is a sensible place to do more global configuration like this:

```javascript
// in lib/modules/apostrophe-areas/public/js/user.js in your project folder

apos.define('apostrophe-areas', {
  construct: function(self, options) {
    // Use the super pattern - don't forget to call the original method
    var superEnableCkeditor = self.enableCkeditor;
    self.enableCkeditor = function() {
      superEnableCkeditor();
      // Now do as we please
      CKEDITOR.plugins.addExternal('myplugin', 'url/of/plugin/folder', 'plugin.js');
    };
  }
});
```

**What's going on in this code?**

* By placing the file in `lib/modules/apostrophe-areas/public/js/user.js`, we assure that it is pushed to the browser automatically. That module already pushes `user` as a script, and will push our project-level version too, providing a convenient place to extend a [moog type](../glossary.html#moog-type).
* Calling `apos.define('apostrophe-areas', { ... })` adds a new definition for the browser-side object that manages editable areas — basically, the browser's version of the areas module. When we do this, moog gives us an [implicit subclass](../glossary.html#implicit-subclassing) of the original type, replacing it with our enhanced version.
* We then use the [super pattern](../glossary.html#code-super-code-pattern) to extend the existing `enableCkeditor` method, calling the old version and then adding new functionality.
* Inside that method, we call `CKEDITOR.plugins.addExternal` to add a [CKEditor plugin](http://ckeditor.com/addons/plugins/all). Any toolbar buttons it makes available can now be used when configuring the `toolbar` option for the [apostrophe-rich-text widget](../reference/apostrophe-rich-text-widgets/index.html).


## Instance-specific CKEditor configuration

It is also possible to do custom configuration at the time a rich text editor is fired up. That allows us to look at the options that were passed to that widget via `apos.area` or `apos.singleton` and decide what to do:

```javascript
// in lib/modules/apostrophe-rich-text-widgets/public/js/editor.js in your project folder

apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function(self, options) {
    self.beforeCkeditorInline = function() {
      // Mess around with the `config` object about to be passed to CKEditor
      self.config.removePlugins = 'man-i-hate-this-particular-plugin';
    };
  }
});
```

**What's going on in this code?**

* Placing the file in `lib/modules/apostrophe-rich-text-widgets/public/js/editor.js` ensures it is pushed to the browser. See the corresponding file in `node_modules/apostrophe`. Again, if the `editor` asset is pushed by this module, our project-level version will get pushed too. No further configuration is needed on our part.
* We implicitly subclass `apostrophe-rich-text-widgets-editor`. Apostrophe makes an instance of this type each time a rich text widget is ready to start editing.
* We override the `beforeCkeditorInline` method, which is provided for our convenience. Inside this method we can modify `self.config`, which is the configuration object about to be passed to CKEditor.

> If we want to, we can look at `self.options.templateOptions`, which contains the configuration passed to this widget by `apos.areas` or `apos.singleton`.

> Apostrophe's initial definition of the `beforeCkeditorInline` method is empty (following the [template pattern](https://en.wikipedia.org/wiki/Template_method_pattern)), but if you are using various add-on modules it's possible that some of them define it. If you want to be sure that code is called too, use the [super pattern](../glossary.html#code-super-code-pattern) rather than just replacing the method outright.
