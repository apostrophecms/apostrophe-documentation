module.exports = function() {
  var args = process.argv.slice(2);
  var result = {
    _: []
  };
  var i;
  for (i = 0; (i < args.length); i++) {
    var matches = args[i].match(/^--(\S+)=(.*)$/);
    if (matches) {
      result[matches[1]] = matches[2];
      continue;
    }
    matches = args[i].match(/^--(\S+)$/);
    if (matches) {
      result[matches[1]] = true;
      continue;
    }
    result._.push(args[i]);
  }
  return result;
};
