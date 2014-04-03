# The minimum

Here's a basic `app.js` file that uses `apostrophe-site` to power a project. While `pages` is not strictly required, it is necessary if you want custom page templates.

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

  // You can always log in at /login as admin, with this password
  adminPassword: 'SOMETHING SECURE PLEASE',

  // a random session secret
  sessionSecret: 'SOMETHING RANDOM',

  // Any options accepted by the apostrophe-pages module go here.
  // The `name` field refers to the template in the views/pages folder.
  pages: {
    // List all the page types users should be able to add here
    types: [
      { name: 'default', label: 'Default Page Template' },
      { name: 'home', label: 'Home Page Template' }
    ]
  }
});
```