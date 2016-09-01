---
title: "apostrophe-oembed (module)"
layout: module
children:
  - browser-apostrophe-oembed
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.oembed`
The oembed module provides an oembed query service for embedding
third-party website content, such as YouTube videos. The service includes
enhancements and substitutes for several services that do not support
oembed or do not support it well, and it is possible to add more by
extending the `enhanceOembetter` method. The server-side
code provides a query route with caching. The browser-side code
provides methods to make a query, and also to make a query and then immediately
display the result.

Also see the [oembetter](https://www.npmjs.com/package/oembetter) npm module and
the [oembed](http://oembed.com/) documentation.

Sites to be embedded need to be whitelisted, to avoid XSS attacks. Many
widely trusted sites are already whitelisted.

Your `whitelist` option is concatenated with `oembetter`'s standard
whitelist, plus wufoo.com, infogr.am, and slideshare.net.

Your `endpoints` option is concatenated with `oembetter`'s standard
endpoints list.


## Methods
### query(*req*, *url*, *options*, *mainCallback*) *[api]*
This method fetches the specified URL, determines its best embedded
representation via oembetter, and on success invokes its callback with null
and an object containing the oembed API response from the service provider.

If oembetter has no luck, open graph is used as a fallback.

If options.alwaysIframe is true, the result is a simple
iframe of the URL. If options.iframeHeight is set, the iframe
has that height in pixels, otherwise it is left to CSS.

Responses are automatically cached, by default for one hour. See the
cacheLifetime option to the module.
### openGraph(*req*, *url*, *callback*) *[api]*
Given a URL, return a nice oembed response for it
based on its Open Graph tags, or the best we can
fake, based on the HTML markup of the page. Called
for you by `self.query` if `oembetter` is unsuccessful.
### iframe(*req*, *url*, *options*, *callback*) *[api]*
Given a URL, return an oembed response for it
which just iframes the URL given. Fetches the page
first to get the title property.

If options.iframeHeight is set, use that # of
pixels, otherwise do not specify & let CSS do it.

Called by `self.query` if the `alwaysIframe` option
is true.
### afterScriptLoads(*script*, *beforeId*, *scriptId*, *then*) *[api]*
Returns browser-side javascript to load a given
cross-domain js file dynamically and then run
the javascript code in the `then` string argument.
`script` should be a URL pointing to the third-party
js file and may start with // to autoselect
http or https depending on how the page was loaded.

You may supply an id attribute for the script tag.
Some services rely on these (infogr.am).

You may also supply the ID of an element that the
script should be inserted immediately before. Some
services try to infer how they should behave from the
context the script tag is in (infogr.am).

This code was inspired by the wufoo embed code and
is used to dynamically load wufoo and other services
that use js-based embed codes. See the oembetter
filter in `wufoo.js`.
### pushAssets() *[browser]*
Push assets to the browser. Called by `afterConstruct`.
### pushCreateSingleton() *[browser]*
Create the browser-side `apos.oembed` singleton, enabling
calls to `apos.oembed.query` and `apos.oembed.queryAndPlay`.
Called by `afterConstruct`.
### pushCreateSingleton()
Create the browser-side object `apos.oembed` for convenient oembed queries
and display of oembed responses. Called by `afterConstruct`.
### createOembetter()
Creates an instance of the `oembetter` module and adds the standard whitelist.
Called by `afterConstruct`.
### enhanceOembetter()
Enhances oembetter to support services better or to support services
that have no oembed support by default. Called by `afterConstruct`.
Extend this method to add additional `oembetter` filters.
### createRoutes()
Add oembed query API routes. Called by `afterConstruct`.
## API Routes
### GET /modules/apostrophe-oembed/query
Simple API to self.query, with caching. Accepts url and
alwaysIframe parameters; alwaysIframe is assumed false
if not provided. The response is a JSON object as returned
by apos.oembed. You may use GET or POST
