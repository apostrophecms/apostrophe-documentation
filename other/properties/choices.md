# `choices`

Use `choices` in conjunction with the `boolean`, `checkbox`, and `select` fields to define the choices that a user will see. The `choices` array should be an array of objects with `label` and `value` properties. `value` is what winds up in the database, `label` is what the user sees.

## `showFields`

The `showFields` sub-option can be used to show and hide other fields based on the choice that was made. This is a very powerful way to make forms more user-friendly.

### `boolean` Example

```javascript
{
  type: 'boolean',
  name: 'housing',
  label: 'Do you require housing?',
  mandatory: 'Sorry, you need to have housing!',
  choices: [
    {
      value: true,
      showFields: [
        'dormPreference', 'vegetarian'
      ]
    }
  ]
}
```

When "Yes" is selected, the `value` becomes `true`, and the fields named `dormPreference` and `vegetarian` will be visible. At all other times they will not be.

### `checkboxes` Example

```javascript
{
  type: 'checkboxes',
  name: 'preferences',
  label: 'Preferences (check one or more)',
  choices: [
    {
      label: 'Big',
      value: 'big'
    },
    {
      label: 'Friendly',
      value: 'friendly',
      showFields: [ 'friends' ]
    },
    {
      label: 'Furry',
      value: 'furry'
    }
  ]
}
```

In this example, the value of the `preferences` property of the data object will be an array of strings. Each string is the `name` property of a choice that was checked. If no boxes are checked, the value is an empty array.

When "Friendly" is one of the selected checkboxes, the field named `friends` becomes visible. Otherwise that field is hidden.

### `select` Example

```javascript
{
  type: 'select',
  name: 'housing',
  label: 'Where will you be staying?',
  choices: [
    {
      label: 'On Campus',
      value: 'on-campus',
      showFields: [
        'accessible', 'vegetarian'
      ]
    },
    {
      label: 'Off Campus',
      value: 'off-campus'
    }
  ]
}
```

When the "On Campus" choice is selected, the schema fields named `accessible` and `vegetarian` will be visible. At all other times they will not be.

A cursor filter method is added automatically for all fields of type `select`. This means joins to pieces containing a `select` type field can be filtered by the field's value;

```javascript
{
  name: '_post',
  type: 'joinByOne',
  filters: {
    postType: 'event',
  }
}
```

## Fetching choices dynamically from APIs

What if the choices change and can't be hardcoded in your code? You can fetch them dynamically.

First, set the `choices` option to the name of a method in your module. Pass a string, the name of the method — do not pass a function.

Second, implement that function to take a single `(req)` argument and return an array of choices in the usual format. You may use an async function, or return a promise that will resolve to the array. That means you can reach out to APIs using modules like `axios` or `request-promise`.

It is usually a good idea to perform at least short-term caching in your choices method, in order to limit the impact on performance when editing.
