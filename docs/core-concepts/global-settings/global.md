# The global doc: sharing content across pages

In the [previous global settings section](settings.md) you explored different ways of using global content. But what if your users need more control over their footer?

You can use `data.global` to reference the same doc from anywhere on the site. It looks like this:

```markup
{% block main %}
  <div class="main-content">
    {{ apos.singleton(data.global, 'footer', 'apostrophe-rich-text', {
      toolbar: [ 'Bold', 'Italic', 'Styles', 'Link', 'Unlink' ]
    }) }}
  </div>
{% endblock %}
```

Just like `data.page`, `data.global` can contain Apostrophe areas and singletons. Unlike `data.page`, it _always refers to the same, shared document_. So it is ideal for a footer, banner or other sitewide content element.

::: tip
`data.global` is great, but don't put your entire site in there! Sometimes beginning Apostrophe developers will add hundreds of areas to `global`. This is not a good idea. A good rule of thumb is that you should store your content with the appropriate page, or the appropriate [piece](/core-concepts/reusable-content-pieces/reusable-content-with-pieces.md), unless it is needed at least 50% of the time... because the global doc has to be loaded by the server 100% of the time.
:::
