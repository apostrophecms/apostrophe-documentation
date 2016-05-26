---
title: "Editing Page Templates"
---
## Editing Page Templates

This tutorial will introduce you to the `apostrophe-pages` and `apostrophe-templates` modules.  It will also cover the basics of editing page templates in [nunjucks](http://nunjucks.jlongster.com/), and show you how to add a hero section to the Home page.

### Orientation

Take a look in the `apostrophe-pages` module directory of your project (`lib/modules/apostrophe-pages`). Here you'll find a `/views` directory containing our `.html` template files.  Within the `/pages` subdirectory you fill find our existing Home page template, `home.html`.

### Nunjucks

Templates in Apostrophe are written with [nunjucks](http://nunjucks.jlongster.com/), a template language based on the popular [jinja2](http://jinja.pocoo.org/docs/)] from the Python world, which also has a well-known port called [Twig](http://twig.sensiolabs.org/) in the PHP world.

See the [jinja documentation](http://jinja.pocoo.org/docs/) for complete information about the template syntax. It's pretty easy.

### Extending Templates

One of the nicest features is that you can extend another template, overriding "blocks" to change parts of it, like this:

```markup
{% extends data.outerLayout %}
```

When you use `extends` in a page template, Apostrophe looks for the template in the `apostrophe-templates` module `/views` folder.  The `apostrophe-templates` module contains `outerLayout.html`, which provides the basic structure of your HTML page.  Everything output by your page template is inserted into the outer layout.  

In the [next tutorial](/), we'll learn how to create our own `outerLayout.html` and override other core templates in Apostrophe.

### Adding a section to the home page

Now, in `home.html`, we can override the `beforeMain` block that starts out empty in `outerLayout.html`.  Let's add a hero section to the top of the page:

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

Thanks to the shared outer and inner layouts, your templates are able to avoid duplicating a lot of markup.

*Tip: you will need to restart the node app when you make code changes, even in templates.* In the terminal window, press control-C, then type "node app" again (or just press the up arrow key to get back to that command). Since each node app is its own webserver, you'll need to get used to restarting when you make code changes. Tools like `nodemon` can help by automatically restarting your site when files are modified.
