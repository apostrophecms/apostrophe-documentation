# `array`

An `array` field has its own schema, and allows the user to create one or more objects that have the fields in that schema. These objects are stored as an array.

This is useful for collections that clearly belong to a parent object, such as multiple email addresses for a business or tabs in a widget, and do not have any other relationships to other objects.

If the objects in the array are also related to other doc types, such as pieces or pages, you should be using [joins](joinByOne.md) instead.

## Example 1

```javascript
{
  name: 'homes',
  label: 'Homes',
  type: 'array',
  titleField: 'address',
  schema: [
    {
      type: 'string',
      name: 'address',
      label: 'Address'
    },
    {
      type: 'string',
      name: 'zip',
      label: 'Zip'
    },
  ]
}
```

If `titleField` is not enough for your purposes, you can completely customize the output of the titles by setting `gr` to the name of a custom Nunjucks template. All your template has to do is output whatever it wants, based on the `item` variable provided to it.

This template will be loaded from the `apostrophe-schemas` module, at project level \(`lib/modules/apostrophe/schemas/views/your-template-name.html` at project level\).

## Example 2: Cross module includes

If you would rather the template came from your own module, use "cross-module include" syntax, like this:

```javascript
// app.js
// ... where you configure your modules ...
  modules: {
    products: {},
    // other modules...
  }
```

```javascript
// lib/modules/products/index.js
module.exports = {
  extend: 'apostrophe-pieces',
  name: 'product',
  addFields: [
    {
      type: 'array',
      name: 'features',
      listItemTemplate: 'products:listItem.html',
      schema: [
        {
          type: 'singleton',
          name: 'description',
          widgetType: 'apostrophe-rich-text',
          required: true
        }
      ]
    }
  ]
}
```

```markup
{# lib/modules/products/listItem.html #}

<div>{{ apos.areas.richText(item.description) }}</div>
```

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| limit | `int` |  | The maximum number of entries in the array |
| schema | `schema` | | The set of fields present for each object |
| titleField | `string` |  | If provided, the editing interface will use the value of that field as a distinguishing label for each entry in the array. Uses "dot notation" to access a nested property just as you would with MongoDB. |
| listItemTemplate | template name |  | Enter the name of a nunjucks template to customize title output for each value in the array |

{% hint style='info' %}
Notes on `titlefield`:
* If there is no `titleField` setting, the items are numbered.

* Setting `titleField` is recommended to improve clarity for content editors.

* `titleField` can access joins beginning with Apostrophe 2.50.0, which is especially useful with dot notation.
{% endhint %}
