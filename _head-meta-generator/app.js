// Fetch the actual meta tags from apostrophecms.org every time the
// documentation is built instead of manually keeping the two different projects
// in sync

var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');

request('https://apostrophecms.org/', function(error, response, data) {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  var selectors = [
    'link[rel="apple-touch-icon"]',
    'link[rel="icon"]',
    'link[rel="manifest"]',
    'link[rel="mask-icon"]',
    'link[rel="shortcut icon"]',
    'meta[name="description"]',
    'meta[name="msapplication-config"]',
    'meta[name="theme-color"]',
    'meta[property="og:image:height"]',
    'meta[property="og:image:type"]',
    'meta[property="og:image:width"]',
    'meta[property="og:image"]'
  ];

  var $ = cheerio.load(data);
  var nodes = $.html(selectors.join(", "));
  nodes = '{# This file is generated with _head-meta-generator/app.js #}\n' + nodes;

  fs.writeFileSync(path.resolve(__dirname, "../_layouts/head-meta.html"), nodes);
});
