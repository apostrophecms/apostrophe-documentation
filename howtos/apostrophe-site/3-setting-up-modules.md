# Setting up Modules

## Adding Modules to the Admin Bar

Adding a module to the `modules` property in the `apostrophe-site` configuration of `app.js` does most of the work, but you do need to add it to the admin bar when appropriate. For instance, you'll want the "blog" menu to be added at the top of the page when the blog module is installed.

In our sandbox site or a project cloned from it, you would do that in `outerLayout.html`. Just look for calls like this one:

```
{{ aposBlogMenu({ edit: permissions.edit }) }}
```

Conversely, if you choose not to include a module but haven't removed it from the admin bar, don't be surprised when you get a template error.

## Overriding the Templates of a Module

First `npm install` and configure `apostrophe-blog`. Then create a `lib/modules/apostrophe-blog/views` folder in your project. Copy any templates you wish to customize from the npm module's views folder to `lib/modules/apostrophe-blog/views`.

Boom! Apostrophe will automatically look first at your "project level" module folder.

## Overriding a Module With a New Name

You can override a module more than once, for instance to set up two things that are similar in spirit to a blog. Just create folders in `lib/modules`, with your `views` overrides, and configure them in `app.js` via the `modules` option as shown above. Then use the `extend` property to tell Apostrophe what module you're extending.

You'll want to set the `name` and `instance` options so the database can distinguish between your stories and regular blog posts:
```javascript
    stories: {
      extend: 'apostrophe-blog',
      name: 'stories',
      instance: 'story',
      addFields: [
        {
          name: 'storyteller',
          type: 'string'
        }
      ]
    }
```
Note that you will need to copy the `new`, `edit` and `manage` templates to your `views` folder and fix any references to `blog` and `blog-post` to refer to `stories` and `story`.

## Overriding the Schema of a Module: Adding Custom Properties

As seen above, you can add and alter the properties of blog posts and similar things via the `addFields` and `alterFields` options as described in the [apostrophe-snippets](http://github.com/punkave/apostrophe-snippets) documentation. Those options can go right in the configuration for your module in `app.js`.

## Overriding and Extending Methods of a Module

If you really need to change a module's behavior, for instance changing what the page loader function does or the way it fetches data from the database, you'll need to subclass it. But we've made subclassing much easier. Just create an `index.js` file in your `lib/modules/mymodulename` folder.

Here's a really simple subclass that changes the way the `index` method of the blog behaves so that a featured story is available to the `index.html` template as the `featured` variable in nunjucks:
```javascript
module.exports = stories;

function stories(options, callback) {
  return new stories.Stories(options, callback);
}

stories.Stories = function(options, callback) {
  var self = this;

  module.exports.Super.call(this, options, null);

  var superIndex = self.index;
  self.index = function(req, snippets, callback) {
    self.get(req, { tags: 'featured' }, { limit: 1 }, function(err, results) {
      if(err) {
        callback(err);
      }
      if(results.total > 0) {
        req.extras.featured = results.snippets[0];
      }
      superIndex(req, snippets, callback);
    });
  };

  // Must wait at least until next tick to invoke callback!
  if (callback) {
    process.nextTick(function() { return callback(null); });
  }

};
```
Note the use of `module.exports.Super`. This automatically points to the base class constructor.

Confused? Just remember to follow this pattern and put your method overrides after the call to `module.exports.Super`.

## Tip: Subclassing Snippets is Often a Good Idea

If it doesn't smell like a blog post, you probably want to subclass snippets instead. The blog module simply subclasses snippets and adds the idea of a publication date.

## Modules Can Have Nothing To Do With Snippets

You can configure modules that have nothing at all to do with snippets, too. Our own RSS and Twitter modules, for instance.

To configure a module with `apostrophe-site`, all you have to do is make sure it looks like this:
```javascript
module.exports = factory;

function factory(options, callback) {
  return new Construct(options, callback);
}

function Construct(options, callback) {
  var self = this;
  // Add a bunch of methods to self here, then...

  // Invoke the callback. This must happen on next tick or later!
  return process.nextTick(function() {
    return callback(null);
  });
}

// Export the constructor so others can subclass
factory.Construct = Construct;
```
In a nutshell: you must export a factory function, and it must have a constructor as its `Construct` property.

## Options Provided to Modules

In addition to the options you specify in `app.js`, all modules receive:

`apos`: the `apos` object, a singleton which provides core methods for content management. See the [apostrophe](http://github.com/punkave/apostrophe) module documentation.

`pages`: the `pages` object, a singleton which provides methods for dealing with the page tree. See the [apostrophe-pages](http://github.com/punkave/apostrophe-pages) module documentation.

`schemas`: the `schemas` object, a singleton which provides methods for dealing with schemas. Most of the time you won't interact with this directly, but you might if you're writing a module that handles moderated submissions and the like. See the [apostrophe-schemas](http://github.com/punkave/apostrophe-schemas) module documentation.

`mailer`: a `nodemailer` transport object, ready to send email as needed. See the [nodemailer](http://www.nodemailer.com/) documentation.

`site`: an object containing `title`, `shortName` and `hostName` properties, as configured in `app.js`.

`modules`: an array of objects with `web` and `fs` properties, specifying the web and filesystem paths to each folder in the chain of overrides, which is useful if you wish to allow project-level overrides via `lib/modules` of views provided by an npm module. You can take advantage of this easily if you use the `mixinModuleAssets` and `serveAssets` mixins; see `assets.js` in the apostrophe module for documentation.

## Accessing Other Modules

After all modules have been initialized, `apostrophe-site` calls the `setBridge` method on each module that has one. This method receives an object containing all of the modules as properties. The `people` module, for instance, uses the bridge to access the `groups` module. Note that this is not called until after all modules have invoked their initialization callback.

## Limitations

Currently `extend` does not check `lib/modules`, so the module you are extending must be published in npm. Most of the time we extend modules like `apostrophe-blog` and `apostrophe-snippets` in simple project-specific ways, so this isn't much of a problem so far.