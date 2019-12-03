# `float`

`float` adds an editable numeric field which supports decimal input to the schema. You may set minimum and maximum values using the `min` and `max` options.

## Example

```javascript
{
  name: 'gpa',
  label: 'What is your GPA?',
  type: 'float',
  min: 1.0,
  max: 4.0
}
```

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|type | `string` | | Specifies the field type | 
|readOnly | `boolean` | false | If true, prevents the user from editing the field | 
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|min | `float` |  | The minimum acceptable value for the field |
|max | `float` |  | The maximum acceptable value for the field |
