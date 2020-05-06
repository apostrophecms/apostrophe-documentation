# apostrophe-jobs
## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
The `apostrophe-jobs` module runs long-running jobs in response
to user actions. Batch operations on pieces are a good example.

The `apostrophe-jobs` module makes it simple to implement
progress display, avoid server timeouts during long operations,
and implement a "stop" button.

See the `run` method for the easiest way to use this module.
The `run` method allows you to implement routes that are designed
to be paired with the `progress` method of this module on
the browser side. All you need to do is make sure the
ids are posted to your route and then write a function that
can carry out the operation on one id.

If you just want to add a new batch operation for pieces,
see the examples already in `apostrophe-pieces` and those added
by the `apostrophe-workflow` module. You don't need to go
directly to this module for that case.

If your operation doesn't break down neatly into repeated operations
on single documents, look into calling the `start` method and friends
directly from your code.

The `apostrophe-jobs` module DOES NOT have anything to do with
cron jobs or command line tasks.


## Methods
### addRoutes() *[routes]*

### run(*req*, *change*, *options*) *[api]*
Starts and supervises a long-running job such as a
batch operation on pieces. Call it to implement an API route
that runs a job involving carrying out the same action
repetitively on many things. If your job doesn't look like
that, check out `runNonBatch` instead.

The `ids` to be processed should be provided via `req.body.ids`.

Pass `req` and a `change` function that accepts `(req, id, callback)`,
performs the modification on that one id and invokes its callback
with an error if any (if passed, this is recorded as a bad item
in the job, it does not stop the job) and an optional
`result` object.

If `req.body.job` is truthy, sends an immediate JSON response to `req.res` with
`{ status: 'ok', jobId: 'cxxxx' }`.

The `jobId` can then be passed to `apos.modules['apostrophe-jobs'].progress(jobId)`
on the browser side to monitor progress. After the job status is `completed`,
the results of the job can be obtained via the progress API as the `results`
property, an object with a sub-property for each `id`.

Jobs run in this way support the stop operation. They do not currently support
the cancel (undo/rollback) operation.

Note that this method does not actually care if `id` is a doc id or not.
It is just a unique identifier for one item to be processed that your
`change` function must understand.

The `batchSimple` method of `apostrophe-pieces` is an even
simpler wrapper for this method if you are implementing a batch operation
on a single type of piece.

*Options*

`options.labels` should be passed as an object with
a `title` property, to title the progress modal.
A default is provided but it is not very informative.

In addition, it may have `failed`, `completed` and
`running` properties to label the progress modal when the job
is in those states, and `good` and `bad` properties to label
the count of items that were successful or had errors.
All of these properties are optional and reasonable
defaults are supplied.

*Backwards compatibility*

For bc a single id can be provided via `req.body._id`.

If `req.body.job` is not truthy, the entire job is processed and
a single HTTP response is sent, like:

`{ status: 'ok', data: firstResult }` on success.

`firstResult` is an empty object if `ids` was passed rather than `id`.

This alternative approach is for bc only. Proxy timeouts are bad. Don't use it.
### runNonBatch(*req*, *doTheWork*, *options*) *[api]*
Similar to `run`, this method Starts and supervises a long-running job,
however unlike `run` the `doTheWork` callback function provided is invoked just
once, and when it completes the job is over. This is not the way to
implement a batch operation on pieces; see the `batchSimple` method
of that module.

The `doTheWork` function receives `(req, reporting, callback)` and may optionally invoke
`reporting.good()` and `reporting.bad()` to update the progress and error
counters, and `reporting.setTotal()` to indicate the total number of
counts expected so a progress meter can be rendered. This is optional and
an indication of progress is still displayed without it.
`reporting.setResults(object)` may also be called to pass a
`results` object, which is made available to the optional `success` callback
of the job's modal on the browser side. `doTheWork` may optionally
return a promise rather than invoking the callback.

This method will send `{ status: 'ok', jobId: 'cxxxx' }` to the
browser for you. There is no callback because there is nothing more for
you to do in your route.

The `jobId` can then be passed to `apos.modules['apostrophe-jobs'].progress(jobId)`
on the browser side to monitor progress. After the job status is `completed`,
the results of the job can be obtained via the progress API as the `results`
property, an object with a sub-property for each `id`.

*Options*

