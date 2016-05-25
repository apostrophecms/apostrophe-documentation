---
title: Arrays in schemas
---

#### Arrays in schemas

Let's say you're managing "companies," and each company has several "offices." Wouldn't it be nice if you could edit a list of offices while editing the company?

This is easy to do with the `array` field type. Arrays are a great way to manage a list of objects, with their own schema, that are nested inside your object.

### When to use arrays

You should use arrays when:

* The items in the array are clearly constituent parts of your larger document
* You don't need to refer to those items from other documents
* The items in the array don't have an independent life of their own that should continue if the larger document is gone
* You will not have thousands of items, pushing MongoDB's limit for a single document and impacting performance

If your needs don't match these requirements, you should use [use joins instead](joins.html).

### Example

```javascript
{
  name: 'offices',
  label: 'Offices',
  type: 'array',
  schema: [
    {
      name: 'city',
      label: 'City',
      type: 'string'
    },
    {
      name: 'zip',
      label: 'Zip',
      type: 'string',
      def: '19147'
    },
    {
      name: 'thumbnail',
      label: 'Thumbnail',
      type: 'singleton',
      widgetType: 'slideshow',
      options: {
        limit: 1
      }
    }
  ]
}
```

Each `array` has its own `schema`, which supports all of the usual field types. You an even nest an `array` in another `array`.

It's easy to access the resulting information in a page template, such as the `show` template for companies. The array property is... you guessed it... an array! Not hard to iterate over at all:

```markup
<h4>Offices</h4>
<ul>
  {% for office in item.offices %}
    <li>{{ office.city }}, {{ office.zip }}</li>
  {% endfor %}
</ul>
```

Areas and thumbnails are allowed in arrays. In order to display them in a page template,  you'll need to use this syntax:

```markup
{% for office in item.offices %}
  {{ aposSingleton({ area: office.thumbnail, type: 'slideshow', more options... }) }}
{% endfor %}
```

For an area you would write:

```markup
{% for office in item.offices %}
  {{ aposArea({ area: office.body, more options... }) }}
{% endfor %}
```

Since the area is not a direct property of the page, we can't use the `(page, areaname)` syntax that is typically more convenient.

Areas and thumbnails in arrays can be edited "in context" on a page.

Also check out [schema widgets](http://github.com/punkave/apostrophe-schema-widgets) for an alternative approach to related problems.

