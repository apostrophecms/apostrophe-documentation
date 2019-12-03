# `checkboxes`

A `checkboxes` field presents a list of options where a user can select multiple items, or possible none at all depending on the configuration. The values of the checkbox entries are set using the [`choices`](../properties/choices.md) property and its sub-properties.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| type | `string` | | Specifies the field type |
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| choices | `array` |  | An array of choices that the user can select from. Each must be an object with value and label properties. |  
---
|	| *showFields* | `boolean` | false | A sub-property of eacg choice, which allows additional fields to be displayed on selection |
---
| widgetContols | `boolean` | false | If true, `checkbox` fields can be edited in line on the page if the field is in a widget |
| contextual | `boolean` | false | If true, will prevent the `checkbox` field from appearing in the dialog box for a widget |

