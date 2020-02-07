---
title: "Example: Creating a Content Type with Pieces"
layout: tutorial
---

# Example: Creating a Content Type with Pieces

To demonstrate the process of creating new pieces, let’s create a a piece which represents “food” for a restaurant. The “food” will need a 

*   name (string)(url)
*   price (float)(url)
*   image (image)(url)

We’ll create a widget and piece pages to display the food as items on a menu.

## Create the Piece Type in a Module

First, create the new piece type, along with the modules for the widget and pages, and define the schema.

1. From your project root in your terminal, run the following command:

  ```bash
    apostrophe create-piece food --pages --widgets
  ```

2. Add the following code to the **modules** section of **app.js** to register the piece and the widget: \
  
  ```markup
    modules: { 
  
      ... 
      'foods': {}, 
      'foods-widgetss': { 
      extend: 'apostrophe-pieces-widgets' 
     }, 
    ... 
    } 
  ```

3. Open to **lib/modules/foods/index.js**

4. Add the following code to define the schema:

  ```markup
    module.exports = {
      extend: 'apostrophe-pieces',
      name: 'foods',
      label: 'Food',
      pluralLabel: 'Food',
    
      addFields: [
      {
        name: 'title',
        label: 'Name',
        type: 'string',
        required: true
      },
      {
        name: 'price',
        label: 'Price',
        type: 'float',
        required: true
      },
      {
        name: 'image',
        label: 'Image',
        type: 'singleton',
        widgetType: 'apostrophe-images',
        options: {
          limit: 1,
          minSize: [ 200, 200 ],
          aspectRatio: [ 1, 1 ]
      }
     }
     ]
    };
  ```


```
Note: Every time you update your module configuration in app.js you will need to restart Apostrophe for the changes to take effect.
```

## Create the Piece Widget

Next, define the template for the widget to display the new pieces.

1. Open `lib/modules/menu-item-widgets/views/widget.html`
2. Add the following code to define the display template for the piece:
  ```markup
    {% for piece in data.widget._pieces %}

      <h4>{% if piece._url %}<a href="{{ piece._url }}">{% endif %}

      {{ piece.title }}

      {% if piece._url %}</a>{% endif %}</h4>

      ${{ piece.price }}

      <p>{{ piece.description }}</p>

      {{ apos.singleton( piece, 'image', 'apostrophe-images',

        { edit: false }

      )}}

    {% endfor %}
  ```

## Displaying Pieces with a Widget

Next, create some pieces to display and add the new widget to a page.

### Create Pieces

1. Log in to your Apostrophe instance.

2. Open the main menu and select **Food**

3. Create some food to be displayed.

![](/.gitbook/assets/pieces-manage-food.png) 

### Add the Widget to a Page

1. Open `lib/modules/apostrophe-pages/views/pages/home.html`

2. Add the widget to the template with an area

  ```markup
    {{ apos.area(data.page, 'body', {
      widgets: {
        'foods': {}
        }
      }
    )}}
  ```

3. Navigate back to the home page, and you can now add a Menu Item Widget to the page.

4. Click *Add Food Widget* and you can define which pieces to display and how to display them in the widget.

![](/.gitbook/assets/pieces-add-food-widget.png) 

```
Note: in the widget template, you defined a **for loop** which looks through the list of all pieces to display. When you display the pieces in the widget, the selection you make in the dialog box will define the complete list of pieces that the template sees.
```

![](/.gitbook/assets/pieces-widget-page.png) 

Congratulations! You created a new content type and a widget to display it. However, there are some limitations to using a widget to display this sort of content. One limitation is that everything you do and configure is contained within the instance of the widget placed on a specific page. Another is that the pieces themselves don’t have a “home” that you can universally link to them from. Using pieces pages will solve this.

## Create the Pieces Pages

Since you created the new piece type with the `--pages` options, you already have the pieces pages module created. Now, you must register the pieces pages module in `app.js`, and create the templates for the index and show pages. 

![](/.gitbook/assets/pieces-pages-directory.png) 

1. Add the following code to `app.js` in the main modules section to register the pieces pages module.
  
  ```markup
    modules { 
      ... 
      'foods-pages': { 
          extend: 'apostrophe-pieces-pages'
        }, 
      ...
    }
  ```

2. Then register the pieces pages as a new page type by adding this is the `pages` subsection of `modules`:

  ```markup
    {
      name: 'foods-pages',
      label: 'Food’'
    }
  ```

3. Open `index.html` and add the following code:

  ```markup
    {% extends "layout.html" %}
     {% block title %}{{ data.page.title }}
    {% endblock %}

    {% block main %}
      <div class="main-content">
        {% for piece in data.pieces %}
          <h4><a href="{{ piece._url }}">{{ piece.title }}</a></h4> ${{ piece.price }}
        {% endfor %}
      </div>
    {% endblock %} \
  ```

4. Open `show.html` and add the following code:


  ```markup
    {% extends "layout.html" %}
    {% block title %}{{ data.piece.title }}{% endblock %}
    
    {% block main %}
      <div class="main-content">
        <h4> {{ data.piece.title }}
        ${{ data.piece.price }}
        
        {{ apos.singleton( data.piece, 'image', 'apostrophe-images',
          { edit: false }
        )}}
      </div>
    {% endblock %}
  ```

### Displaying Pieces with Pieces Pages

After you create and register the pieces pages module, you can create a new page for your piece type.

1. While logged into Apostrophe, open the _Page Menu_ and select _New Page_.

2. Under _Page Type_ select “Food”.

3. Name the page “Menu” and click _Save_.

![](/.gitbook/assets/pieces-create-pieces-page.png) 

This creates the piece index page. The `index.html` template generates links for each piece of the piece type.

![](/.gitbook/assets/pieces-menu-page.png) 

The pages for each piece are generated from the `show.html`, so you now have individual pages for each piece.

![](/.gitbook/assets/pieces-pieces-page.png) 

The individual pieces pages will even integrate back with the widget, since now each piece has its own page at its own URL.

## Next Steps

From this example you can see how powerful pieces are, but we’ve only just scratched the surface. You can continue reading to try a [different piece example which uses more features, like joins](joins.md), or you can go to the [Advanced Pieces](/tutorials/advanced-development/advanced-pieces-topics) to learn more about concepts like [filters](/tutorials/advanced-development/advanced-pieces-topics/adding-filters.md) and [columns](/tutorials/advanced-development/advanced-pieces-topics/adding-columns.md).

