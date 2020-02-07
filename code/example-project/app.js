var path = require('path');

var apos = require('apostrophe')({
  shortName: 'final-test',

  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {

    // Apostrophe module configuration

    // Note: most configuration occurs in the respective
    // modules' directories. See lib/apostrophe-assets/index.js for an example.
    
    // However any modules that are not present by default in Apostrophe must at
    // least have a minimal configuration here: `moduleName: {}`

    // If a template is not found somewhere else, serve it from the top-level
    // `views/` folder of the project

    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },

    'link-widgets': {},
    'foods': {},
    'foods-widgets': {
        extend: 'apostrophe-pieces-widgets'
         },
    'foods-pages': {
        extend: 'apostrophe-pieces-pages'
         },

    'apostrophe-pages': {
      types: [
            {
              name: 'default',
              label: 'Default'
            },
            {
              name: 'landing-page',
              label: 'Landing Page'
            },
            {
              name: 'home',
              label: 'Home'
            },
            {
              name: 'foods-page',
              label: 'Food'
            }
          ]
        }
      }
});
