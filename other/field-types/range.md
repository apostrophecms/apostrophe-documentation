# `range`

A `range` field provides [range input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) for selecting a numeric value, often represented in the browser as a slider. The step option may be used along with min and max, if desired, to effectively limit the results to integers.

## Example

```text
{
  type: 'range',
  name: 'fontSize',
  label: 'Font Size',
  min: 18,
  max: 32,
  step: 2 // optional
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
|min | `int` |  | The minimum acceptable value for the field |
|max | `int` |  | The maximum acceptable value for the field |
|step | `int` |  | The interval between numbers |
