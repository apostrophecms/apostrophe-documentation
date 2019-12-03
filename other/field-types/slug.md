# `slug`

`slug` adds a slug field to the schema for specifying the contextual location of content in your site. Usually there is only one, named `slug`, and it is already part of your schema when extending pieces or custom pages.

By default slugs are sanitized by the [sluggo](https://github.com/punkave/sluggo) module. This can be changed by overriding the `apos.utils.slugify` method.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|page | `boolean` | false | If true, then the slug field is describing a page and slashes are allowed |  