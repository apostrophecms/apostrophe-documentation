# `singleton`

|  Property | Type   | Default | Description | 
|------------|--------|---|---|
| widgetType | string | | The name of the widget type to be displayed |
| options | array | | An array of options which can be set on a field |  
| searchable | boolean | true | If false, content from the area will not appear in search results. |

The `singleton` field type adds a single widget to your schema. It is exactly like calling `apos.singleton` in a page template.

The widget type is set by the `widgetType` property. The `options` property is passed on to the widget as its options object.

Example:

```javascript
{
  name: 'thumbnail',
  label: 'Thumbnail',
  type: 'singleton',
  widgetType: 'slideshow',
  options: {
    aspectRatio: [ 4, 3 ],
    minSize: [ 400, 300 ],
    limit: 1
  }
}
```
