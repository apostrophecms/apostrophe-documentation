---
title: Working with cursors
---

Apostrophe uses cursors to fetch docs from the database. An [apostrophe-cursor](../../api/reference/apostrophe-docs/server-apostrophe-cursor.html) object helps us conveniently fetch docs from
the `aposDocs` mongodb collection using chainable "filter" methods. Much
like a MongoDB or Doctrine cursor, but with many filters specific
to Apostrophe that add a great deal of convenience. And it's possible
to add your own filters.

## An illustrated example

Let's say we've created a `profiles` module that [extends apostrophe-pieces](../getting-started/reusable-content-with-pieces.html). Its configuration looks like this:

```javascript
{
  modules: {
    profiles: {
      extend: 'apostrophe-pieces',
      name: 'profile',
      label: 'Profile',
      addFields: [
        {
          type: 'integer',
          name: 'reputation',
          label: 'Reputation'
        }
      ]
    }
  }
}
```

Now, from another module, we want to fetch the ten most recently updated profiles by authors over 30:

```javascript
return apos.docs.getManager('profile').docs.find(req,
    {
      reputation: {
        $gte: 30
      }
    }
  ).sort({ updatedAt: -1 })
  .toArray(function(err, profiles) {
    // We can work with the profiles here
  });
```

What's going on here?

