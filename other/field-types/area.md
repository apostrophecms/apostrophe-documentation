# `area`

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

|  Property | Type   | Default | Description | 
|---|---|---|---|
| options | array | | an array of options which can be set on a field |  
| searchable | boolean | true | If false, content from the area will not appear in search results. |
|---|---|---|---|
