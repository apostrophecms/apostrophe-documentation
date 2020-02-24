---
title: AJAX Features: Enhanced Browsing Without Page Refresh
layout: tutorial
---

# AJAX Features: Enhanced Browsing Without Page Refresh

Asynchronous JavaScript and XML, commonly known as [AJAX](https://api.jquery.com/jquery.ajax/), provides techniques for more dynamic and responsive websites. You can use AJAX with Pieces to refresh and display content without fully refreshing the page. To demonstrate this, we'll work off of the `people-pages` example from the [Reusable Content with Pieces](/tutorials/core-concepts/reusable-content-pieces/reusable-content-with-pieces.md) which uses `piece-pages` to create a user directory, but you should be able to easily adapt this example to your own project.

## Filtering without reloading the page: using AJAX to enhance filters

Apostrophe offers an general-purpose, extremely easy solution for AJAX refreshes.

"What the heck is an AJAX refresh?" Right now, if you click on a filter, the whole page reloads. Instead, an AJAX refresh only updates the relevant part of the page.

Add a `data-apos-ajax-context="name"` attribute to the outer div that should be refreshed when any link or form submission inside it takes place and has a URL that points back to the same page.

_The value of the attribute must be unique on the page._

Next, refactor your `index.html` template so that the actual list of people and any filters are in an `indexAjax.html` template, which is included at the appropriate point, wrapped in a div that has the `data-apos-ajax-context` attribute:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
```markup
{% extends "layout.html" %}
<h2>People</h2>
<div data-apos-ajax-context="people">
  {% include "indexAjax.html" %}
</div>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/indexAjax.html" %}
```markup
{% for piece in data.pieces %}
  <h4>
    {% set image = apos.images.first(piece.thumbnail) %}
    {% if image %}
      <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
    {% endif %}
    <a href="{{ piece._url }}">{{ piece.title }}</a>
  </h4>
{% endfor %}
```
{% endcode-tabs-item %}
{% endcode-tabs %}


That's it! Really. And it automatically works with the filters from the [Connecting Piece Types example](/tutorials/core-concepts/reusable-content-pieces/children-and-joins.md).

**Tip:** you want to include your filter links and forms in `indexAjax.html` so that they too can be refreshed automatically, narrowing down the choices based on the other filters already in use. Any input elements or textareas that currently have the focus will not be refreshed, so if you are using form elements, you can even implement typeahead by triggering a submit of the form via JavaScript as the user types. (Keep in mind the accessibility consequences.)

#### Preserving the values of certain elements during replacement

Any text input or textarea fields, and any other elements with a distinct `data-apos-ajax-preserve`
attribute, are NOT refreshed; their ancestors are also not refreshed, although the rest of the ancestors' content will be. This prevents loss of
focus if you have connected a submit handler to keyboard input, when typing which is a very difficult cross-browser problem otherwise.

After the replacement takes place, the `enhance` and `ajax` Apostrophe events
are emitted, in that order, with a jQuery object containing the ajax context div
as the argument.

Note that your event handlers for these should watch out for preserved elements and
their ancestors, and not do things twice. You can address this by checking for
`data-apos-ajax-preserve` and `data-apos-ajax-preserved` attributes.

#### Combining a "Load More..." button with AJAX

There's one catch with the ajax solution above: it doesn't yet account for a "Load More" button that appends to, rather than replacing, the current page's worth of content.

But this isn't hard to accommodate. All you have to do is:

1. Wrap a new element _inside_ your `data-apos-ajax-context` element around the content that makes up the current "page" of results. This should _not_ wrap around filter links or the "Load More" button itself.
2. Give that element the `data-apos-ajax-append` attribute.
3. Add `append=1` to the query string of your `Load More` button.

Here's an example. Here we assume you already set up the `piecesFilters` option as described earlier in this tutorial to enable filtering people by tag.

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/index.html" %}
```markup
{% extends "layout.html" %}
<h2>People</h2>
<div data-apos-ajax-context="people">
  {% include "indexAjax.html" %}
</div>
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="lib/modules/people-pages/indexAjax.html" %}
```markup
{# Filter by tag. Note this is OUTSIDE data-apos-ajax-append, so it gets REFRESHED #}
<ul class="tag-filters">
  {% for tag in data.piecesFilters.tags %}
    <li><a href="{{ data.url | build({ tags: tag.value }) }}">{{ tag.label }}</a></li>
  {% endfor %}
</ul>

{# New stuff gets appended to this element #}
<div data-apos-ajax-append>
  {% for piece in data.pieces %}
    <h4>
      {% set image = apos.images.first(piece.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% endif %}
      <a href="{{ piece._url }}">{{ piece.title }}</a>
    </h4>
  {% endfor %}
</div>

{# Load More button. Also outside data-apos-ajax-append, so it gets refreshed #}
{% if data.currentPage < data.totalPages %}
  {# "Load More" button with the "append=1" flag #}
  <a href="{{ data.url | build({ page: data.currentPage + 1, append: 1 }) }}">Load More...</a>
{% endif %}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

#### Infinite scroll with AJAX

"Load More" is nice, but what about infinite scroll? Can't we just load the next page when the user scrolls close to the bottom of the last one?

It's often a great idea. But first, ask yourself if it fits into your site design! If your "footer" contains anything important, remember that users will often never reach it.

That being said, here's how to make it work:

1. Implement the "Load More" button, above.
2. Add a `data-apos-ajax-infinite-scroll` attribute to the button itself:

```markup
{# Load More button. Also outside data-apos-ajax-append, so it gets refreshed #}
{% if data.currentPage < data.totalPages %}
  {# "Load More" button with the "append=1" flag #}
  <a data-apos-ajax-infinite-scroll href="{{ data.url }} | build({ page: data.currentPage + 1, append: 1 })">Load More...</a>
{% endif %}
```

Apostrophe will hide the button with JavaScript, but you can do it with CSS also to avoid seeing it momentarily.

That's it! Apostrophe will detect the button, hide it, and convert it to a scroll position sensor that automatically triggers the appending of the next page exactly as if the button had been clicked.

"Why do we still need to add the link?" If the link doesn't exist... how will Google index your content? It won't. And that would be a significant SEO failure. That's why we "progressively enhance" it to create the infinite scroll feature.
