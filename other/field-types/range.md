# `range`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| min | `int` |  | The minimum acceptable value for the field |
| max | `int` |  | The maximum acceptable value for the field |
| step | `int` |  | The interval between numbers |

A `range` field provides a [range input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) interface for tuning integers. Values are stored as floats.

Example:

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