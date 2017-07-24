---
title: "Global settings"
layout: tutorial
---

## Introducing global settings

[Pieces](reusable-content-with-pieces.html) are great for articles, events and other content that might be reused around the site. And we've seen how to extend the schema of a piece type to contain new fields.

But sometimes we need a few editable settings just for the site administrator that are relevant to *every* page, in much the way that a [shared footer](global.html) is relevant to every page.

A Google Analytics property ID is a great example. It's subject to change, and you don't want to change the source code every time. You want it to be a global setting.

To pull off that trick, we just extend the schema of the `apostrophe-global` module with a few new fields, like this:

```js
// in the lib/module/apostrophe-global/index.js file
// of your own project. Never edit the Apostrophe
// npm module itself

module.exports = {
  addFields: [
    {
      type: 'string',
      name: 'analytics',
      label: 'Google Analytics Property ID (like UA-xxxxx)'
    }
  ]
};
```

To set the field, just click on the admin bar, then click "Global."

Now, let's take advantage of it in our `layout.html` file:

```markup
{# in your lib/modules/apostrophe-templates/views/layout.html file #}

{% block extraHead %}
  {% if data.global.analytics %}
    {# Typical Google Analytics code as of 2017 #}
    <script type="text/javascript">
      var _gaq = _gaq || [];
      {# This is the interesting bit #}
      _gaq.push(['_setAccount', {{ data.global.analytics | json }} ]);
      _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    </script>
  {% endif %}
{% endblock %}
```

Notice that we use Apostrophe's `json` Nunjucks filter when we output the Analytics property code:

```markup
{{ data.global.analytics | json }}
```

**Always use the `json` filter** if you want to push a variable to JavaScript code from inside a Nunjucks template. The `json` filter will automatically quote strings the right way, format objects as objects, format arrays as arrays, and even deal with several edge cases where JSON and JavaScript aren't 100% compatible. So please don't reinvent it.

## Getting carried away

"Hey, I can do lots of things with the `global` schema. I can even put [joins](schema-guide.html) and [pieces-widgets](reusable-content-with-pieces.html) in there. What if I built my whole site in `global`?"

Don't do that. Remember, the server must fetch `global` and everything joined to it on every single page request, whether you really need that content on that particular page or not.

So again, as a rule of thumb, don't put it in global unless you need it at least 50% of the time.
