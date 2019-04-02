## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.areas`
An area is a series of zero or more widgets, in which users can add
and remove widgets and drag them to reorder them. This module implements
areas, including calling the loader methods of widgets that have them
whenever a doc containing areas is fetched, via an extension to
`apostrophe-cursors`. This module also provides browser-side support for
invoking the players of widgets in an area and for editing areas.


## Methods
### setWidgetManager(*name*, *manager*) *[api]*
Set the manager object for the given widget type name. The manager is
expected to provide `sanitize`, `output` and `load` methods. Normally
this method is called for you when you extend the `apostrophe-widgets`
module, which is recommended.
### getWidgetManager(*name*) *[api]*
Get the manager object for the given widget type name.
### warnMissingWidgetType(*name*) *[api]*
Print warning message about a missing widget type — only once per run per type.
### renderArea(*area*, *options*) *[api]*
Render the given `area` object via `area.html`, passing the
specified `options` to the template. Called for you by the
`apos.area` and `apos.singleton` template helpers.
### sanitizeItems(*req*, *items*, *callback*) *[api]*
Sanitize an array of items intended to become
the `items` property of an area. Invokes the
sanitize method for each widget's manager. Widgets
with no manager are discarded. Invoked for you by
the routes that save areas and by the implementation
of the `area` schema field type.

If the sanitize method of a widget manager reports
a string error, this method will report a string error
like "5.required", where `5` is the index of the
widget in the area and `required` is the string error
from the widget.
### renderWidget(*req*, *type*, *data*, *options*, *callback*) *[api]*
Renders markup for a widget of the given `type`. The actual
content of the widget is passed in `data`. The callback is
invoked with `(null, html)` on success. Invoked by the
`render-widget` route, which is used to update a widget on the
page after it is saved.
### saveArea(*req*, *docId*, *dotPath*, *items*, *callback*) *[api]*
Update or create an area at the specified
dot path in the document with the specified
id, if we have permission to do so. The change is
saved in the database before the callback is invoked. The
`items` array is NOT sanitized here; you should call
`sanitizeItems` first. Called for you by the
`save-area` route.
### lockSanitizeAndSaveArea(*req*, *areaInfo*, *callback*) *[api]*
Lock, sanitize and save the area described by `areaInfo` on behalf
of `req`.

`areaInfo` must have `items`, `docId` and `dotPath`
parameters. For bc, if `req.htmlPageId` is not present
then advisory locking is not performed.

Note that the area is not unlocked. This method is designed
for autosave operations, which continue until the page
is unloaded, at which time the `save-areas-and-unlock`
route will be accessed.

This method performs sanitization of all properties of
`areaInfo` before trusting it, so passing `req.body`
is a safe thing to do.
### walk(*doc*, *iterator*) *[api]*
Walk the areas in a doc. Your iterator function is invoked once
for each area found, and receives the
area object and the dot-notation path to that object.
note that areas can be deeply nested in docs via
array schemas.

If the iterator explicitly returns `false`, the area
is *removed* from the page object, otherwise no
modifications are made. This happens in memory only;
the database is not modified.
### getSchemaOptions(*doc*, *name*) *[api]*
If the schema corresponding to the given doc's
`type` property has an `options` property for the
given field `name`, return that property. This is used
to conveniently default to the `options` already configured
for a particular area in the schema when working with
`apostrophe-pieces` in a page template.
### richText(*within*, *options*) *[api]*
Returns the rich text markup of all rich text widgets
within the provided doc or area, concatenated as a single string.

By default the rich text contents of the widgets are joined with
a newline between. You may pass your own `options.delimiter` string if
you wish a different delimiter or the empty string. You may also pass
an HTML element name like `div` via `options.wrapper` to wrap each
one in a `<div>...</div>` block. Of course, there may already be a div
in the rich txt (but then again there may not).

Also available as a helper via `apos.areas.richText(area, options)` in templates.

Content will be retrieved from any widget type that supplies a
`getRichText` method.
### plaintext(*within*, *options*) *[api]*
Returns the plaintext contents  of all rich text widgets
within the provided doc or area, concatenated as a single string.

By default the rich text contents of the various widgets are joined with
a newline between. You may pass your own `options.delimiter` string if
you wish a different delimiter or the empty string.

