## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
This module provides a framework for triggering notifications
within the Apostrophe admin UI. Notifications may be triggered
either on the browser or the server side, via `apos.notice`.

## Options

### `queryInterval`: interval in milliseconds between MongoDB
queries while long polling for notifications. Defaults to 1000
(1 second). Set it longer if you prefer fewer queries, however
these are indexed queries on a small amount of information and
should not significantly impact your app.

### `longPollingTimeout`: maximum lifetime in milliseconds of a long
polling HTTP request before a response with no notifications is sent.
Defaults to 10000 (10 seconds) to avoid typical proxy server timeouts.
Until it times out the request will keep making MongoDB queries to
see if any new notifications are available (long polling).


## Methods
### pushAssets()

### trigger(*req*, *message*, *options*)
Call with `req`, then a message, followed by any interpolated strings
which must correspond to %s placeholders in `message` (variable number
of arguments), followed by an `options` object if desired.

If you do not have a `req` it is acceptable to pass a user `_id` string
in place of `req`. Someone must be the recipient.

`options.type` styles the notification and may be set to `error`,
`warn` or `success`. If not set, a "plain" default style is used.

If `options.dismiss` is set to `true`, the message will auto-dismiss after 5 seconds.
If it is set to a number of seconds, it will dismiss after that number of seconds.
Otherwise it will not dismiss unless clicked.

The message is internationalized, which is why the use of
%s placeholders for any inserted titles, etc. is important.

Throws an error if there is no `req.user`.

This method is aliased as `apos.notify` for convenience.

The method returns a promise, which you may await if you need
to be absolutely certain the notification has been committed
to the database, for instance before exiting a command line task.
You may also pass a callback as a final argument.
### expressMiddleware(*req*, *res*, *next*)
This middleware is essentially a POST route at
`/modules/apostrophe-global/poll-notifications`. It is implemented
as middleware to allow it to run before `req.data.global` is loaded,
which can be a very expensive operation on some sites and should
thus not be required before a high-frequency polling operation.

Poll for active notifications. Responds with:

`{ status: 'ok', notifications: [ ... ], dismissed: [ id1... ] }`

Each notification has an `html` property containing
its rendered, localized markup, as well as `_id`, `createdAt`
and `id` (if one was provided when it was triggered).

The client must provide `req.body.displayingIds`,
an array of notification `_id` properties it is already displaying.
Without this, all notifications that have not been dismissed via the
dismiss route are sent.

If any of the ids in `displayingIds` have been recently dismissed,
the response will include them in its `dismissed` property.

Waits up to 10 seconds for new notifications (long polling),
but then respond with an empty array to avoid proxy server timeouts.

As usual POST is used to avoid unwanted caching of the response.
### find(*req*, *options*, *callback*)
Resolves with an object with `notifications` and `dismissed`
properties.

Returns a promise if no callback is passed.

If `options.displayingIds` is set, notifications
whose `_id` properties appear in it are not returned.
### ensureCollection(*callback*)

## API Routes
### POST /modules/apostrophe-notifications/trigger
Send a new notification for the user.
### POST /modules/apostrophe-notifications/dismiss
Dismiss the notification indicated by `req.body._id`.
