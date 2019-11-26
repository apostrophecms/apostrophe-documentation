
# Schema Field Property Reference

Each [Schema Field](/tutorials/advanced-development/schema-guide.md#guide-to-schema-field-types) in Apostrophe can take a number of different properties for configuration and display settings. Below is a reference of the most commonly used properties. You can also view the reference for each individual field for a complete list of properties used by that field and an explanation of what it does.

## Commonly Used Properties

| Property | Type | Default | Description | Used By |
|----------|------|---------|-------------|---------|
|name | `string` | | Sets the name of the field in the database | universal |
|label | `string` | | Sets the label of the field that the user sees | universal |
|required | `boolean` | false | If true, the field is mandatory | universal |
|type | `string` | | Specifies the field type | universal |
|readOnly | `boolean` | false | If true, prevents the user from editing the field | universal |
|help | `string` | | Help text for te field that will appear with the field's label | universal |
|htmlHelp | `string` | | Help text with support for HTML markup | universal |
|def | depends on field type | | The default value for the field | most fields, excluding areas, singletons, objects, and arrays |
|searchable | `boolean` | true | If false a field will not inform sitewide search | [string](field-types/string.md), [area](field-types/area.md), [singleton](field-types/singleton.md) |
|limit | `int` | | sets the max number of tags in a tag field, the max number of widgets in an area, and the max number of entries in an array  | [tags](field-types/tags.md), [area](field-types/area.md), [array](field-types/array.md)  |
|options | `object` | | An object which contains options that can be set in the field | [area](field-types/area.md), [singleton](field-types/singleton.md) |
|[sortify](properties/sortify.md) | `boolean` | false | If true, creates a parallel Sortified version of the field that is more intuitive for sorting  | [string](field-types/string.md), [email](field-types/email.md) |
|[choices](properties/choices.,d) | `array` | | An array of values that the user can select from with each being an object with value and label properties | [boolean](field-types/boolean.md) [select](field-types/select.md), [checkboxes](field-types/checkboxes.md) |
|*showFields* | `boolean` | | A sub-property of choices, which allows additional fields to be displayed on selection | [select](field-types/select.md), [checkboxes](field-types/checkboxes.md), [boolean](field-types/boolean.md) |
|*label* | `string` | | A sub-property of choices, which specifices the label for each item | [select](field-types/select.md), [checkboxes](field-types/checkboxes.md), [boolean](field-types/boolean.md) |
|*value* | `string` | | A sub-property of choices, which specifices the value for each item | [select](field-types/select.md), [checkboxes](field-types/checkboxes.md), [boolean](field-types/boolean.md) |