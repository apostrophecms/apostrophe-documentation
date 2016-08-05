---
title: "apostrophe-modal (browser)"
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)

## Methods
### getSource(*callback*)

### enableGlobalEventsOnce()

### disableGlobalEvents()

### enableButtonEvents()

### enableBreadcrumbEvents()

### captureTitle()

### captureControls()

### captureInstructions()

### resetEl()
If we are planning to slide, then we need to reset self.$el to
the data-modal-content element because it will be moved out
of self.$el and event handlers counting on self.$el would
no longer work. -Tom and Matt
### getSlideableAncestorEl()

### setSelfReference()

### enableLifecycleEvents()

### getLastSlide()
Return the last slide or the modal itself if it has no nested slides.
Returns an apostrophe-modal object, not a jQuery element
### getSlides()

### show()

### slideIn()

### stackPush()

### resizeContentHeight()
Calculate modal body height by subtracting
header, breadcrumb, and footer heights
### refreshBreadcrumb()

### beforeShow(*callback*)
Your chance to touch the DOM and add
event handlers before the modal appears
### afterShow()
Called after the modal is visible. Normally you should
use beforeShow to do your work behind the scenes, but
perhaps you need to call self.$el.width(), which only
works properly on visible elements. There is no callback
because the modal has no more work to do after yours.
### save(*callback*)
Save the modal. Prevents simultaneous saves, displays
a busy indicator, saves all views and then invokes
saveContent to do the actual saving of data. If there
is no error the modal is hidden.

The callback is optional.
### _afterHide()

### saveContent(*callback*)
Override this method to do your actual storing of data. If you
invoke the callback with an error, the modal does not disappear.
### afterHide(*callback*)
Override to clean up timers, etc. after the modal or view has
been dismissed.
### confirmCancel(*callback*)

### getBeforeUnloadText()

### getConfirmCancelText()

### beforeCancel(*callback*)
Called before the modal disappears when cancel or "done" is clicked.
You can prevent the modal from disappearing by invoking the callback
with an error. You must invoke the callback.
### cancel(*callback*)
Callback is optional
### _afterHide()

### hide()

### slideOut()

### stackPop()

### overrideFormSubmission()

### determineTop()

### determineLeft()

### setOffset(*offset*)

### applyBlackout()

### focusFirstFormElement()

### getViews()

