var fs = require('fs');
var list = {};
var otherList = [];

fs.readdir('modules', function (err, items) {
  items.forEach(function(item) {
    list[item] = [];
    fs.readdir('modules/' + item, function (err, subitems) {
      if (subitems) {
        subitems.forEach(function (subitem) {
          list[item].push(' * [' + subitem.replace('.md', '') + '](modules/' + item + '/' + subitem + ')')
        })
      }
    })
  })
});

setTimeout(() => {
  const keys = Object.keys(list)
  for (const key of keys) {
    otherList.push('* [' + key + '](modules/' + key + '/README.md)');
    otherList.push(...list[key])
  }
  // console.log(otherList);
  console.log(JSON.stringify(otherList))
}, 1000);