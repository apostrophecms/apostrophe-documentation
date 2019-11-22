# `color`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| type | `string` | | Specifies the field type |
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |


A `color` field provides a colorpicker interface to the editor for choosing/pasting a hex value to be stored. Values are stored as hex strings.

Example:

```text
{
  type: 'color',
  name: 'bgColor',
  label: 'Background Color'
}
```
