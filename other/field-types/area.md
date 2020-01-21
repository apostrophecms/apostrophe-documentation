# `area`

The `area` field type defines an editable content area that allows users to add a series of widgets. It is exactly like calling `apos.area` in a page template.

The properties configured in `options` specify the allowed widget types and the configuration for those widgets. You can learn more about widget configuration in templates in [Nunjucks Helper Functions](/tutorials/core-concepts/working-with-templates/nunjucks-helper-functions.md).

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

|  Property | Type   | Default | Description | Sub-properties
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database | |
|label | `string` | | Sets the label of the field that the user sees | |
|required | `boolean` | false | If true, the field is mandatory | |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in the dialog box for a widget |
|type | `string` | | Specifies the field type | |
|readOnly | `boolean` | false | If true, prevents the user from editing the field | |
|help | `string` | | Help text for the field that will appear with the field's label | |
|htmlHelp | `string` | | Help text with support for HTML markup | universal | |
|limit | `int` | | Sets the number of widgets that can be added to an area |  |
|[options](../properties/options.md)| `object` | | An object containing options to be passed to `apos.area` | [`widgets`](../properties/options.md#widgets) |

