const { sidebar } = require('./sidebar.json');

module.exports = {
  themeConfig: {
    lastUpdated: 'Last updated',
    nextLinks: true,
    prevLinks: true,
    sidebar,
    logo: '/images/a2-lockup.png',
    nav: [
      {
        text: 'Docs Home',
        link: '/'
      },
      {
        text: 'Community',
        link: 'https://apostrophecms.com/community',
        rel: false
      },
      {
        text: 'Demo',
        link: 'http://demo.apostrophecms.org',
        rel: false
      },
      {
        text: 'Main Site',
        link: 'https://apostrophecms.com',
        rel: false
      }
    ]
  }
};
