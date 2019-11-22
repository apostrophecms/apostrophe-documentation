# `select`

A single-select dropdown menu. The `choices` array should be an array of objects with `label` and `value` properties. `value` is what winds up in the database, `label` is what the user sees.

**The** `showFields` **option can be used to show and hide other fields based on the choice that was made.** This is a very powerful way to make forms more user-friendly.

## Example 1

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

**A cursor filter method is added automatically for all fields of type** `select`**.** This means joins to pieces containing a `select` type field can be filtered by the field's value;

## Example 2

```javascript
{
  name: '_post',
  type: 'joinByOne',
  filters: {
    postType: 'event',
    projection: [
      ...
    ]
  }
}
```

## Fetching choices dynamically from APIs

What if the choices change and can't be hardcoded in your code? You can fetch them dynamically.

First, set the `choices` option to the **name of a method in your module.** Pass a string, the name of the method — do not pass a function.

Second, implement that function to take a single `(req)` argument and return an array of choices in the usual format. **You may use an async function, or return a promise that will resolve to the array.** That means you can reach out to APIs using modules like `axios` or `request-promise`.

> It is usually a good idea to perform at least short-term caching in your choices method, in order to limit the impact on performance when editing.

## Fields and widgets: editing the field "in context" on the page

If present in the schema of a widget, `select` fields can also be edited inline on the page. All you have to do is set `widgetControls: true` in your schema for the field.

You may also want to set `contextual: true` so the field does not *also* appear in the dialog box for the widget. But, you don't have to.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| choice | `array` |  | Provides the list of choices available for selection |

