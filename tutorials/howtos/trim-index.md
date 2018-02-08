---
title: "How can I remove pieces from an index listing?"
layout: tutorial
---

In Apostrophe, an index page (or paginated pages) is a listing of "pieces" on a page or across paginated pages powered by the `apostrophe-pieces-pages` module or a module that extends `apostrophe-pieces-pages`. A list of blog posts and staff profiles page are both possible examples.

It's common for an index page to have a featured piece, such as a news listing with featured article. It might then make sense to remove that featured piece from the main list so it doesn't appear duplicated on the page. To do this you'll want to add a filter to the index cursor so that it never makes it into your data object.

In your module extending `apostrophe-pieces-pages`, extend `indexCursor` with the `super` pattern. You'll need to get the IDs of the pieces you're excluding, dropping them into an array. Then in the final return, use the `.and()` cursor method to add the additional MongoDB filter to only call for pieces that don't share those IDs.

Example:
```js
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
        omit.push(widget._piece._id);
      }));
    }

    // 3. Return `superIndexCursor` filtering out pieces with the IDs. This is the key.
    return superIndexCursor(req).and({_id: {$nin: omitIds}});
  };
}
```
