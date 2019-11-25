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

## Case-insensitive, intuitive sorting

Email fields can be sortified, just like [`string` field](string.md#case-insensitive-intuitive-sorting).

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
