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

## About `app.js`

`app.js` is Apostrophe's main configuration file. This is the file that fires up Apostrophe with a given configuration, and is where you can specify what modules you want to be present in your project. As you add them, you also configure them by providing options via an object.

Some modules are always a part of Apostrophe whether you configure them or not. You will create more to meet the needs of your project.

## `lib/modules`: modules in Apostrophe

Apostrophe is a modular content management system. Each meaningful component is broken into its own module, which can then be interacted with or subclassed (extended) by other modules in the system. Under the hood, modules are powered by [moog](https://github.com/punkave/moog) and [moog-require](https://github.com/punkave/moog-require), but you don't have to understand that right away to build a great website.

The `lib/modules` folder of your project is where modules created for your own project live. And it is also where you can "implicitly subclass" (i.e. configure or improve upon) Apostrophe's own modules, whether part of the apostrophe npm module's core or packaged in separate npm modules.

We've already seen two modules that are extended in your test project's `lib/modules` folder, `apostrophe-assets` and `apostrophe-pages`. `apostrophe-assets` gets some custom [LESS CSS](http://lesscss.org/features/) files, while `apostrophe-pages` contains page templates.

**Apostrophe modules and npm modules are not the same thing.** One npm module might package several Apostrophe modules that are maintained together as a "bundle." You'll see this later when you install the `apostrophe-blog` npm module.

## Pushing stylesheets and JavaScript from your own modules

Later on, when you start creating your own modules, you might want to "push" assets directly from them. When the time comes, check out the [pushAsset](../../modules/apostrophe-module/index.html#push-asset) method, which all modules in Apostrophe provide. This method gives you a powerful way to push assets only if the user is logged in, or all the time. And it allows you to organize your assets with the modules to which they are most relevant.
