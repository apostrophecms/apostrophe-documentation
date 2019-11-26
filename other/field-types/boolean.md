# `boolean`

A `boolean` field is a simple "True/False" choice. The value stored in the database will be either `true` or `false`.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| type | `string` | | Specifies the field type |
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| mandatory | `string` |  | If set, the string is displayed if the user does not complete the field, often used for Terms and Conditions or similar content |
| [choices](../properties/choices.md) | `array` |  | An array of choices that the user can select from. Each must be an object with value and label properties. |    
| *showFields* | `boolean` | false | A sub-property, which allows additional fields to be displayed on selection. |
