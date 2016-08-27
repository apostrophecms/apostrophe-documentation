---
title: "apostrophe-templates (module)"
layout: module
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
Implements template rendering via Nunjucks. **You should use the
`self.render` and `self.partial` methods of *your own* module**,
which exist courtesy of [apostrophe-module](../apostrophe-module/index.html)
and invoke methods of this module more conveniently for you.

You may have occasion to call `self.apos.templates.safe` when
implementing a helper that returns a value that should not be
escaped by Nunjucks. You also might call `self.apos.templates.filter` to
add a new filter to Nunjucks.


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
at least under its module alias. -Tom
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
that would cause a <script> tag to end prematurely if
the JSON were embedded in it.
### renderBody(*req*, *type*, *s*, *data*, *module*)
Implements `render` and `renderString`. See their
documentation.
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
Typically you will call the `renderPage` method of
your own module, provided by the `apostrophe-module`
base class, which is a wrapper for this method. Also
consider calling `sendPage` which is even more convenient
and adds tabs to the data object, etc.

Generate a complete HTML page for transmission to the
browser.

If `req.error` is truthy, it is logged similarly to a
template error and the `error.html` template is displayed.

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

"apostrophe-templates:outerLayout.html"

Or:

"apostrophe-templates:refreshLayout.html"

This allows the template to handle either a content area
refresh or a full page render just by doing this:

{% extend outerLayout %}

Note the lack of quotes.

Under the following conditions, "refreshLayout.html"
is used in place of "outerLayout.html":

req.xhr is true (always set on AJAX requests by jQuery)
req.query.xhr is set to simulate an AJAX request
req.decorate is false
req.query.apos_refresh is true

These default properties are also provided on the `data` object
visible in Nunjucks:

user (req.user)
query (req.query)
permissions (req.user._permissions)
calls (javascript markup to insert all global and
  request-specific calls pushed by server-side code)
data (javascript markup to insert all global and
  request-specific data pushed by server-side code)
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

"apostrophe-templates:outerLayout.html"

Or:

"apostrophe-templates:refreshLayout.html"

This allows the template to handle either a content area
refresh or a full page render just by doing this:

{% extend outerLayout %}

Note the lack of quotes.

Under the following conditions, "refreshLayout.html"
is used in place of "outerLayout.html":

req.xhr is true (always set on AJAX requests by jQuery)
req.query.xhr is set to simulate an AJAX request
req.decorate is false
req.query.apos_refresh is true

These default properties are also provided on the `data` object
visible in Nunjucks:

user (req.user)
query (req.query)
permissions (req.user._permissions)
calls (javascript markup to insert all global and
  request-specific calls pushed by server-side code)
data (javascript markup to insert all global and
  request-specific data pushed by server-side code)
