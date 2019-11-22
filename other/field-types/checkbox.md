# `checkboxes`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| choices | array |  | An array of choices that the user can select from. Each must be an object with value and label properties. |  
| showFields | boolean | false | If true, additional fields can be displated when the user selects an answer. |

A `checkboxes` field presents an array of checkboxes. Its value is an array containing the values of the selected checkboxes.

**The** `showFields` **option can be used to show and hide other fields based on the choices that were made.** This is a very powerful way to make forms more user-friendly.

For example:

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

**In this example, the value of the** `preferences` **property of the data object will be an array of strings.** Each string is the `name` property of a choice that was checked. If no boxes are checked, the value is an empty array.

When "Friendly" is one of the selected checkboxes, the field named `friends` becomes visible. Otherwise that field is hidden.

The `required` option currently has no meaning for `checkboxes`.

This is a multiple-select field. For a single yes-or-no choice, see [boolean](schema-guide.md#boolean). For a single-select choice, see [select](schema-guide.md#select).

#### Fetching choices dynamically from APIs

What if the choices change and can't be hardcoded in your code? You can fetch them dynamically.

First, set the `choices` option to the **name of a method in your module.** Pass a string, the name of the method — do not pass a function.

Second, implement that function to take a single `(req)` argument and return an array of choices in the usual format. **You may use an async function, or return a promise that will resolve to the array.** That means you can reach out to APIs using modules like `axios` or `request-promise`.

> It is usually a good idea to perform at least short-term caching in your choices method, in order to limit the impact on performance when editing.

#### Fields and widgets: editing the field "in context" on the page

If present in the schema of a widget, `checkboxes` fields can also be edited inline on the page. All you have to do is set `widgetControls: true` in your schema for the field.

You may also want to set `contextual: true` so the field does not *also* appear in the dialog box for the widget. But, you don't have to.
