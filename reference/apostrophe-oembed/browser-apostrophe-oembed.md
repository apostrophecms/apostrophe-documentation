---
title: "apostrophe-oembed (browser)"
---

## Methods
### queryAndPlay(*$el*, *options*, *callback*)
Populate the specified div with the oembed result for the specified URL.
Adds the apos-oembed-busy class to $el during the interim.

options.url must be set to the URL for the oembed query.

If options.type is set, the type property of the oembed response must match,
or it is treated as invalid.

On success the title and thumbnail URL oembed result properties are made
available as the `title` and `thumbnail` jQuery data properties of
$el.
### query(*options*, *callback*)
apos.oembed.query: a convenience wrapper for making oembed requests
through Apostrophe's built-in proxy. options.url must be set to the
URL for the oembed query.
### play(*$el*, *result*, *callback*)
apos.oembed.play accepts a jQuery div and an oembed response
from apos.oembed.query. The div is repopulated with the oembed result.
The callback is optional and is invoked when the video has been
displayed and sized. It receives (null, $el, result)
