# `integer`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| min | int |  | The minimum acceptable value for the field |
| max | int |  | The maximum acceptable value for the field |

`integer` adds an editable integer field to the schema. You may set minimum and maximum values using the `min` and `max` options. Any fractional part is discarded.

Example:

```javascript
{
  name: 'children',
  label: 'How many children do you have?',
  type: 'integer'
}
```
