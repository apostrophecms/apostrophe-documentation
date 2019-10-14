---
title: Accessing images inside related pages
layout: tutorial
---

Out of the box, Apostrophe makes it very easy to access the children of the home page, in order to create "tab" navigation:

```markup
{# In your layout template #}
<ul class="tabs">
  {% for tab in data.home._children %}
    <li class="tab">
      <a href="{{ tab._url }}">{{ tab.title }}</a>
    </li>
  {% endfor %}
</ul>
```

So let's try to expand this to display an image that comes from a singleton or area inside each subpage of the home page:

```markup
<ul class="tabs">
  {% for tab in data.home._children %}
    <li class="tab">
      {% set image = apos.images.first(tab.thumbnail) %}
      {% if image %}
        <img src="{{ apos.attachments.url(image, { size: 'one-sixth' }) }}" />
      {% else %}
        <span class="missing-thumbnail"></span>
      {% endif %}
      <a href="{{ tab._url }}">{{ tab.title }}</a>
    </li>
  {% endfor %}
</ul>
```

Maybe you also added that thumbnail singleton to every page's "page settings" dialog box, like this:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-custom-pages/index.js" %}
```javascript
module.exports = {
  beforeConstruct: function(self, options) {
    options.addFields = [
      {
        name: 'thumbnail',
        type: 'singleton',
        widgetType: 'apostrophe-images',
        options: {
          aspectRatio: [ 1, 1 ],
          limit: 1
        }
      }
    ].concat(options.addFields || []);
  }
}; 
```
{% endcode-tabs-item %}
{% endcode-tabs %}

We're very close! But it doesn't quite work yet. For performance, Apostrophe intentionally does not load the images of related pages. 

Fortunately we can switch this on for the children of the home page:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/index.js" %}
```javascript
module.exports = {
  // other configuration, such as the types option, then...
  filters: {
    ancestors: {
      children: {
        areas: [ 'thumbnail' ]
      }
    }
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style='info' %}
*"What's happening in this code?"* We're changing the way `apostrophe-pages` loads the ancestors of the current page. By specifying `areas: [ 'thumbnail' ]` for the children of each ancestor, we tell Apostrophe to fully load the widgets in that area, fetching the images we need.

*"What does `filters` mean here?"* It's an advanced topic, but when `apostrophe-pages` fetches the current page, it makes an Apostrophe cursor object. It then loops through all the properties of the `filters` option and calls those methods on the cursor, passing on any arguments given. For more information see [working with cursors](../intermediate/cursors.md).
{% endhint %}

## Drop-down menus with pictures: images from second-level pages

Yes, you can do that too. But, keep in mind that we're doing extra work here that could slow Apostrophe down a little. The life of a web developer is full of tradeoffs!

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/index.js" %}
```javascript
module.exports = {
  // other configuration, such as the types option, then...
  filters: {
    ancestors: {
      children: {
        depth: 2,
        areas: [ 'thumbnail' ]
      }
    }
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}


{% hint style='info' %}
Adding `depth: 2` tells `apostrophe-pages` to go two levels deep fetching the subpages of each ancestor of the current page. Now you can loop over `_children` two levels deep in your template and produce dropdown menus with images... at the cost of a little speed.
{% endhint %}


## Fetching images from children of the current page

You can do a similar trick for children of the current page:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-pages/index.js" %}
```javascript
module.exports = {
  // other configuration, such as the types option, then...
  filters: {
    children: {
      areas: [ 'thumbnail' ]
    }
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style='info' %}
See the earlier example on this page for how to add `thumbnail`to the schema of every page. You can then access the thumbnails in your templates by looping over `data.page._children` with code similar to the template shown above.
{% endhint %}


