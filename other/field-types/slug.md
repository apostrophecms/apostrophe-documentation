# `slug`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| page | boolean | false | If true, then the slug field is descriing a page |  
|---|---|---|---|

`slug` adds a slug field to the schema. Usually there is only one, named `slug`, and it is already part of your schema when extending pieces or custom pages.

If the `page` property is `true`, slashes are allowed and a leading slash is always supplied if missing. Otherwise slashes are not allowed.

By default slugs are sanitized by the [sluggo](https://github.com/punkave/sluggo) module. This can be changed by overriding the `apos.utils.slugify` method.