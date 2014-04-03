# Detecting empty areas and singletons

It's common to want to do something special if an area or singleton is empty, especially if the user does not have editing privileges for the current page. You can detect that with a little Nunjucks logic:

```html
{% if (not edit) and aposSingletonIsEmpty({ area: page.sidebarVideo, type: 'video' }) %}
  <p>A default placeholder video might go here</p>
{% endif %}
```

*"Why does it take an `area` property if it's a singleton?"* Under the hood, singletons and areas are stored in the same way.

`aposAreaIsEmpty` is also available:

```html
{% if (not edit) and aposAreaIsEmpty({ area: page.content1 }) %}
  <p>Whoops, someone is a very lazy editor!</p>
{% endif %}
```
