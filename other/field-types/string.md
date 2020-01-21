# `string`

`string` adds an editable text field to the schema.

## Example

```javascript
// Single line
{
  name: 'author',
  label: 'Author',
  type: 'string'
}
```

```javascript
// Multiple line
{
  name: 'authors',
  label: 'Authors',
  type: 'string',
  textarea: true
}
```

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in the dialog box for a widget |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|textArea | `boolean` | false | If true, create a larger text areas |
|searchable | `boolean` | true | If false, content from the area will not appear in search results. |
|min | `integer` | | Sets the minimum number of characters allowed |
|max | `integer` | | Sets the maximum number of characters allowed |
|[sortify](../properties/sortify.md) | `boolean` | false | If true, creates "sortified" fields |
