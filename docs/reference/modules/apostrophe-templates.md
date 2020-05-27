# apostrophe-templates
## Inherits from: [apostrophe-module](./apostrophe-module/README.md)
### `apos.templates`
Implements template rendering via Nunjucks. **You should use the
`self.render` and `self.partial` methods of *your own* module**,
which exist courtesy of [apostrophe-module](/reference/modules/apostrophe-module)
and invoke methods of this module more conveniently for you.

You may have occasion to call `self.apos.templates.safe` when
implementing a helper that returns a value that should not be
escaped by Nunjucks. You also might call `self.apos.templates.filter` to
add a new filter to Nunjucks.

## Options

### `filters`: an object in which
each key is the name of a Nunjucks filter and
its corresponding value is a function that implements it.
You may find it easier and more maintainable to call `apos.templates.addFilter(name, fn)`.

### `language`: your own alternative to the object
returned by require('nunjucks'). Replacing Nunjucks
entirely in Apostrophe would be a vast undertaking, but perhaps
you have a custom version of Nunjucks that is compatible.

### `viewsFolderFallback`: specifies a folder or an array of folders to be checked for templates
if they are not found in the module that called `self.render` or `self.partial`
or those it extends. This is a handy place for project-wide macro files.
Often set to `__dirname + '/views'` in `app.js`.


## Methods
### addHelpersForModule(*module*, *object *, *or module, name, value*)
Add helpers in the namespace for a particular module.
They will be visible in nunjucks at
apos.modules[module-name].helperName. If the alias
option for the module is set to "shortname", then
they are also visible as apos.shortname.helperName.
Note that the alias option must be set only by the
project-level developer (except for core modules).
### addHelperShortcutForModule(*module*, *name*)

### addShortcutHelper(*name*, *value*)
The use of this method is restricted to core modules
and should only be used for apos.area, apos.singleton,
and anything we later decide is at least that important.
Everything else should be namespaced at all times,
at least under its module alias.
### modulesReady()
When all modules have finished adding helpers, wrap all
helper functions so that the true line numbers responsible
for any errors can be seen in the error logs. Also apply
module aliases, make the options passed to the module available
in nunjucks, and apply any helper shortcuts
### addFilter(*object *, *or name, fn*)
Add new filters to the Nunjucks environment. You
can add many by passing an object with named
properties, or add just one by passing a name
and a function. You can also do this through the
filters option of this module.
### safe(*s*)
return a string which will not be escaped
by Nunjucks. Call this in your helper function
when your return value contains markup and you
are absolutely sure that any user input has
been correctly escaped already.
### renderForModule(*req*, *name*, *data*, *module*)
Load and render a Nunjucks template, internationalized
by the given req object. The template with the name
specified is loaded from the views folder of the
specified module or its superclasses; the deepest
version of the template wins. You normally won't call
this directly; you'll call self.render on your module.
Apostrophe Nunjucks helpers such as `apos.area` are
attached to the `apos` object in your template.
Data passed in your `data` object is provided as the
`data` object in your template, which also contains
properties of `req.data` and `module.templateData`,
if those objects exist.
If there is a conflict, your `data` argument wins,
followed by `req.data`.
If not overridden, `data.user` and `data.permissions`
are provided for convenience.
The .html extension is assumed.
### renderStringForModule(*req*, *s*, *data*, *module*)
Works just like self.render, except that the
entire template is passed as a string rather than
a filename.
### partialForModule(*name*, *data*, *module*)

### partialStringForModule(*name*, *data*, *module*)

### jsonForHtml(*data*)
Stringify the data as JSON, then escape any sequences
that would cause a `script` tag to end prematurely if
the JSON were embedded in it. Also make sure the JSON is
JS-friendly by escaping unicode line and paragraph
separators.

If the argument is `undefined`, `"null"` is returned. This is
better than the behavior of JSON.stringify (which returns
`undefined`, not "undefined") while still being JSONic
(`undefined` is not valid in JSON).
### renderBody(*req*, *type*, *s*, *data*, *module*)
Implements `render` and `renderString`. See their
documentation.
### i18n(*req*, *operation *, *, additional arguments*)
Takes `req`, `operation` which will be '__', '__mf' or another
standard helper name provided by the i18n module, and the
arguments intended for that helper, beginning always with `key`.
Invokes the specified operation of the i18n module. This
method exists as an override and extension point for
Apostrophe's static text internationalization features.
### getEnv(*module*)
Fetch a nunjucks environment in which `include`,
`extends`, etc. search the views directories of the
specified module and its ancestors. Typically you
will call `self.render`, `self.renderPage` or
`self.partial` on your module object rather than calling
this directly.
### getViewFolders(*module*)

### newEnv(*moduleName*, *dirs*)
Create a new nunjucks environment in which the
specified directories are searched for includes,
etc. Don't call this directly, use:

apos.templates.getEnv(module)
### newLoader(*moduleName*, *dirs*)
Creates a Nunjucks loader object for the specified
list of directories, which can also call back to
this module to resolve cross-module includes. You
will not need to call this directly.
### addStandardFilters(*env*)

### renderPageForModule(*req*, *template*, *data*, *module*)
Typically you will call the `sendPage` method of
your own module, provided by the `apostrophe-module`
base class, which is a wrapper for this method.

