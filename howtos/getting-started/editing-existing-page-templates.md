---
title: "Editing existing page templates"
---

Take a look in the `views/pages` subdirectory of your project. Here you'll find `.html` files, including `default.html` and `home.html`. These are templates for the `default` and `home` page types. Typically most ordinary pages on your site will use the `default` type, while the home page will use the `home` type.

These templates are written with [nunjucks](http://nunjucks.jlongster.com/), a template language based on the popular [jinja2](http://jinja.pocoo.org/docs/)] from the Python world, which also has a well-known port called [Twig](http://twig.sensiolabs.org/) in the PHP world.

See the [jinja documentation](http://jinja.pocoo.org/docs/) for complete information about the template syntax. It's pretty easy.

One of the nicest features is that you can extend another template, overriding "blocks" to change parts of it, like this:

```markup
{% extends "layout.html" %}
```

When you use `extends` in a page template, Apostrophe looks for the template you're asking for in `views/global`. Sure enough, you'll find `layout.html` there.

Now, in `home.html`, we can override the `hero` block that starts out empty in `layout.html`:

```markup
{% block hero %}
  <div class="block hero">
    <div class="inner">
      <div class="hero-text">
        <h4>This is the sandbox! Feel free to log in, play around, and see what it can do.</h4>
      </div>
    </div>
  </div>
{% endblock %}
```

There's one more really critical template: `views/global/outerLayout.html`. This special template provides the basic structure of your HTML page. Everything output by your page template is inserted into the outer layout where you see this code:

```markup
{{ content }}
```

Thanks to the shared outer and inner layouts, your templates are able to avoid duplicating a lot of markup.

*Tip: you will need to restart the node app when you make code changes, even in templates.* In the terminal window, press control-C, then type "node app" again (or just press the up arrow key to get back to that command). Since each node app is its own webserver, you'll need to get used to restarting when you make code changes. Tools like `nodemon` can help by automatically restarting your site when files are modified.

