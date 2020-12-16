/* eslint-disable no-console */
const page = require('webpage').create();
const url = 'http://localhost:3000/modules/documentation/scripts';
page.onConsoleMessage = function(msg, lineNum, sourceId) {
  console.log(msg);
};
page.open(url, function (status) {
  if (status !== 'success') {
    throw status;
  }
  setTimeout(function() {
    window.phantom.exit();
  }, 5000);
});
