# `integer`

`integer` adds an editable integer field to the schema. You may set minimum and maximum values using the `min` and `max` options. Any fractional part is discarded.

## Example

```javascript
{
  name: 'children',
  label: 'How many children do you have?',
  type: 'integer'
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
|min | `int` |  | The minimum acceptable value for the field |
|max | `int` |  | The maximum acceptable value for the field |
