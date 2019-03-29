---
title: "Custom schema field types"
layout: "tutorial"
---

Apostrophe's [schemas](../getting-started/schema-guide.html) provide a simple and powerful way to add new properties to any doc type in Apostrophe, such as a piece or a page. It's a powerful feature. But sometimes you might want to add a field type that doesn't already exist.

## A simple color picker: the server side

Let's add a simple color picker field to our project. Our color picker will display an inline preview of the color chosen.

We'll make a new Apostrophe module to power our field type. Here's the server-side code:

```javascript
// in app.js

var apos = require('apostrophe')({
  // ... other configuration ...
  modules: {
    // ... other modules ...
    'color-picker': {}
  }
});
```

```javascript
// in lib/modules/color-picker/index.js

var _ = require('lodash');

module.exports = {

  afterConstruct: function(self) {
    self.addFieldType();
    self.pushAssets();
    self.pushCreateSingleton();
  },

  construct: function(self, options) {

    self.addFieldType = function() {
      self.apos.schemas.addFieldType({
        name: 'color-picker',
        converters: {
          csv: function(req, data, name, object, field, callback) {
            var def = field.def || 'rgb(0, 0, 0)';
            var s = self.apos.launder.string(data[name], def);
            var matches = s.match(/^rgb\((.*?)\)$/);
            if (!matches) {
              return safety();
            }
            var channels = matches[1].split(/,/);
            if (channels.length !== 3) {
              return safety();
            }
            channels = _.map(channels, function(s) {
              return self.apos.launder.integer(s, 0);
            });
            object[name] = 'rgb(' + channels.join(',') + ')';
            return setImmediate(callback);

            function safety() {
              object[name] = def;
              return setImmediate(callback);
            }
          },
          form: 'csv'
        },
        partial: self.fieldTypePartial
      });
    };

    self.fieldTypePartial = function(data) {
      return self.partial('field', data);
    };

    self.pushAssets = function() {
      self.pushAsset('script', 'user', { when: 'user' });
      self.pushAsset('stylesheet', 'user', { when: 'user' });
    };

  }
};
```

### What's happening in this code?

In `construct`, we add two methods to our module: `addFieldType`, `fieldTypePartial` and `pushAssets`.

In `afterConstruct` we invoke `addFieldType`, `pushAssets` and `pushCreateSingleton`, which is provided for us by `apostrophe-module`.

> We don't have to delay the "real work" until `afterConstruct` like this, but doing so allows anyone extending our module a chance to override first.

