# Programming with cursors

Apostrophe uses cursors to fetch docs from the database. An [apostrophe-cursor](../../modules/apostrophe-docs/server-apostrophe-cursor.md) object helps us conveniently fetch docs from
the `aposDocs` mongodb collection using chainable "filter" methods, quite similar to those MongoDB developers are used to. Apostrophe's cursors work much like MongoDB or Doctrine cursors, but with many filter methods specific to Apostrophe that add a great deal of convenience, including methods for every field in your schema. And it's possible to add your own filters.

So when do we need to work with cursors? **When we are writing custom queries in our own server-side JavaScript code.** If you are simply adding filters to a pieces page based on your schema fields, or adding filters to the "Manage" view of your pieces, **you do not have to write any custom JavaScript at all.** See [reusable content with pieces](../core-concepts/reusable-content-with-pieces.md) for more information about how to easily configure the `piecesFilters` option, for example.

Still with us? OK, let's talk about programming with cursors.

## An illustrated example

Let's say we've created a `profiles` module that [extends apostrophe-pieces](../core-concepts/reusable-content-with-pieces.md). Its configuration looks like this:

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

Now let's say we want to fetch the ten most recently updated profiles with a `reputation` value greater than 30 and make sure we have access to that information in every page template:

{% code-tabs %}
{% code-tabs-item title="lib/modules/profiles/index.js" %}
```javascript
module.exports = {
  construct: function(self, options) {
    self.on('apostrophe-pages:beforeSend', 'fetchProfiles', async function(req) {
      req.data.topProfiles = await apos.docs.getManager('profile').find(
        req,
        {
          reputation: {
            $gte: 30
          }
        }
      )
      .sort({ updatedAt: -1 })
      .toArray();
    });
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

> **"What's going on in this code?"** We've written a [promise event handler](../other/events.md) that listens for the `apostrophe-pages:beforeSend` event, which is sent just before Apostrophe renders the page template. We've given it the method name `fetchProfiles`, to distinguish it from other handlers. And we've supplied an `async` function that fetches the profiles.
>
> `apos.docs.getManager('profile')` returns the module that manages the piece type named `profile`. If the module has an `alias` option set to `profiles`, we could also write `apos.profiles`.
>
> The `find(req, ...)` method of that module returns a cursor we can use to fetch profiles. We always pass it `req`, so it knows who is asking and what to include in the results. We also pass a MongoDB-style criteria object.
>
> We then chain the `sort` filter method to specify a sort order, then call `toArray()` to return an actual array of profiles. **Note that if we didn't specify `await`, we would just get a promise. Use `await` to get the actual array of profiles.**

## Full text search

So far this looks familiar to MongoDB developers. But Apostrophe adds some [filter methods of its own](../../modules/apostrophe-docs/server-apostrophe-cursor.md#methods) that go beyond what you get out of the box with MongoDB.

Let's search for profiles related to shoes, based on the text of each document:

```javascript
// You can add this code to the previous example
req.data.shoeProfiles = await apos.docs.getManager('profile')
  .find(req)
  .search('shoes')
  .toArray();