Send a complete HTML page for to the
browser.

If `template` is a function it is passed a data object,
otherwise it is rendered as a nunjucks template relative
to this module via self.render.

`data` is provided to the template, with additional
default properties as described below.

`module` is the module from which the template should
be rendered, if an explicit module name is not part
of the template name.

Additional properties merged with the `data object:

"outerLayout" is set to...

`apostrophe-templates:outerLayout.html`

Or:

`apostrophe-templates:refreshLayout.html`

This allows the template to handle either a content area
refresh or a full page render just by doing this:

`{% extend outerLayout %}`

Note the lack of quotes.

Under **any** of the following conditions, "refreshLayout.html"
is used in place of "outerLayout.html":

* `req.xhr` is true (always set on AJAX requests by jQuery)
* `req.query.xhr` is set to simulate an AJAX request
* `req.decorate` is false
* `req.query.apos_refresh` is true

These default properties are also provided on the `data` object
visible in Nunjucks:

* `url` (`req.url`)
* `user` (`req.user`)
* `query` (`req.query`)
* `permissions` (`req.user._permissions`)
* `refreshing` (true if we are refreshing the content area of the page without reloading)
* `js.globalCalls` (javascript markup to insert all global pushed javascript calls)
* `js.reqCalls` (javascript markup to insert all req-specific pushed javascript calls)
### addBodyClass(*req*, *bodyClass*)
Add a body class or classes to be emitted when the page is rendered. This information
is attached to `req.data`, where the string `req.data.aposBodyClasses` is built up.
The default `outerLayoutBase.html` template outputs that string.
The string passed may contain space-separated class names.
### addBodyDataAttribute(*req*, *name*, *value = ''*)
Add a body attribute to be emitted when the page is rendered. This information
is attached to `req.data`, where `req.data.aposBodyDataAttributes` is built up
using `name` as the attribute name which is automatically prepended with "data-"
and the optional `value` argument
Also receives an object with key/pair values which becomes attribute name(s) and value(s)
The default `outerLayoutBase.html` template outputs that string.
### prepend(*location*, *helperFn*)
Use this method to provide a function that will be invoked at the point
in the page layout identified by the string `location`. Standard locations
are `head`, `body`, `main` and `contextMenu`.

 The page layout, template or outerLayout must contain a corresponding
`apos.templates.prepended('location')` call, with the same location, to
actually insert the content.

**Your function is called once per request,** and will receive `req` as an argument
as a convenience. Since page rendering is in progress, `req` will be equal to
`apos.templates.contextReq`.

The output of functions added with `prepend` is prepended just after the
opening tag of an element, such as `<head>`. Use `append` to insert material
before the closing tag.

This method is most often used when writing a module that adds new UI
to Apostrophe and allows you to add that markup without forcing
developers to customize their layout for your module to work.
### append(*location*, *helperFn*)
Use this method to provide a function that will be invoked at the point
in the page layout identified by the string `location`. Standard locations
are `head`, `body`, `main` and `contextMenu`.

 The page layout, template or outerLayout must contain a corresponding
`apos.templates.prepended('location')` call, with the same location, to
actually insert the content.

**Your function is called once per request,** and will receive `req` as an argument
as a convenience. Since page rendering is in progress, `req` will be equal to
`apos.templates.contextReq`.

The output of functions added with `append` is appended just before the
closing tag of an element, such as `</head>`. Use `prepend` to insert material
after the opening tag.

This method is most often used when writing a module that adds new UI
to Apostrophe and allows you to add that markup without forcing
developers to customize their layout for your module to work.
### insert(*end*, *location*, *helperFn*)
Implementation detail of `apos.templates.prepend` and `apos.templates.append`.
### inserted(*end*, *location*)
Implementation detail of `apos.templates.prepended` and `apos.templates.appended`.
### prepended(*location*)
Invokes all of the `prepend` helper functions registered for the given
location and returns the resulting markup as a Nunjucks "safe" string
(HTML tags are allowed). Available as the `apos.templates.prepended`
helper, and invoked as such by `outerLayoutBase.html`.
### appended(*location*)
Invokes all of the `append` helper functions registered for the given
location and returns the resulting markup as a Nunjucks "safe" string
(HTML tags are allowed). Available as the `apos.templates.appended`
helper, and invoked as such by `outerLayoutBase.html`.
### showContextMenu(*req*)
Determines whether the aposContextMenu block, which contains
the "Page Settings" and "Published" UIs in the lower left corner
in addition to further UI pushed by modules like workflow, should
appear or not. Override to add additional nuances to this decision.
### enableHelpers()

## Nunjucks template helpers
### showContextMenu()

### prepended(*location*)
Invokes all of the `prepend` helper functions registered for the given
location and returns the resulting markup as a Nunjucks "safe" string
(HTML tags are allowed). Available as the `apos.templates.prepended`
helper, and invoked as such by `outerLayoutBase.html`.
### appended(*location*)
Invokes all of the `append` helper functions registered for the given
location and returns the resulting markup as a Nunjucks "safe" string
(HTML tags are allowed). Available as the `apos.templates.appended`
helper, and invoked as such by `outerLayoutBase.html`.
