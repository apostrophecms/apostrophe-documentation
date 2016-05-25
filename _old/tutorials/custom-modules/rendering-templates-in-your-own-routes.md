---
title: Rendering templates in your own routes
---

You might choose to set up some routes of your own, usually for REST API calls, AJAX rendering of small portions of the page, or form submissions. We recommend you not render an entire webpage via your own route in most cases; it is better to use [page loaders](page-loader-functions.html) to render entire pages. However you will often want to make an AJAX request via jQuery and return a JSON object or page fragment.

In such routes you can use the `self.render` method to render a page fragment via a template in your module:

```javascript
self._app.get('/apos-stories/weather', function(req, res) {
  return res.send(self.render('weather', { temperature: 65 }));
});
```

When a request for `/apos-stories/weather` arrives, this code will render the `views/weather.html` Nunjucks template found in your module, passing it the variable `temperature` to the template.
