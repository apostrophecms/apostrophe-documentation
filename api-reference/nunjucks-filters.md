---
title: Nunjucks Filters
---

**All of the standard Nunjucks filters are available.** See the [Nunjucks builtin filters page.](http://mozilla.github.io/nunjucks/templating.html#builtin-filters)

The following additional filters are provided by Apostrophe:

###build

The `build` filter is similar to the [query](#query) filter, but much more powerful. `build` accepts a URL as input and adds the properties of each of its arguments to the URL as query string parameters. Existing parameters in the URL can be overridden. If any properties are null, they are removed rather than added.

**You may pass any number of objects as arguments to the filter.** If a property appears more than once, the last object wins.

Example:

```markup
'/blog?search=foo' | build({ search: null, tag: 'green' })
```

Outputs:

```
/blog?tag=green
```

If the first argument is an array, the properties named in that array are appended directly to the URL in that order, rather than added to the query string. That is, instead of `year=2014`, you get `/2014`. Of course your server-side code must do the right thing when it sees this in the URL. If the value is not safe for inclusion in a URL it will be output in the query string instead. Your server-side code must tolerate this.

Example:

```markup
'/blog?search=foo' | build([ 'year' ], { year: 2013, search: null, tag: 'green' })
```

Outputs:

```
/blog/2013?tag=green
```

`build` is typically used to add and remove filters from an existing URL.

###css

The `css` filter converts a name in camelCase or under_scored_style into a hyphenated name, which is Apostrophe's convention for building CSS class names.

Example:

```markup
{{ 'camelCaseName' | css }}
```

Outputs:

```
camel-case-name
```

###date

When applied to a timestamp, a date object, or another input string that [moment.js](http://momentjs.com) can understand, the `date` filter outputs that string via `moment` according to its `format` argument.

Example:

```markup
{{ item.publishedAt | date("MMM DD, YYYY") }}
```

See the [moment.js](http://momentjs.com) documentation for details on the `format` argument.

###query

The `query` filter transforms its input into a query string for use in a URL, via the [qs](https://www.npmjs.org/package/qs) module.

Example:

```markup
{{ { style: 'fancy', color: 'blue' } | query }}
```

Outputs:

```markup
style=fancy&color=blue
```

See also the [build](#build) filter for cases where you need to modify an existing URL, both adding and removing arguments.

###json

The `json` filter converts its input to valid JSON. The `json` filter also takes care to escape any HTML comment or script opening tags that would otherwise prevent the browser from parsing it properly. This ensures that you may always safely write this in a template:

```markup
<script type="text/javascript">
var data = {{ item | json }};
</script>
```

###jsonAttribute

The `jsonAttribute` filter escapes its input for use as a DOM attribute value. If the value is an object, it is escaped as JSON and then as HTML. Otherwise it is simply escaped as HTML. Double-quotes are escaped to ensure the attribute does not end prematurely.

Example:

```markup
<div data="{{ item | jsonAttribute }}"> ... </div>
```

To save a great deal of space, single-quote your attributes and use the `single: true` option when calling the `jsonAttribute` filtr:

```markup
<div data='{{ item | jsonAttribute({ single: true }) }}'> ... </div>
```

###nlbr

The `nlbr` filter replaces newlines with `<br />` tags.

###stripTags

The `stripTags` filter removes HTML tags from markup. It does not unescape entities.

###truncate

The `truncate` filter accepts plaintext (not HTML entity-escaped text) as input and limits it to a specified number of characters, without breaking words. When truncation takes place, an ellipsis is added. If the `ellipsis` argument is not present, `...` (three periods) is used.

Example:

```markup
{{ "This is some text that is long." | truncate(20) }}
```

Outputs:

```
This is some text...
```
