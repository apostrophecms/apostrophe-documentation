# `object`

An `object` field has its own schema, and is very similar to an [`array`](array.md) field. However there is always exactly one object, represented as an object property of the doc in the database \(a sub-object\).

Using `object` instead of `array` when only dealing with a single object prevents unnecessary prefixing of field names and nesting docs in the form.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|schema | `schema` | | The set of fields present for configuring the object | 
