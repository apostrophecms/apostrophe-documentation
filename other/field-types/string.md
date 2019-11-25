# `string`

`string` adds an editable text string field to the schema. Setting `textarea: true` presents an interface that allows multiple lines. You may set minimum and maximum numbers of characters using the `min` and `max` options.

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

## Case-insensitive, intuitive sorting

If this field is part of a doc type, such as a piece or page type, you may also set `sortify: true` to automatically create a parallel `Sortified` version of the field that is more intuitive for sorting purposes. Apostrophe will automatically use it if a request is made to sort on the original field.

For instance, if your field's `name` is `lastName` and you set `sortify: true`, `lastNameSortified` will automatically be created and used when sorting on the `lastName` field. This provides case-insensitive sorting that also ignores punctuation differences.

{% hint style='info' %}
Note: If you add `sortify: true` to an existing field, existing objects will get the sortified version of the field the next time you run the `apostrophe-migrations:migrate` command line task. Migrations like this only need to be run once because on future updates or inserts of a document the sortified property is automatically set.
{% endhint %}

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| textArea | `boolean` | false | If true, create a larger text areas |
| searchable | `boolean` | true | If false, content from the area will not appear in search results. |
| sortify | `boolean` | false | If true, creates "sortified" fields |
