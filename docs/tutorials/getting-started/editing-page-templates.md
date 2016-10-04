---
title: "Editing Page Templates"
layout: tutorial
---
## Editing Page Templates

This tutorial will introduce you to the `apostrophe-pages` and `apostrophe-templates` modules.  It will also cover the basics of editing page templates in [Nunjucks](http://nunjucks.jlongster.com/), and show you how to add a hero section to the Home page.

But first, two quick questions we should answer... what the heck is an Apostrophe module? And what's this `app.js` file all about?

## About `app.js`

`app.js` is Apostrophe's main configuration file. This is the file that fires up Apostrophe with a given configuration, and is where you can specify what modules you want to be present in your project. As you add them, you also configure them by providing options via an object.

Some modules are always a part of Apostrophe whether you configure them or not. You will create more to meet the needs of your project.

## `lib/modules`: modules in Apostrophe

Apostrophe is a modular content management system. Each meaningful component is broken into its own module, which can then be interacted with or subclassed (extended) by other modules in the system. Under the hood, modules are powered by [moog](https://github.com/punkave/moog) and [moog-require](https://github.com/punkave/moog-require), but you don't have to understand that right away to build a great website.

The `lib/modules` folder of your project is where modules created for your own project live. And it is also where you can "implicitly subclass" (i.e. configure or improve upon) Apostrophe's own modules, whether part of the apostrophe npm module's core or packaged in separate npm modules.

We've already seen two modules that are extended in your test project's `lib/modules` folder, `apostrophe-assets` and `apostrophe-pages`. `apostrophe-assets` gets some custom [LESS CSS](http://lesscss.org/features/) files, while `apostrophe-pages` contains page templates.

**Apostrophe modules and npm modules are not the same thing.** One npm module might package several Apostrophe modules that are maintained together as a "bundle." You'll see this later when you install the `apostrophe-blog` npm module.

### Modifying page templates

Now that we know what a module is, let's take a look in the `apostrophe-pages` module directory of your project (`lib/modules/apostrophe-pages`). Here you'll find a `/views` directory containing our `.html` template files.  Within the `/pages` subdirectory you'll find our existing Home page template, `home.html`. Right now, our site only has this template so let's add a new one.

### Adding a New Page Template

Let's add a `default` template for new pages.

The first step is to add configuration for the `apostrophe-pages` module in `app.js`:

```javascript
    // This configures our default page template
    'apostrophe-pages': {
      types: [
        {
          name: 'default',
          label: 'Default'
        },
        {
          name: 'home',
          label: 'Home'
        },
      ]
    }
```

> You will need to restart the node app when you make code changes, even in templates. In the terminal window, press control-C, then type: `node app.js`
>
> This is because every node application is a webserver in its own right. Unlike PHP applications, node apps "stay alive" indefinitely, handling many page requests asynchronously for better performance. Later, [in production](../intermediate/deployment.html), we'll use a more robust webserver as a "frontend proxy" to help handle the load.

### Creating and Extending Page Templates

We've configured the two page types we want for our site. But if you try to add a new page now via the "Page Menu" (lower left corner) and give it the  "default" page type, you'll get an error.

Apostrophe is looking for the template file `lib/modules/apostrophe-pages/views/pages/default.html`. So open up your editor and create that file.

Now let's take a look at how to add content to the page.

With an empty `default.html`, we don't get much; not even a page title. But we can get quite a bit for free just by extending a layout template.

[Nunjucks](http://nunjucks.jlongster.com/) allows you to extend another template, with the option of overriding `blocks` to update or change the template. For example:

```markup
{% extends data.outerLayout %}
```

Extending the `outerLayout` provides the basic Apostrophe scaffolding for a page. A quick peek at Apostrophe's `outerLayout` template reveals several blocks which will be the basic structure of your HTML page:

```markup
<div class="apos-refreshable" data-apos-refreshable>
    {% block beforeMain %}{% endblock %}
    {% block main %}{% endblock %}
    {% block afterMain %}{% endblock %}
</div>
```

Blocks are another great Nunjucks feature; they are defined in `outerLayout.html`, and you can override them in your page template just by using the `block` keyword.

So using these blocks on your pages means everything output by your page template will be inserted into the outer layout in the appropriate spot.

**"So why `data.outerLayout`? Why not just a filename?"** Apostrophe can actually refresh just the body of the page in certain situations. This variable points to the appropriate template, either the real outer layout or a simple "ajax layout" for refreshing the body. But you don't have to worry about it: just use `data.outerLayout`.

> if you peek at `outerLayout.html` in the Apostrophe npm module, you'll discover it just extends `outerLayoutBase.html`. We did this so that you can override `outerLayout.html` by supplying your own in `lib/modules/apostrophe-templates/views`, extend `outerLayoutBase.html`, and selectively override its blocks. This gives you a unique "master layout" for all of your templates in the project.

### Using blocks to override parts of the layout

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
