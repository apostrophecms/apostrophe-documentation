# Extending the Widget

A "widget" is used to display selected snippets in the context of a page. The standard widget for snippets is automatically subclassed when you subclass snippets, and it works well: you can pick your own pieces by title or pull them in by tag. But what if we want to add a new field to the widget editor, or change its behavior more significantly?

Here's how to do it. Continuing with the "Stories" example above, we add this code to our constructor:

```javascript
var superExtendWidget = self.extendWidget;

// extendWidget is called after the widget is constructed but
// before it is populated; you can override methods of the
// "widget" object here

self.extendWidget = function(widget) {
  // Call the original extendWidget method first. Maybe you're
  // subclassing something that has an interesting one.
  superExtendWidget();

  var superAfterCreatingEl = widget.afterCreatingEl;
  var superBeforeUpdate = widget.beforeUpdate;

  // afterCreatingEl is called after the widget's DOM element
  // comes into being. Let's add code to populate a checkbox
  // called "special"

  widget.afterCreatingEl = function() {

    widget.$newType = widget.$el.find('[name="special"]');
    widget.$newType.prop('checked', widget.data.special);

    superAfterCreatingEl();

  };

  // When the widget is previewed or saved we want to
  // make sure we record the state of the checkbox in
  // widget.data. That's all we have to do to save it

  // Plumbing to use the same code for preview and save,
  // then call the right callback for each

  var superPrePreview = widget.prePreview;
  var superPreSave = widget.preSave;
  widget.prePreview = function(callback) {
    return beforeUpdate(superPrePreview, callback);
  };
  widget.preSave = function(callback) {
    return beforeUpdate(superPreSave, callback);
  };

  // Examine the checkbox and update the data object
  function beforeUpdate(callback, andThen) {
    widget.data.special = widget.$newType.is(':checked');
    return callback(andThen);
  }
};
```