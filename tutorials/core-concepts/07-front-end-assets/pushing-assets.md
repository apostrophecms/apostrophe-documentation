---
title: Pushing assets to the browser
layout: tutorial
---

# Styling Your Content

The first thing most website visitors see isn't the content or how well the navigation is organized, it's how the website looks. Is it a modern, visually consistent, and readable, or does it look like it hasn't been updated since it was originally hosted by Geocities in 1995?

If all you have are some basic templates in the default boilerplate project, you probably need some styling to get your site ready for the 21st century. In this section, you'll learn to create stylesheets and to push CSS and JavaScript files to your project and provide the visual structure and styling that you need.

## Configuring stylesheets

 Take a peek at your project's `lib/modules/apostrophe-assets/index.js` file and you'll spot some really simple configuration that is already pushing a `site.less` file, as well as a `site.js` file.

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-assets/index.js" %}
```javascript
// This configures the apostrophe-assets module to push a 'site.less'
// stylesheet by default:

module.exports = {
  stylesheets: [
    {
      name: 'site'
    }
  ],
  scripts: [
    {
      name: 'site'
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

We could have put this configuration inside `app.js`, but that leads to a cluttered `app.js` file. Apostrophe will also automatically look for a `lib/modules/MODULE-N AME-HERE/index.js` file for each module and load that too if it exists.

Your LESS file might look like:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-assets/public/css/site.less" %}
```css
@import "utils/reset.less";

body
{
  .karla;
  background-color: @apos-light
}

.main-content
{
  margin: 200px auto;
  padding: 20px;
  max-width: 500px;
  color: @apos-white;
  background-color: @apos-primary;
  .apos-drop-shadow;

  h3 { font-size: 24px; margin-bottom: 12px; }

  .login-link {
    float: right;
    color: @apos-white;
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

We use `@import` here because in LESS, `@import` is compiled just once on the server, so there is no performance hit. You can use it to bring in additional LESS files, so it's common to only configure one in `app.js`.

Also notice that the styles for `.main-content h3` are written by nesting styles for `h3` inside `.main-content`. This nesting feature is one of the most important advantages of LESS over plain-vanilla CSS. We are also using some color variables defined by Apostrophe's default stylesheets; your code will probably not use these, but you could define your own variables. Check out the [LESS documentation](http://lesscss.org/) for much more.

### Pushing a CSS stylesheet without LESS compilation

What if you're building your own CSS file, using your own Webpack-based setup?

You can push the output file to Apostrophe just like any other asset, following the techniques above. And that will work... mostly. But once in a while your CSS might contain something LESS doesn't yet accept.

You can work around this by using import flags:

{% code-tabs %}
{% code-tabs-item title="lib/modules/apostrophe-assets/index.js" %}
```javascript
module.exports = {
  stylesheets: [
    {
      name: 'site',
      import: {
        inline: true
      }
    }
  ]
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

When you use the `inline` import flag, the LESS compiler will import your file as-is, without attempting to interpret it as LESS.

## Configuring JavaScript for the browser

You can push JavaScript files to the browser too, as you can see in the `index.js` file above:

```javascript
    scripts: [
      {
        name: 'site'
      }
    ]
```

This will push the file `lib/modules/apostrophe-assets/public/js/site.js` to the browser. If you follow our [production deployment tutorial](../intermediate/deployment.md), it will be included in a single minified file along with Apostrophe's JavaScript, for much better performance. Minification is also provided for stylesheets.

{% hint style="tip" %}
Want to use `gulp`, `browserify`, `grunt` and friends? Go for it! Just set up your configuration so that the compiled output file is pushed by Apostrophe. Apostrophe doesn't need to know you are using these tools for you to be successful with them. Separation of concerns is a good thing.
{% endhint %}

## Including webfonts, images, and other assets

The following isn't necessary \(strictly speaking\) until you start doing production deployments on a cloud server, but since you'll probably need to put your site online eventually, why not start off on the right foot?

There's a couple ways you can go about this. We'd recommend creating a theme module as the pathing is more straightforward, but the choice is yours.

### Assets in a theme module

When making comprehensive visual changes including css, javascript, web-fonts, and image assets, it's a good idea to create a theme module to all your additions together. Don't forget to push your stylesheets and javascript though, which will be described in the next section.

Your `my-theme` module might look something like the following:

```text
my-theme
  - public/
    - css/
    - fonts/
    - img/
    - js/
  - index.js
```

In your `my-theme` module, you'll include your assets in `lib/modules/my-theme/public/**`. You'll then reference them in your css and nunjucks templates at `modules/my-theme/**`.

As an example, with `karla.woff` in `lib/modules/my-theme/public/fonts` the @font-face definition could be as simple as:

{% code-tabs %}
{% code-tabs-item title="lib/modules/my-theme/public/fonts" %}
```css
@font-face {
    font-family: 'Karla';
    src: url('/modules/my-theme/fonts/karla.woff') format('woff');
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% hint style="working" %}
Not working for you yet? Please check out the [complete, working example of a `theme` module in the apostrophe-samples project](https://github.com/apostrophecms/apostrophe-samples). This project is a great place to start if you need more examples of where to put your code "in context" so that everything works!
{% endhint %}

### Assets in apostrophe-assets

When including your assets in any module that comes with Apostrophe you'll run into some unexpected differences compared to using your own module. We'll use `karla.woff` as an example again, this time in `apostrophe-assets`.

If you included `karla.woff` in `lib/modules/apostrophe-assets/public/fonts`, then in your less files the URL would be `/modules/my-apostrophe-assets/fonts/karla.woff`. The use of `my-` in front of the module name in less allows symbolic links from `public/modules` to differentiate between the npm version of a core Apostrophe module and additions you've made at a project-level.

## Pushing stylesheets and JavaScript from your own modules

Later on, when you start creating your own modules, you might want to "push" assets directly from them. When the time comes, check out the [pushAsset](../../modules/apostrophe-module/README.md#push-asset) method, which all modules in Apostrophe provide. This method gives you a powerful way to push assets only if the user is logged in, or all the time. And it allows you to organize your assets with the modules to which they are most relevant.

Just as before, you can optionally use `import` flags by including an `import` object in the options object you pass to `pushAsset`.

