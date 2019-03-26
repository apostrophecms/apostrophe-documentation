---
title: apostrophe-oembed (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-oembed

The browser-side `apos.oembed` singleton. Provides the `apos.oembed.query` and `apos.oembed.queryAndPlay` methods.

## Methods

### queryAndPlay\(_$el_, _options_, _callback_\)

Populate the specified div with the oembed result for the specified URL. Adds the apos-oembed-busy class to $el during the interim.

options.url must be set to the URL for the oembed query.

If options.type is set, the type property of the oembed response must match, or it is treated as invalid.

On success the title and thumbnail URL oembed result properties are made available as the `title` and `thumbnail` jQuery data properties of $el.

The callback is optional and is invoked when the video has been displayed and sized. It receives \(null, $el, result\).

### query\(_options_, _callback_\)

apos.oembed.query: a convenience wrapper for making oembed requests through Apostrophe's built-in proxy. options.url must be set to the URL for the oembed query.

### play\(_$el_, _result_, _callback_\)

apos.oembed.play accepts a jQuery div and an oembed response from apos.oembed.query. The div is repopulated with the oembed result. The callback is optional and is invoked when the video has been displayed and sized. It receives \(null, $el, result\).

On success the title and thumbnail URL oembed result properties are made available as the `title` and `thumbnail` jQuery data properties of $el.

Normally `apos.oembed.queryAndPlay` is the most convenient approach.

