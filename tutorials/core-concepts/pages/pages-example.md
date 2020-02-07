---
title: "Example: Creating Pages with Templates"
layout: tutorial
---

# Example: Creating Pages with Templates

To demonstrate how to create and connect pages with Apostrophe you’ll:

1. Create a new page template

2. Create pages based on that template

3. Create a simple navigation element to link between those pages.

## Create a new page template

First create the new template, and register it so that we can use it to create pages.

1. Create a file name `default.html` in `lib/modules/apostrophe-pages/views/pages`

2. Add the following code to the file: 

  ```markup
    {% extends "layout.html" %}

    {% block main %}
    ... 
    {% endblock %}
  ```

3. Open `app.js`

4. Add the following code to the `apostrophe-pages` section:

  ```markup
    { name: 'default', label: 'Default' }
  ```

{% hint style="info" %}
You might have noticed two things in our template code:

Our template extends `layout.html`
The "blocks" in the code which define different section of the template. 

`layout.html` is where the base styles for Apostrophe templates are stored. You can use it to apply universal styles to all of your templates. Blocks are a feature of Nunjucks which allow you to easily define styles and behavior for various elements on the page.
{% endhint %}

### Create pages based on a template

Now that you have a template, you can log in to Apostrophe and use it to create a new page.

1. Log in to Apostrophe.

2. Open the page menu and select *New Page*

3. In the dialog that appears, enter “About Us” for the name and select *Default* for the template.

Now you have a new page based off your template, but if you go back to the homepage you might notice that you can’t get to your new page right now without manually entering the URL. Before we continue: 

1. Go back to the *Page Menu* and create some additional pages.
2. Click on *Page Menu -> Reorganize* dragging and dropping pages to change the order and nest them.

![](/.gitbook/assets/pages-reorganize-pages.gif)

### Connecting pages with a simple navigation

To more easily navigate from page to page, you need to add links to your various pages in your template. Remember, you don’t need to manually add links to create your navigation, you can generate the links using the page tree.

1. Open `lib/modules/apostrophe-pages/views/pages/default.html`
2. Add the following code to dynamically link between pages.

  ```markup
    <ul class="tabs">

      {% for tab in data.home._children %}
        <li class="
          {% if data.page and
            (apos.pages.isAncestorOf(tab, data.page) or tab._id == data.page._id)
          %}
            current
          {% endif %}
        "><a href="{{ tab._url }}">{{ tab.title }}</a></li>
      {% endfor %}
    </ul>
  ```
3. Add the same code to `lib/modules/apostrophe-pages/views/pages/home.html` to add it to the Home page as well.

This adds a simple, unstyled navigation that you can use to easily navigate across all your site.

![](/.gitbook/assets/pages-simple-nav.png)

Feel free to add your own styles, or check out the [Front End Assets](/tutorials/core-concepts/front-end-assets) section to spice it up a little bit.

## Next Steps

You have a site with some pages, but there’s no content yet. To learn how to add content to your pages continue reading to learn about [Widgets](/tutorials/core-concepts/widgets) and [Pieces](tutorials/core-concepts/pieces). 

To dig a little deeper into page templates and navigation, you can continue on to try out some [More Navigation Examples](more-navigation-examples.md)
