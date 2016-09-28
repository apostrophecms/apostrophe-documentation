---
title: "apostrophe-context (browser)"
layout: reference
namespace: browser
---
A base class with convenience methods for modals and other types that
have an action and optionally a jquery element (self.$el). Your
subclass is responsible for setting self.$el in its constructor if
you wish to use methods that expect it, such as self.link. The
other methods just expect options.action to be present.

Also takes care of setting self.options and self.action for you.


## Methods
### link(*verb*, *object*, *fn*)
If an element with a `[data-verb-object]`
attribute is clicked, invoke `fn` method
with the jquery element clicked upon, and the
value of the attribute.  Mixed case
in `verb` and `object` is converted to
hyphenation before adding the click handler.

Can also be called with just (verb, fn)
if you are just looking for `[data-verb]`.

Event propagation and the default behavior of
the click event are both automatically stopped.

Your subclass must set self.$el to use this method.

The word "object" refers to "the object of the sentence."
It is a STRING, not a javascript object. -Tom and Joel
### api(*verb*, *data*, *options*, *success*, *failure*)
Invoke $.jsonCall with the URL
self.action + '/' + verb.

"options" and "failure" may be omitted entirely.

Typical example:

self.api('update', { age: 50 }, function(result) {
  if (result.status === 'ok') { ... }
});

See $.jsonCall for details.
### html(*verb*, *options*, *data*, *success*, *failure*)
Invoke $.jsonCall with the URL self.action + '/' + verb
and always add { dataType: 'html' } to the options. For
fetching HTML fragments asynchronously. Since $.jsonCall
is always POST, there is no limit to the size of the
data object and no risk of a stale cached result coming back.

Typical example:

self.html('editor', { _id: 5555 }, function(html) {
  self.$editorDiv.html(html);
}, function() {
  alert('An error occurred');
});

See $.jsonCall for details.
