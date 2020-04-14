/* eslint-disable no-console */
var async = require('async');
var fs = require('fs');

// The convention now is to prefix the name of all moog types related to
// a module with a module name, however we need a lookup table for the handful
// of frequently used types that predate this convention

var typeModules = {
  'apostrophe-context': 'apostrophe-utils',
  'apostrophe-cursor': 'apostrophe-docs',
  'apostrophe-array-editor-modal': 'apostrophe-schemas'
};

module.exports = {
  construct: function(self, options) {

    if (self.apos.argv._[0] === 'documentation:generate') {
      // Add a route to dump the browser side type definitions, but
      // only when our task is running
      self.route('get', 'scripts', function(req, res) {
        req.scene = 'user';
        return self.sendPage(req, 'scripts', {});
      });
    }

    const sidebarJsonPath = '../docs/.vuepress/sidebar.json';
    const startingNav = JSON.parse(fs.readFileSync(sidebarJsonPath, 'utf8'));
    const refIndex = startingNav.sidebar.findIndex(item => {
      return item.path && item.path === '/reference';
    });

    self.apos.tasks.add('documentation', 'generate', 'Usage: node app documentation:generate\n\nRegenerates the module reference documentation.', function(apos, argv, callback) {
      return async.series([
        self.extract,
        self.generate
      ], callback);
    });

    self.extract = function(callback) {

      if (self.apos.argv['skip-extract']) {
        return setImmediate(callback);
      }

      // Strategy: dump out the server side definitions as JSON, then
      // allow the Apostrophe site to listen for connections and use
      // phantomjs to dump out the browser side definitions as JSON too

      console.log('Fetching server side definitions');
      fs.writeFileSync(self.apos.rootDir + '/data/server-types.json', JSON.stringify(self.apos.synth.definitions, null, '  '));

      console.log('Fetching browser side definitions');
      self.apos.options.afterListen = function(err) {
        if (err) {
          return callback(err);
        }
        console.log('in afterListen');
        return require('child_process').exec('npx phantomjs ' + __dirname + '/phantomjs-print-definitions.js', function(err, stdout, stderr) {
          if (err) {
            return callback(err);
          }
          fs.writeFileSync(self.apos.rootDir + '/data/browser-types.json', stdout);
          return callback(null);
        });
      };
      self.apos.listen();
    };

    self.generate = function(callback) {

      var fs = require('fs');
      var _ = require('lodash');
      var glob = require('glob');
      var path = require('path');

      var serverTypes, browserTypes;

      var modules = getAllModules();

      var types = {};

      readAllTypes();

      _.each(modules, function(module) {
        processModule(module);
      });

      _.each(modules, function(module) {
        documentModule(module);
      });

      mkdirp('../docs/reference/modules');

      const sidebarJson = JSON.stringify(startingNav, null, 2);
      fs.writeFileSync(sidebarJsonPath, sidebarJson);

      return callback(null);

      function readAllTypes() {
        serverTypes = JSON.parse(fs.readFileSync(self.apos.rootDir + '/data/server-types.json'));
        browserTypes = JSON.parse(fs.readFileSync(self.apos.rootDir + '/data/browser-types.json'));
        _.each(serverTypes, function(type, name) {
          if (!name.match(/^apostrophe-/)) {
            // A server-side type specific to the reference generator itself, ignore it
            return;
          }
          types['server-' + name] = {
            module: getModuleName(name),
            title: name +
            ((getModuleName(name) === name) ? ' (module)' : ' (server)'),
            files: [],
            routes: [],
            methods: [],
            helpers: [],
            deferredHelpers: [],
            name: name,
            nameNamespaced: 'server-' + name,
            options: typeToOptions(type),
            namespace: 'server'
          };
        });
        _.each(browserTypes, function(type, name) {
          if (!name.match(/^apostrophe-/)) {
            // A browser-side type specific to the reference generator itself, ignore it
            return;
          }
          types['browser-' + name] = {
            module: getModuleName(name),
            title: name + ' (browser)',
            files: [],
            routes: [],
            methods: [],
            helpers: [],
            deferredHelpers: [],
            name: name,
            nameNamespaced: 'browser-' + name,
            options: typeToOptions(type),
            namespace: 'browser'
          };
        });

        function getModuleName(typeName) {

          // For oddballs not following the pattern

          if (typeModules[typeName]) {
            return typeModules[typeName];
          }

          // Alpha sort is a quick and dirty way to make sure subclassed
          // modules wind up matching first if there is any danger of
          // confusion due to prefix naming
          var moduleNames = modules.slice();
          moduleNames.sort(function(a, b) {
            if (a.length > b.length) {
              return -1;
            } else if (b.length > a.length) {
              return 1;
            } else {
              return 0;
            }
          });

          return _.find(moduleNames, function(name) {
            if ((name === typeName) || ((name + '-') === typeName.substr(0, name.length) + '-')) {
              return name;
            };
          });
        }

        function typeToOptions(type) {
          var options = {};
          _.each(type, function(val, name) {
            options[name] = {
              def: val,
              comments: ''
            };
            if ((name === 'extend') && val) {
              // Sometimes points to the actual type object, turn that back to a name
              if (typeof (val) === 'object') {
                options[name] = {
                  def: val.__meta.name,
                  comments: ''
                };
              }
            }
          });
          return options;
        }
      }

      function getAllModules() {
        return fs.readdirSync(self.apos.rootDir + '/node_modules/apostrophe/lib/modules');
      }

      function processModule(module) {

        var relatedTypes = [];
        _.each(self.apos.modules, function(otherModule, name) {
          var related = otherModule.__meta.related || [];
          _.each(related, function(relatedType) {
            if (relatedType.module === module) {
              relatedTypes.push(relatedType);
            }
          });
        });
        _.each(relatedTypes, function(relatedType) {
          var info = {
            module: module,
            extend: relatedType.extend,
            type: 'server-' + relatedType.name
          };
          if (relatedType.filename) {
            console.log('hooray defining ' + relatedType.name + ' from ' + relatedType.filename);
            processFile(module, null, relatedType.filename, info);
          }
        });

        processFile(module, null, self.apos.rootDir + '/node_modules/apostrophe/lib/modules/' + module + '/index.js');
        // , null, relatedTypes);

        var type = types['server-' + module];
        _.each(type.deferredHelpers || [], function(name) {
          var method = _.find(type.methods, { name: name });
          if (!method) {
            console.error(type.name);
            console.error("helper " + name + " was picked but not found");
          } else {
            type.helpers.push(method);
          }
        });

      }

      function documentModule(module) {
        const refSection = startingNav.sidebar[refIndex];
        const moduleList = refSection.children[refSection.children.length - 1].children;

        var type = types['server-' + module];
        var relatedTypes = _.filter(types, function(type, name) {
          return (type.module === module) && ((type.name !== module) || (type.namespace !== 'server'));
        });

        // Check if there are sub-pages. If not, just make a file named after
        // the module. If so, make a directory and do it the old way.
        if (relatedTypes.length === 0) {
          const loneFile = `../docs/reference/modules/${module}.md`;
          fs.writeFileSync(loneFile,
            `# ${module}\n` +
            documentExtend(type, 0) +
            documentAlias(type) +
            documentComments(type.comments) + "\n" +
            documentMethods(type) +
            documentHelpers(type) +
            documentRoutes(type)
          );

          moduleList.push(`reference/modules/${module}`);
          return;
        }

        var folder = '../docs/reference/modules/' + module;
        mkdirp(folder);

        const navGroup = {
          title: module,
          path: `/reference/modules/${module}`,
          children: []
        };

        var markdownFile = folder + '/README.md';

        fs.writeFileSync(markdownFile,
          `# ${module}\n` +
          documentExtend(type) +
          documentAlias(type) +
          documentComments(type.comments) + "\n" +
          documentMethods(type) +
          documentHelpers(type) +
          documentRoutes(type)
        );

        _.each(relatedTypes, function(type) {
          var markdownFile = folder + '/' + type.nameNamespaced + '.md';
          fs.writeFileSync(markdownFile,
            `# ${type.title}\n` +
            documentExtend(type) +
            documentComments(type.comments) + "\n" +
            documentMethods(type) +
            documentRoutes(type)
          );

          navGroup.children.push(`reference/modules/${module}/${type.nameNamespaced}`);
        });
        moduleList.push(navGroup);
      }

      function processFile(module, subcategory, file, info, relatedTypes) {
        var code = fs.readFileSync(file, 'utf8');
        var matches;
        var base = file.replace(/\/[^/]+$/, '');
        var browserFiles = [];
        var routes = [];
        var methods = [];
        var helpers = [];
        var deferredHelpers = [];

        if (!info) {
          info = {
            module: module
          };
        }
        matches = code.match(/(^|\n)apos\.define\('([\w-]+)'/);
        if (matches) {
          info = _.cloneDeep(info);
          if (info.options) {
            // Don't let this turn into a fallback to apostrophe-cursor
            delete info.options.extend;
          }
          if (file.match(/\/public\//)) {
            // This is a browser side js file that defines a new moog type
            info.type = 'browser-' + matches[2];
            subcategory = null;
            info.options = extractOptions(code);
          } else {
            console.error('*** Confused by apos.define not in browser file');
            console.error(file);
          }
        } else if (file.match(/index\.js/)) {
          info.type = 'server-' + module;
          info.options = extractOptions(code);
        } else if (file.match(/public/)) {
          // browser file that does not define a moog type. Don't
          // look at it, we'll just get confused
          return;
        }

        if (!subcategory) {
          info.comments = commentsBeginning(code);
        }

        // Server side has a default base class
        if (file.match(/index\.js$/)) {
          if (info.options.extend !== undefined) {
            // Leave it alone, even if explicitly null
            // console.log('leaving it alone: ' + info.type);
          } else if (info.module !== 'apostrophe-module') {
            info.options.extend = {
              def: 'apostrophe-module',
              comments: ''
            };
          }
        }

        if (!types[info.type]) {
          console.error('FIRST DEFINE of ' + info.type + ', it was not in the extract');

          types[info.type] = {
            module: module,
            title: getTitle(info.type),
            files: [],
            name: info.type
          };
        }

        var requireRegex = /(apos\.define\('([\w-]+)',\s*)?require\('(\.\/(lib\/)?([\w-]+))(\.js)?'\)\s*(\(self)?/g;

        while ((matches = requireRegex.exec(code)) !== null) {
          var newType = matches[2];
          var newFile = matches[3];
          var newSubcategory = matches[5];
          var hasSelf = matches[7];

          if (hasSelf) {
            if (matches[0].match(/cursor/i)) {
              console.error('TODO deal with apostrophe-pieces and the magical way it defines cursors');
            }
            processFile(module, newSubcategory, path.resolve(base, newFile) + '.js', info);
          } else if (newType) {
            var _info = _.cloneDeep(info);
            if (_info.options) {
              // New type, does not necessarily extend same chain
              delete _info.options.extend;
            }
            _info.type = 'server-' + newType;
            processFile(module, null, path.resolve(base, newFile) + '.js', _info);
          }
        }

        // Make sure it's not commented out
        var methodRegex = /\n +self\.(\w+)\s*=\s*function\s*\((.*?)\)/g;
        while ((matches = methodRegex.exec(code)) !== null) {
          methods.push(processMethod(module, subcategory, file, matches, code, info));
        }

        matches = code.match(/\n( +)self.addHelpers\(\{([\s\S]*)$/);
        if (matches) {
          var helpersSpaces = matches[1];
          var end = matches[2].indexOf('\n' + helpersSpaces + '}');
          var helpersCode = matches[2].substr(0, end);
          var helperRegex = new RegExp('\n' + helpersSpaces + '  (\\w+): function\\((.*?)\\)', 'g');
          while ((matches = helperRegex.exec(helpersCode)) !== null) {
            helpers.push(processHelper(module, file, matches, helpersCode, info));
          }
        }

        matches = code.match(/\n( +)self.addHelpers\(require\('(.+?)'/);

        if (matches) {
          // Cope with helpers following the pattern in the utils module:
          // self.addHelpers(require('./lib/helpers.js')(self, options));
          // (returns an object from a function, so look for that)
          helpersCode = fs.readFileSync(path.resolve(base, matches[2]), 'utf8');
          matches = helpersCode.match(/\n(\s+)return \{([\s\S]*)\}/);
          helpersSpaces = matches[1];
          helpersCode = matches[2];
          helperRegex = new RegExp('\n' + helpersSpaces + '  (\\w+): function\\((.*?)\\)', 'g');
          while ((matches = helperRegex.exec(helpersCode)) !== null) {
            helpers.push(processHelper(module, file, matches, helpersCode, info));
          }
        }

        matches = code.match(/self.addHelpers\(_.pick\(self,(.*)?\)/);
        if (matches) {
          var names = matches[1].split(/,\s*/);
          names = _.map(names, function(name) {
            name = name.replace(/[') ]/g, '');
            return name;
          });
          deferredHelpers = deferredHelpers.concat(names);
        }

        if (file.match(/cursor/i)) {
          // Make sure it's not commented out
          var filterRegex = /\n\s+self\.addFilter\('(\w+)/g;
          while ((matches = filterRegex.exec(code)) !== null) {
            matches[2] = 'value';
            var method = processMethod(module, subcategory, file, matches, code, info);
            method.type = 'filter';
            methods.push(method);
          }
        }

        // // Make sure it's not commented out
        // var assetRegex = /\n\s+self\.pushAsset\(\'script\',\s*\'([\w\-]+)\',\s*\{\s*when: \'(\w+)/g;

        // while ((matches = assetRegex.exec(code)) !== null) {
        //   var _info = _.cloneDeep(info);
        //   info.when = matches[2];
        //   browserFiles.push(matches[1]);
        // }

        if (!browserFiles.length) {
          browserFiles = glob.sync(require('path').dirname(file) + '/public/js/*.js');
          _.each(browserFiles, function(file) {
            processFile(module, null, file, info);
          });
        }

        // Make sure it's not commented out
        var routeRegex = /\n\s+self\.route\('(\w+)',\s*'([\w-]+)'/g;

        while ((matches = routeRegex.exec(code)) !== null) {
          routes.push({
            module: module,
            method: matches[1],
            name: matches[2],
            comments: commentsPreceding(code, matches.index)
          });
        }

        _.merge(types[info.type], {
          options: info.options
        });
        // This is NOT what _.merge does ):
        appendArrays(types[info.type], {
          routes: routes,
          methods: methods,
          helpers: helpers,
          files: [file],
          deferredHelpers: deferredHelpers
        });

        if (!types[info.type].comments) {
          types[info.type].comments = '';
        }
        if (types[info.type].comments.indexOf(info.comments) === -1) {
          types[info.type].comments += info.comments;
        }
      }

      function documentExtend(type, nestLevel = 1) {
        if (type.options.extend) {
          if (type.name === 'apostrophe-module') {
            // This is the default base class for modules, it doesn't extend another
            return '';
          }
          var extend = type.options.extend.def;
          var extendNamespaced;
          extend = extend.replace(/^(my-)+/, '');
          extendNamespaced = type.namespace + '-' + extend;
          if (!type.namespace) {
            throw new Error('no namespace for ' + type.name);
          }
          if (extend === type.name) {
            // This anomaly happens with apostrophe-cursor due to the
            // way the my- chain works with anonymous subclassing
            return '';
          }
          var extendedType = types[extendNamespaced];
          const nesting = `${nestLevel === 0 ? '.' : '..'}`;

          if ((extendedType.namespace === 'server') && (extendedType.module === extendedType.name)) {
            // It's a module, it has to extend another module
            return `## Inherits from: [${extend}](${nesting}/${extend}/README.md)\n`;
          } else {
            // The type we're extending could live in another module,
            // figure it out as a relative path
            var extendType = types[extendNamespaced];
            if (!types[extendNamespaced]) {
              console.error('NOT FOUND: ', extendNamespaced);
            }

            return `## Inherits from: [${extend}](${nesting}/${extendType.module}/${extendNamespaced}.md)\n`;
          }
        }
        return '';
      }

      function documentAlias(type) {
        if (type.options.alias) {
          return '### `apos.' + type.options.alias.def + '`\n';
        } else {
          return '';
        }
      }

      function documentMethods(type) {
        var methods = type.methods;
        if (methods.length) {
          return '## Methods\n' +
            _.map(methods, function(method) {
              return documentMethod(method);
            }).join('\n') + '\n';
        }
        return '';
      }

      function documentHelpers(type) {
        var helpers = type.helpers;
        if (helpers.length) {
          return '## Nunjucks template helpers\n' +
            _.map(helpers, function(helper) {
              return documentHelper(helper);
            }).join('\n') + '\n';
        }
        return '';
      }

      function documentRoutes(type) {
        var routes = type.routes;
        if (routes.length) {
          return '## API Routes\n' +
          _.map(routes, function(route) {
            return documentRoute(route);
          }).join('\n') + '\n';
        }
        return '';
      }

      function getTitle(typeName) {
        var matches = typeName.match(/^(\w+)-(.*)$/);
        if ((types[typeName].namespace === 'server') && (types[typeName].module === types[typeName].name)) {
          return matches[2] + ' (module)';
        }
        return matches[2] + ' (' + matches[1] + ')';
      }

      function documentMethod(method) {
        var s = '### ' + method.name + '(' + _.map(method.args, documentArg).join(', ') + ')';
        if (method.subcategory) {
          s += ' *[' + method.subcategory + ']*';
        }
        s += '\n';
        return s + documentComments(method.comments);
      }

      function documentHelper(helper) {
        var s = '### ' + helper.name + '(' + _.map(helper.args, documentArg).join(', ') + ')';
        s += '\n';
        return s + documentComments(helper.comments);
      }

      function documentRoute(route) {
        return '### ' + route.method.toUpperCase() + ' /modules/' + route.module + '/' + route.name + '\n' + documentComments(route.comments);
      }

      function documentArg(arg) {
        return '*' + arg.replace(/\*/g, '\\*') + '*';
      }

      function documentComments(comments) {
        if (!comments) {
          return '';
        }
        var lines = comments.split('\n');
        return lines.map(function(line) {
          return line.replace(/^\s*\/\/\s?/, '');
        }).join('\n');
      }

      function extractOptions(code) {
        var lines = code.split(/\n/);
        var options = {};
        _.each(lines, function(line, index) {
          var matches = line.match(/^ {2}('.*?'|\w+):\s*(.*)$/);
          if (matches) {
            // Remove trailing commas
            var def = matches[2].trim().replace(/,$/, '');
            // beforeConstruct, construct, afterConstruct are not
            // really options
            if (def.match(/^function/)) {
              return;
            }
            try {
              // eslint-disable-next-line no-eval
              def = eval(def);
            } catch (e) {
              // Since we're lame and not really grabbing multiline values
              // like arrays, this will happen sometimes for now
              def = 'unknown';
            }
            options[matches[1]] = {
              def: def,
              comments: commentsPrecedingIndex(lines, index)
            };
          }
        });
        return options;
      }

      function processMethod(module, subcategory, file, matches, code, info) {
        var name = matches[1];
        var args = matches[2];
        var optional = args.match(/\/\*.*?\*\//);
        if (optional) {
          optional = optional[0];
        }
        args = args.replace(/\/\*.*?\*\//, '');
        args = args.split(/\s*,\s*/);
        if ((args.length === 1) && (args[0] === '')) {
          args = [];
        }
        if (optional) {
          args.push(optional.substr(2, optional.length - 4).trim());
        }
        var comments = commentsPreceding(code, matches.index);

        return {
          name: name,
          args: args,
          comments: comments,
          subcategory: subcategory
        };
      }

      function processHelper(module, file, matches, code, info) {
        var name = matches[1];
        var args = matches[2];
        var optional = args.match(/\/\*.*?\*\//);
        if (optional) {
          optional = optional[0];
        }
        args = args.replace(/\/\*.*?\*\//, '');
        args = args.split(/\s*,\s*/);
        if ((args.length === 1) && (args[0] === '')) {
          args = [];
        }
        if (optional) {
          args.push(optional.substr(2, optional.length - 4).trim());
        }
        var comments = commentsPreceding(code, matches.index);
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

      // Return any comment block at the beginning of the code

      function commentsBeginning(code) {
        var comments = '';
        var lines = code.split(/\n/);
        var i;
        for (i = 0; (i < lines.length); i++) {
          var line = lines[i];
          if ((line === '') || (line.match(/^\s*\/\//))) {
            comments += line + '\n';
            continue;
          }
          break;
        }
        return comments;
      }

      function mkdirp(s) {
        require('mkdirp').sync(s, 0o777);
      }

      function appendArrays(o, i) {
        _.each(i, function(val, key) {
          o[key] = (o[key] || []).concat(val);
        });
      }
    };
  }
};
