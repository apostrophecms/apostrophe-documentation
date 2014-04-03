# Advanced Server Side Topics

Let's return to the server side for a few advanced topics.

### Manipulating snippet objects in the database

The following methods are convenient for manipulating snippet objects:

`self.get(req, criteria, options, callback)`, as described earlier, retrieves snippets. `self.getOne` takes the same arguments but invokes its callback with just one result, or null, as the second argument.

`self.putOne(req, oldSlug, snippet, callback)` inserts or updates a single snippet. If you are not potentially changing the slug you can skip the `oldSlug` argument.

These methods respect the permissions of the current user and won't allow the user to do things they are not allowed to do. They should be used in preference to directly manipulating the `self._apos.pages` collection in most cases.

The `self.putOne` method also invokes `self.beforePutOne` method and `self.afterPutOne` methods, which always receive the parameters `req, oldSlug, options, snippet, callback`. This is a convenient point at which to update denormalized copies of properties or perform a sync to other systems. These methods differ from `beforeSave` in that they are used for all operations in which you want to update a snippet, not just when a user is editing one via the "Manage Snippets" dialog or importing them from CSV.

### Pushing our JavaScript and CSS assets to the browser

Great, but how do our `editor.js` and `content.js` files make it to the browser? And what about the various templates that are instantiated on the browser side to display modals like "New Blog Post" and "Manage Blog Posts?"

The answer is that the snippet module pushes them there for us:

```javascript
self.pushAsset('script', 'editor');
self.pushAsset('script', 'content');
self.pushAsset('template', 'new');
self.pushAsset('template', 'edit');
self.pushAsset('template', 'manage');
self.pushAsset('template', 'import');
```

As explained in the documentation of the main `apostrophe` module, the `pushAsset` call schedules scripts, stylesheets and templates to be "pushed" to the browser when building a complete webpage. Scripts and stylesheets are typically minified together in production, and templates that are pushed to the browser in this way are hidden at the end of the `body` element where they can be cloned when they are needed by the `apos.fromTemplate` method. And since we specified our own directory when setting up the `dirs` option, our versions of these files are found first.

So you don't need to worry about delivering any of the above files (`editor.js`, `editor.less`, `content.js`, `content.less`, `new.html`, `edit.html`, `manage.html`, and `import.html`). But if you wish to push additional browser-side assets as part of every page request, now you know how.

You can also push stylesheets by passing the `stylesheet` type as the first argument. Your stylesheets should be in `.less` files in the `public/css` subdirectory of your module. Be sure to take advantage of LESS; it's pretty brilliant. But plain old CSS is valid LESS too.

### Saving Extra Properties on the Server

*Remember, this is the hard way, just use `addFields` if you can.*

Now that we've introduced extra properties, and seen to it that they will be included when a new blog post is sent to the server, we need to enhance our server-side code a little to receive them.

The server-side code in `apostrophe-blog/index.js` is very similar to the code we saw in the browser.

We can store our new properties via the `self.beforeSave` method:

```javascript
var superBeforeSave = self.beforeSave;

self.beforeSave = function(data, snippet, callback) {
  snippet.publicationDate = self._apos.sanitizeDate(data.publicationDate, snippet.publicationDate);
  return superBeforeSave(data, snippet, callback);
}
```

If you need to treat new and updated snippets differently, you can override `beforeInsert` and `beforeUpdate`.

Notice that we call the original version of the `beforeSave` method from our superclass. Although `apostrophe-snippets` itself keeps this method empty as a convenience for overrides, if you are subclassing anything else, like the blog or events modules, it is critical to call the superclass version. So it's best to stay in the habit.

Note the use of the `apos.sanitizeDate` method. The `apostrophe` module offers a number of handy methods for sanitizing input. The `sanitize` npm module is also helpful in this area. Always remember that you cannot trust a web browser to submit valid, safe, correct input.

*Apostrophe's philosophy is to sanitize input rather than validating it.* If the user enters something incorrect, substitute something reasonable and safe; don't force them to stop and stare at a validation error. Or if you must do that, do it in browser-side JavaScript to save time. Is the slug a duplicate of another snippet's slug? Modify it. (We already do this for you.) Is the title blank? Provide one. (We do this too.)

"What about areas?" In our earlier example we introduced an Apostrophe content area named `parking` as part of a snippet. Here's how to sanitize and store that on the server side:

