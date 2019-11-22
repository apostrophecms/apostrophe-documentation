# `boolean`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| mandatory | string |  | If set, the string is displayed if the user does not complete the field |  
| showFields | boolean | false | If true, additional fields can be displated when the user selects an answer. |

A `boolean` field is a simple "Yes or No" choice. The value stored in the database will be either `true` or `false`.

A `boolean` field can have a `mandatory` property that will require the user to change the value you to `true` during validation. Set the  string, and that string is displayed if the user does not select the boolean field in question. The user is then not permitted to complete the form unless they change their answer to Yes. This is a convenience feature for things like "terms and conditions".

**The** `showFields` **option can be used to show and hide other fields based on the choice that was made.** This is a very powerful way to make forms more user-friendly.

Example:

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

You can also set `showFields` for the value `false` if you wish.