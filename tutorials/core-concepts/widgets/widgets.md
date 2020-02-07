---
title: Widgets
layout: tutorial
---

# Widgets

To build a widget, you define a schema (link) will all the fields and properties (link) you need, and then create a template to display those fields.

## Creating a Widget

You create a widget by creating a new module (link). A module is basically anything that is deployed to Apostrophe. It could be a collection of pages, widget, or a new content type.

You can create a widget in just a few steps:

1. Create the widget with the CLI. 

2. Register the widget in app.js. 

3. Create the widget’s schema in index.js. 

4. Create the widget’s template in widget.html. 

5. Display the widget by adding it to a page template.

You can see the [field reference](/other/field-types.md) for more information on all the options you have available for building widgets.

{% hint style="info" %}
Warning:  Your module name should not start with `apostrophe`. That's reserved for our official modules.
{% endhint %}

## Displaying a Widget

In Apostrophe, widgets are displayed on a page using tools called Areas and Singletons. An **Area** is a region of a page, defined in a template, where you can add one or more widgets to display. A **Singleton** displays a single widget in a fixed location. Because Areas and Singletons  are defined in templates which are used to create many pages, generally you’ll want the flexibility of Areas in order to add different widgets with different arrangements to pages using the same template, and use Singletons for specific cases where you need to have one widget in a fixed location.

### Area

An area can display any number of widgets, and it can display multiples of each type of widget assigned to the area. When you configure widgets to display in an area, and view it on a page, nothing will appear at first. When logged in as an editor a plus ("+") button is displayed which opens a menu for adding any widgets that are configured for that area.

### Singleton

A singleton will display the selected widget on the page with the options you configured in the template.
