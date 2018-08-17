---
title: "apostrophe-modal (browser)"
layout: reference
namespace: browser
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)
`apostrophe-modal` is a base class for modal dialog boxes. Define a new
type that extends `apostrophe-modal`, set the `source` option to the
name of a server-side route that outputs suitable HTML, extend the
`beforeShow` method to add custom event handlers and dynamic content,
and extend `saveContent` to take action when the `save` button is clicked.

*Where the markup comes from*

The `source` option is combined with the `action` option to arrive at
the URL for fetching the modal's markup:

`/action/source`

`action` is usually pushed from the server side via `pushBrowserCall`,
so that the server-side code can just implement its route via
`self.route`. The route is a POST route. Any data present in the
`body` option is passed as POST parameters.

*Examples*

The `apostrophe-tags`, `apostrophe-widgets` and `apostrophe-pieces` modules
provide excellent examples of how modals are defined, created
and populated.

*An alternative to "save and cancel"*

An alternative approach: if a single `save` operation doesn't make sense,
you can implement buttons that perform actions immediately and use a "cancel"
button labeled `Done` to close the modal.

When a modal creates another modal, they "stack," unless the new
modal has the `transition: slide` option and the top modal already
on the stack has the `apos-modal-slideable` CSS class, in which case
the new modal "slides in" creating a breadcrumb trail.

Subclasses of `apostrophe-modal` can also provide a `$view` jQuery
reference, in which case the new "modal" actually populates that div
directly and doesn't actually block the page or display in its own
modal dialog box. This is convenient when you wish to build up modals
by composition.


## Methods
### getSource(*callback*)
Fetch rendered HTML to populate self.$el with the actual content
of the modal. The HTML is fetched from:

self.options.action + '/' + self.options.source

Via a POST request.

If a `self.body` object exists it is passed to the server side
as POST parameters.

Invoked for you as the first step of `afterConstruct`.
### enableGlobalEventsOnce()
Enables support for the escape key and click-outside-to-cancel
behaviors. The handlers are installed on first use and then
reused by any nested modals. Invoked for you as part of
`afterConstruct`.
### disableGlobalEvents()
Removes the global event handlers for ESC and click-outside-
to-close. Invoked when the last open modal closes.
### enableButtonEvents()
Add event handlers for the cancel and save buttons,
[data-apos-cancel] and [data-apos-save]. If the save
also has the [data-next] attribute, the self.next() method
is invoked with no arguments after the normal save-and-close operation.
This is meant to allow "save and create another" behavior, which is
popular with experienced users.

In this base class self.next() is not implemented.
### enableBreadcrumbEvents()
Enable clicks on the breadcrumb trail [data-modal-breadcrumb], which is
present when "stacked" modals "slide in" instead by setting the `transition`
option to `slide` when constructing the modal. The breadcrumb trail can
be used to back up to any point in the series of slides. All modals after
that point have their cancel operation invoked, starting with the
last/newest modal.
### captureTitle()
Fetches the title of the modal from the element with
[data-modal-title] and records it in `self.title`. Called
as part of `afterConstruct`.
### captureControls()
Locates the div that contains the controls for saving, cancelling,
and other top-level operations on this modal and stores a
jQuery reference to it in `self.$controls`. Part of the implementation
of the slide transition, which moves these controls to a shared div
outside of the individual slide modals for layout reasons.
### captureFilters()
Locates the div that contains the filters for this modal and stores a
jQuery reference to it in `self.$modalFilters`. Part of the implementation
of the slide transition, which moves these filters to a shared div
outside of the individual slide modals for layout reasons. The name
`modalFilters` avoids a bc break with the pieces manager modal.
### captureInstructions()
Locates the div that contains the instructions (the explanatory caption)
for the modal and stores a jQuery reference to it in `self.$instructions`.
Part of the implementation of the slide transition, which moves these
controls to a shared div outside of the individual slide modals for
layout reasons.
### resetEl()
Part of the implementation of the slide transition. When sliding a
new modal in, `self.$el` is reset to the `[data-modal-content]` element
within the modal, so that event handlers relying on `self.$el` work
reasonably after the original modal div is diced up to move the
controls, filters and instructions to one area of the slide container and
the content div to another.

