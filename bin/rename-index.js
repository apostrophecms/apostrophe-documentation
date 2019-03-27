var recursive = require("recursive-readdir");
var indexes = [];
var regex = RegExp('index.md', 'g');
var fs = require('fs');

recursive("modules", function (err, files) {
  files.forEach(function(file){
    if (regex.test(file)) {
      var path = file.split('index.md')[0];
    fs.rename(file, path + 'README.md', function (err) {
      if (err) console.log('ERROR: ' + err);
    });
    }
  })
  console.log(indexes);
});