```javascript
// Transportation is an area, ask snippet/index.js to process it for us automatically
self.convertFields.push({ type: 'area', name: 'transportation' });
```

*Important:* you don't need to do this as part of your `self.beforeSave` override. You register it just once in your constructor, after calling the snippet module constructor that provides the service.

Always keep in mind that most fields don't need to be integrated into a `beforeSave` method and can just be implemented using the `addFields` schema feature.

### Extending the `get` method to support custom criteria

So far, so good. But what if we want to limit the blog posts that appear on the index page to those whose publication date has already passed? While we're at it, can't we put the blog posts in the traditional descending order by publication date?

Those are very reasonable requests. Here's how to do it. Once again we'll use the `super` pattern to extend the existing method:

```javascript
// Establish the default sort order for blog posts
var superGet = self.get;

self.get = function(req, optionsArg, callback) {
  var options = {};

  extend(options, optionsArg || {}, true);

  if (options.publicationDate === 'any') {
    delete options.publicationDate;
  } else if (!options.publicationDate) {
    options.publicationDate = { $lte: moment().format('YYYY-MM-DD') };
  } else {
    // Custom criteria were passed for publicationDate
  }

  if (!options.sort) {
    options.sort = { publicationDate: -1 };
  }
  return superGet.call(self, req, options, callback);
};
```

The `get` method accepts an `options` argument, an object which eventually becomes a set of criteria to be passed as the first argument to a MongoDB `find()` call. Here we start by coping the entire `options` object with the `extend` function, which is available via the `extend` npm module.

"Hang on a second! Why are we copying the options?" Because we're going to change them. And when you pass an object in JavaScript, you're *not copying it*. Which means that if you modify it, *the original is modified*. And the code that's calling our function might not like that. So we copy the options before we start to alter them.

We begin by checking for a special case: if `publicationDate` is set to `any`, we actually do want to see unpublished blog posts. So we remove the property from the `options` object so it doesn't get passed to MongoDB. This option is used when implementing the admin interface, as you'll see below.

Next we set up the default behavior: if no `publicationDate` option has already been specified, we set it up as a MongoDB query for dates prior to or equal to today's date. (See the documentation of the `moment` npm module, used here to format a date in the correct way to compare it to our publication dates.)

Finally, if no sorting criteria have already been specified, we specify a sort in reverse order by publication date (the traditional order for a blog).

Finally we invoke the original version of the `get` method.

### When the `manage` dialog and the public should see different things

An editor managing blog posts through the "Manage Blog Posts" dialog needs to see slightly different things than a member of the public. For instance, they should see posts whose publication date has not yet arrived.

The snippets module provides an `addApiCriteria` method for adding special criteria only when an API is being called. This allows us to treat requests for blog posts made by the "Manage Blog Posts" dialog differently:

```javascript
var superAddApiCriteria = self.addApiCriteria;
self.addApiCriteria = function(query, criteria) {
  superAddApiCriteria.call(self, query, criteria);
  criteria.publicationDate = 'any';
};
```

Here we extend `addApiCriteria` to explicitly include posts whose publication date has not yet arrived. Since this method is invoked for us before `get` is called to populate the "Manage Blog Posts" dialog, we'll see the additional posts that haven't been shared with the world yet.

### When Two Page Types Have the Same Instance Type

"Great, now I know how to subclass snippets in a big way. But all I want to do is present blog posts a little differently if my user picks the 'press releases' page type. What's the absolute minimum I have to do?"

Fair question. You can do it like this, in `app.js` where you configure modules:

```javascript
modules: {
  sweet: {
    extend: 'apostrophe-blog'
  },
  savory: {
    extend: 'apostrophe-blog'
  }
}
```

Add both page types as well:

```javascript
  pages: {
    types: [
      { name: 'default', label: 'Default (Two Column)' },
      { name: 'home', label: 'Home Page' },
      { name: 'sweet', label: 'Sweet-Styled Blog' },
      { name: 'savory', label: 'Savory-Styled Blog' },
    ]
  }, ... more configuration ...
```

Now create `index.html` and `show.html` files in `lib/modules/sweet/views` and `lib/modules/savory/views`.

Now you can create pages with either type. They will draw from the same pool of content (the "Articles" menu), but you can lock down the pages to display articles with particular tags.