---
title: apostrophe-context (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-context

A base class with convenience methods for modals and other types that have an action and optionally a jquery element \(self.$el\). Your subclass is responsible for setting self.$el in its constructor if you wish to use methods that expect it, such as self.link. The other methods just expect options.action to be present.

Also takes care of setting self.options and self.action for you.

## Methods

### link\(_verb_, _object_, _fn_\)

If an element with a `[data-verb-object]` attribute is clicked, invoke `fn` method with the jquery element clicked upon, and the value of the attribute. Mixed case in `verb` and `object` is converted to hyphenation before adding the click handler.

Can also be called with just \(verb, fn\) if you are just looking for `[data-verb]`.

Event propagation and the default behavior of the click event are both automatically stopped.

Your subclass must set self.$el to use this method.

The word "object" refers to "the object of the sentence." It is a STRING, not a javascript object. -Tom and Joel

### api\(_route_, _data_, _options_, _success_, _failure_\)

Invoke a JSON API route implemented by the Apostrophe module associated with this object, or by another module if the ":" syntax is used, like: `module-name:verb`

`options` and `failure` may be omitted entirely.

Typical example:

self.api\('update', { age: 50 }, function\(result\) { if \(result.status === 'ok'\) { ... } }\);

See $.jsonCall for details of how the call is made.

### html\(_route_, _options_, _data_, _success_, _failure_\)

Invoke an API route implemented by the Apostrophe module associated with this object, or by another module if the ":" syntax is used, like: `module-name:verb`

The response is expected to be markup, not JSON. Otherwise this method is very similar to the `api` method.

`options` and `failure` may be omitted entirely.

Typical example:

self.html\('editor', { \_id: 5555 }, function\(html\) { self.$editorDiv.html\(html\); }, function\(\) { apos.notify\('An error occurred', { type: 'error', dismiss: true }\); }\);

See $.jsonCall for details.

