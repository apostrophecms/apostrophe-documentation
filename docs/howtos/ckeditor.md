# Configuring CKEditor in Apostrophe

Apostrophe uses [CKEditor](http://docs.ckeditor.com/) for rich text editing. It's a great rich text editor that seriously addresses the many cross-browser compatibility issues that come up due to the fact that each browser has its own unique implementation of the underlying rich text edit functionality.

You've [seen how to add a rich text widget to a page and configure styles and toolbar controls](/core-concepts/pages-and-navigation/widgets-singletons-and-areas.md), but sometimes you'll want to go beyond that and configure CKEditor for your project's specific needs. Here's how you can do that.

## Changing the allowed HTML tags in rich text

Some CKEditor configurations introduce new HTML tags that might be present in the markup. It looks great in the editor, but when you refresh the page they are gone. What happened?

Apostrophe automatically filters all rich text through the [sanitize-html](https://npmjs.org/package/sanitize-html) module. This prevents XSS attacks and also prevents the page design from being wrecked by bad or just plain ugly markup pasted from desktop applications.

However, sometimes the default configuration isn't working for you, for instance because you want to add `sub` and `sup` to the list of allowed tags.

It's easy to change: just set the `sanitizeHtml` option in `lib/modules/apostrophe-rich-text-widgets/index.js` in your project. Just keep in mind that **if you configure one of the sanitizeHtml options at all, you must configure that option completely.** A common mistake is forgetting to allow `a` elements or the `http` protocol, resulting in very pretty text with no links allowed!

Here are a few common configurations. For more, [see the `sanitize-html` documentation](https://npmjs.org/package/sanitize-html).

### Add text styles using classes

You will often want to add styles to the rich text editor widget that use classes for visual styling. For example, you may have these configurations in an area with a rich text widget for a basic paragraph and two special styles:

```django
  {{ apos.area(data.page, 'body', {
    widgets: {
      'apostrophe-rich-text': {
        toolbar: [ 'Styles', 'Bold', 'Italic', 'Link', 'Unlink' ],
        styles: [
          { element: 'p', name: 'Paragraph' },
          {
            element: 'p',
            name: 'Featured text',
            attributes: { class: 'featured-text' }
          },
          {
            element: 'h3',
            name: 'Section title',
            attributes: { class: 'section-heading' }
          }
        ]
      }
    }
  }) }}
```

You can allow these classes in two ways. First, you could allow all classes on those elements using `allowedAttributes`:

```javascript
// lib/modules/apostrophe-rich-text-widgets/index.js

module.exports = {
  // The standard list copied from the module, plus sup and sub
  sanitizeHtml: {
    // allowedTags: [...],
    allowedAttributes: {
      'p': ['class'],
      'h3': ['class'],
      // Include the default setting as well, or else links will break
      'a': [ 'href', 'name', 'target' ]
    },
    // ...,
  }
};
```

::: tip
You can open this up to allow the `class` attribute on any element by replacing those individual tag name keys in `allowedAttributes` with an asterisk string (`'*': ['class']`).
:::

Alternatively, you could only allow specific classes. You may not want to allow people to paste in rich text from somewhere else that includes classes that don't work well in a certain context. In this approach, you would use `allowedClasses`:

```javascript
// lib/modules/apostrophe-rich-text-widgets/index.js

module.exports = {
  // The standard list copied from the module, plus sup and sub
  sanitizeHtml: {
    // allowedTags: [...],
    allowedClasses: {
      'p': [ 'featured-text' ],
      'h3': [ 'section-heading' ]
    },
    // ...,
  }
};
```

There are no default `allowedClasses` settings, so you don't need to worry about including defaults for this one.

### Allow additional HTML tags

The **default** `allowedTags` configuration from `sanitize-html` is:

```javascript
  allowedTags: [
    'h3', 'h4', 'h5', 'h6', 'blockquote',
    'p', 'a', 'ul', 'ol', 'nl', 'li',
    'b', 'i', 'strong', 'em', 'strike', 'abbr',
    'code', 'hr', 'br', 'div', 'caption',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'
  ],
```

To add tags to that list, you would include all of those tags you want to keep, then add the new ones.  Here is an example adding `sup` and `sub`:

```javascript
// lib/modules/apostrophe-rich-text-widgets/index.js

module.exports = {
  // The standard list copied from the module, plus sup and sub
  sanitizeHtml: {
    allowedTags: [
      'h3', 'h4', 'h5', 'h6', 'blockquote',
      'p', 'a', 'ul', 'ol', 'nl', 'li',
      'b', 'i', 'strong', 'em', 'strike', 'abbr',
      'code', 'hr', 'br', 'div', 'caption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe',
      'sup', 'sub' // ⬅ The new tags
    ],
    // ...,
  }
};
```

There are many other combinations of similar configurations you may need to use. For more, [see the `sanitize-html` documentation](https://npmjs.org/package/sanitize-html).

## Global CKeditor configuration

The [apostrophe-areas](/reference/modules/apostrophe-areas/README.md) module is responsible for initially loading CKEditor. On the browser side, the [enableCkeditor method](/reference/modules/apostrophe-areas/browser-apostrophe-areas.md#enableckeditor) is responsible for setting global CKEditor properties like `disableAutoinline` and calling `CKEditor.plugins.addExternal` to add our `split` plugin, which allows a toolbar control for splitting a rich text widget into two rich text widgets.

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

* By placing the file in `lib/modules/apostrophe-areas/public/js/user.js`, we assure that it is pushed to the browser automatically. That module already pushes `user` as a script, and will push our project-level version too, providing a convenient place to extend a [moog type](/reference/glossary.md#moog-type).
* Calling `apos.define('apostrophe-areas', { ... })` adds a new definition for the browser-side object that manages editable areas — basically, the browser's version of the areas module. When we do this, moog gives us an [implicit subclass](/reference/glossary.md#implicit-subclassing) of the original type, replacing it with our enhanced version.
* We then use the [super pattern](/reference/glossary.md#super-pattern) to extend the existing `enableCkeditor` method, calling the old version and then adding new functionality.
* Inside that method, we call `CKEDITOR.plugins.addExternal` to add a [CKEditor plugin](http://ckeditor.com/addons/plugins/all). Any toolbar buttons it makes available can now be used when configuring the `toolbar` option for the [apostrophe-rich-text widget](/reference/modules/apostrophe-rich-text-widgets/README.md).
* The URL of the plugin begins with `/modules/my-apostrophe-areas`. This path will always point to the `public` subdirectory of your project-level extension of the `apostrophe-areas` module (`lib/modules/apostrophe-areas/public` in your project). The `my-` prefix is automatically added to distinguish it from the assets folder of the original `apostrophe-areas` module that ships with Apostrophe.

The CKEditor plugin then needs to be registered in the `apostrophe-rich-text-widgets`
widget as well:

```javascript
// lib/modules/apostrophe-rich-text-widgets/public/js/editor.js
apos.define('apostrophe-rich-text-widgets-editor', {
  construct: function(self, options) {
    self.beforeCkeditorInline = function() {
      // The 'myplugin' name should match what you added in the previous step.
      // NOTE: Be sure to include `'split'` if you intend to use that feature.
      // This will become unnecessary in a future release.
      self.config.extraPlugins = ['myplugin', 'split'];
    };
  }
});
```

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

> Apostrophe's initial definition of the `beforeCkeditorInline` method is empty (following the [template pattern](https://en.wikipedia.org/wiki/Template_method_pattern)), but if you are using various add-on modules it's possible that some of them define it. If you want to be sure that code is called too, use the [super pattern](/reference/glossary.md#super-pattern) rather than just replacing the method outright.
