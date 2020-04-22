# `checkboxes`

A `checkboxes` field presents a list of options where a user can select multiple items, or possible none at all depending on the configuration. The values of the checkbox entries are set using the [`choices`](/reference/field-properties/choices.md) property and its sub-properties.

## Settings

|  Property | Type   | Default | Description | Sub-properties |
|---|---|---|---|---|
|name | `string` | | Sets the name of the field in the database | |
|label | `string` | | Sets the label of the field that the user sees | |
|required | `boolean` | false | If true, the field is mandatory | |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box | |
|type | `string` | | Specifies the field type |  |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |  |
|help | `string` | | Help text for the field that will appear with the field's label | |
|htmlHelp | `string` | | Help text with support for HTML markup | |
|[choices](/reference/field-properties/choices.md) | `array` |  | An array of choices that the user can select from. Each must be an object with value and label properties. |  [**showFields**](/reference/field-properties/choices.md#showfields) |
|widgetContols | `boolean` | false | If true, `checkbox` fields can be edited in line on the page if the field is in a widget | |
