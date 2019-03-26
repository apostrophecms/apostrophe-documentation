---
title: apostrophe-jobs (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-jobs

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

## Methods

### progress\(_jobId_, _options_\)

Start a progress display for the given job id. If `options.change` is set, an `apos.change` call is made with that argument when the progress display is dismissed.

If `options.success` is set, it is invoked after all items have been processed and receives the `results` property provided by the server at the end of the job; it is not invoked if the operation was stopped or canceled by the user. Note that `options.success` does not take a callback because the modal has already been dismissed.

