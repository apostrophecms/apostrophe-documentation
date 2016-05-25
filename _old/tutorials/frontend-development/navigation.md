---
title: Navigation and menus
---

Every website needs navigation links. In Apostrophe several helpful arrays of related pages are attached to the current page to help you build navigation menus. The current page is always in the `page` variable in your page template.

Navigation is most often built in `layout.html`, a template extended by all of your page templates.

Check out `views/global/components/nav.html` in the sandbox project for examples of iterating over `page.tabs` and `page.ancestors` to build navigation.

You can also iterate over `page.children`. This array contains child pages of `page`, while `page.tabs` contains child pages of the home page.

Pages in these arrays can have their own `children` property depending on how high you set the appropriate `depth` option in `app.js`.

Let's breadcrumb navigation, to help the visitor go "back up" to the parent page, the home page, etc.:

```
<ul>
  <li class="nav-item">
    {% if not page.ancestors.length %}
      <a href="/" class="active">{{ page.title | e }}</a>
    {% else %}
      <a href="{{ page.ancestors[0].url | e }}"
        {% if page.slug == '/' %}class="active"{% endif %}
      >
      {{ page.ancestors[0].title | e }}</a>
    {% endif %}
  </li>
</ul>
```

Now let's build tabs:

```
{% for item in page.tabs %}
  <li class="nav-item">
    <a href="{{ item.url | e }}"
      {% if page.slug == item.slug %}class="active"
      {% endif %}>
    {{ item.title | e }}</a>
  </li>
{% endfor %}
```

Let's link to child pages to create a subnav:

```
{% for item in page.children %}
  <li class="nav-item">
    <a href="{{ item.url | e }}">
      {{ item.title | e }}
    </a>
  </li>
{% endfor %}
```

And finally, let's crank up the depth of child pages fetched in app.js so that we can build submenus, and also fully populate some content areas so we can include images in menus:

```javascript
var site = require('apostrophe-site')({
  ... other settings ...
  pages: {
    tabOptions: { depth: 3 },
    descendantOptions: { depth: 2,  areas: [ 'marquee' ] },
  }
  ... more settings ...
});
```

Note that by default, areas are not fully populated for these related pages (for instance, slideshows are not joined to their files). This is for performance reasons. But, you can turn it on selectively for an individual area or two as shown above without too much of a penalty.
