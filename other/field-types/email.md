# `email`

`email` fields operate similarly to `string` fields, but will only accept a valid email address. If they are not `required`, then they will also accept an empty string.

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

If this field is part of a doc type, such as a piece or page type, you may also set `sortify: true` to automatically create a parallel `Sortified` version of the field that is more intuitive for sorting purposes. Apostrophe will automatically use it if a request is made to sort on the original field.

For instance, if your field's `name` is `lastName` and you set `sortify: true`, `lastNameSortified` will automatically be created and used when sorting on the `lastName` field. This provides case-insensitive sorting that also ignores punctuation differences.

Note that if you add `sortify: true` to an existing field, existing objects will get the sortified version of the field the next time you run the `apostrophe-migrations:migrate` command line task. Migrations like this only need to be run once because on future updates or inserts of a document the sortified property is automatically set.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
