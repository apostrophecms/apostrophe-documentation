# Configuring CKEditor in Apostrophe

Apostrophe uses [CKEditor](http://docs.ckeditor.com/) for rich text editing. It's a great rich text editor that seriously addresses the many cross-browser compatibility issues that come up due to the fact that each browser has its own unique implementation of the underlying rich text edit functionality.

You've [seen how to add a rich text widget to a page and configure styles and toolbar controls](/tutorials/core-concepts/pages-and-navigation/widgets-singletons-and-areas.md), but sometimes you'll want to go beyond that and configure CKEditor in ways we didn't anticipate. Here's how you can do that.

## Global CKeditor configuration

The [apostrophe-areas](/modules/apostrophe-areas/README.md) module is responsible for initially loading CKEditor. On the browser side, the [enableCkeditor method](/modules/apostrophe-areas/browser-apostrophe-areas.md#enableckeditor) is responsible for setting global CKEditor properties like `disableAutoinline` and calling `CKEditor.plugins.addExternal` to add our `split` plugin, which allows a toolbar control for splitting a rich text widget into two rich text widgets.

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
      CKEDITOR.plugins.addExternal('myplugin', '/modules/my-apostrophe-areas/js/ckeditorPlugins/YOUR-PLUGIN-NAME/', 'plugin.js');
    };
  }
});
```

**What's going on in this code?**

* By placing the file in `lib/modules/apostrophe-areas/public/js/user.js`, we assure that it is pushed to the browser automatically. That module already pushes `user` as a script, and will push our project-level version too, providing a convenient place to extend a [moog type](other/glossary.md#moog-type).
* Calling `apos.define('apostrophe-areas', { ... })` adds a new definition for the browser-side object that manages editable areas — basically, the browser's version of the areas module. When we do this, moog gives us an [implicit subclass](/other/glossary.md#implicit-subclassing) of the original type, replacing it with our enhanced version.
* We then use the [super pattern](/other/glossary.md#super-pattern) to extend the existing `enableCkeditor` method, calling the old version and then adding new functionality.
* Inside that method, we call `CKEDITOR.plugins.addExternal` to add a [CKEditor plugin](http://ckeditor.com/addons/plugins/all). Any toolbar buttons it makes available can now be used when configuring the `toolbar` option for the [apostrophe-rich-text widget](/modules/apostrophe-rich-text-widgets/README.md).
* The URL of the plugin begins with `/modules/my-apostrophe-areas`. This path will always point to the `public` subdirectory of your project-level extension of the `apostrophe-areas` module (`lib/modules/apostrophe-areas/public` in your project). The `my-` prefix is automatically added to distinguish it from the assets folder of the original `apostrophe-areas` module that ships with Apostrophe.

## Instance-specific CKEditor configuration

It is also possible to do custom configuration at the time a rich text editor is fired up. That allows us to look at the options that were passed to that widget via `apos.area` or `apos.singleton` and decide what to do. It is also the best place do things like changing the list of buttons that CKEditor is currently disabling.

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

> Apostrophe's initial definition of the `beforeCkeditorInline` method is empty (following the [template pattern](https://en.wikipedia.org/wiki/Template_method_pattern)), but if you are using various add-on modules it's possible that some of them define it. If you want to be sure that code is called too, use the [super pattern](/other/glossary.md#super-pattern) rather than just replacing the method outright.

## Changing the allowed HTML tags in rich text

Some CKEditor configurations introduce new HTML tags that might be present in the markup. It looks great in the editor, but when you refresh the page they are gone. What happened?

Apostrophe automatically filters all rich text through the [sanitize-html](https://npmjs.org/package/sanitize-html) module. This prevents XSS attacks and also prevents the page design from being wrecked by bad or just plain ugly markup pasted from desktop applications.

However, sometimes the default configuration isn't working for you, for instance because you want to add `sub` and `sup` to the list of allowed tags.

It's easy to change: just set the `sanitizeHtml` option in `lib/modules/apostrophe-rich-text-widgets/index.js` in your project. Just keep in mind that **if you configure one of the sanitizeHtml options at all, you must configure that option completely.** A common mistake is forgetting to allow `a` elements or the `http` protocol, resulting in very pretty text with no links allowed!

Here is an example of a complete copy of the default `sanitize-html` configuration that also adds `sup` and `sub`:

```javascript
// lib/modules/apostrophe-rich-text-widgets/index.js

module.exports = {
  // The standard list copied from the module, plus sup and sub
  sanitizeHtml: {
    allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
      'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
      'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre',
      'sup', 'sub'
    ],
    allowedAttributes: {
      a: [ 'href', 'name', 'target' ],
      // We don't currently allow img itself by default, but this
      // would make sense if we did
      img: [ 'src' ]
    },
    // Lots of these won't come up by default because we don't allow them
    selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont',
      'input', 'link', 'meta' ],
    // URL schemes we permit
    allowedSchemes: [ 'http', 'https', 'ftp', 'mailto' ],
    allowedSchemesByTag: {}
  }
};
```





