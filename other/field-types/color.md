# `color`

A `color` field provides a colorpicker interface to the editor for choosing/pasting a hex value to be stored. Values are stored as hex strings.

## Example

```text
{
  type: 'color',
  name: 'bgColor',
  label: 'Background Color'
}
```
## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in the dialog box for a widget |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field | 
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |