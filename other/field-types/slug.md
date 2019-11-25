# `slug`

`slug` adds a slug field to the schema. Usually there is only one, named `slug`, and it is already part of your schema when extending pieces or custom pages.

If `page` is set to `true`, then slashes are allowed and a leading slash is always supplied if missing. Slashes are not allowed if the `page` property is `false`.

By default slugs are sanitized by the [sluggo](https://github.com/punkave/sluggo) module. This can be changed by overriding the `apos.utils.slugify` method.

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| page | `boolean` | false | If true, then the slug field is describing a page |  