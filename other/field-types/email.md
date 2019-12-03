# `email`

`email` fields operate similarly to `string` fields, but will only accept a valid email address.

## Example

```javascript
// Single line, optional
{
  name: 'contact',
  label: 'Contact',
  type: 'email'
}
```

```javascript
// Single line, required
{
  name: 'contact',
  label: 'Contact',
  type: 'email',
  required: true
}
```

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|[sortify](../properties/sortify.md) | `boolean` | false | If true, creates "sortified" fields |
