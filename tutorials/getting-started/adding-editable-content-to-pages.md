---
title: "Adding Editable Content To Pages"
---

## Adding Editable Content to Pages

Central to Apostrophe is the philosophy that editors can edit their content in context. In order for a developer to enable this functionality in their templates, Apostrophe provides `singleton` and `area` helpers in Nunjucks.

### Singletons

Singletons are a slot on a page that allow an editor to add a single widget of a specific type. Let's add a singleton to our `home.html` template!

```markup
{% block main %}
  <div class="main-content">
    {{ apos.singleton(data.page, 'textBlock', 'apostrophe-rich-text', {
      toolbar: [ 'Bold', 'Italic' ]
    }) }}
  </div>
{% endblock %}
```

Let's deconstruct the arguments we are passing here.

#### data.page

The object you want to save the singleton to. In this case, we are editing content on a page, so the content should be saved to that page.

#### 'textBlock'

The name of the area. This denotes what field the singleton will be saved to in the object. In this case, it would be saved to `data.page['textBlock']`.

#### 'apostrophe-rich-text'

The widget type we want to allow in the singleton. In this case, we are using the default rich text widget.

#### { toolbar: [ 'Bold', 'Italic' ] }

An object that allows us to pass type-specific options to the widget.

If we restart our server and refresh our site's home page while logged in, we'll see a gray block with a button prompting us to add rich text.

<img src="/images/tutorials/developer/boilerplate_singleton.png" class="shadow">

### Areas

Oftentimes, we'll want to enable an editor to add several widgets of different types to build out a page. For this, we can use the `apos.area` helper.

```markup
{{ apos.area(data.page, 'body', {
  widgets: {
    'apostrophe-rich-text': {
      toolbar: [ 'Bold', 'Italic' ]
    },
    'apostrophe-images': {}
  }
}) }}
```

The first two arguments for this helper are the same as `apos.singleton`. The third option is an options object. We can see that that options object supports a `widgets` option, which takes a key-value map of available widgets and their respective options.

### Widget Types

#### apostrophe-rich-text

#### apostrophe-images

#### apostrophe-html
