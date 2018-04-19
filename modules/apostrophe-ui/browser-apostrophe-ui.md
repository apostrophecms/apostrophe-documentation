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
### pushGlobalBusy()
Call this method when the global busy mechanism is in effect, but
you need to temporarily suspend it and allow interaction again.
Must be paired with a call to `popGlobalBusy`. This is probably
not what you need for most situations, see `globalBusy`.

If the global busy mechanism was not in effect in the first place, that is
handled gracefully.
### popGlobalBusy()
Call this method when the global busy mechanism has been suspended,
and you are ready to allow it back into effect.
Must be paired with a call to `pushGlobalBusy`. This is probably
not what you need for most situations, see `globalBusy`.

If the global busy mechanism was not in effect in the first place, that is
handled gracefully.
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
### enhanceColorpicker(*$el*, *options*)
Enhance a plaintext color field with Spectrum
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

The `object` argument may be null if the language doesn't
flow that way, for example 'apos-workflow-export' does not
end with a noun, so just pass it as `verb`.
### enableAjax()

### ajaxInfiniteScrollHandler()

### ajaxSubmitHandler(*event*)

### ajaxClickHandler(*event*)

### ajaxContextOf(*$el*)
Given a jQuery object, return the name of the ajax context containing it
(the `data-apos-ajax-context` attribute of its closest ancestor that has one).
### ajaxGo(*name*, *url*, *data*, *options*)
Refresh the named `data-apos-ajax-context` with the content returned by the specified
URL. The URL is submitted with the additional query data specified by `data`, if any;
it may be a string (the output of serializing a form) or an object for convenience.
The URL will be pushed to the browser history as specified unless `options.push`
is explicitly `false`.

Any text input or textarea fields, and any other elements with a distinct data-apos-ajax-preserve
attribute, are NOT refreshed; their ancestors are also not refreshed. This prevents loss of
focus when typing which is a very severe cross browser problem otherwise.

After the replacement takes place, the `enhance` and `ajax` Apostrophe events
are emitted, in that order, with a jQuery object containing the ajax context div
as the argument.

Note that your event handlers for these should watch out for preserved elements and
their ancestors, and not do things twice. You can address this by checking for
`data-apos-ajax-preserve` and `data-apos-ajax-preserved` attributes.

If `url` or `data` contains an `append` parameter set to `1`, then the portion of
the new content that falls within an element with the `data-apos-ajax-append` attribute
is appended to the corresponding element already nested within `data-apos-ajax-content`.
However everything *not* in side the `data-apos-ajax-append` element is replaced in the
usual way. So you can refresh the "load more..." button itself, filters, etc. even when
appending just one page of content. This is useful for "load more..." buttons and
infinite scroll.
### ajaxPopStateHandler(*event*)

### ajaxPushHistory(*name*, *url*)
Push the specified URL to the browser history, associating it with the named data-apos-ajax-context
element in the page. Any apos-ajax query parameter is stripped off so that the history shows
full-page URLs rather than ajax refresh URLs. You will not need to call this method yourself. It is
called for you by `ajaxGo`.
### isAjaxUrl(*url*)
Returns true if the given URL is appropriate for an AJAX update when found
within `data-apos-ajax-context`. To avoid unexpected results the default behavior
is quite conservative: the URL must be the same as the current page, except
for the query string and/or hashtag.
### ajaxError(*err*)

### replaceUnpreserved(*$old*, *$new*, *options*)
This method is used to AJAX-refresh forms without breaking text input in progress
and can also be used to single out other elements for preservation during an
ajax replace.

The jquery objects $old and $new represent HTML container elements. $old is
something currently in the DOM such as a form. $new is newly constituted from an AJAX call.
Replace the contents of $new with the contents of $old, except that elements
of $old with a data-apos-ajax-preserve attribute are preserved, and of
necessity their ancestors are also preserved, because removing an input element
from the DOM temporarily is as bad as removing it forever as far as text input in
progress is concerned.

Each preserved element must have a **unique value** for data-apos-ajax-preserve,
and this attribute must be consistent between $old and $new.

If options.text is true, all text input and textarea elements are automatically
marked to be preserved, provided they have a name attribute.
