const { sidebar } = require('./sidebar.json');

module.exports = {
  title: 'ApostropheCMS Developer Documentation',
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
    docsBranch: 'master',
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
    ],
    algolia: {
      apiKey: 'e11d95029c6a9ac596343664b7f622e4',
      indexName: 'apostrophecms'
    }
  }
};
