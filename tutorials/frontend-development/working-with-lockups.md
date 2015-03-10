---
title: "Working with lockups"
---

Apostrophe supports "lockups." A lockup is a marriage between one rich text item and one widget, such as a slideshow. Lockups provide a sane way to allow users to float things without wrecking your design.

Users begin by adding text blocks and widgets to the area. Then, they may drag any widget via its handle and drop it on a text block. This locks the two together.

TODO: gif of lockup action.

However, we believe strongly in preserving your design intentions. So if you do not configure any lockups for a particular `aposArea` call, then the user is not permitted to drop widgets on text.

Lockups must be configured at the project level, typically in `app.js`, but you decide which lockups to enable by name when inserting each area.

Here's how you define lockups:

```javascript
... more apostrophe-site configuration ...
lockups: {
  left: {
    label: 'Left',
    icon: 'icon-arrow-left',
    tooltip: 'Float Left',
    // Only allows one type of widget
    widgets: [ 'slideshow' ],
    // Override the options for slideshows when they are inside the lockup to get the size right
    slideshow: {
      size: 'one-third'
    }
  },
  right: {
    label: 'Right',
    icon: 'icon-arrow-right',
    tooltip: 'Float Right',
    // Allows two types of widget
    widgets: [ 'slideshow', 'video' ],
    slideshow: {
      size: 'one-half'
    },
    video: {
      size: 'one-half'
    }
  }
},
...
```

And here's how you permit them in a particular area:

```nunjucks
{{
    aposArea(page, 'content2', {
      controls: ['style', 'bold', 'italic', 'slideshow' ],
      lockups: [ 'left', 'right' ] })
}}
```

Again, *if you do not enable lockups explicitly for each area, they are not permitted.*

Configuring lockups for areas in the schema of a snippet subclass works as you'd expect: just set the lockups option as you would when calling `aposArea`.

**"But how do I get it to float?"** Apostrophe guarantees that the widget and the text it's been locked to will be wrapped in a div with the `apostrophe-lockup` class, and also a CSS class with the same name as the lockup. So if your lockup is named `left`, you can count on the classes `apostrophe-lockup` and `left` existing on that div. From there you should have no trouble targeting the widget, for instance:


```css
.apos-lockup.left .apos-widget {
  float: left;
  width: 300px;
}
```

Actually floating and sizing things is up to you and your CSS, but lockups help you by always nesting the widget to be floated as a direct child of a div with the `apostrophe-lockup` class.

## Adding tags with custom attributes to the Styles menu
You can pass custom attributes (like classes) to tags in the Styles menu of CKEditor by adding the element to the styles array of an area:

```nunjucks
{{
    aposArea(page, 'content', {
      styles: [
        { value: 'h5', label: 'Heading 5' },
        { value: 'div', label: 'Centered', attributes: {class: 'centered' } }
      ]
    })
}}
```

After which you must make the proper exception in apostrophe-site's SanitizeHtml in app.js (add it if you don't have it)

```javascript
var site = require('apostrophe-site')({
  sanitizeHtml: {
    allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        img: [ 'src' ],
        div: [ 'class' ]
    },
  },
})
```

## Lockups and the `limit` option of areas

Lockups are not intended to mix with the `limit` option of areas. You should not use `limit` and lockups for the same area.
