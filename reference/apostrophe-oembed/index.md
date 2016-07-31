---
title: "apostrophe-oembed (module)"
children:
  - browser-apostrophe-oembed
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

## Methods
### pushCreateSingleton(*req*, *url*, *options*, *mainCallback*)

### createOembetter(*req*, *url*, *callback*)

### enhanceOembetter(*req*, *url*, *options*, *callback*)

### createRoutes(*script*, *beforeId*, *scriptId*, *then*)

## API Routes
### GET /modules/apostrophe-oembed/query
Simple REST API to self.query, with caching. Accepts url and
alwaysIframe parameters; alwaysIframe is assumed false
if not provided. The response is a JSON object as returned
by apos.oembed. You may use GET or POST
