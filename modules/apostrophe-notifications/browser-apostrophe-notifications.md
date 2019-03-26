---
title: apostrophe-notifications (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-notifications

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

## Methods

### trigger\(_message_, _options_\)

Call with a message, followed by any interpolated strings which must correspond to %s placeholders in `message` \(variable number of arguments\), followed by an `options` object if desired.

`options.type` styles the notification and may be set to `error`, `warn` or `success`. If not set, a "plain" default style is used.

If `options.dismiss` is set to `true`, the message will auto-dismiss after 5 seconds. If it is set to a number of seconds, it will dismiss after that number of seconds. Otherwise it will not dismiss unless clicked.

This method is aliased as `apos.notify` for convenience.

The message is internationalized by the server, which is why the use of %s placeholders for any inserted titles, etc. is important.

### enable\(\)

### display\(_notification_\)

Display a notification received from the server. You want `apos.notify`, not this method, unless you are overriding how notifications are displayed.

### createContainer\(\)

### reparentContainer\(\)

### addToContainer\(_$notification_\)

### dismiss\(_$notification_, _fromServer_\)

