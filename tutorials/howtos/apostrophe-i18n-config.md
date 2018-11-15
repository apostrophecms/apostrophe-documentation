---
title: apostrophe-i18n configuration
layout: tutorial
---

This module makes an instance of the i18n npm module available as `apos.i18n`. Apostrophe also makes this available in Nunjucks templates via the usual `__()` helper function, so if you want translate a static content, you can do this: `{{__('HELLO WORD')}}`.
When you start the application, the file into `locales` are increased whit a string like `"HELLO WORD":"HELLO WORD"` and in this place you can enter translations.

*NOTE: this kind of translations are just for the static element in a project, this is not for a content into pieces.*

Any options passed to this module are passed on to `i18n`.

By default i18n locale files are generated in the `locales` subdirectory of the project.

## Options
You can pass options to `apostrophe-i18n` in `app.js`.

```javascript
//app.js
    ...
    modules:{
        'apostrophe-i18n':{
             locales:['it', 'en']   //with this you can setup some locales
        }
    }
```

Which options can you pass?

`localesDir`: if specified, the locale .`json` files are stored here, otherwise they are stored in the `locales` subdirectory of the project root.

`locales`: array of some locales.
` locales: ['it', 'en']`

`fallbacks`: an object to fall back from one locale to other.
`fallbacks:{'it':'en'}`

`defaultLocale`: (string) to set a default locale.
`defaultLocale:'it'`

`cookie`: (string) set a custom cookie name to parse settings
`cookie:'apos_language'`

`queryParameter`: (string) set a query parameter to switch locale */user?lang=en*
`queryParameter: 'lang'`

`updateFiles`: (boolean) if this is set false, not write new locale information to disk *default true*
`updateFiles:false`

`prefix`: (string) a prefix about json file *web-it.json*
`prefix:'web-'`

If you put this information into `apostrophe-i18n` object, automatically the npm i18n is configurated.

## Simple configuration

```javascript
//app.js
    ...
    modules:{
        ...
        'apostrophe-i18n':{
            locales: ['it', 'en'],
            cookie: 'apos_language',
            defaultLocale: 'it',
            queryParameter: 'lang',
            updateFiles:false
        }
        ...
    }
    ...
```