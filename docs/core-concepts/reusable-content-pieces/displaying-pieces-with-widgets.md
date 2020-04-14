# Displaying Pieces with Widgets

In the previous example, you learned how to create pieces. Now you'll see how to use display those pieces using widgets.

## Displaying Pieces

So you created pieces, but you don't have a way to display them on your site yet. For that you'll need to add a second module in `app.js`, this time a widget:


```javascript
// app.js
// other modules, then...
  'people-widgets': {
    extend: 'apostrophe-pieces-widgets'
  }
// etc.
```

{% hint style="info" %}
`people-widgets` will automatically figure out that its job is to display the pieces that come from the `people` module, by removing `-widgets` from its name. If you don't want to follow that pattern, you'll have to set the `piecesModuleName` option.
{% endhint %}

Already this is enough to let us add the new widget to any `apos.area` call in a page template, like your `home.html` or `default.html` template:


```django
{# lib/modules/apostrophe-pages/views/default.html #}
apos.area(data.page, 'body', {
    widgets: {
      'apostrophe-rich-text': {},
      'apostrophe-images': {},
      'people': {}
    }
  }
)
```

Right off the bat, you can click the `+` anywhere in this area to add a people widget, and then decide whether to display all people or just hand-pick a few by entering their names. There's an autocomplete feature to complete names quickly.

**Notice that people have to be published in order to be added to the widget.**

### An important performance warning

Pieces widgets are great, but they are powered by joins, and joins can cause trouble because they load so many things... and the things they load may load other things, like widgets... until your site is slow, or Apostrophe refuses to load more widgets to prevent an infinite loop.

To solve that, you should always add a `projection` filter when configuring a subclass of `apostrophe-pieces-widgets`:

```javascript
  // lib/modules/people-widgets/index.js
  module.exports = {
    extend: 'apostrophe-pieces-widgets',
    filters: {
      projection: {
        title: 1,
        phone: 1,
        thumbnail: 1,
        // Not a real database property, but including it in the projection
        // fetches everything needed to populate it
        _url: 1,
      }
    },
    // etc.
  }
```

This way, only the properties you really need are fetched for the widget. This can greatly speed up your site and prevent mysterious refusals to load any more data if things start joining back to themselves.

{% hint style="info" %}
_"Which properties do I need in my projection?"_ Just those you'll use in your `widget.html` template. However, if you try to guess on your own which properties are needed to populate `_url` correctly, you'll have a tough time. Instead, just say `_url: 1` and Apostrophe will include those for you (`slug`, `type` and `tags`, by default).
{% endhint %}

### Custom templates for widgets

Your widget isn't very satisfying yet. It just displays full names. Let's improve it by creating your own `lib/modules/people-widgets/views/widget.html` file to provide a more detailed display:


```django
{# lib/modules/people-widgets/views/widget.html #}
{% for piece in data.widget._pieces %}
  <h4>
    {% if piece._url %}<a href="{{ piece._url }}">{% endif %}
    {{ piece.title }}
    {% if piece._url %}</a>{% endif %}
    {% if piece.phone %}
      <a href="tel:{{ piece.phone }}">
        {{ piece.phone }}
      </a>
    {% endif %}
    {{
      apos.singleton(
        piece,
        'thumbnail',
        'apostrophe-images',
        {
          edit: false,
          size: 'one-sixth'
        }
      )
    }}
  </h4>
{% endfor %}
```

{% hint style="info" %}
**"Where do those** `piece._url` **links go?"** Nowhere, yet. Read on to learn about `apostrophe-pieces-pages`, which provide a destination for those links.

The `apostrophe-pieces-widgets` module already has a `widget.html` file, but when you extend a widget and provide your own version of an existing template, your version gets rendered instead.

Notice that you can pass your piece to `apos.singleton` the same way you would pass a page. Both are Apostrophe docs, and both live in the `aposDocs` MongoDB collection. However, pages have a `slug` property that starts with a `/`, so they can be viewed at their own URLs. Pieces do not.
{% endhint %}

