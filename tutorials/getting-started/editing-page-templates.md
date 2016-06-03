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

Using [Nunjucks](http://nunjucks.jlongster.com/), allows you to extend another template, with the option of overriding `blocks` to update or change the template, for example:

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

Using these blocks on your pages means everything output by your page template will be inserted into the outer layout.  

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

Because we extended the `outerLayout`, you can avoid duplicating a lot of markup.
