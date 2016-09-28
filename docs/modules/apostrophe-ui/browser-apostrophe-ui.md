---
title: "apostrophe-ui (browser)"
layout: reference
namespace: browser
---
Provides apos.ui, a singleton that provides user interface features
used throughout Apostrophe on the browser side.

## Properties of interest

### apos.ui.shiftActive

True whenever the shift key is down.


## Methods
### enableShift()
Sets apos.ui.shiftActive whenever the shift key is down.
### enableActionable()
Utility that lets you add the data attribute 'data-apos-actionable' to any element and have
its `apos-active` class be toggled on click.

Optionally you can give the attr a value which can be used to target another element's active
class to be toggled.
### enhanceDropdowns()
Implement automatic width adjustment for `[data-apos-dropdown]` menus that have a
`[data-apos-dropdown-button-label]`.
### enableClickUrl()
If the URL ends in: #click-whatever

... Then we locate an element with the attribute data-whatever,
and trigger a click event on it.

This is useful for resuming an activity after requiring the
user to log in.
### enablePrefix(*prefix*)
If Apostrophe has a global URL prefix, patch
jQuery's AJAX capabilities to prepend that prefix
to any non-absolute URL. This assists in avoiding the
need for application code to be specifically prefix-aware
and allows the prefix to be changed whenever needed.
See also [apostrophe-express](../apostrophe-express/index.html)
### enableStyledFileButtons()
Click the original file upload button if the styled
proxy for it is clicked. Allows indirect styling of
file buttons
### globalBusy(*state*)
If state is true, the interface changes to
indicate Apostrophe is busy loading a modal
dialog or other experience that preempts other
activities. If state is false, the interface
is unlocked. Calls may be nested and the
interface will not unlock until all
locks are released.

See also apos.busy for interactions that
only need to indicate that one particular
element is busy.
### globalLock()
Do not call this method yourself. It is called
by self.globalBusy to display the global spinner.
Freel free to override this method to change the UI.
### globalUnlock()
Do not call this method yourself. It is called
by self.globalBusy to hide the global spinner.
Freel free to override this method to change the UI.
### busy(*$el*, *state*)
Simple progress display. Enables a progress display
inside the given element. If state is true, the
element with a [data-progress] attribute is shown,
otherwise the element with a [data-finished] attribute
is shown. Neither element is required. Supports
nested calls; does not revert to indicating complete
until the nesting level is 0.
### redirect(*slug*)
Redirect correctly to the given location on the
Apostrophe site, even if the prefix option is in use
(you should provide a non-prefixed path). Note that
when prefixes are in use it is especially important
to use this method rather than simply setting
`window.location.href` yourself.
### enhanceDate(*$el*, *options*)
Enhance a plaintext date field with a pikaday date widget.
### formatTime(*time*, *options*)
Converts apostrophe-schemas 24 hour time field strings
to local time. The format string depends on the
`userTimeFormat` option passed to this module, which
defaults to US 12 hour time. It must be understandable
by `launder.time`, however that method is very tolerant.
### link(*sel*, *verb*, *object*, *callback*)
Add a callback when a link is clicked to trigger
a certain action.

Example:

self.link($el, 'edit', 'blogPost', fn)

When a click occurs on anything inside $el with a
data-edit-blog-post attribute, invoke
"fn" with the jQuery element clicked and the value
of the attribute.

self.link('apos-manage', 'blogPost', fn)

When a click occurs anywhere on the page
on something with a data-manage-blog-post
attribute, invoke "fn" with the jquery element
clicked and the value of that attribute.

Event propagation and the default behavior of
the click event are both automatically stopped.

The word "object" refers to "the object of the sentence."
It is a STRING, not a javascript object.