* The [`getManager` method of `apostrophe-docs`](../../reference/apostrophe-docs/index.html#getManager) is telling us the right module to talk to about docs of type `profile`. That will be our `profiles` module.
* The [`find` method of `apostrophe-pieces`](../../reference/apostrophe-pieces/index.html#find) creates a cursor that is specific to profiles.
* That cursor will be able to see only documents the current request is allowed to see, thanks to `req`.
* Next, the [mongodb query ("criteria") object](https://docs.mongodb.com/manual/reference/method/db.collection.find/) we pass to `find` specifies that we are only interested in profiles with a `reputation` field set to 30 or higher.
* Then, the [sort filter method of `apostrophe-cursor`](../../reference/apostrophe-docs/server-apostrophe-cursor.html#sort) specifies the sort order, just like the `sort()` filter in MongoDB.
* Finally, the [`toArray` method of `apostrophe-cursor`](../../reference/apostrophe-docs/server-apostrophe-cursor.html#to-array) actually fetches the docs from the database. If all goes well, our callback function receives `(null, docs)`, and `docs` is an array of profiles.

## Full text search

So far this looks familiar to MongoDB developers. But Apostrophe adds some [filter methods of its own](../../api/reference/apostrophe-docs/server-apostrophe-cursor.html#methods) that go beyond what you get out of the box with MongoDB.

Let's search for profiles related to shoes, based on the text of each document:

```javascript
return apos.docs.getManager('profile').docs.find(req,
    {
      reputation: {
        $gte: 30
      }
    }
  ).search('shoes')
  .toArray(function(err, profiles) {
    // We can work with the profiles relevant to shoes here
  });
```

The `search` filter performs a MongoDB full-text search *and* adjusts the sort order to be based on search quality, unless you explicitly ask for another order. And, Apostrophe has already taken care of ensuring that MongoDB indexes the content of your string schema fields and rich text widgets.

> You can specify `searchable: false` for a schema field if you really don't want it to be considered for search.

> There is also an `autocomplete` filter, which accepts with partial words, autocompletes them based on "high importance" words such as those in titles, and then feeds that back into the `search` filter. Autocomplete is great, but it can't find everything. So if you offer autocomplete, it's also a good idea to offer "full search" as well.

## Pieces pages and filters

To make it easier to browse a listing of pieces, the [apostrophe-pieces-pages](../../reference/apostrophe-pieces-pages/index.html) module will *automatically permit filters to be used as query string parameters*, provided they are marked as safe for the public. You can try this with the `search` filter, which is marked as safe. But where this feature really comes into its own is when we add custom filters to our modules.

## Custom filters: browsing profiles by market

Let's say our profiles have a [join](../getting-started/schema-guide.html) with another content type, `market`. Each profile is for a salesperson who works in a particular market:

```javascript
{
  modules: {
    profiles: {
      extend: 'apostrophe-pieces',
      name: 'profile',
      label: 'Profile',
      addFields: [
        {
          type: 'integer',
          name: 'reputation',
          label: 'Reputation'
        },
        {
          type: 'joinByOne',
          idField: 'marketId',
          withType: 'market',
          name: '_market',
          label: 'Market'
        }
      ]
    }
  }
}
```

We'd like to be able to fetch profiles by market. We could do that by writing a MongoDB criteria object, but if we're doing it often, it would be a lot nicer to call `.market(id)`. Better yet, `.market(slug)`, which would allow us to have user-friendly query strings in the address bar.

Here's how we do the latter:

```javascript
// In lib/modules/profiles/lib/cursor.js
module.exports = {
  construct: function(self, options) {
    self.addFilter('market', {
      def: false,
      launder: function(value) {
        return self.apos.launder.string(value);
      },
      safeFor: 'public',
      finalize: function(callback) {
        var slug = self.get('market');
        if (!slug) {
          return setImmediate(callback);
        }
        return self.apos.docs.getManager('market').find({
          slug: slug
        }, {
          _id: 1
        }).toObject(function(err, market) {
          if (err) {
            return callback(err);
          }
          self.and({ marketId: market._id });
          return callback(null);
        });
      }
    });
  }
};
```

What's happening in this code?

* We placed our code in `lib/modules/profiles/lib/cursor.js`. This is important. Apostrophe will automatically load any code placed here as an [implicit subclass](../../glossary.html#implicit-subclassing) of our cursor type. That means we can modify the cursor in our own `construct` function.
* We called `addFilter` and gave the filter the name `market`. This defines a new, chainable `market(id)` method for our cursor type.
* We set a default value with `def`. By default, we don't want to filter by a particular market.
* We provided a `launder` function. The `launder` function accepts raw input from the web browser and returns it in a sanitized, "laundered" form. This is indispensable for a filter the public is allowed to use. See the [launder](https://npmjs.org/package/launder) module, always available as `self.apos.launder` inside our cursor code.
* We set `safeFor` to `public`. With this setting, any subclass of [apostrophe-pieces-pages](../../reference/apostrophe-pieces-pages/index.html) we choose to provide for browsing our profiles will *automatically support* a `market` query string parameter and filter results accordingly. *The "slug" property of each doc is a user-friendly label based on the title, suitable for use in URLs.*
* We provide a `finalize` function. `finalize` does the real work of the filter: it reaches out to the `markets` module (using `getManager`), gets a cursor for fetching markets, limits the MongoDB projection to just the IDs for speed, and calls `toObject` to fetch just one result.
* We call `self.and`. This filter says, "this cursor has all the criteria I already gave it... *and* this additional MongoDB criteria object must match too." Behind the scenes, it creates an `{ $and: [ ... ] }` MongoDB criteria object. But we don't have to fuss with that. This is the most commonly used filter when building other filters.
* Once we're finished, we invoke the callback successfully and return.

## Adding features to all cursors for pieces

You can change the behavior of all cursors for pieces. Just put your cursor definition, like the one above, in `lib/modules/apostrophe-pieces/lib/cursor.js` in your project.

## Adding features to all cursors for pages

The [apostrophe-pages-cursor](../../reference/apostrophe-pages/server-apostrophe-pages-cursor.html) type is used to fetch the current page for display on the site. It is also used to fetch its ancestors and children, and defines filters for those purposes. You can configure the filters that are called by default when fetching the current page via the [`filters` option to `apostrophe-pages`](../../reference/apostrophe-pages/index.html#filters).

But what if we want to add new filters to this type?

For this trick, you'll need to get slightly more comfortable with Apostrophe's use of [moog](https://npmjs.org/package/moog) to manage object-oriented programming.

But it's still pretty easy:

```javascript
// in app.js
modules: {
  'extend-page-cursors': {}
}
```

```javascript
// in lib/modules/extend-page-cursors/index.js
module.exports = {
  construct: function(self, options) {
    self.apos.define('apostrophe-pages-cursor', require('./lib/pagesCursor.js'));
  }
};
```

```javascript
// in lib/modules/extend-page-cursors/lib/pagesCursor.js'
module.exports = {
  construct: function(self, options) {
    self.addFilter('yourFilterNameHere', { ... definition ... });
  }
}
```

What's happening in this code?

* We created a new module, `extend-page-cursors`.
* In that module, we called `self.apos.define`, a convenience method that invokes `self.apos.synth.define` to define a new type of object. But *since that type already exists, it creates an implicit subclass*, in which *our version replaces the original but does not discard it*. Instead, our `construct` function is called `after` the regular one. This allows us to add additional filters as we see fit.
* We used `require` to pull in the actual definition from `pagesCursor.js`, just to keep the code tidy.

## Whoa, that was intense

It's true, cursors are a little intense once you start extending them. But they are also one of Apostrophe's most powerful and useful features. The more you work with them, the more you'll appreciate the convenience.