Whitespace is trimmed off the leading and trailing edges of the string, and
consecutive newlines are condensed to one, to better match reasonable expectations
re: text that began as HTML.

Pass `options.limit` to limit the number of characters. This method will
return fewer characters in order to avoid cutting off in mid-word.

By default, three periods (`...`) follow a truncated string. If you prefer,
set `options.ellipsis` to a different suffix, which may be the empty string
if you wish.

Also available as a helper via `apos.areas.plaintext(area, options)` in templates.

Content will be retrieved from any widget type that supplies a
`getRichText` method.
### fromPlaintext(*plaintext*, *options*) *[api]*
Very handy for imports of all kinds: convert plaintext to an area with
one `apostrophe-rich-text` widget if it is not blank, otherwise an empty area. null and
undefined are tolerated and converted to empty areas.
Takes an option `el` if you wish to specify a wrapper element. Ex: `fromPlaintext(text, { el: 'p' })`.
### modulesReady() *[api]*
When all modules are ready and all widget managers therefore should have been
added, determine the list of rich text widgets for purposes of the
apos.areas.richText() method which returns just the rich text of the area
### loadDeferredWidgets(*req*, *callback*) *[api]*
Load widgets which were deferred until as late as possible. Only
comes into play if `req.deferWidgetLoading` was set to true for
the request. Invoked after the last `pageBeforeSend` handler, and
also at the end of the `apostrophe-global` middleware.
### widgetControlGroups(*req*, *widget*, *options*) *[api]*
This method is called when rendering widgets in an area,
to add top-level controls to them, such as the movement arrows
and the edit pencil. It can be extended to add more controls in
a context-sensitive way, or configured via the addWidgetControlGroups
option (see the source, TODO: document the format in detail)
### isEmpty(*doc*, *name*) *[api]*
Returns true if the named area in the given `doc` is empty.

Alternate syntax: `{ area: doc.areaname, ... more options }`

An area is empty if it has no widgets in it, or when
all of the widgets in it return true when their
`isEmpty()` methods are interrogated. For instance,
if an area only contains a rich text widget and that
widget. A widget with no `isEmpty()` method is never empty.
### pageServe(*req*) *[protectedApi]*
When a page is served to a logged-in user, make sure the session
contains a blessing for every join configured in schemas for widgets
### docBeforeUpdate(*req*, *doc*, *options*) *[protectedApi]*

### restoreDisallowedFields(*req*, *item*, *oldItem*) *[protectedApi]*
Restore the original values of any fields present in the
schema for a widget but disallowed for this particular editor
due to permissions.

The original values are copied from `oldItem`. To save you
an "if" statement, if `oldItem` is null (commonplace if
the widget is new), nothing happens.

If the field type has a `copy` method it is used.
Otherwise, custom logic handles `join` fields, and
the rest are copied by simple assignment to the
named field.
### pageBeforeSend(*req*) *[browser]*

### getCreateSingletonOptions(*req*) *[browser]*

## Nunjucks template helpers
### singleton(*doc*, *name*, *type*, *_options*)
`apos.singleton` renders a single widget of a fixed type, standing alone
in the page. The `_options` object is passed to the widget.

A singleton is just a special case of an area, so you can change your
mind later and call `apos.area` with the same `name`.

The `name` property distinguishes this singleton from other areas in
the same `doc`.

If `_options.addLabel` is set, that text appears on the button to
initially populate the singleton. If `_options.editLabel` is set, that
text appears on the button edit an existing widget in the singleton.

If `_options.controls.movable` is false, the widget may not be dragged out
of the singleton.

If `_options.controls.removable` is false, the widget
may not be removed entirely.

If `_options.controls.position` is set to `top-left`, `top-right`,
`bottom-left` or `bottom-right`, the widget controls (edit, drag
and remove) are positioned accordingly.

If `_options` is not specified, Apostrophe falls back to the options
configured for the given field `name` in the schema for this type of
`doc`. For ordinary pages there usually won't be any, but this is
very convenient when working with `apostrophe-pieces`.

Alternate syntax: `{ area: doc.areaname, type: type, ... more options }`
### area(*doc*, *name*, *_options*)
`apos.area` renders an area: a column of widgets of one or more types.

If present The `_options` object must contain a `widgets` property, an object
which must at least contain a property by the name of each allowed widget. The
corresponding value should be an object, and is passed on as options to
widgets of that type appearing in this area.

