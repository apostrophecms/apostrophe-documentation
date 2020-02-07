---
title: Pieces
layout: tutorial
---

## How to create a new piece type

You can create a new piece type in two steps:

1. Create a module for the new piece type.
2. Define the structure, or [schema](/tutorials/schema-guide/schema-guide.md), within the piece module.

### Create a new module for the piece type

To create a module, all you need to do is create a new folder, named for your new piece type, inside of your projects `lib/modules` folder (or use the `apostrophe create-piece` command from the CLI), and then register the module in `app.js`.

![](/.gitbook/assets/pieces-folders.png) 

### Define a schema within the piece module

The schema defines the types of [fields](/other/field-types.md) that make up the piece type. You create the schema for a piece in `index.js` in the root folder of the piece module.

## Creating pieces

Once you create and register a new piece type, it’s added to the main menu.

![](/.gitbook/assets/pieces-menu.png) 

You can easily add and manage entries through the administration interface that Apostrophe generates for each piece type.

![](/.gitbook/assets/pieces-manage.png) 

## Displaying pieces

Each piece type needs a widget or a piece page to display it. Within the piece pages or widget, you have access to the schema fields from the piece. You can access these in the templates by prepending `piece`. to the name of the field. For example, if you wanted to the title of the piece, you could access it with `piece.title` or if you had a field for the phone number named “phone” you could access it in the template with `piece.phone`.

### Pieces Widgets

You can [create a widget](/tutorials/core-concepts/widgets) for displaying pieces of a specific type. To do create a piece widget:

1. Create and register the widget.

2. Name the widget using the convention `<piece-name>-widgets`, this will provide you access to piece data in the widget without [further configuration](link)

3. Add your code to the widget

4. Add the widget to a page template in a singleton or area


### Pieces Pages

Piece pages enables you to create a page which displays all pieces of a certain type on one page, and also provide individual pages for each piece. The main page is called a **piece index page**, and the individual pages are called **piece show pages.**

As an example, if you were creating a site for a restaurant, the piece index page could be the menu which displays the name of each item and its price, and then the piece show pages could have pictures and nutritional information for each individual item.

To create pieces pages:

1. Create the module and register it as extending **apostrophe-pieces-pages**.

2. Name the module with the convention `<piece-name>-pages` so that you have access to piece data without further configuration.

3. Create an `index.html` template for the piece index page

4. Create a `show.html` template for the piece show pages
