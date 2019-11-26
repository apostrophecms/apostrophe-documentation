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
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| [sortify](../properties/sortify.md) | `boolean` | false | If true, creates "sortified" fields |
