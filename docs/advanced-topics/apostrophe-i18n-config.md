# Internationalization and Localization

With Apostrophe, the best solution for internationalization (also known as i18n, or localization) depends on whether you're interested in translating "static" text in your templates and our interface, or dynamic text created by editing on the page, creating pieces, and so on.

## Internationalization of dynamic content

For dynamic text and other media — basically anything the user can edit — you will want to use the [apostrophe-workflow](https://npmjs.org/package/apostrophe-workflow) module for internationalization. The workflow module lets you create all of your site's content in a "master locale," then export that content for translation over time as changes are made. So, [see that module's documentation](https://npmjs.org/package/apostrophe-workflow) for everything you need to know.

## Internationalization of static content

Internationalization of static content is a built-in feature of Apostrophe. All you need to do is take advantage of the `apostrophe-i18n` module, which is built on the widely used [i18n](https://npmjs.org/package/i18n) npm module.

`apostrophe-i18n` makes an instance of the i18n npm module available as `apos.i18n`. More importantly, Apostrophe makes this available in Nunjucks templates via the usual `__()` helper function. So to translate static content in your templates, just write:

```markup
<h3>{{ __('Hello World') }}</h3>
```

Now, when you start the application, you will see files in the `locales` subdirectory of your project with names like `en.json` and these files will automatically gain new properties over time as new text strings are seen for the first time. In production, you can configure the module differently so that new strings are not added.

> Again, these files are just for static text. For user-editable content, use [apostrophe-workflow](https://npmjs.org/package/apostrophe-workflow).

### Configuring `apostrophe-i18n`

Any modules you pass to the `apostrophe-i18n` module are automatically passed on to `i18n`.

```javascript
// app.js
...
modules:{
  'apostrophe-i18n':{
      locales:['it', 'en']
  }
}
```

Here is a guide to the available options:

`localesDir`: if specified, the locale .`json` files are stored here, otherwise they are stored in the `locales` subdirectory of the project root.

`locales`: array of locale codes, such as `en` (English, generally) or `en-gb` (English, localized for Great Britain).

`defaultLocale`: a default locale, such as `defaultLocale: 'it'`.

`fallbacks`: an object specifying fallback locales if another locale is not available.

`fallbacks: { 'it': 'en'} // falls back to English`

`cookie`: (string) set a custom cookie name to hold the current locale selection. *This does not actually cause it to be stored to the cookie, it only causes the cookie to be read if it exists.* You can set the cookie yourself via the usual Express APIs.

`cookie: 'apos_language'`

`queryParameter`: (string) set a query parameter to switch the locale for localization of static content. Note that this works regardless of what the URL is, for instance:

`queryParameter: 'lang'`

`http://example.com/?lang=fr`

`updateFiles`: (boolean) if this is set false, do **not** write new locale information to disk even if new strings are seen for the first time. Defaults to true. In production environments you will want to set this to `false`.

`prefix`: (string) may be used to prefix the names of the `json` files in the locales folder. Not usually needed.

`prefix:'web-'`

## Simple configuration

```javascript
// app.js
modules:{
// ...
'apostrophe-i18n':{
    locales: ['it', 'en'],
    defaultLocale: 'it',
    queryParameter: 'lang',
    updateFiles:false
}
// ...
}
```

There are many more options, which you can read about in the [i18n npm module documentation](https://www.npmjs.com/package/i18n).
