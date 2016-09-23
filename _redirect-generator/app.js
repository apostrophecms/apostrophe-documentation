var fs = require('fs');

var list = fs.readFileSync('/tmp/list', 'utf8').split('\n');

list.forEach(function(item) {
  item = item.replace(/\.md/, '.html');
  item = item.replace(/^_old/, '');
  if (fs.existsSync('../_site' + item)) {
    console.error('SKIPPING because it exists in new site: ' + item);
  }
  // We don't dare 301, because what if we want one of these URLs back? OOPS. -Tom
  console.log('location = ' + item + ' { return 302 http://ohdotfive.apostrophenow.org' + item + '; }\n');
  if (item.match(/index\.html/)) {
    item = item.replace(/index\.html/, '');
    console.log('location = ' + item + ' { return 302 http://ohdotfive.apostrophenow.org' + item + '; }\n');
    item = item.replace(/\/$/, '');
    if (item.length) {
      console.log('location = ' + item + ' { return 302 http://ohdotfive.apostrophenow.org' + item + '; }\n');
    }
  }
});