`addFieldType` calls the [addFieldType method of the `apostrophe-schemas` module](../../modules/apostrophe-schemas/index.html#add-field-type) to add a new schema field type to Apostrophe.

The `converters` property covers two cases: CSV import and ordinary form submissions.

For the color picker, the format is the same for both: a simple RGB color string as used in CSS.

So we set `form` to the string `"csv"` to indicate we don't want to supply a separate converter just for forms, and we implement only the `csv` converter.

Inside our `csv` converter function, the data the user submitted will be in `data[name]`.

We first use `self.apos.launder.string` to ensure it is a string. Then we use a regular expression to make sure it is formatted as a nice RGB color, like `rgb(255, 127, 127)`.

If anything looks suspicious, we just set it to the default, or to black.

> Remember, **you can never, ever trust a web browser! Browser side "validation" is ONLY a convenience to help the user** and must not be trusted under any circumstances. That's why our server-side code must check the input thoroughly. That "web browser" might just be a malicious program that doesn't even run your nice JavaScript.

You can invoke `callback` with an error if the response is unacceptable, but this is not a good user
experience. **Whenever you can, just supply a reasonable default.** You can use browser-side code to
encourage better user responses. The server's job is just to make sure what is saved is safe and reasonable.

When we're done, we copy the cleaned-up value into `object[name]` and invoke the callback.

> **"Why don't you just invoke `callback(null)`?"** Converters are allowed to be asynchronous, but this one
> doesn't make any asynchronous calls. If our schema is large and too many fields like this one just invoke `callback(null)`, the stack will
> eventually crash. Calling `setImmediate(callback)` and then returning guarantees that doesn't happen.
> If your converter actually does something that is asynchronous, then you can just invoke `callback(null)`.

### The template

We also supply a `fieldTypePartial` method and configure the `partial` property of the new field type to use it. This method is responsible for rendering the markup for the field.

> The [self.partial](../../modules/apostrophe-module/index.html#partial) method renders a Nunjucks template in the `views/` folder of this module with the data we pass to it, as *part of* a larger response that is already being generated, such as a complete modal for editing a piece. Since a response is already in progress for a specific request, we don't pass `req` to this method. This is different from [self.render](../../modules/apostrophe-module/index.html#render), which is used when you want to generate and send an HTML fragment directly in response to an AJAX request.

Here's the template file we need:

```markup
{# In lib/modules/color-picker/views/field.html #}
{%- import "apostrophe-schemas:macros.html" as schemas -%}

{# A macro for our color picker control's content #}
{% macro colorPicker(field) %}
  <canvas width="256" height="256" class="color-picker-canvas" data-color-picker></canvas>
  <div class="color-picker-preview" data-color-picker-preview></div>
{% endmacro %}

{# Wrap our content in a standard fieldset #}
{{ schemas.fieldset(data, colorPicker) }}
```

### What's going on in this template?

This template takes advantage of macros provided by the `apostrophe-schemas` module. It uses a **cross-module path** to import them.

First we define our own macro to output a color picker. It's short because JavaScript will do the really interesting work to render the canvas. Then we invoke `schemas.fieldset`, a macro that wraps our own macro's output in a fieldset in the correct way.

> "Hey, I don't see you output the current value of the field anywhere!" That's right — browser side JavaScript handles that, as you'll see in a moment. Schema field templates only know about the field definition, not the current value.

### The stylesheet

Don't forget the stylesheet! You'll have a tough time seeing the clickable colors and the preview without it. We pushed it in our `pushAssets` method:

```css
// in lib/modules/color-picker/public/css/user.less

.color-picker-canvas {
  display: inline-block;
  width: 256px;
  height: 256px;
  margin: 12px 12px 12px 0px;
  cursor: pointer;
}

.apos-ui .color-picker-preview {
  vertical-align: top;
  display: inline-block;
  width: 64px;
  height: 64px;
}
```

## Handling user input: the browser side

Earlier in `afterConstruct` we saw a call to `pushAssets`. That method pushes a stylesheet and a javascript file to the browser when a user is logged in and might need to pick colors.

In addition, we saw a call to `pushCreateSingleton`. This method creates an object to represent our module on the browser side. It'll look for one with a [moog type name](../../glossary.html#moog-type) that matches the module's name... and our `user.js` file will provide that:

```javascript
// in lib/modules/color-picker/public/js/user.js

apos.define('color-picker', {

  afterConstruct: function(self) {
    self.addFieldType();
  },

  construct: function(self, options) {

    self.addFieldType = function() {
      apos.schemas.addFieldType({
        name: 'color-picker',
        populate: self.populate,
        convert: self.convert
      });
    };

    self.populate = function(object, name, $field, $el, field, callback) {
      var $fieldset = apos.schemas.findFieldset($el, name);
      var $colorPicker = $fieldset.find('[data-color-picker]');
      var $preview = $fieldset.find('[data-color-picker-preview]');
      if (object[name]) {
        $preview.css('background-color', object[name]);
      }

      var canvas = $colorPicker[0];
      var red, green, blue, x, y, ctx;
      ctx = canvas.getContext('2d');
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      y = 0;
      for (blue = 0; (blue < 256); blue += 32) {
        x = 0;
        for (green = 0; (green < 256); green += 32) {
          for (red = 0; (red < 256); red += 32) {
            ctx.fillStyle = 'rgb(' + red + ',' + green + ',' + blue + ')';
            ctx.fillRect(x, y, 4, 32);
            x += 4;
          }
        }
        y += 32;
      }
      $fieldset.data('color', object[name]);
      $colorPicker.on('click', function(e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;
        var cellX = Math.floor(x / 4);
        var cellY = Math.floor(y / 32);
        var red = Math.min((cellX % 8) * 32, 255);
        var green = Math.min(Math.floor(cellX / 8) * 32, 255);
        var blue = Math.min(cellY * 32, 255);
        var color = 'rgb(' + red + ',' + green + ',' + blue + ')';
        $fieldset.data('color', color);
        $preview.css('background-color', color);
        return false;
      });
      return setImmediate(callback);
    };

    self.convert = function(object, name, $field, $el, field, callback) {
      var $fieldset = apos.schemas.findFieldset($el, name);
      object[name] = $fieldset.data('color');
      if (field.required && (!object[name])) {
        return setImmediate(_.partial(callback, 'required'));
      }
      return setImmediate(callback);
    };

  }
});
```

### What's going on in this code?

We start by calling `apos.define` to create a [moog type](../../glossary.html#moog-type) on the browser side with the same name as the module. The `pushCreateSingleton` call earlier will take care of calling `apos.create` for us.

Next we define an `addFieldType` method in `construct` and call it from `afterConstruct`, just like on the server side.

On the browser side we need to provide a `populate` function and a `convert` function for each field type. This time we set these up as methods, making the code easier to maintain and extend.

#### The `populate` method

In `populate`, we get the field ready to pick colors and display the current color.

We use `apos.schemas.findFieldset` to locate the `fieldset` element that contains the entire field, then we use jQuery's `find` method to locate things within that. *Never, ever use `$('...')` directly here.* There can be more than one color picker in your world! *Always use find()* within the fieldset to keep things in scope.

> "Can't we just use `$field`?" That's just a convenience for cases where the field type is a simple one like `string` where there's a traditional form field, like an input element. For interesting controls like this one, we need the fieldset, which is guaranteed to contain all of our markup.

Displaying the current color is easy: we know it's already a CSS-friendly color string, so we just set the `background-color` CSS attribute of our preview element.

Choosing colors is a little tricker. We create a simple grid of 4x4 boxes, offering a choice of 512 colors. (No, they aren't great colors. Hey, it's just an example.) And we use an HTML5 (canvas)[https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial] element to render those colors without creating hundreds of spans or divs.

When a click takes place on the canvas, we turn the process around. We grab the location of the click in the document, subtract the offset of the canvas, and scale the numbers to get back to a range between 0 and 255 for each channel: red, green and blue.

We then associate the resulting CSS color string with the fieldset using jQuery's `data` function, so that we can get it back later.

> "I see a lot of click handlers being attached to things. Is this safe? What if the field gets populated twice? Will I get two click handlers?"
>
> Apostrophe fieldsets are never populated twice. Schema-driven modals call `populate` only once. But `convert` may be run many times, if the user's first inputs are rejected.

#### The `convert` method

The `convert` method's job is to clean up the data, raise an objection if it is unacceptable, and otherwise store it back to `object[name]`.

Here the click handler in `populate` has done most of the work already. So we just pick up the color string from the fieldset again using jQuery's `data()` function and store it in `object[name]`. Then we invoke `setImmediate(callback)`. Just like on the server side, we don't want to crash the stack by invoking `callback(null)` directly too many times.

> "Is `setImmediate(callback)` cross-browser safe?" It is in Apostrophe. Apostrophe always pushes a "polyfill" to make `setImmediate` available in all browsers.

However, if no choice has been made and the field is marked `required`, we need to let the modal know an error has occurred so it can call attention to the field and stop the save operation.

To do that, we invoke the callback with the string `required` as our error.

Again though, we don't want to just invoke the callback directly, because we haven't done anything asynchronous. So we use `setImmediate`, and we use `_.partial` to create a function that will invoke the callback with `'required'` as its sole argument when `setImmediate` invokes it.

> The `_.partial` function of lodash is a very useful tool for creating callbacks that are already "primed" to pass a particular argument when they are called.

## Using our field type

That's it! We've built a custom field type, and it's not a trivial one. With this knowledge you can go on to add sophisticated field types to your Apostrophe projects.

Just one last question: how to use it? Just like any other field type. Add it to the piece type of your choice via the `addFields` option in the usual way. For instance, we might use it like this:

```javascript
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'story',
  addFields: [
    {
      type: 'color-picker',
      name: 'color',
      label: 'Background Color'
    }
  ]
};
```

Now we might use the `color` property of each piece as a CSS background color when overriding, for example, the `show.html` page of our subclass of `apostrophe-pieces-pages`.

> "Why are all these methods asynchronous?" In many simple cases it seems unnecessary. But for field types like our `joinByOne` and `joinByArray`, the ability to do asynchronous work is essential. You'll appreciate it the first time you create a field type that needs to query an API to validate something.

## Publishing field types in npm

It's easy to publish a field type in npm for everyone to use. You can just pack up your module as an npm module, and you'll find you can still configure it like any other Apostrophe module.

Naturally you will also need to add it to `package.json` so that `npm install` knows what to do.

**If you are publishing a field type in npm, or just want to avoid conflicts in the future,** please prefix your field type name with something unique to you or your organization.

## More examples of custom field types

There are two excellent examples of custom field types already built as separate modules in Apostrophe: [apostrophe-attachments](../../modules/apostrophe-attachments/index.html) and [apostrophe-video-fields](../../modules/apostrophe-video-fields/index.html). You can [learn from the code on github](https://github.com/punkave/apostrophe/tree/master/lib/modules/apostrophe-video-fields). The video field type is the simpler of the two. There's no magic here: if you build a field type using a module in your project in exactly the same way, or publish it to npm, it will work just as well.
