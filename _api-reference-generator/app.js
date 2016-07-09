var fs = require('fs');
var _ = require('lodash');
var argv = require('boring')();
var glob = require('glob');
var tokenizer = require('js-tokenizer');
var path = require('path');

var modules = getAllModules();

_.each(modules, function(module) {
  processModule(module);
});

mkdirp('reference');
var file = 'reference/index.md';
fs.writeFileSync(file,
  '---\n' +
  'title: "API reference: modules"\n' +
  'children: \n' +
  _.map(modules, indentModule).join("\n") +
  '---\n'
);

function getAllModules() {
  return fs.readdirSync(argv._[0] + '/lib/modules');
}

function indentModule(name) {
  return '  ' + name;
}

function processModule(module) {
  var vendor = [];
  // var files = getModuleFiles(module);
  // files = filterOutNodeModules(files);
  // files = filterOutVendor(files, vendor);
  processFile(module, null, argv._[0] + '/lib/modules/' + module + '/index.js');
}

function getModuleFiles(module) {
  var glob = require('glob');
  return glob.sync(argv._[0] + '/lib/modules/' + module + '/**/*.js');
}

function filterOutNodeModules(files) {
  return _.filter(files, function(file) {
    return !file.match(/\/node_modules\//);
  });
}

function filterOutVendor(files, vendor) {
  return _.filter(files, function(file) {
    var isVendor = file.match(/\/vendor\//);
    if (isVendor) {
      vendor.push(file);
    } else {
      return !isVendor;
    }
  });
}

function processFile(module, subcategory, file, info) {
  var folder = 'reference/apostrophe/' + module;
  mkdirp(folder);

  var code = fs.readFileSync(file, 'utf8');
  var matches;
  var base = file.replace(/\/[^\/]+$/, '');
  var type;
  if (!info) {
    info = {};
  }
  matches = code.match(/apos\.define\(\'([\w\-]+)\'/);
  if (matches) {
    info = _.cloneDeep(info);
    info.type = matches[1];
    info.options = extractOptions(code);
  } else if (file.match(/index\.js/)) {
    info.type = module;
    info.options = extractOptions(code);
  }

  var requireRegex = /require\('(\.\/lib\/(\w+))(\.js)?'\)/g;
  var serverFiles = [];
  while ((matches = requireRegex.exec(code)) !== null) {
    serverFiles.push(matches[1]);
    processFile(module, matches[2], path.resolve(base, matches[1]) + '.js', info);
  }

  var methodRegex = /self\.(\w+)\s*=\s*function\((.*?)\)/g;
  var methods = [];
  while ((matches = methodRegex.exec(code)) !== null) {
    methods.push(processMethod(module, subcategory, file, matches, code, info));
  }

  if (file.match(/cursor/i)) {
    var filterRegex = /self\.addFilter\(\'(\w+)/g;
    while ((matches = filterRegex.exec(code)) !== null) {
      matches[2] = 'value';
      var method = processMethod(module, subcategory, file, matches, code, info);
      method.type = 'filter';
      methods.push(method);
    }
  }

  var assetRegex = /self\.pushAsset\(\'script\',\s*\'(\w+)\',\s*\{\s*when: \'(\w+)/g;

  var browserFiles = [];
  while ((matches = assetRegex.exec(code)) !== null) {
    var _info = _.cloneDeep(info);
    info.when = matches[2];
    browserFiles.push(matches[1]);
    processFile(module, matches[1], argv._[0] + '/lib/modules/' + module + '/public/js/' + matches[1] + '.js', info);
  }

  var basename = getMarkdownName(file);
  var file = folder + '/' + basename + '.md';
  fs.writeFileSync(file,
    '---\n' +
    'title: "' + getTitle(module, basename) + '"\n' +
    'children: \n' +
    _.map(serverFiles, indentMarkdownName(name)) +
    _.map(browserFiles, indentMarkdownName(name)) +
    '---\n' +
    _.map(methods, function(method) {
      return documentMethod(method, info);
    }).join("\n")
  );
}

// Get the best markdown filename for the given filename
function getMarkdownName(file) {
  var basename = path.basename(file);
  if (file.match(/\/public\//)) {
    basename = 'browser-' + basename;
  }
  return basename;
}

function indentMarkdownName(name) {
  return '  ' + getMarkdownName(name);
}

function getTitle(module, basename) {
  if (basename.match(/^browser\-/)) {
    return module + ': ' + basename.substr(8) + ' (browser)';
  }
  return module + ': ' + basename + ' (server)';
}

function documentMethod(method, info) {
  return '### ' + method.name + '(' + _.map(method.args, documentArg).join('') + ')\n'+ documentComments(method.comments, info);
}

function documentArg(arg) {
  return '\'' + arg + '\'';
}

function documentComments(comments, info) {
  var lines = comments.split('\n');
  return lines.map(function(line) {
    return line.replace(/^\/\/ /, '');
  }).join('\n');
}

function extractOptions(code) {
  var lines = code.split(/\n/);
  var options = {};
  _.each(lines, function(line, index) {
    var matches = line.match(/^  (\'.*?\'|\w+)\:\s*(.*)$/);
    if (matches) {
      options[matches[1]] = {
        def: matches[2],
        comments: commentsPrecedingIndex(lines, index)
      };
    }
  });
  return options;
}

function processMethod(module, subcategory, file, matches, code, info) {
  var name = matches[1];
  var args = matches[2];
  args = args.split(/\s*,\s*/);
  comments = commentsPreceding(code, matches.index);
  return {
    name: name,
    args: args,
    comments: comments
  };
}

function commentsPreceding(code, index) {
  // Look back for comments. It's a little brute-force
  var comments = [];
  var lines = code.substr(0, index).split(/\n/);
  var i = lines.length - 1;
  while (i >= 0) {
    if (lines[i].match(/^\s*$/)) {
      i--;
      continue;
    }
    if (lines[i].match(/^\s*\/\//)) {
      comments.push(lines[i]);
    } else {
      break;
    }
    i--;
  }
  comments.reverse();
  comments = comments.join("\n");
  return comments;
}

function commentsPrecedingIndex(lines, index) {
  var comments = [];
  var i = index - 1;
  while (i >= 0) {
    var line = lines[i].trim();
    if ((line === '') || (line.match(/^\s*\/\//))) {
      comments.push(line);
      i--;
    } else {
      break;
    }
  }
  comments.reverse();
  return comments.join('\n');
}

// Find the tokens inside a { ... } block, optionally preceded by the specified array
// of tokens. Returns { tokens: tokens, next: i } where i is the offset
// of the next token after the block is closed

function findBlock(tokens, preceding) {
  var i = 0, match, j;
  if (preceding) {
    for (i = 0; (i < tokens.length); i++) {
      match = true;
      for (j = 0; (j < preceding.length); j++) {
        if (tokens[i + j] !== preceding[j]) {
          match = false;
          break;
        }
      }
      if (match) {
        break;
      }
    }
    if (!match) {
      throw new Exception('preface to block never found');
    }
    // To get here we must have just matched it
    i += preceding.length;
  }
  if (tokens[i] !== '{') {
    throw new Exception('block not found');
  }
  var count = 0;
  var start = i + 1;
  do {
    if (tokens[i] === '{') {
      count++;
    } else if (tokens[i] === '}') {
      count--;
    }
    i++;
  } while (count > 0);
  return {
    block: tokens.slice(start, i),
    next: i + 1
  };
}

function filterSpaceTokens(tokens) {
  return _.filter(tokens, function(token) {
    return !token.match(/^\s/);
  });
}
