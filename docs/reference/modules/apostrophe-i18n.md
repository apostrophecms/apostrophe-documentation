# apostrophe-i18n
## Inherits from: [apostrophe-module](./apostrophe-module/README.md)
This module makes an instance of the [i18n](https://npmjs.org/package/i18n) npm module available
as `apos.i18n`. Apostrophe also makes this available in Nunjucks templates via the
usual `__ns('apostrophe', )` helper function. Any options passed to this module are passed on to `i18n`.

By default i18n locale files are generated in the `locales` subdirectory of the project.

## Options

`localesDir`: if specified, the locale `.json` files are stored here, otherwise they
are stored in the `locales` subdirectory of the project root.

`namespaces`: if set to `true`, the translation key is prefixed like this
so that translation teams can tell the difference between Apostrophe's
UI phrases and your own phrases:

"apostrophe<:>Phrase Here"

The separator was chosen to be unlikely to be part of your actual text,
but you can change the separator with the `namespaceOperator` option.

## Namespacing your own i18n calls

You can optionally namespace your own i18n calls by invoking
`__ns('namespace', 'phrase')` rather than `__('phrase')`,
`__ns_n` rather than `__n`, etc.

Currently the namespaced wrapper calls only support being invoked with a key as the
second argument. Other variations are not supported with namespaces.

*If you are using the `objectNotation` option to i18n, do not use your
objectNotation separator character in a namespace name.*


## Methods
### namespacesMiddleware(*req*, *res*, *next*)

