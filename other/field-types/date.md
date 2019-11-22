# `date`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| pikadayOptions | float |  | Allows configuration of the date format |


`date` adds an editable date field to the schema. A friendly date picker UI is presented when the field is clicked. Dates are stored as strings in `YYYY-MM-DD` format, which is good for sorting and comparing purposes.

Example:

```javascript
{
  name: 'date',
  label: 'Date',
  type: 'date'
}
```

The date picker UI can be configured by using the `pikadayOptions` configuration. We use [pikaday](https://github.com/dbushell/Pikaday#usage) and most configurations should work without problems.

Example with configuration of date picker:

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

**Note: Apostrophe tries its best to convert any date picker format to the above mentioned** `YYYY-MM-DD` **friendly sorting format, but very advanced configurations may not work out of the box, so please keep that in mind.**

**If you do not set** `def: null` **or** `required: true`**, the date defaults to the current date.**