If this modal does not have the `{ transition: 'slide' }` option,
or there is no modal already open with the `apos-modal-slideable`
CSS class, this method does nothing.

The original div is captured in `self.$shell`, which is currently used
only as a test for whether the modal is a slide.
### getSlideableAncestorEl()
Part of the implementation of the `slide` transition. Checks the
most recent non-sliding modal in the stack to see whether it has
the `apos-modal-slideable` CSS class and, if so, returns
a jQuery reference to that modal.
### setSelfReference()
Records a reference to the modal in the `aposModal` jQuery data
attribute of `self.$el`, the div corresponding to the modal.
Invoked by `afterConstruct`.
### enableLifecycleEvents()
Adds jQuery event handlers to `self.$el`, the div corresponding to
the modal, for the `aposModalCancel` and `aposModalHide` events.
### beforeunload()

### getLastSlide()
Return the last slide, or the modal itself if it has no nested slides.
Returns the `apostrophe-modal` object, not a jQuery element. Use findSafe
so we are not faked out by nested views.
### getSlides()
Returns the `apostrophe-modal` objects corresponding to each
slide nested in this modal, which presumably is a slide parent
modal (one with the `apos-modal-slideable` CSS class). The
slides are returned in the order they slid in, so the deepest
(currently visible) slide is the last in the array. Used by
the breadcrumb trail mechanism that displays the titles of
all of the slides and allows clicking to jump backwards,
closing intervening slides.
### show()
Displays the modal. The `enhance` Apostrophe event is triggered,
with `self.$el` as the argument, allowing progressive enhancement
to take place. If the modal has a `$view` option, it is appended
to that div rather than displaying as a modal normally would.

Otherwise, if the `transition` option is set to `slide` and
the top modal already on the stack has the `apos-modal-slideable`
CSS class, the new modal "slides in," adding its title to the
breadcrumb trail.

Otherwise, the modal is pushed onto the stack, appearing on
top of the previous modal if any.

Note that `self.beforeShow(callback)` and `self.afterShow()` are
provided for your overriding convenience. Usually it is better
to override these rather than changing the implementation of
`self.show()` to do extra work.
### slideIn()
Invoked for you by `self.show()`, this method causes the modal
to "slide in" and add itself to the breadcrumb trail if the top
modal on the stack has the `apos-modal-slideable` CSS class.
Otherwise it defaults to calling `self.stackPush()` instead,
causing the modal to appear normally on top of any modals
already open.
### setDepthAttribute(*$el*)
Make the current modal's depth available as an attribute on various
elements such as `data-apos-modal-instructions`. This is needed for
reliable Nightwatch testing
### stackPush()
Called for you by `self.show()`, this method adds the modal to
the stack, blacking out the page, preventing unwanted interaction
with the page while the modal is active, and stacking on top of
any modals already open, if any. This is normal behavior for
modals that do not have the `transition: 'slide'` option set,
and fallback behavior if there is no parent modal already on
the stack or the parent modal does not have the `apos-modal-slideable`
CSS class.
### resizeContentHeight()
Calculates the appropriate modal body height by subtracting
header, breadcrumb, and footer heights and an additional
50 pixels from the browser window height. Invoked for you
by `self.show()`.
### refreshBreadcrumb()
Rebuilds the breadcrumb trail of slide titles inside the slideable
ancestor of the current slide, or the modal itself if it is a
parent of slides. Normally the text of the breadcrumb is simply the
title of the corresponding slide modal. If the `field` option is set,
the slide is assumed to be either the modal for editing an array
schema field (see `apostrophe-schemas`) or a modal related to editing one
entry in that field. For the former, the title is set to `field.label`.
For the latter, the title is set to the value of the `field.titleField`
property of the array element indicated by the `active` property of
the slide for the array (the previous slide).

