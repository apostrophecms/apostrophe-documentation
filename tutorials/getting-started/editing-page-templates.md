---
title: "Editing Page Templates"
---
## Editing Page Templates

This tutorial will introduce you to the `apostrophe-pages` and `apostrophe-templates` modules.  It will also cover the basics of editing page templates in [Nunjucks](http://nunjucks.jlongster.com/), and show you how to add a hero section to the Home page.

### Orientation

Take a look in the `apostrophe-pages` module directory of your project (`lib/modules/apostrophe-pages`). Here you'll find a `/views` directory containing our `.html` template files.  Within the `/pages` subdirectory you'll find our existing Home page template, `home.html`. Right now, our site only has this template so let's add a new one.

### Adding a New Page Template

Let's add a `default` template for new pages.

The first step is to add configuration for the `apostrophe-pages` module in `app.js`:

```javascript
    // This configures our default page template
    'apostrophe-pages' = {
      types: [
        {
          name: 'default',
          label: 'Default',
          type: 'default'
        }
      ]
    }
```
*Tip: you will need to restart the node app when you make code changes, even in templates.*

In the terminal window, press control-C, then type node app.js

This creates a new `default` page type. But! Trying to add this page using the page settings menu and you'll get an error. Apostrophe is looking for the template `default.html` in `lib/modules/apostrophe-pages/views/pages`, so let's add the template `default.html`.

Now let's take a look at how to add content to the page.

### Extending Templates

With an empty `default.html`, we don't get much; not even a page title. But we can get quite a bit for free just by extending a layout template.

[Nunjucks](http://nunjucks.jlongster.com/) allows you to extend another template, with the option of overriding `blocks` to update or change the template. For example:

```markup
{% extends data.outerLayout %}
```

Extending the `outerLayout` provides the basic Apostrophe scaffolding for a page. The `outerLayout` contains several blocks which will be the basic structure of your HTML page:

```markup
<div class="apos-refreshable" data-apos-refreshable>
    {% block beforeMain %}{% endblock %}
    {% block main %}{% endblock %}
    {% block afterMain %}{% endblock %}
</div>
```

Blocks are another great Nunjucks feature; they are defined in `outerLayout.html`, and you can override them in your page template just by using the `block` keyword.

So using these blocks on your pages means everything output by your page template will be inserted into the outer layout in the appropriate spot.

**Tip:** you *can* override `outerLayout.html` in your own `lib/modules/apostrophe-templates/views` folder, but try not to. You already have complete control of the body, and overriding the outer layout makes you responsible for tracking changes in Apostrophe's version.

**"So why `data.outerLayout`? Why not just a filename?"** Apostrophe can actually refresh just the body of the page in certain situations. This variable points to the appropriate template, either the real outer layout or a simple "ajax layout" for refreshing the body. But you don't have to worry about it: just use `data.outerLayout`.

### Adding a section to the home page

Now that we've extended `outerLayout` in `default.html`, we can override the `beforeMain` block. Let's add a hero section to the top of the page:

```markup
{% block beforeMain %}
  <div class="block hero">
    <div class="inner">
      <div class="hero-text">
        <h4>Welcome to my first Apostrophe site!</h4>
      </div>
    </div>
  </div>
{% endblock %}
```

Because we extended the `outerLayout`, we can avoid duplicating a lot of markup.

**But what about editable content?** Good question! That's the next topic.
