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
      redirect: '/*'
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
      redirect: '/devops/deployment/*'
    },
    {
      path: '/howtos/cloud/',
      redirect: '/devops/cloud/'
    },
    {
      path: '/howtos/cloud/*',
      redirect: '/devops/cloud/*'
    }
  ].concat(entries));
};