`options.labels` should be passed as an object with
a `title` property, to title the progress modal.
A default is provided but it is not very informative.

In addition, it may have `failed`, `completed` and
`running` properties to label the progress modal when the job
is in those states, and `good` and `bad` properties to label
the count of items that were successful or had errors.
All of these properties are optional and reasonable
defaults are supplied.

You may set `options.canStop` or `options.canCancel` to true.
If you do, a "stop" or "cancel" button is presented to the user.
Your code may then invoke `reporting.isCanceling()` when convenient
and, if it returns a function, must cease the operation and then invoke
that function **instead of** its callback. If the operation has completed
in the meantime your code must take care not to invoke it afterwards.

If `canCancel` was used, your code must also
undo all effects of the entire job **before invoking** the function.
### start(*options*, *callback*) *[api]*
Start tracking a long-running job. Called by routes
that require progress display and/or the ability to take longer
than the server might permit a single HTTP request to last.
*You usually won't call this yourself. The easy way is usually
to call the `run` method, above.*

On success this method invokes its callback with `(null, job)`.
You can then invoke the `setTotal`, `success`, `error`,
and `end` methods with the job object. *For convenience,
only `start` and `end` require a callback.*

Once you successfully call `start`, you *must* eventually call
`end` with a `job` object and a callback. In addition,
you *may* call `success(job)` and `error(job)` any number of times
to indicate the success or failure of one "row" or other item
processed, and you *may* call `setTotal(job, n)` to indicate
how many rows to expect for better progress display.

*Canceling and stopping jobs*

If `options.cancel` is passed, the user may cancel (undo) the job.
If they do `options.cancel` will be invoked with `(job, callback)` and
it *must undo what was done*. You must invoke the callback *after the
undo operation*. If you pass an error to the callback, the job will be stopped
with no further progress in the undo operation.

If `options.stop` is passed, the user may stop (halt) the operation.
If they do `options.stop` will be invoked with `(job, callback)` and
it *must stop processing new items*. You must invoke the callback
*after all operations have stopped*.

The difference between stop and cancel is the lack of undo with "stop".
Implement the one that is practical for you. Users like to be able to
undo things fully, of course.

You should not offer both. If you do, only "Cancel" is presented
to the user.

*Labeling the progress modal: `options.labels`*

`options.labels` should be passed as an object with
a `title` property, to title the progress modal.

In addition, it may have `failed`, `completed` and
`running` properties to label the progress modal when the job
is in those states, and `good` and `bad` properties to label
the count of items that were successful or had errors.
All of these properties are optional and reasonable
defaults are supplied.
### good(*job*, *n*) *[api]*
Call this to report that n items were good
(successfully processed).

If the second argument is completely omitted,
the default is `1`.

For simplicity there is no callback,
since the reporting is noncritical. Just
call it and move on.
### bad(*job*, *n*) *[api]*
Call this to report that n items were bad
(not successfully processed).

If the second argument is completely omitted,
the default is 1.

For simplicity there is no callback,
since the reporting is noncritical. Just
call it and move on.
### setTotal(*job*, *total*) *[api]*
Call this to indicate the total number
of items expected. Until and unless this is called
a different type of progress display is used.
If you do call this, the total of all calls
to success() and error() should not exceed it.

It is OK not to call this, however the progress
display will be less informative.

For simplicity there is no callback,
since the reporting is noncritical. Just
call it and move on.
### end(*job*, *success*, *results*, *callback*) *[api]*
Mark the given job as ended. If `success`
is true the job is reported as an overall
success, if `failed` is true the job
is reported as an overall failure.
Either way the user can still see the
count of "good" and "bad" items.

If the results parameter is not omitted entirely,
it is added to the job object in the database
as the `results` property.
### ensureCollection(*callback*) *[implementation]*

### checkStop(*context*) *[implementation]*
Periodically invoked to check whether
a request to cancel or stop the job has been made.
If it has we invoke options.cancel or options.stop to
actually cancel it, preferably the former. This method is invoked
by an interval timer installed by `self.start`.
This allows a possibly different apostrophe process
to request a cancellation by setting the `canceling` property;
the original process actually running the job
cancels and then acknowledges this by setting status to `canceled`
or `stopped` according to which operation is
actually supported by the job.
### pushAssets() *[browser]*

