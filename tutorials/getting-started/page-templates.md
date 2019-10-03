---
title: Page Templates
layout: tutorial
---

# Page templates

This tutorial will introduce you to the `apostrophe-pages` and `apostrophe-templates` modules. It will also cover the basics of editing page templates in [Nunjucks](https://mozilla.github.io/nunjucks/), and show you how to add a hero section to the Home page.

But first, two quick questions we should answer... what the heck is an Apostrophe module? And what's this `app.js` file all about?

## About `app.js`

`app.js` is Apostrophe's main configuration file. This is the file that fires up Apostrophe with a given configuration, and is where you can specify what modules you want to be present in your project. As you add them, you also configure them by providing options via an object.

Some modules are always a part of Apostrophe whether you configure them or not. You will create more to meet the needs of your project.

## `lib/modules`: modules in Apostrophe

Apostrophe is a modular content management system. Each meaningful component is broken into its own module, which can then be interacted with or subclassed \(extended\) by other modules in the system. Under the hood, modules are powered by [moog](https://github.com/punkave/moog) and [moog-require](https://github.com/punkave/moog-require), but you don't have to understand that right away to build a great website.

The `lib/modules` folder of your project is where modules created for your own project live. And it is also where you can "implicitly subclass" \(i.e. configure or improve upon\) Apostrophe's own modules, whether part of the apostrophe npm module's core or packaged in separate npm modules.

We've already seen two modules that are extended in your test project's `lib/modules` folder, `apostrophe-assets` and `apostrophe-pages`. `apostrophe-assets` gets some custom [LESS CSS](http://lesscss.org/features/) files, while `apostrophe-pages` contains page templates.

**Apostrophe modules and npm modules are not the same thing.** One npm module might package several Apostrophe modules that are maintained together as a "bundle." You'll see this later when you install the `apostrophe-blog` npm module.

### Modifying page templates

Now that we know what a module is, let's take a look in the `apostrophe-pages` module directory of your project \(`lib/modules/apostrophe-pages`\). Here you'll find a `/views` directory containing our `.html` template files. Within the `/pages` subdirectory you'll find our existing Home page template, `home.html`. Right now, our site only has this template so let's add a new one.


Projects created with our CLI from the `apostrophe-boilerplate` project ship with a simple `layout.html` file in the top-level `views/` folder, where templates are found if they are not present in a specific module. If you peek in `layout.html`, you'll find several examples of "blocks" you can override, notably `main`:

{% code-tabs %}
{% code-tabs-item title="views/layout.html" %}
```markup
{% block beforeMain %}
  {#
    We recommend you use the beforeMain block for global page components
    like headers or navigation.
  #}
{% endblock %}

{% block main %}
  {#
    Usually, your page templates in the apostrophe-pages module will override
    this block. It is safe to assume this is where your page-specific content
    should go.
  #}
{% endblock %}

{% block afterMain %}
  {#
    This would be a great place to put a global footer.
  #}
{% endblock %}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

Blocks are another great Nunjucks feature; they are defined in files you extend, and you can override them in your page template just by using the `block` keyword.

So using these blocks on your pages means everything output by your page template will be inserted into the layout in the appropriate spot.

There is also a `title` block which you can extend to set the page title, although the default `layout.html` makes a good guess based on the current piece or page.

{% hint style='info' %}
Even `layout.html` extends another file. For a typical page load, it extends `outerLayout.html`, which lives in the `lib/modules/apostrophe-templates/views` folder. That file extends the `outerLayoutBase.html` file that ships with Apostrophe. Most of the time you won't need to look there, but it does contain additional blocks you can override, notably `extraHead` which is perfect for adding `link` elements to the `head` element and so on.
{% endhint %}