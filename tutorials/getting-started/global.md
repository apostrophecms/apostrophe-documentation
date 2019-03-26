---
title: "The global doc: sharing content across pages"
layout: tutorial
---

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


