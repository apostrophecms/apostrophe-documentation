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
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| textArea | `boolean` | false | If true, create a larger text areas |
| searchable | `boolean` | true | If false, content from the area will not appear in search results. |
| min | `integer` | | Sets the minimum number of characters allowed |
| max | `integer` | | Sets the maximum number of characters allowed |
| [sortify](../properties/sortify.md) | `boolean` | false | If true, creates "sortified" fields |
