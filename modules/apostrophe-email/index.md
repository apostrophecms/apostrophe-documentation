---
title: apostrophe-email (module)
layout: reference
module: true
namespaces: null
children: null
---

# index

## Inherits from: [apostrophe-module](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-module/index.html)

## Methods

### emailForModule\(_req_, _templateName_, _data_, _options_, _module_, _callback_\)

Implements the `email` method available in all modules.

See `apostrophe-module` for coverage of the `email` method that every module has. You won't need to call `emailForModule` directly.

### getTransport\(\)

Fetch the nodemailer-compatible transport object. The default implementation creates a transport via `nodemailer.createTransport` on the first call, passing it the value of the `nodemailer` option configured for the `apostrophe-email` module. If there is none, a fatal error is thrown.

