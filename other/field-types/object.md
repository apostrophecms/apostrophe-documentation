# `object`

An `object` field has its own schema, and is very similar to an `array` field as described above. However there is always exactly one object, represented as an object property of the doc in the database \(a sub-object\).

The use of this field is not strictly necessary, however it does avoid unnecessary prefixing of field names and nesting does take place in the form, which opens up the possibility of styling things to match.