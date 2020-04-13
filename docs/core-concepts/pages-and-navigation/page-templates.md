---
title: Page Templates
layout: tutorial
---

# Page Templates

The first thing you need to do is create a page. You can create the most amazing content in history, but if it doesn't have a page to be displayed on, then no one will ever know.

There are three main steps for creating a new page:

1. Create the template for the new page.

2. Register the new page template in `app.js`

3. Add the page through the ApostropheCMS user interface.

To create new pages and page templates, you'll use the `apostrophe-pages` and `apostrophe-templates` modules. You'll also learn the basics of editing page templates in [Nunjucks](https://mozilla.github.io/nunjucks/), and a little bit about modules in Apostrophe.

## Creating Page Templates

First you want to create you template. A page template in Apostrophe is stored in an `.html` file, and is composed of HTML and JavaScript with additional features added through the Nunjucks templating language. The primary location for page templates is `lib/modules/apostrophe-pages/views/`.

If you have an existing Apostrophe project, take a look at the `apostrophe-pages` module directory of the project \(`lib/modules/apostrophe-pages`\). Here you'll find a `/views` directory containing our `.html` template files. Within the `/pages` subdirectory by default, you'll just find the Home page template, `home.html`.

In addition to the `home.html` template in `lib/modules/apostrophe-pages`, projects created with our CLI from the `apostrophe-boilerplate` project ship with a simple `layout.html` file in the top-level `views/` folder. Templates  that are not from a specific module are found in `views/`. If you peek inside `layout.html`, you'll find several examples of "blocks":


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

Blocks are a great Nunjucks feature; they are defined in files, and when you extend that file, you can override them in your page template by using the `block`keyword. So using these blocks on your pages means everything output by your page template will be inserted into the layout in the appropriate spot.

Two blocks to take note of are `title` and `main`. You can extend the `title` blockto set the page title, although the default `layout.html` makes a good guess based on the current piece or page. The `main` block is where the content of your page will go.

As a rule, you should extend the `layout.html` or create your own templates using a similar pattern in `views/` to extend, rather than creating all of your templates.

### Example: Creating a New Page Template

To create a page template:

1. Create new HTML file in `lib/modules/apostrophe-pages/views/pages/` named `default.html`.

2. At the top of the file, extend `layout.html`
    ```markup
    {% extends "layout.html" %}
    ```
3. Within the file create the different blocks that you will need.

    ```markup
    {% block main %}
    ...
    {% endblock %}
    ```

    In this example, we only created a main block, since often you'll want to use content inherited from the main template in `beforeMain` and `afterMain`. The main block would be filled with various widgets used to display and create content. But let's not get ahead of ourselves.

Now that you have a `default.html` file, you need to register it in `app.js` to make it available.

{% hint style='info' %}
Even `layout.html` extends another file. For a typical page load, it extends `outerLayout.html`, which lives in the `lib/modules/apostrophe-templates/views` folder. That file extends the `outerLayoutBase.html` file that ships with Apostrophe. Most of the time you won't need to look there, but it does contain additional blocks you can override, notably `extraHead` which is perfect for adding `link` elements to the `head` element and so on.
{% endhint %}

## Configuring Apostrophe with `app.js`

`app.js` is Apostrophe's main configuration file. This is the file that fires up Apostrophe with a given configuration, and is where you can specify what modules you want to be present in your project. As you add them, you also configure them by providing options via an object.

Some modules are always a part of Apostrophe whether you configure them or not, and you can create your own modules to meet the needs of your project. To learn more abuou modules, visit the [Modules section](/tutorials/core-concepts/modules/README.md).

In order for any new page template to load, you must add it to `app.js`. When you add a new page template to `app.js`, remember, you're not creating a new page: you're registering a page template that can be used to create new pages.


### Example: Adding a Page Template to `app.js`

1. Open `app.js` in your favorite text editor.

2. Add the registration for your new page template to `app.js`:


{% code-tabs-item title="app.js" %}
    ```javascript
        // This configures our default page template
        'apostrophe-pages': {
          types: [
            //This is the new section
            {
              name: 'default',
              label: 'Default'
            },
            //The rest is what what was there already
            {
              name: 'home',
              label: 'Home'
            },
          ]
        },
    ```
{% endcode-tabs-item %}
{% endcode-tabs %}

Remember, all you're doing here is registering a template. New pages are created in context on your Apostrophe instance.

### Example: Create a Page from the New Template

Now that you created the template, use it to create a new page.

1. Log on to Apostrophe.

2. Open the main menu and select *Pages*.

3. Click *New Page*.

4. Enter a Title, a friendly URL, and select your new template under Type.

![Creating a new page](/images/assets/create_new_page2.png)


Nice work! You created a new page template, and now you can create as many pages as you like from that template. Next we'll talk about using Widgets, Singletons, and Areas to add content to your page.

