# `area`

The `area` field type defines an editable content area that allows users to add a series of widgets. It is exactly like calling `apos.area` in a page template.

The `options` property passed to the field is passed on as the `options` object of the area.

## Example

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
## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| searchable | `boolean` | true | If false, content from the area will not appear in search results. |
| limit | `int` | | Sets the number of widgets that can be added to an area |  
| options | `object` | | A list of options that can be set |
