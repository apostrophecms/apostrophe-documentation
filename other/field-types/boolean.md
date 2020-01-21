# `boolean`

A `boolean` field is a simple "True/False" choice. The value stored in the database will be either `true` or `false`. To customize the displayed values, use the `label` sub-property of [`choices`](../properties/choices.md). The `value` for each choice must always be "true" or "false".

## Settings

|  Property | Type   | Default | Description | Sub-properties |
|---|---|---|---|---|
|name | `string` | | Sets the name of the field in the database | |
|label | `string` | | Sets the label of the field that the user sees | |
|required | `boolean` | false | If true, the field is mandatory | |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in the dialog box for a widget | |
|type | `string` | | Specifies the field type |  |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |  |
|help | `string` | | Help text for the field that will appear with the field's label | |
|htmlHelp | `string` | | Help text with support for HTML markup | |
|mandatory | `string` |  | If set, the string is displayed if the user does not complete the field, often used for Terms and Conditions or similar content | |
|[choices](../properties/choices.md) | `array` |  | An array of choices that the user can select from. Each must be an object with value and label properties. |  [**showFields**](../properties/choices.md#showfields) |
