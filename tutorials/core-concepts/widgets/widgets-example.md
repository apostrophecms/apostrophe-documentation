---
title: Example: Creating and Displaying a Simple Widget
layout: tutorial
---

# Example: Creating and Displaying a Simple Widget

To demonstrate creating a widget, start simple, and create a simple customizable link widget. Then display it in two locations - first in a repeatable form in an area on the body of the page and then in the footer of the page with as a singleton. d

## Creating a Widget

1. In the terminal, from the project root, enter:

  ```bash
    apostrophe create-widget link
  ```

  ```
  Note: When you create a widget with the CLI, it will automatically append `-widgets` to the name you provide, so just enter the name of the widget. You don't want to end up with a module named `link-widget-widgets`!
  ```

2. Then register the module in `app.js` by adding the following to the `modules` section:

  ```markup
    {% code-tabs %} {% code-tabs-item title="app.js" %}
    modules: {
    
    // ...,
    'link-widgets': {}
    
    }
  ```

3. Now define your widgets schema in `lib/modules/link-widgets/index.js` in:

  ```markup
    module.exports = {

      extend: 'apostrophe-widgets',
      label: 'Link to a Page’,
      addFields: [

      {
        name: 'url',
        type: 'url',
        label: 'URL',
        required: true
      },

      {
        name: 'label',
        type: 'string',
        label: 'Label',
        required: true
      }

      ]

    };
  ```

  In the schema, we define a `url` and it’s label, a `string`.

4. Open `lib/modules/link-widgets/views/widget.html` and add the following code:

  ```markup
    <h4><a href="{{ data.widget.url }}">{{ data.widget.label }}</a></h4>
  ```
  
  In the widget template, the `label` is displayed and defined as a link to the `url`.

  ![](/.gitbook/assets/widgets-tree.png) 

```
Note: Every time you update your module configuration in app.js you will need to restart Apostrophe for the changes to take effect.
```

## Displaying a Widget

First add the widget to the body of the page.

1. Open `lib/modules/apostrophe-pages/views/pages/default.html`
2. Add the following block in the main body:

  ```markup
    {{ 
      apos.area(data.page, ‘main’, {
        widgets: { 
        link: {} 
        } 
      }) 
    }}
  ```

In the page template, the widget is in an “area.” And within the area, and editor can add any number of links.

Next, add a singleton to the footer.

1. Add this `afterMain` section to the bottom of default.html:

  ```markup
    {% block afterMain %} \
    {{ apos.singleton(data.page, ‘footer’, 'link', { \
      limit: 1 \
    }) }} \
    {% endblock %}
  ```

This adds the ability to set a single link in the footer.

### Testing the link widget

Go to a page that uses the `default.html` template (or create a new one), and you can see the widget on the page, with the option to add a new link.

![](/.gitbook/assets/widgets-add-link.png) 

If you click on that, you can define the label and url for the link.

![](/.gitbook/assets/widgets-define-link.png) 

You can add any number of links here.

![](/.gitbook/assets/widgets-links-on-page.png) 

Now, go to the footer, and set a link there.

![](/.gitbook/assets/widgets-footer-link1.png) 

Note that this link will remain unstyled since the footer does not have any styles associated with it at this time. Feel free to add your own, or reference the [Front End Assets](link) section for more information on adding your own stylesheets.

![](/.gitbook/assets/widgets-footer-link2.png) 

## Next Steps

Now that you know the basics of creating widgets with Apostrophe, you can check out some more advanced options, and learn all about how to unlock the full power of widgets. Or you can move on to learn more about [Pieces]() one of the most powerful content tools you have in Apostrophe.

How do I create a [Layout/Nested Widget](layout-widgets.md)?

How do I create [more complex widgets?](custom-widgets.md)?