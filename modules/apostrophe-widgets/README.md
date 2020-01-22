## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
The base class for all modules that implement a widget, such as
[apostrophe-rich-text-widgets](/modules/apostrophe-rich-text-widgets/),
[apostrophe-pieces-widgets](/modules/apostrophe-pieces-widgets/) and
[apostrophe-video-widgets](/modules/apostrophe-video-widgets/).

All widgets have a [schema](/tutorials/schema-guide/schema-guide.md).
Many project-specific modules that extend this module consist entirely of an
`addFields` option and a `views/widget.html` file.

For more information see the [custom widgets tutorial](/tutorials/core-concepts/editable-content-on-pages/custom-widgets.

## Options

### `label`

The label of the widget, as seen in menus for adding widgets.

### `name`

The unique name of this type of widget, as seen in the `type` property in the database.
It will be singular if it displays one thing, like `apostrophe-video`,
and plural if it displays more than one thing, like `apostrophe-pieces`.
**By default, Apostrophe automatically removes `-widgets` from the name
of your module to set this option for you.** This is a good convention
but you may set this option instead if you wish.

### `playerData`

By default, all of the permanent properties of your widget's schema
are present in the page as JSON and can be accessed via the
`data` argument of the `play` method of your browser-side object
(see `always.js` in `apostrophe-images-widgets` for an example).

This is often useful, but if the information is sensitive and you
don't want it to be available in this way, set:

`playerData: false`

If you want the `play` method to have access to *some* of the
properties, set:

`playerData: [ 'propName1', 'propName2' ]`

**When you have editing privileges, you always have access to
100% of the permanent properties of the widget in this way.**
This is needed for the editing experience.

### `scene`

If your widget wishes to use Apostrophe features like schemas
when interacting with *logged-out* users — for instance, to implement
forms conveniently — you can set the `scene` option to `user`. Any
page that contains the widget will then load the full javascript and stylesheet
assets normally reserved for logged-in users. Note that if a page
relies on AJAX calls to load more content later, the assets will not be
upgraded. So you may wish to set the `scene` option of the appropriate
subclass of `apostrophe-custom-pages` or `apostrophe-pieces-pages`, as well.

### `addFields`, `removeFields`, `arrangeFields`, etc.

The standard options for building [schemas](/tutorials/advanced-topics/schema-guide)
are accepted. The widget will present a modal dialog box allowing the user to edit
these fields. They are then available inside `widget.html` as properties of
`data.widget`.

### `defer`

If you set `defer: true` for a widget module, like apostrophe-images-widgets, the join to
actually fetch the images is deferred until the last possible minute, right before the
template is rendered. This can eliminate some queries and speed up your site when there
are many separate joins happening on a page that ultimately result in loading images.

If you wish this technique to also be applied to images loaded by content on the global doc,
you can also set `deferWidgetLoading: true` for the `apostrophe-global` module. To avoid chicken
and egg problems, there is still a separate query for all the images from the global doc and all
the images from everything else, but you won't get more than one of each type.

Setting `defer` to `true` may help performance for any frequently used widget type
that depends on joins and has a `load` method that can efficiently handle multiple widgets.

If you need access to the results of the join in server-side JavaScript code, outside of page
templates, do not use this feature. Since it defers the joins to the last minute,
that information will not be available yet in any asynchronous node.js code.
It is the last thing to happen before the actual page template rendering.

## Important templates

You will need to supply a `views/widget.html` template for your module that
extends this module.

In `views/widget.html`, you can access any schema field as a property
of `data.widget`. You can also access options passed to the widget as
`data.options`.

## More

If your widget requires JavaScript on the browser side, you will want
to define the browser-side singleton that manages this type of widget by
supplying a `public/js/always.js` file. In
that file you will override the `play` method, which receives a jQuery element containing
the appropriate div, the `data` for the widget, and the `options` that
were passed to the widget.

For example, here is the `public/js/always.js` file for the
[apostrophe-video-widgets](../apostrophe-video-widgets/README.md) module:

```javascript
apos.define('apostrophe-video-widgets', {
  extend: 'apostrophe-widgets',
  construct: function(self, options) {
    self.play = function($widget, data, options) {
      return apos.oembed.queryAndPlay($widget.find('[data-apos-video-player]'), data.video);
    };
  }
});
```

**ALWAYS USE `$widget.find`, NEVER $('selector....')` to create widget players.**
Otherwise your site will suffer from "please click refresh after you save"
syndrome. Otherwise known as "crappy site syndrome."

## Command line tasks

```
node app your-widget-module-name-here:list
```
Lists all of the places where this widget is used on the site. This is very useful if
you are debugging a change and need to test all of the different ways a widget has
been used, or are wondering if you can safely remove one.


## Methods
### composeSchema()
Compose the schema, accepting `addFields`, `removeFields`, etc.
as described in the schema guide. After `afterConstruct` invokes
this method, `self.schema` is available. Throw an error
if `type` is used as a field name
### output(*widget*, *options*)
Returns markup for the widget. Invoked by `widget.html` in the
`apostrophe-areas` module as it iterates over widgets in
an area. The default behavior is to render the template for the widget,
which is by default called `widget.html`, passing it `data.widget`
and `data.options`. The module is accessible as `data.manager`.
### load(*req*, *widgets*, *callback*)
Perform joins and any other necessary async
actions for our type of widget. Note that
an array of widgets is handled in a single call
as you can usually optimize this.

Override this to perform custom joins not
specified by your schema, talk to APIs, etc.

Also implements the `scene` convenience option
for upgrading assets delivered to the browser
to the full set of `user` assets.
### sanitize(*req*, *input*, *callback*)
Sanitize the widget. Invoked when the user has edited a widget on the
browser side. By default, the `input` object is sanitized via the
`convert` method of `apostrophe-schemas`, creating a new `output` object
so that no information in `input` is blindly trusted.

The callback is invoked with `(null, output)`.
### allowedSchema(*req*)
Return a new schema containing only fields for which the
current user has the permission specified by the `permission`
property of the schema field, or there is no `permission` property for the field.
### filterForDataAttribute(*widget*)
Remove all properties of a widget that are the results of joins
(arrays or objects named with a leading `_`) for use in stuffing the
"data" attribute of the widget.

If we don't do a good job here we get 1MB+ of markup! So if you override
this, play nice. And seriously consider using an AJAX route to fetch
the data you need if you only need it under certain circumstances, such as
in response to a user click.

If the user has editing privileges for the widget, all of the permanent
properties of the widget are serialized.

If the user does not have editing privileges:

If the `playerData` option of the widget's module is set to `false`,
only an empty object is supplied. If `playerData` is set to an
array, only the named permanent properties are supplied. If `playerData is `true`
(the default), all of the permanent properties are supplied.
### filterOptionsForDataAttribute(*options*)
Filter options passed from the template to the widget before stuffing
them into JSON for use by widget players and the widget editor. Again,
by default we discard all properties that are the results of joins or
otherwise dynamic (arrays or objects named with a leading `_`).

If we don't do a good job here we get 1MB+ of markup. So if you override
this, play nice. And think about fetching the data you need only when
you truly need it, such as via an AJAX request in response to a click.
### pushAssets()
Push `always.js` to the browser at all times.
Push `user.js` to the browser when a user is logged in.
Push `editor.js` to the browser when a user is logged in.

Note that if your module also has files by these names
they are automatically pushed too, and they will always
come after these, allowing you to `extend` properly
when calling `apos.define`.
### pushDefineSingleton()
Define the browser-side singleton for this module, which exists
always in order to permit `play` methods.
### pageBeforeSend(*req*)
Before any page is sent to the browser, create the singleton.
### getCreateSingletonOptions(*req*)
Set the options to be passed to the browser-side singleton corresponding
to this module. By default they do not depend on `req`, but the availability
of that parameter allows subclasses to make distinctions based on permissions,
etc.

If a `browser` option was configured for the module its properties take precedence
over the default values passed on here for `name`, `label`, `action`
(the base URL of the module), `schema` and `contextualOnly`.
### list(*apos*, *argv*, *callback*)
Implement the command line task that lists all widgets of
this type found in the database:

`node app your-module-name-here-widgets:list`
### addSearchTexts(*widget*, *texts*)

### isEmpty(*widget*)
Return true if this widget should be considered
empty, for instance it is a rich text widget
with no text or meaningful formatting so far.
By default this method returns false, so the
presence of any widget of this type means
the area containing it is not considered empty.
### getWidgetWrapperClasses(*widget*)
override to add CSS classes to the outer wrapper div of the widget.
### getWidgetClasses(*widget*)
Override to add CSS classes to the div of the widget itself.
## API Routes
### POST /modules/apostrophe-widgets/modal
A POST route to render `widgetEditor.html`. `data.label` and
`data.schema` are available to the template.
