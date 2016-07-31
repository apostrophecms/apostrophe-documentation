// This apostrophe app exists solely for use as a command line
// utility; invoke with:
//
// node app documentation:generate
//
// It will listen briefly on port 3000, which must be free,
// in order to use phantomjs to introspect the browser side
// moog types.

var apos = require('apostrophe')({
  shortName: 'api-reference-generator',
  modules: {
    // Make sure apostrophe-pieces-pages gets activated as a module
    // so it's not missing from the docs. This requires we have
    // a piece type too
    'dummies': {
      extend: 'apostrophe-pieces',
      name: 'dummy',
      label: 'Dummy',
      pluralLabel: 'Dummies'
    },
    'dummies-pages': {
      extend: 'apostrophe-pieces-pages',
    },
    // Documentation generator
    'documentation': {}
  },
});
