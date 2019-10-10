## "Next", "previous" and blog posts

One thing that might be confusing: for this purpose, "next" means "appears next in the list of pieces in the `index.html` view." and "previous" means "appears previously in the list of pieces in the `index.html` view."

For most types of pieces, this is intuitive. But since blogs are displayed in reverse chronological order, there it can seem a little backwards. So just keep in mind that you may need to use different language for your links on the front end.

## Fetching the `next` or `previous` piece programmatically

This feature is implemented using the `next` and `previous` cursor filter methods. You can use those yourself:

```javascript
// `doc` is a piece we already fetched
return self.find(req).previous(doc).toObject(function(err, previous) { ... });
```

The same technique can be used with `next`.

## Removing Pieces from a Listing

In Apostrophe, you'll often display a nice single page or paginated list of pieces, using a module that extends `apostrophe-pieces-pages`. That could include official modules such as `apostrophe-blog-pages` as well as custom modules you create. We refer to these special pages as "index pages."

It's common for an index page to have a featured piece, such as a news listing with featured article. It might then make sense to remove that featured piece from the main list so it doesn't appear duplicated on the page. To do this you'll want to add a filter to the index cursor so that it never makes it into your data object.

In your module extending `apostrophe-pieces-pages`, extend `indexCursor` with the `super` pattern. You'll need to get the IDs of the pieces you're excluding, dropping them into an array. Then in the final return, use the `.and()` cursor method to add the additional MongoDB filter to only call for pieces that don't share those IDs.

Example:
```javascript
construct: function (self, options) {
  var superIndexCursor = self.indexCursor;
  self.indexCursor = function (req) {
    // 1. Establish an array to omit later. This is just one way to do this part.
    var omitIds = [];

    // 2. Do stuff to populate the array with IDs. This is based on a real example, but it'll vary based on your use case.
    var features = _.filter(req.data.page.['name-of-feature-area'].items, function (obj) {
      return obj.type === 'blog'; // Set this to the widget type name.
    });

    if (features.length > 0) {
      _.forEach(features, function (widget) {
        _.forEach(widget._pieces, function (piece) {
          omit.push(piece._id);
        });
      });
    }

    // 3. Return `superIndexCursor` filtering out pieces with the IDs. This is the key.
    return superIndexCursor(req).and({_id: {$nin: omitIds}});
  };
}
```


