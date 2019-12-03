# `select`

A single-select input field. The contents of the menu are set using the [`choices`](../properties/choices.md) property and its sub-properties.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| [choices](../properties/choices.md) | `array` |  | Provides the list of choices available for selection |
| *showFields* | `boolean` | false | A sub-property of choices, which allows additional fields to be displayed on selection |
| widgetContols | `boolean` | false | If true, `checkbox` fields can be edited in line on the page if the field is in a widget |
| contextual | `boolean` | false | If true, will prevent the `checkbox` field from appearing in the dialog box for a widget |
