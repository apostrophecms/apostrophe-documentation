# `singleton`

The `singleton` field type adds a single widget to your schema. It is exactly like calling `apos.singleton` in a page template.

The widget type is set by the `widgetType` property. The `options` property is passed on to the widget as its options object.

## Example

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

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|widgetType | `string` | | The name of the widget type to be displayed |
|options | `object` | | An object containing options which can be set on a field |  
|searchable | `boolean` | true | If false, content from the area will not appear in search results |