If `blockLevelControls: true` is present, the controls for this area are given
extra vertical space and rendered in a distinct color. These are affordances
to ensure the user can clearly distinguish the controls of an area used for layout, i.e.
an area that contains "two column" and "three column" widgets containing areas
of their own.

The `name` property distinguishes this area from other areas in
the same `doc`.

The `limit` option may be used to limit the number of widgets allowed.

For every widget in `_options.widgets`, you can pass the same options as
in `apos.singleton`. See the documentation above for `addLabel`,
`controls.movable`, `controls.removable` and `controls.position`. Note
that `addLabel` normally does not actually begin with `Add ` in areas, as
opposed to in singletons.

If `_options` is not specified, Apostrophe falls back to the options
configured for the given field `name` in the schema for this type of
`doc`. For ordinary pages there usually won't be any, but this is
very convenient when working with `apostrophe-pieces`.

Alternate syntax: `{ area: doc.areaname, ... more options }`
### widget(*widget*, *options*)
apos.areas.widget renders one widget. Invoked by both `apos.area` and
`apos.singleton`. Not
often called directly, but see `area.html` if you are interested in
doing so.
### richText(*within*, *options*)
Returns the rich text markup of all `apostrophe-rich-text` widgets
within the provided doc or area, concatenated as a single string. In future this method
may improve to return the content of other widgets that consider themselves primarily
providers of rich text, such as subclasses of `apostrophe-rich-text`,
which will **not** be regarded as a bc break. However it will never return images, videos, etc.

By default the rich text contents of the widgets are joined with
a newline between. You may pass your own `options.delimiter` string if
you wish a different delimiter or the empty string. You may also pass
an HTML element name like `div` via `options.wrapper` to wrap each
one in a `<div>...</div>` block. Of course, there may already be a div
in the rich txt (but then again there may not).

Content will be retrieved from any widget type that supplies a
`getRichText` method.
### plaintext(*within*, *options*)
Returns the plaintext contents  of all rich text widgets
within the provided doc or area, concatenated as a single string.

By default the rich text contents of the various widgets are joined with
a newline between. You may pass your own `options.delimiter` string if
you wish a different delimiter or the empty string.

Pass `options.limit` to limit the number of characters. This method will
return fewer characters in order to avoid cutting off in mid-word.

By default, three periods (`...`) follow a truncated string. If you prefer,
set `options.ellipsis` to a different suffix, which may be the empty string
if you wish.

Content will be retrieved from any widget type that supplies a
`getRichText` method.
### widgetControlGroups(*widget*, *options*)
Output the widget controls. The `addWidgetControlGroups` option can
be used to append additional control groups. See the
`widgetControlGroups` method for the format. That method can also
be extended via the `super` pattern to make the decision dynamically.
### isEmpty(*doc*, *name*)
Returns true if the named area in the given `doc` is empty.

Alternate syntax: `{ area: doc.areaname, ... more options }`

An area is empty if it has no widgets in it, or when
all of the widgets in it return true when their
`isEmpty()` methods are interrogated. For instance,
if an area only contains a rich text widget and that
widget. A widget with no `isEmpty()` method is never empty.
## API Routes
### POST /modules/apostrophe-areas/save-area

### POST /modules/apostrophe-areas/save-areas-and-unlock
Similar to `save-area`. This route expects
an object with an `areas` property, and that
property is an array of requests in the format
expected by the `save-area` route. In addition to
saving all of the posted areas, this route
releases any locks held by `req.htmlPageId`.
property. These functions are combined for
best performance during performance-critical
`beforeunload` events.
### POST /modules/apostrophe-areas/edit-virtual-area
Render an editor for a virtual area with the content
specified as an array of items by the req.body.content
property, if any. The area will not attempt to save itself periodically.

Used to implement editing of areas within schemas.
### POST /modules/apostrophe-areas/render-widget
Render a view of the widget specified by req.body.data (which contains its
properties) and req.body.options (treated as if they were passed to it via
aposSingleton). req.body.type specifies the widget type. It is assumed that
the widget is editable and should be rendered with contextual editing controls
if it supports them.
### POST /modules/apostrophe-areas/editor
Supplies static DOM templates to the editor on request
