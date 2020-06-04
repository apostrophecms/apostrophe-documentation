const { entries } = require('./gitbook-redirects.json');

export default ({ router }) => {
  router.addRoutes([
    // Redirect the old, extra /apostrophe/ path.
    {
      path: '/apostrophe/*',
      redirect: '/*'
    },
    // Redirect the deprecated /tutorials subdirectory
    {
      path: '/tutorials/*',
      redirect: to => {
        if (to.params && to.params.pathMatch) {
          const leadRegex = /^tutorials/;
          return to.params.pathMatch.replace(leadRegex, '');
        }
        return '/';
      }
    },
    // Redirect the funky old devops path.
    {
      path: '/apostrophe-devops/devops/',
      redirect: '/devops/'
    },
    {
      path: '/apostrophe-devops/devops/*',
      redirect: '/devops/*'
    },
    // Not sure how this one is coming up often.
    {
      path: '/devops/apostrophe-devops/devops/*',
      redirect: '/devops/*'
    },
    // Redirect the funky old howtos path.
    {
      path: '/howtos/howtos/',
      redirect: '/howtos/'
    },
    {
      path: '/howtos/howtos/*',
      redirect: '/howtos/*'
    },
    // There were duplicate devops/howtos pages. Redirect the deprecated ones.
    {
      path: '/devops/windows',
      redirect: '/howtos/windows'
    },
    {
      path: '/devops/docker',
      redirect: '/howtos/docker'
    },
    {
      path: '/devops/migration',
      redirect: '/howtos/migration'
    },
    {
      path: '/devops/storing-sessions-in-redis',
      redirect: '/howtos/storing-sessions-in-redis'
    },
    {
      path: '/howtos/email',
      redirect: '/devops/email'
    },
    {
      path: '/howtos/multicore',
      redirect: '/devops/multicore'
    },
    // Redirect deployment and cloud, which used to be in howtos
    {
      path: '/howtos/deployment/',
      redirect: '/devops/deployment/'
    },
    {
      path: '/howtos/deployment/*',
      redirect: to => {
        if (to.params && to.params.pathMatch) {
          const leadRegex = /^howtos\/deployment/;
          return to.params.pathMatch.replace(leadRegex, 'devops/deployment');
        }
        return '/devops/deployment';
      }
    },
    {
      path: '/howtos/cloud/',
      redirect: '/devops/cloud/'
    },
    {
      path: '/howtos/cloud/*',
      redirect: to => {
        if (to.params && to.params.pathMatch) {
          const leadRegex = /^howtos\/cloud/;
          return to.params.pathMatch.replace(leadRegex, 'devops/cloud');
        }
        return '/devops/cloud';
      }
    },
    {
      path: '/other/glossary',
      redirect: '/reference/glossary'
    },
    {
      path: '/other/core-server',
      redirect: '/reference/core-server'
    },
    {
      path: '/other/core-browser',
      redirect: '/reference/core-browser'
    }
  ].concat(entries));
};
