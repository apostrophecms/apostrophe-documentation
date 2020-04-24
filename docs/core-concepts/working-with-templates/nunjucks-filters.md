# Apostrophe Nunjucks Filters

Nunjucks is a designer friendly templating language that Apostrophe uses to provide additional power and responsiveness to HTML templates. You can use a combination of Nunjucks Core Filters, and Apostrophe's custom filters in your projects.

Here is the list of [core Nunjucks filters](https://mozilla.github.io/nunjucks/templating.html#builtin-filters), and below you can see the Apostrophe specific filters.

## Apostrophe Nunjucks Helper Functions

Filters are just a small part of what Apostrophe provides to Nunjucks templates.

Apostrophe also adds plenty of "helper functions" which do not use the `| foo` filter syntax. These are documented with the modules that provide them. In particular, the \[apostrophe-utils module\] \(/reference/modules/apostrophe-utils/index.html\#nunjucks-template-helpers\) provides a wide variety of helpers, often based on the `lodash` module.

## How to use filters

Here's an example:

```markup
<p>
This page was last modified on {{ data.page.updatedAt | date('YYYY-MM-DD') }}
</p>
```

"What's going on here?" The data **before** the `|` is passed to the filter, which transforms it in some way \(in this case, formatting a date object as a string\) and outputs the result on the page.

In addition, some filters take extra arguments inside `()`, like the format string needed here. Filters that don't require any arguments do not require `()`.

## Alphabetical filter reference

### `| bless(label...)`

You probably won't use this filter yourself.

This filter should be applied to an object containing options, such as the options given in a template for a particular widget type. This filter will add a "blessing" of those options to the user's session, which permits the user to submit those options back to the server when re-rendering a widget after editing it. The filter outputs the original object, which typically means further filtering with `json` or `jsonAttribute` is expected.

If `label` arguments are given, they are used to namespace the blessing. Apostrophe uses label arguments to distinguish valid widget options from valid join options.

The blessing mechanism avoids the need for Apostrophe to sanitize developer-supplied template options with the same degree of scrutiny as ordinary user input.

### `| build(obj...)`

Given a URL and one or more objects, this filter adds query string parameters for each of the properties in the objects. If objects affect the same parameter, the last object wins. If a parameter is set to `null` or the empty string it is removed from the URL altogether. This is very useful for adding filters to the current URL, respecting other filters already present, without complicated logic.

The `build` filter has additional features which you can read about in the [build method documentation](/reference/modules/apostrophe-urls.html#build-url-path-data).

### `| clonePermanent`

Given JavaScript data, this filter recursively strips out any properties whose names beginning with a `_`, except `_id`. This is used to avoid pushing large joined documents into the DOM.

### `| css`

Converts a string to a hyphenated CSS identifier. For instance, `fooBar` becomes `foo-bar`.

### `| date(format)`

Turns a JavaScript Date object into a string, as specified by `format`. For formatting options, see [the documentation of the `momentjs` npm module](https://momentjs.com/docs/#/displaying/format/).

### `| json`

Turns JavaScript data into a JSON string, **correctly escaped for safe use inside a** `script` **tag in the middle of an HTML document.** Note that it is **not** safe to use the Nunjucks `dump` filter in this way. This filter is not for attributes, see `jsonAttribute`.

### `| jsonAttribute(options)`

Given JavaScript data, this filter escapes it correctly to be the value of a `data-` attribute of an element in the page. It does not add the `"` quote characters, but it does escape any `"` characters in the JSON string.

`options` may be omitted. If `options.single` is truthy, single-quotes are escaped instead, and you must use `'` \(single quotes\) to quote the attribute. This saves space and is more readable in "view page source."

**If this filter is applied to anything other than an object or array,** the value is converted to a string and output literally, without quotes. This is done for compatibility with jQuery's `data` method, which only parses JSON when it sees `{}` or `[]` syntax, and otherwise returns the value directly as a string. If you don't like this, only pass objects to this filter.

### `| merge(object2, object3...)`

When applied to an object, this filter "merges in" the properties of any additional objects given to it as arguments, using the lodash `assign` method. Note that this is not a recursive merge. If two objects contain the same property, the last object wins.

### `| nlbr`

Converts newlines found in a string into `<br />` tags.

### `| nlp`

Breaks a string into `<p>...</p>` elements, based on newlines.

### `| query`

Turns an object into a query string. See also `build`.

### `| striptags`

Strips HTML tags from a string, leaving only the content inside the tags.