```

The `search` filter performs a MongoDB full-text search *and* adjusts the sort order to be based on search quality, unless you explicitly ask for another order. And, Apostrophe has already taken care of ensuring that MongoDB indexes the content of your string schema fields and rich text widgets.

> You can specify `searchable: false` for a schema field if you really don't want it to be considered for search.

> There is also an `autocomplete` filter, which accepts with partial words, autocompletes them based on "high importance" words such as those in titles and tags, and then feeds that back into the `search` filter. Autocomplete is great, but it can't find everything. So if you offer autocomplete, it's also a good idea to offer "full search" as well.

## Built-in filters: every schema field gets one!

**Every cursor object obtained via `find` from a manager automatically has methods with the same name as each field in the schema.** For instance, you can write `.slug('party').toArray()` to find all docs with a slug (URL) that exactly matches the word `party`. This works for most schema field types, although there are a few for which filters don't make sense or don't exist yet.

### Joins and filters

When working with joins, there are several ways we can call filter methods.

Let's say our join is named `_jobs`. In that case, we can write:

* `._jobs('xyz')` to match docs that are joined to the job whose `_id` is `xyz`.
* `.jobs('doctor')` to match docs that are joined to the job with the slug `doctor`.

Note the absence of the `_` in the second case.

If you are interested in results for docs joined to any of several jobs, you can pass an array:

* `._jobs([ 'abc', 'xyz' ])` to match docs that are joined to a job with **either** `_id`.
* `.jobs([ 'doctor', 'dentist' ])` to match docs that are joined to a job with **either** `slug`.

You can also match only docs that join with *all* of the `_id` or `slug` values specified:

* `._jobsAnd([ 'abc', 'xyz' ])` to match docs that are joined to *both* jobs, specified by `_id`.
* `.jobsAnd([ 'doctor', 'dentist' ])` to match docs that are joined to *both* jobs, specified by `slug`.

> End users usually find "AND" filters to be frustrating because they receive few or no results. We recommend using the "OR" approach.

## Custom filters

The standard filter methods for each schema field are quite powerful, but occasionally you'll want to write one of your own. Here's an example of a custom filter.

Let's say the `people` module contains a join field like this:

```javascript
addFields: [
  {
    name: '_jobs',
    type: 'joinByArray',
    withType: 'job'
  }
]
```

> See [reusable content with pieces](../core-concepts/reusable-content-with-pieces.md) for a more complete discussion of this particular example join.

We can already write `._jobs('xyz')` to match people that are joined with that particular job `_id`. But let's say we want an easy way to match only people who are joined with **more than one job** - people who are "busy." Here's a custom filter that can do that:

{% code-tabs %}
{% code-tabs-item title="lib/modules/profiles/lib/cursor.js" %}
```javascript
module.exports = {
  construct: function(self, options) {
    self.addFilter('busy', {
      def: false,
      launder: function(value) {
        return self.apos.launder.boolean(value);
      },
      safeFor: 'public',
      finalize: function() {
        const popular = self.get('popular');
        if (popular) {
          // MongoDB dot notation
          self.and({ 'jobsIds.1': { $exists: 1 } });
        }
      }
    });
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

"What's happening in this code?"

* We placed our code in `lib/modules/profiles/lib/cursor.js`. This is important. Apostrophe will automatically load any code placed here as an [implicit subclass](../../glossary.md#implicit-subclassing) of our cursor type. That means we can modify the cursor in our own `construct` function.
* We called `addFilter` and gave the filter the name `busy`. This defines a new, chainable `.busy(true)` method for our cursor type.
* We set a default value with `def`. By default, we don't want to restrict results to "busy" people.
* We provided a `launder` function. The `launder` function accepts raw input from the web browser and returns it in a sanitized, "laundered" form. This is indispensable for a filter the public is allowed to use, for instance via the query string on a pieces-page. See the [launder](https://npmjs.org/package/launder) module, always available as `self.apos.launder` inside our cursor code.
* We set `safeFor` to `public`. With this setting, any subclass of [apostrophe-pieces-pages](../../modules/apostrophe-pieces-pages/README.md) we choose to provide for browsing our profiles will *automatically support* a `market` query string parameter and filter results accordingly. *The "slug" property of each doc is a user-friendly label based on the title, suitable for use in URLs.*
* We provide a `finalize` function. `finalize` does the real work of the filter, as described below.
* We call `self.and`. The `and` filter says, "this cursor has all the criteria I already gave it... *and* this additional MongoDB criteria object must match too." Behind the scenes, it creates an `{ $and: [ ... ] }` MongoDB criteria object. But we don't have to fuss with that. This is the most commonly used filter when building other filters.
* The parameter to `self.and` is a MongoDB criteria object that uses "dot notation" to check whether the `jobsIds` array has at least two values. Although we don't see it in the field's schema, **a `joinByArray` field named `_jobs` automatically stores the actual `_id`s being joined with in an array property called `jobsIds`**. We can leverage this knowledge to build the filter we want.
* Cursors for our pieces will still automatically inherit all the usual features, like filter methods for each schema field. Here we are just adding one more.

> Although not shown here, the `finalize` method can also take a `callback`. If it does, then it can do asynchronous work before invoking the callback. This is useful if your filter must make a database query or API call. In this case, we just need to modify the MongoDB criteria for the query that Apostrophe is about to make.

## Adding features to all cursors for pieces

You can change the behavior of all cursors for pieces. Just put your cursor definition, like the one above, in `lib/modules/apostrophe-pieces/lib/cursor.js` in your project.

## Adding features to all cursors for pages

The [apostrophe-pages-cursor](../../modules/apostrophe-pages/server-apostrophe-pages-cursor.md) type is used to fetch the current page for display on the site. It is also used to fetch its ancestors and children, and defines filters for those purposes. You can configure the filters that are called by default when fetching the current page via the [`filters` option to `apostrophe-pages`](../../modules/apostrophe-pages/README.md#filters).

But what if we want to add new filters to this type?

For this trick, you'll need to get slightly more comfortable with Apostrophe's use of [moog](https://npmjs.org/package/moog) to manage object-oriented programming.

But it's still pretty easy:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
modules: {
  'extend-page-cursors': {}
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="lib/modules/extend-page-cursors/index.js" %}
```javascript
module.exports = {
  construct: function(self, options) {
    self.apos.define('apostrophe-pages-cursor', require('./lib/pagesCursor.js'));
  }
};
```
{% endcode-tabs-item %}
{% endcode-tabs %}

{% code-tabs %}
{% code-tabs-item title="lib/modules/extend-page-cursors/lib/pagesCursor.js" %}
```javascript
module.exports = {
  construct: function(self, options) {
    self.addFilter('yourFilterNameHere', { ... definition ... });
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

What's happening in this code?

* We created a new module, `extend-page-cursors`.
* In that module, we called `self.apos.define`, a convenience method that invokes `self.apos.synth.define` to define a new type of object. But *since that type already exists, it creates an implicit subclass*, in which *our version replaces the original but does not discard it*. Instead, our `construct` function is called `after` the regular one. This allows us to add additional filters as we see fit.
* We used `require` to pull in the actual definition from `pagesCursor.js`, just to keep the code tidy.

