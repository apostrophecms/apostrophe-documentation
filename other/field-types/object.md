# `object`

An `object` field has its own schema, and is very similar to an `array` field as described above. However there is always exactly one object, represented as an object property of the doc in the database \(a sub-object\).

The use of this field is not strictly necessary, however it does avoid unnecessary prefixing of field names and nesting does take place in the form, which opens up the possibility of styling things to match.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| schema | `schema` | | The set of fields present for configuring the object | 
