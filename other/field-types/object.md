# `object`

An `object` field has its own schema, and is very similar to an [`array`](array.md) field. However there is always exactly one object, represented as an object property of the doc in the database \(a sub-object\).

Using `object` instead of `array` when only dealing with a single object prevents unnecessary prefixing of field names and nesting does in the form.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| schema | `schema` | | The set of fields present for configuring the object | 
