---
title: "Layouts and the global doc: sharing content across pages"
layout: tutorial
---

## Creating your own `layout.html`

Most of the time, you'll have content that is shared between the different page templates on your site. We've seen how easy it is to add editable content to a particular page. But some content, such as a footer that appears on every page of the site, should be shared. 

First, let's create a `layout.html` file. All of our page templates can then extend that file, so we don't have to fuss with `data.outerLayout`, and we can share some of the template markup:

```markup
{# lib/modules/apostrophe-templates/views/layout.html in your project #}

{% extends data.outerLayout %}

{% block afterMain %}
  <footer>
    Copyright 2017, Remarkable Company
  </footer>
{% endblock %}
```

Now, change your individual page templates such as `default.html` and `home.html` to take advantage of it.

You'll want to remove this:

```markup
{% extends data.outerLayout %}
```

And replace it with this:

```markup
{% extends "layout.html" %}
```

## Editable global content

This is nice, but a static copyright notice isn't going to cut it. Your users will want to edit their own global footer.

Here's how to let them do that:

```markup
{% block main %}
  <div class="main-content">
    {{ apos.singleton(data.global, 'footer', 'apostrophe-rich-text', {
      toolbar: [ 'Bold', 'Italic', 'Styles', 'Link', 'Unlink' ]
    }) }}
  </div>
{% endblock %}
```

Just like `data.page`, `data.global` can contain Apostrophe areas and singletons. Unlike `data.page`, it *always refers to the same, shared document*. So it is ideal for a footer, banner or other sitewide content element.

> `data.global` is great, but don't put your entire site in there! Sometimes beginning Apostrophe developers will add hundreds of areas to `global`. This is not a good idea. A good rule of thumb is that you should store your content with the appropriate page, or the appropriate [piece](reusable-content-with-pieces.html), unless it is needed at least 50% of the time... because the global doc has to be loaded by the server 100% of the time.


