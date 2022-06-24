const { sidebar } = require('./sidebar.json');

module.exports = {
  title: 'Apostrophe 2 Documentation',
  theme: 'apostrophe',
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-106613728-3'
      }
    ],
    [
      'sitemap',
      {
        hostname: 'https://v2.docs.apostrophecms.org'
      }
    ]
  ],
  themeConfig: {
    docsRepo: 'https://github.com/apostrophecms/apostrophe-documentation',
    docsBranch: 'main',
    docsDir: 'docs',
    lastUpdated: 'Last updated',
    nextLinks: true,
    prevLinks: true,
    editLinks: true,
    latestVersionPromo: true,
    sidebar,
    feedbackWidget: {
      docsRepoIssue: 'apostrophecms/apostrophe-documentation'
    },
    logo: '/images/apos-dark.png',
    nav: [
      {
        text: 'Versions',
        ariaLabel: 'Apostrophe versions',
        items: [
          {
            text: 'Apostrophe 3',
            link: 'https://v3.docs.apostrophecms.org',
            target: '_self'
          },
          {
            text: 'Apostrophe 2',
            link: '/'
          }
        ]
      },
      {
        text: 'Sections',
        ariaLabel: 'Documentation sections',
        items: [
          {
            text: 'Getting started',
            link: '/getting-started/'
          },
          {
            text: 'Guide',
            link: '/core-concepts/'
          },
          {
            text: 'Reference',
            link: '/reference/'
          }
        ]
      },
      {
        text: 'More',
        ariaLabel: 'More Apostrophe links',
        items: [
          {
            text: 'Main site',
            link: 'https://apostrophecms.com',
            rel: false
          },
          {
            text: 'GitHub',
            link: 'https://github.com/apostrophecms/apostrophe/tree/2.0',
            re: false
          },
          {
            text: 'Discord',
            link: 'http://chat.apostrophecms.org/',
            rel: false
          },
          {
            text: 'Forum',
            link: 'https://github.com/apostrophecms/apostrophe/discussions',
            rel: false
          },
          {
            text: 'Stack Overflow',
            link: 'https://stackoverflow.com/questions/tagged/apostrophe-cms',
            rel: false
          }
        ]
      }
    ],
    algolia: {
      apiKey: 'e11d95029c6a9ac596343664b7f622e4',
      indexName: 'apostrophecms',
      algoliaOptions: {
        facetFilters: [ 'tags:v2' ]
      }
    }
  },
  head: [
    // <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/6104347.js"></script>
    [ 'script', {
      type: 'text/javascript',
      id: 'hs-script-loader',
      async: 'true',
      defer: 'true',
      src: '//js.hs-scripts.com/6104347.js'
    } ],

    ['link', {rel: 'icon', type: 'image/png', sizes: "32x32", href: '/images/favicon/favicon-32.png'}],
    ['link', {rel: 'icon', type: 'image/png', sizes: "128x128", href: '/images/favicon/favicon-128.png'}],
    ['link', {rel: 'icon', type: 'image/png', sizes: "192x192", href: 'images/favicon/favicon-192.png'}],
    ['link', {rel: 'shortcut icon', type: 'image/png', sizes: "196x196", href: '/images/favicon/favicon-196.png'}],
    ['link', {rel: 'apple-touch-icon', type: 'image/png', sizes: "152x152", href: '/images/favicon/favicon-152.png'}],
    ['link', {rel: 'apple-touch-icon', type: 'image/png', sizes: "167x167", href: '/images/favicon/favicon-167.png'}],
    ['link', {rel: 'apple-touch-icon', type: 'image/png', sizes: "180x180", href: '/images/favicon/favicon-180.png'}]
  ]
};
