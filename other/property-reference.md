Commonly used properties reference

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
|searchable | `boolean` | true | If false a field will not inform sitewide search | string, area, singleton |
|limit | `int` | | sets the max number of tags in a tag field, the max number of widgets in an area, and the max number of entries in an array  | tags, area, array  |
|options | `object` | | An object which contains options that can be set in the field | area, singleton |
|choices | `array` | | An array of values that the user can select from with each being an object with value and label properties | select, checkboxes |
|showFields | `boolean` | | A sub-property of choices, which allows additional fields to be displayed on selection | select, checkboxes, boolean |
