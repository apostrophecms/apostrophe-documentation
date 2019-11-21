# `array`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| limit | int |  | The maximum number of entries in the array |  
| titleField | string |  | Value used for array entry labels |
| listItemTemplate | template name |  | Enter the name of an available template to use for each list item |

An `array` field has its own schema, and allows the user to create one or more objects that have the fields in that schema. These objects are stored as an array.

This is useful for collections that clearly belong to a parent object, such as multiple homes for a person or tabs in a widget, and do not have any other relationships to other objects. If the objects in the array are also related to other types of objects, you should be using joins instead.

The `limit` property on array fields will limit the number of items an editor can add to the array. So if you set `limit: 3`, editors can only add up to three items in that array.

If the `titleField` property is set, the editing interface will use the value of that field as a distinguishing label for each entry in the array. You may also use "dot notation" to access a nested property just as you would with MongoDB.

If there is no `titleField` setting, the items are numbered. Setting `titleField` is recommended.

Note that `titleField` can access joins beginning with Apostrophe 2.50.0, which is especially useful with dot notation.

Example:

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

This template will be loaded from the `apostrophe-schemas` module, at project level \(`lib/modules/apostrophe/schemas/views/your-template-name.html` at project level\). **If you would rather it came from your own module, use "cross-module include" syntax,** like in the example below:

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