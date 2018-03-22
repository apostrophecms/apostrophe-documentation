---
title: "Pushing assets to the browser"
layout: tutorial
---

"Hang on, this site is *really* bare bones and I need to add some styles just to see what's going on."

## Configuring stylesheets

OK! Take a peek at your `lib/modules/apostrophe-assets/index.js` file and you'll spot some really simple configuration that is already pushing a `site.less` file, as well as a `site.js` file.

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

> We could have put this configuration inside `app.js`, but that leads to a cluttered `app.js` file. Apostrophe will also automatically look for a `lib/modules/MODULE-N AME-HERE/index.js` file for each module and load that too if it exists.

Your LESS file might look like:

```css
// lib/modules/apostrophe-assets/public/css/site.less

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

> Notice the use of `@import`. In LESS, `@import` is compiled just once on the server, so there is no performance hit. You can use it to bring in additional LESS files, so it's common to only configure one in `app.js`.
>
> Also notice that the styles for `.main-content h3` are written by nesting styles for `h3` inside `.main-content`. This nesting feature is one of the most important advantages of LESS over plain-vanilla CSS. We are also using some color variables defined by Apostrophe's default stylesheets; your code will probably not use these, but you could define your own variables. Check out the [LESS documentation](http://lesscss.org/) for much more.

## Configuring JavaScript for the browser

You can push JavaScript files to the browser too, as you can see in the `index.js` file above:


```javascript
    scripts: [
      {
        name: 'site'
      }
    ]
```

This will push the file `lib/modules/apostrophe-assets/public/js/site.js` to the browser. If you follow our [production deployment tutorial](../intermediate/deployment.html), it will be included in a single minified file along with Apostrophe's JavaScript, for much better performance. Minification is also provided for stylesheets.

> Want to use `gulp`, `browserify`, `grunt` and friends? Go for it! Just set up your configuration so that the compiled output file is pushed by Apostrophe. Apostrophe doesn't need to know you are using these tools for you to be successful with them. Separation of concerns is a good thing.

## Including webfonts, images, and other assets

> The following isn't necessary (strictly speaking) until you start doing production deployments on a cloud server, but since you'll probably need to put your site online eventually, why not start off on the right foot?

There's a couple ways you can go about this. We'd recommend creating a theme module as the pathing is more straightforward, but the choice is yours.

### Assets in a theme module

When making comprehensive visual changes including css, javascript, web-fonts, and image assets, it's a good idea to create a theme module to all your additions together. Don't forget to push your stylesheets and javascript though, which will be described in the next section.


Your `my-theme` module might look something like the following:

```bash
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

```css
@font-face {
	font-family: 'Karla';
	src: url('/modules/my-theme/fonts/karla.woff') format('woff');
}
```

### Assets in apostrophe-assets

When including your assets in any module that comes with Apostrophe you'll run into some unexpected differences compared to using your own module. We'll use `karla.woff` as an example again, this time in `apostrophe-assets`.

If you included `karla.woff` in `lib/modules/apostrophe-assets/public/fonts`, then in your less files the URL would be `/modules/my-apostrophe-assets/fonts/karla.woff`. The use of `my-` in front of the module name in less allows symbolic links from `public/modules` to differentiate between the npm version of a core Apostrophe module and additions you've made at a project-level.

## Pushing stylesheets and JavaScript from your own modules

Later on, when you start creating your own modules, you might want to "push" assets directly from them. When the time comes, check out the [pushAsset](../../modules/apostrophe-module/index.html#push-asset) method, which all modules in Apostrophe provide. This method gives you a powerful way to push assets only if the user is logged in, or all the time. And it allows you to organize your assets with the modules to which they are most relevant.
