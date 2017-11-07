---
title: "Layout (nested) widgets"
layout: tutorial
---

## Layout (nested) widgets

You’ve built a couple of custom widgets, you’ve got a powerful `area` running down the main column of your template, awesome. Now you want start pairing widgets up, creating complex layouts of widgets. `singletons` let you enforce particular widgets in particular pieces of layout, but you want the editor to decide where it's appropriate to create these complex arrangements and be able to mix them with simpler widgets.

You want a widget that creates a layout of inner widgets.

### Create a layout widget

Generally, you need a dedicated widget to create layout. The Apostrophe team sometimes refers to these as ‘layout widgets’ that give form and structure to ‘content widgets’ (widgets whose sole job is to display content). **In this example we'll make a simple two column layout.**

With the `apostrophe-cli` installed

```bash
apostrophe create-widget two-column
```

We'll include the layout widget in our `app.js` by adding the following to the `modules` object:

```javascript
  modules: {
    // ...,
    'two-column-widgets': {}
  }
```

Now we'll define what can be in a `two-column` widget by defining it in `lib/modules/two-column-widgets/index.js`:

```javascript
module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Two Column Layout',
  // contextualOnly: true,
  // skipInitialModal: true
  addFields: [
    {
      name: 'areaLeft',
      type: 'area',
      label: 'Left Area',
    },
    {
      name: 'areaRight',
      type: 'area',
      label: 'Right Area',
    }
  ]
};
```

#### Conveniences for layout widgets (contextualOnly and skipInitialModal)

There are two commented properties on the widget configuration above and they both do a similar thing. These are useful for a widget dedicated to nesting other widgets.

> **contextualOnly: true** If your widget contains *only* other areas and singletons you don't need the typical manager modal UI popping up when you create the widget, nor do you need an Edit button to edit non-existing configuration. `contextualOnly` will shortcut these and instantly plop your empty widget on the page.

<video src="/docs/videos/tutorials/editor/contextualTrue.mp4" autoplay="" loop="true" muted="true"></video>

> **skipInitialModal: true** If you want to skip the widget manager modal when the widget is created (like `contextualOnly`) but preserve the Edit UI for later user, `skipInitialModal` is for you. This is useful for widgets that have secondary configuration, like setting a background color.

### Putting it in the page

Now, like any other widget, you need to have a template render.

In `lib/modules/two-column-widgets/views/widget.html`

```html
<div class="two-column">
    <div class="column-left">
        {{ apos.area(data.widget, 'areaLeft', {
            widgets: {
                'apostrophe-images': {}
            }
        }) }}
    </div>
<div class="column-right">
        {{ apos.area(data.widget, 'areaRight', {
            widgets: {
                'apostrophe-images': {}
            }
        }) }}
    </div>
</div>
```
