---
title: "Pushing assets to the browser"
layout: tutorial
---

"Hang on, this site is *really* bare bones and I need to add some styles just to see what's going on."

## Configuring stylesheets

OK! Take a peek at your `app.js` file and you'll spot some really simple configuration that is already pushing a `site.less` file:

```javascript
    // This configures the apostrophe-assets module to push a 'site.less'
    // stylesheet
    'apostrophe-assets': {
      stylesheets: [
        {
          name: 'site'
        }
      ]
    },
```

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

You can push JavaScript files to the browser too:

```javascript
    // This configures the apostrophe-assets module to push a 'site.less'
    // stylesheet
    'apostrophe-assets': {
      scripts: [
        {
          name: 'site'
        }
      ]
    },
```

This will push the file `lib/modules/apostrophe-assets/public/css/site.js` to the browser. If you follow our [production deployment tutorial](../intermediate/deployment.html), it will be included in a single minified file along with Apostrophe's JavaScript, for much better performance. Minification is also provided for stylesheets.

> Want to use `gulp`, `browserify`, `grunt` and friends? Go for it! Just set up your configuration so that the compiled output file is pushed by Apostrophe. Apostrophe doesn't need to know you are using these tools for you to be successful with them. Separation of concerns is a good thing.

## Pushing stylesheets and JavaScript from your own modules

Later on, when you start creating your own modules, you might want to "push" assets directly from them. When the time comes, check out the [pushAsset](../../modules/apostrophe-module/index.html#push-asset) method, which all modules in Apostrophe provide. This method gives you a powerful way to push assets only if the user is logged in, or all the time. And it allows you to organize your assets with the modules to which they are most relevant.
