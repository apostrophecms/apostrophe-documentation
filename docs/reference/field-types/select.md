# `select`

A single-select input field. The contents of the menu are set using the [`choices`](/reference/field-properties/choices.md) property and its sub-properties.

## Settings

|  Property | Type   | Default | Description | Sub-properties |
|---|---|---|---|---|
|name | `string` | | Sets the name of the field in the database | |
|label | `string` | | Sets the label of the field that the user sees | |
|required | `boolean` | false | If true, the field is mandatory | |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box | |
|type | `string` | | Specifies the field type | |
|readOnly | `boolean` | false | If true, prevents the user from editing the field | |
|help | `string` | | Help text for the field that will appear with the field's label | |
|htmlHelp | `string` | | Help text with support for HTML markup | |
|[choices](/reference/field-properties/choices.md) | `array` |  | An array of choices that the user can select from. Each must be an object with value and label properties. |  [**showFields**](/reference/field-properties/choices.md#showfields) |
|widgetControls | `boolean` | false | If true, `select` fields can be edited in context on the page if the field is in a widget | |
|[sortify](/reference/field-properties/sortify.md) | `boolean` | false | If true, creates "sortified" fields |

