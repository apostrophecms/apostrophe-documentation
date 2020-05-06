const { sidebar } = require('./sidebar.json');

module.exports = {
  plugins: {
    '@vuepress/google-analytics': {
      ga: 'UA-106613728-3'
    },
    sitemap: {
      hostname: 'https://docs.apostrophecms.org'
    }
  },
  themeConfig: {
    repo: 'https://github.com/apostrophecms/apostrophe',
    docsRepo: 'https://github.com/apostrophecms/apostrophe-documentation',
    docsBranch: 'vuepress', // TODO: Change to master following merge.
    docsDir: 'docs',
    lastUpdated: 'Last updated',
    nextLinks: true,
    prevLinks: true,
    editLinks: true,
    sidebar,
    feedbackWidget: {
      docsRepoIssue: 'apostrophecms/apostrophe-documentation'
    },
    logo: '/images/a2-lockup.png',
    nav: [
      {
        text: 'Docs Home',
        link: '/'
      },
      {
        text: 'Getting Started',
        link: '/getting-started/'
      },
      {
        text: 'Reference',
        link: '/reference/'
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
