---
title: "apostrophe-notifications (browser)"
layout: reference
namespace: browser
---
## Inherits from: [apostrophe-context](../apostrophe-utils/browser-apostrophe-context.html)

## Methods
### trigger(*message*, *options*)
Call with a message, followed by any interpolated strings which must correspond
to %s placeholders in `message` (variable number of arguments), followed by an
`options` object if desired.

`options.type` styles the notification and may be set to `error`,
`warn` or `success`. If not set, a "plain" default style is used.

If `options.dismiss` is set to `true`, the message will auto-dismiss after 5 seconds.
If it is set to a number of seconds, it will dismiss after that number of seconds.
Otherwise it will not dismiss unless clicked.

This method is aliased as `apos.notify` for convenience.

The message is internationalized by the server, which is why the use of
%s placeholders for any inserted titles, etc. is important.
### enable()

### display(*notification*)
Display a notification received from the server.
You want `apos.notify`, not this method, unless you are
overriding how notifications are displayed.
### createContainer()

### reparentContainer()

### addToContainer(*$notification*)

### dismiss(*$notification*, *fromServer*)

