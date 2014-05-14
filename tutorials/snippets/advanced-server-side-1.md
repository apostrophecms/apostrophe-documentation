---
title: "Advanced Server Side Topics: Part 1"
---

It's surprising how much you can do with just `app.js` configuration and a few overridden templates. But sometimes you'll want to go beyond that. Maybe you need more than just `index` and `show` views of your content type. Or maybe you need to enhance the criteria by which items are fetched from MongoDB, adding more filters for instance.

To do so, you'll need to add a `/lib/modules/stories/index.js` file, in which you implement a manager object for your content type. Fortunately this isn't hard, because we provide tools to make it easier to subclass the manager object of `apostrophe-snippets`.

A bare-bones `index.js` looks like this:

```javascript
module.exports = stories;

function stories(options, callback) {
  return new stories.Stories(options, callback);
}

stories.Stories = function(options, callback) {
  var self = this;

  module.exports.Super.call(this, options, null);

  if (callback) {
    process.nextTick(function() { return callback(null); });
  }
};
```

This is just enough code to:

* Provide a "factory function" that creates our manager object
* Provide a constructor for the manager object
* Save `this` in a variable called `self` inside our closure, so we can always find the right `this` in callbacks
* Invoke the constructor of the superclass via `module.exports.Super`
* Invoke a callback to allow Apostrophe to continue starting up.

*Before* the `module.exports.Super` call, you may modify the `options` object. Typically you'll just set your options in `app.js`, but you may find it convenient to modify them here.

*If you are writing an npm module to share with the community*, you'll need to explicitly require your superclass module and invoke its constructor. `module.exports.Super` is a special convenience that only works at project level. Check out how the blog module does it.*

*After* the `module.exports.Super` call, but *before* the callback, you can override methods. And we'll look at examples of that in a moment.

### Snippets = pages outside the main page tree

This is a good time to mention how snippets are actually stored. Snippets are really nothing more than objects in the `aposPages` MongoDB collection, with the `type` property set to `snippet` (the `instance` property of the content type) and a slug that *does not* begin with a `/`, so that they don't appear directly as part of the page tree. Since they exist outside of the page tree, they don't have `rank` or `path` properties. In other respects, though, they are much like regular pages, which means they have a `title` property and an `areas` property containing rich content areas as subproperties. In addition, they can have properties that are unique to snippets.

Since snippets are pages, we can leverage all the capabilities already baked into Apostrophe to manage pages. In particular, the `getPage` and `putPage` methods are used to retrieve and store pages. Those methods check permissions, take care of version control, implement search indexing and perform other tasks common to snippets and regular pages.

### Customizing the dispatcher: handling URLs differently

By default, a snippet index page shows an index of snippets when it is accessed directly. And it shows individual snippets if the rest of the URL, after the slug of the snippet index page, matches the slug of the snippet. It looks like this:

http://mysite.com/policies/parties

Where "/policies" is the slug of a blog index page that the user has added to the page tree, and "parties" is the slug of an individual snippet. (Policies are a rather common use case for directly using snippet index pages on a site.)

### How the `dispatch` method works

The snippet module has a `dispatch` method that figures this out. All that method really does is:

1. Look at `req.remainder`, which contains the rest of the URL following the URL of the page itself. This will be an empty string if the visitor is looking at the index page itself.

2. Decide whether to serve an index page, a show page, or something else unique to your module's purpose.

3. Store any extra variables you wish to pass to the template you'll be rendering as properties of the `req.extras` object. This is how you'll pass your snippet or snippets to your template after fetching them. Typically the dispatcher calls the `get` method of the snippet module to fetch snippets according to criteria taken from the page settings as well as the query string or portions of the URL. Extending the `get` method is very common and provides a way to add additional criteria that can be used together with the built-in criteria for snippets, such as tags. The `get` method also takes care of permissions, widget loader functions, and other things you really don't want to reinvent. And the `get` method provides not just the snippets but also a list of distinct tags that appear among that collection of snippets. The `get` method also implements pagination, together with the default dispatcher and the `addCriteria` method. So we strongly recommend extending `get` rather than querying MongoDB yourself in most cases.

4. Set `req.template` to a function that will render the content of the response when passed the same data that is normally provided to a page template, such as `slug`, `page` (the index page object), `tabs`, `ancestors`, `peers`, etc. Fortunately the snippets module provides a handy `renderer` method for this purpose. So if you want to render the `show.html` template in the `views` subdirectory of your module, you can just write:

```javascript
req.template = self.renderer('show');
```

You can also set `req.notfound = true;` if appropriate, for instance if the URL looks like a show page but there is no actual snippet that maches the URL.

### Extending the `dispatch` method without overriding it completely

You can override the `dispatch` method completely if you wish, and sometimes you'll need to because your needs are sufficiently different. But much of the time there is an easier way.

If you just need to change the way the show page URL is parsed, for instance to handle a publication date in the URL like:

    /2013/05/01/hooray-for-apostrophe

Then you can override the `self.isShow` method. The default version is:

```javascript
self.isShow = function(req) {
  if (req.remainder.length) {
    // Perhaps it's a snippet permalink
    return req.remainder.substr(1);
  }
  return false;
};
```

This just assumes any URL that isn't empty is a `/` followed by a snippet slug. This method should return the slug of the snippet (without actually checking whether it exists) or `false` if the URL doesn't look like a snippet show page.

To account for a publication date appearing first in the URL, we could write the following in our module's constructor, *after* the call to the snippet module's constructor so that our version overrides the other:

```javascript
self.isShow = function(req) {
  var matches = req.remainder.match(/^\/\d+\/\d+\/\d+\/(.*)$/);
  if (matches) {
    return matches[1];
  }
  return false;
};
```

(Note that we don't actually check the publication date. It's just decoration. Snippet slugs are always unique. If a user creates a snippet with a title that matches an existing snippet, the slug is automatically made unique through the addition of random digits.)

There's also another way to achieve the same goal. This technique is worth looking at because it shows us how to call the original `dispatch` method as part of our override. This is similar to calling `parent::dispatch` in PHP or `super.dispatch` in Java:

```javascript
// Grab the "superclass" version of the dispatch method so we can call it
var superDispatch = self.dispatch;

self.dispatch = function(req, callback) {
  if (req.remainder.length) {
    var matches = req.remainder.match(/^\/\d+\/\d+\/\d+\/(.*)$/);
    if (matches) {
      req.remainder = '/' + matches[1];
    }
  }
  superDispatch.call(this, req, callback);
};
```

Here we stash the original method in the variable `superDispatch`, then use the `call` keyword to invoke it as if it were still a method.

This is an important technique because in many cases we do need the default behavior of the original method and we don't want to completely override it. When you completely override something you become responsible for keeping track of any changes in the original method. **It's better to override as little as possible.**
