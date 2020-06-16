# `date`

`date` adds an editable date field to the schema. A friendly date picker UI is presented when the field is clicked. Dates are stored as strings in `YYYY-MM-DD` format.

## Example 1

```javascript
{
  name: 'date',
  label: 'Date',
  type: 'date'
}
```

The date picker UI uses [pikaday](https://github.com/dbushell/Pikaday#usage) for configuration.

## Example with configuration of date picker

```javascript
{
  name: 'date',
  label: 'Date',
  type: 'date',
  pikadayOptions: {
    format: 'DD/MM/YYYY',
    firstDay: 1
  }
}
```

::: tip NOTE
Apostrophe tries its best to convert any date picker format to the above mentioned `YYYY-MM-DD` friendly sorting format, but very advanced configurations may not work out of the box, so please keep that in mind.
:::

## Settings

|  Property | Type   | Default | Description |
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|pikadayOptions | `object` |  | Allows configuration of the date format |
