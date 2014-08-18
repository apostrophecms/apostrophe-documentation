---
title: "With all of the options"
---

Here's an `app.js` file with most of the options you'd want to include in a large apostrophe project.

```javascript
var site = require('apostrophe-site')({
  // Allows apostrophe-sites to require stuff
  // on our behalf and also find our root folder
  root: module,

  // Used to name the local mongodb database,
  // if you don't pass a db option with more details
  shortName: 'mysite',

  // Hostname you plan to give your site
  hostName: 'mysite.com',

  // Title of your site. Used as a prefix to page titles and feed titles by default
  title: 'My Site',

  // This defaults to true and delivers HTML, CSS and JS much faster via
  // gzip transfer encoding. But you can set it to false if you must
  compress: true,

  // Apostrophe sizes your images to several awesome sizes right out of the box,
  // but we're greedy and we want something bigger than full (1280)
  addImageSizes: [
    {
      name: 'max',
      width: 1600,
      height: 1280
    }
  ],

  // By default the media library shows everyone's media until the user decides to
  // change that with the "uploaded by" filter. Want the default to go the other way?
  // Set the "owner" option as shown commented out below

  mediaLibrary: {
    // owner: 'user'
  },

  // Set up email transport via nodemailer. By default sendmail is used because
  // it requires no configuration, but you may use any valid transport, see the
  // nodemailer module documentation.

  mailer: {
    transport: 'sendmail',
    transportOptions: {}
  },

  // You can always log in at /login as admin, with this password
  adminPassword: 'SOMETHING SECURE PLEASE',

  redirectAfterLogin: function(user) {
    if (user.permissions.admin) {
      return '/awesomepeople';
    } else {
      return '/coolpeople';
    }
  },

  // Run some middleware on ALL requests. This happens AFTER
  // basics are in place like sessions and users and i18n.
  // Middleware functions may take an initial "site" argument
  // in addition to req, res, next
  middleware: [ /* middleware, functions, galore */ ],

  sessionSecret: 'SOMETHING RANDOM PLEASE',

  // Any options accepted by the apostrophe-pages module,
  // such as tabOptions and descendantOptions
  pages: {
    // List all the page types users should be able to add here, including
    // things like "Blog" and "Events" that are powered by modules, so you get
    // to pick the order
    types: [
      // TODO double check this doesn't get ignored if blog is added later and wasn't wanted
      { name: 'default', label: 'Default (Two Column)' },
      { name: 'home', label: 'Home Page' },
      { name: 'blog', label: 'Blog' },
      { name: 'events', label: 'Events' }
    ]

    // Load descendants of homepage and current page two levels deep
    // instead of one
    tabOptions: { depth: 2 },
    descendantOptions: { depth: 2 },

    // Do something special if the URL doesn't match anything else
    notfound: function(req, callback) {
      if (req.url === '/special') {
        req.redirect = '/specialer';
      }
      return callback(null);
    }

    // Run some middleware on the route that serves pages.
    // This is not global middleware, see the top-level middleware option
    // Middleware functions may take an initial "site" argument
    // in addition to req, res, next
    middleware: [ /* middleware, functions, galore */ ],

    // Custom page loader functions beyond those automatically
    // provided. Already you have the page with the slug 'global'
    // available at all times, the current page, its tabs, its
    // descendants, and anything loaded on behalf of your modules,
    // like blog posts appearing on the current page
    load: [
      function(req, callback) {
        if (!(req.page && (req.page.type === 'fancy'))) {
          // Doesn't concern us
          return callback(null);
        }
        // Set some custom data to be provided to the nunjucks template.
        // Anything in the extras object is pushed as data to the
        // page template.
        //
        // We have a callback here, so we could go get anything
        req.extras.fanciness = true;
        return callback(null);
      }
    ],
  },

  // Let's add the blog and events modules. You must npm install them.
  // apostrophe-site will require them for you and pass your options
  modules: {
    'apostrophe-events': {
      widget: true
    },
    'apostrophe-blog': {
      widget: true
    }
  },

  // Custom command line tasks. Run like this:
  // node app project:frobulate
  // argv is powered by optimist
  tasks: {
    project: {
      frobulate: function(site, apos, argv, callback) {
        console.log('Frobulated the hibblesnotz');
        console.log('You passed these arguments: ' + argv._);
        return callback(null);
      }
    }
  },

  locals: {
    // Extra locals visible to every nunjucks template. Functions and
    // data are both fair game. You may also pass a function that takes
    // the site object as its sole argument and returns an object containing
    // the desired locals as properties.
    embiggen: function(s) {
      return s * 1000;
    }
  },

  assets: {
    // Loads site.js from public/js
    scripts: [
      // load this js file all the time, minify it normally
      'site',
      {
        // Load this JS file only when a user is logged in, never minify it.
        // 'when' could also be 'always'. 'minify' defaults to true
        name: 'fancy',
        when: 'user',
        minify: false
      }
    ],
    // Loads site.less from public/css
    stylesheets: [
      'site'
    ]
  },

  // Last best chance to set custom Express routes
  setRoutes: function(callback) {
    site.app.get('/wacky', function(req, res) { res.send('wackiness'); });
    return callback(null);
  },

  // Just before apos.endAsset. Last chance to push any assets. Usually the
  // `assets` option above, and calling `pushAsset` from your modules,
  // is good enough.

  beforeEndAssets: function(callback) {
    // Apostrophe already loads these for logged-out users, but we
    // want them all the time in this project.
    site.apos.pushAsset('script', { name: 'vendor/blueimp-iframe-transport', when: 'always' });
    site.apos.pushAsset('script', { name: 'vendor/blueimp-fileupload', when: 'always' });
    return callback(null);
  },

  // Just before listen. Last chance to set up anything
  afterInit: function(callback) {
    return callback(null);
  },

  sanitizeHtml: {
    // Any options that can be passed to the sanitize-html
    // module are valid here. Used to adjust the way we filter
    // HTML saved in the rich text editor. You probably want
    // to stick with our standard set of allowed tags and
    // encourage users to respect your design rather than
    // fighting it
  },

  // A simple way to alter the results of every call to apos.get, and thus
  // every page, snippet, blog post, etc. The retrieved documents will be
  // in results.pages. Be aware that this property does not always exist,
  // as apos.get is sometimes used just to fetch distinct tags or
  // other metadata.
  afterGet: function(req, results, callback) {

  }
});
```