TODO: this is dodgy separation of concerns. Where possible the code
that pokes into the implementation of the array modal should be replaced
by suitable methods that could also be implemented in other places
where a similar behavior is desired.
### beforeShow(*callback*)
This method is provided as your opportunity to modify the DOM via
`self.$el` and add your own event handlers before the modal appears.
By default it does nothing, however if you are extending a subclass
such as `apostrophe-pieces-editor-modal` that provides its own version,
be sure to invoke the  original version before or after yours.
### afterShow()
Called after the modal is visible. Normally you should
use beforeShow to do your work behind the scenes, but
perhaps you need to call `self.$el.width()`, which only
works properly on visible elements. There is no callback
because the modal has no more work to do after yours.
### save(*callback*)
Save the modal. Prevents simultaneous saves, displays
a busy indicator, saves all views if any and then invokes
saveContent to do the actual saving of data. If there
is no error the modal is hidden (dismissed).

The callback is optional. If it is provided any error
preventing the save operation will be passed to it.

`self.saveContent` is invoked to carry out the actual
work (e.g. saving to a database via an API route, for
instance) and by default does nothing. If `self.saveContent`
delivers an error to its callback, the save operation fails
and the modal is not hidden.
### afterHideInternal()

### saveContent(*callback*)
Override this method to carry out the actual storing of data
when a modal is saved.

If you invoke the callback with an error, the modal does not disappear.

Displaying the error to the user is your responsibility.
### afterHide()
Override this method to clean up timers, etc. after the modal or view has
been dismissed.
### afterHideInternal()
Reserved for internal implementation use.
### afterHideWrapper()
Invoked after the modal or view has been dismissed.
Calls `self.afterHideInternal`, which invokes the callbacks of
`self.save` or `self.cancel` when appropriate, and also invokes
`self.afterHide`, an initially empty method for your
overriding convenience.
### confirmCancel(*callback*)
This method is invoked to confirm the user's request to cancel
the modal. Currently invokes `confirm`, which is ugly. However
`confirmCancel` is async so this can be replaced with a more
attractive implementation.
### getBeforeUnloadText()
Returns text to be displayed by the browser in the event the user
attempts to leave the page without saving or cancelling the modal,
if `self.unsavedChanges` is truthy.

Note that some browsers now display a generic message in this case
in order to discourage misleading wording.

By default the `label` option passed when creating the modal is
used to customize the text.
### getConfirmCancelText()
Returns the text to be displayed to the user when they attempt
to cancel the modal, if `self.unsavedChanges` is truthy.

By default the `label` option passed when creating the modal is
used to customize the text.
### beforeCancel(*callback*)
Override this method to alter the behavior when the modal is
dismissed by clicking the cancel/done button, pressing escape or
clicking outside the modal.

You can prevent the modal from disappearing by invoking the callback
with an error. The error is not displayed; doing so is your
responsibility if you wish to.

You must invoke the callback, with or without an error.
### cancel(*callback*)
Cancels the modal, dismissing it without invoking `save`.

Currently this method assumes you wish to close the top modal
(or most recent slide of the top modal) and does not actually check
to make sure `self` is that modal. Generally speaking modals that
are lower in the stack should not attempt to interfere when the user
is working with a new modal on top of the stack.

If the modal has views, their cancel methods are also invoked first.

If the `confirmCancel` or `beforeCancel` method invokes its callback
with an error the modal is not closed.

`self.afterHide` is invoked.
### afterHideInternal()

### hide()
Hides (dismisses) the modal, sliding out or popping off the stack
as appropriate. Invokes for you when the user saves or cancels.
If the modal is a view, nothing happens by default. The `hide()`
methods of any views within the modal are also called.
### slideOut()
Reverses the slide transition, revealing the previous slide.
Invoked for you when the user saves or cancels a slide.
### stackPop()
Pops this modal off the stack. Assumes the modal is a stacked modal
and not a slide. Called for you when the modal is saved or cancelled.
### overrideFormSubmission()
Prevents the enter key from inadvertently submitting a form
the old-fashioned way. Invoked for you by `afterConstruct`.
### applyBlackout()
Applies a blackout div with the `apos-modal-blackout` CSS class to
hide the content of the page (with partial opacity) and prevent
unwanted interactions with the page while the modal is active.
Blackouts are also applied to modals higher in the stack for the
same reason. The top-level blackout adjusts its height at regular
intervals so that it always adequately covers the document while the
modal is active. Invoked for you when a new stacked modal is added.
### focusFirstFormElement()
Gives the focus to the first form element in the modal. Invoked
for you when a modal is displayed. TODO: should respect tabindex if present.
### getViews()
Returns an array of views nested within the modal.
