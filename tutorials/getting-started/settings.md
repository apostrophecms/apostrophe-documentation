---
title: "Global settings"
layout: tutorial
---

## Hardcoded settings

Sometimes you just want to pass some settings from your `app.js` file, or a server-specific `data/local.js` file, and use them in your templates. There's an easy way to do that.

First, pass in the settings you want as options to a relevant module. If there is no specifically relevant module, we suggest creating a `settings` module in your project, like this:

```javascript
// in app.js

modules: {
  settings: {
    // So we can write `apos.settings` in a template
    alias: 'settings',
    // Let's pass in a Google Analytics id, just as an example
    analyticsId: 'UA-XYZPDQ'
  }
  // ... other modules, etc.
}
```

Now, in any template, you can access them like so:

```markup
<script>
ga.somethingLikeThis({{ apos.settings.getOption('analyticsId') | json }})
</script>
```

Every module has a `getOption` helper that can be called from any template. You can also call `apos.settings.getOption()` from the server-side JavaScript code of any module.

You can also access nested options using dot notation, MongoDB-style.

As seen here, **always use the `json` filter** if you want to push a variable to JavaScript code from inside a Nunjucks template. The `json` filter will automatically quote strings the right way, format objects as objects, format arrays as arrays, and even deal with several edge cases where JSON and JavaScript aren't 100% compatible. So please, **don't try to quote strings yourself.** Let the filter do it.

> If you think the default behavior of `getOption` is handy, take a moment to check out the [apostrophe-override-options](https://npmjs.org/package/apostrophe-override-options) module, which really takes it to the limit. Want to change what `getOption` returns based on the current page type or piece type? How about an individual setting of one of the ancestor pages of the current page? You can do all of those things with this optional module.

### Changing the value for a specific server only

Got a setting that has to be different in development and production environments? No problem: just use a `data/local.js` file.

If your project contains such a file, Apostrophe will load it and **merge its contents with the object you pass to `apostrophe` in `app.js`.** In other words, you just **do exactly the same stuff you'd do in `app.js`**, and whatever you put in `data/local.js` wins. Here's an example:

```javascript
// in data/local.js
module.exports = {
  modules: {
    settings: {
      analyticsId: 'totally different for this one server'
    }
  }
};
```

This `modules` object will merge with the `modules` object in your `app.js` file. Any value provided for a property, or sub-property, in `data/local.js` will replace the value given in `app.js`, if any.

> Please don't repeat everything in `data/local.js`. You only need to include what you want to change. Please keep everything else in `app.js`, or in module-level `lib/modules/module-name/index.js` files.

> The file `data/local.js` is excluded from deployment by our standard Stagecoach recipe. If you're not using Stagecoach, make sure you exclude it in another way.

### An alternative approach: environment variables

Some developers like shell environment variables as a way to pass data to applications in a server-specific way. If you like, you can set options via environment variables. For instance:

```javascript
// in app.js

modules: {
  settings: {
    alias: 'settings',
    analyticsId: process.env.ANALYTICS_ID
  }
  // ... other modules, etc.
}
```

Now you can call `apos.settings.getOption('analyticsId')` as usual and you'll get the value that was given for the environment variable.

Actually setting environment variables when launching the Apostrophe node app is up to you. If you're using Stagecoach it is more common to use the `data/local.js` approach. But, you can modify the `deployment/start` script of your project as you see fit.

## User-editable global settings

Sometimes we need a few editable settings just for the site administrator that are relevant to *every* page, in much the way that a [shared footer](global.html) is relevant to every page.

A Google Analytics property ID is a great example. It's subject to change, and you don't want to change the source code every time. You want it to be a global setting.

[Pieces](reusable-content-with-pieces.html) are great for articles, events and other content that might be reused around the site. And we've seen how to extend the schema of a piece type to contain new fields.

We can use the same technique to extend the `apostrophe-global` module: a special module with just one piece that gets loaded on every request.

To pull off that trick, we just extend the schema of the `apostrophe-global` module with a few new fields, like this:

```javascript
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
{# in your views/layout.html file #}

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

As seen above, we use the `json` filter to make sure it comes out quoted correctly as a JavaScript string. Always use the filter, don't try to format JavaScript strings, objects and arrays yourself. There are too many edge cases.

## Getting carried away

"Hey, I can do lots of things with the `global` schema. I can even put [joins](schema-guide.html) and [pieces-widgets](reusable-content-with-pieces.html) in there. What if I built my whole site in `global`?"

Don't do that. Remember, the server must fetch `global` and everything joined to it on **every single page request, whether you really need that content on that particular page or not.**

So again, as a rule of thumb, don't put it in `global` unless you need it at least 50% of the time.
