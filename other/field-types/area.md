# `area`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| searchable | boolean | true | If false, content from the area will not appear in search results. |
| limit | int | | Sets the number of widgets that can be added to an area |  
|---|---|---|---|

The `area` field type defines an editable content area that allows users to add a series of widgets. It is exactly like calling `apos.area` in a page template.

The `options` property passed to the field is passed on as the `options` object of the area.

Example:

```javascript
{
  name: 'body',
  label: 'Biography',
  type: 'area',
  options: {
    // just like apos.area in a template
    widgets: {
      'apostrophe-rich-text': {
        toolbar: [ 'Bold', 'Italic', 'Link', 'Unlink' ]
      },
      'apostrophe-images': {}
    }
  }
}
```
