---
title: "apostrophe-schemas (browser)"
---

## Methods
### populate(*$el*, *schema*, *object*, *callback*)
Populate form elements corresponding to a set of fields as
specified in a schema (the schema argument). The inverse of
self.convert
### convert(*$el*, *schema*, *data*, *options*, *callback*)
Gather data from form elements and push it into properties of the data
object, as specified by the schema provided. The inverse of
self.populate. Errors, if any, are passed as an array to
the callback; if the first parameter is null all is well. In the
event of errors this method will still convert as many fields
as it can.

The options argument can be completely omitted.

By default, any errors are highlighted via showError().
If you explicitly set options.showErrors to false, errors are
not highlighted (but are still reported). This is useful
for autosave and similar operations.
### error(*field*, *type*)
Create a valid error object to be reported from a converter.
You can also report a string in which case self.convert creates
one of these for you. The object is nice if you want to extend it
with extra properties
### enableGroupTabs(*$el*)
Add click handlers for group tabs
### contextualConvertArea(*data*, *name*, *$el*, *field*)

### enableSingleton(*$el*, *name*, *area*, *type*, *_options*, *callback*)

### enableArea(*$el*, *name*, *area*, *options*, *callback*)
options argument may be skipped
### getSingleton(*$el*, *name*)

### getArea(*$el*, *name*)
Retrieve a JSON-friendly serialization of the area
### addFieldType(*type*)

### showError(*$el*, *error*)
Make an error visible. You can use this in your own validation
code, see self.error() for an easy way to make an error object
### scrollToError(*$el*)
A convenience allowing you to scroll to the first error present,
if any. Not called automatically. You can call this when
convert passes an error or when your own validation code
has invoked showError().
### findFieldset(*$el*, *name*)
Used to search for fieldsets at this level of the schema,
without false positives for any schemas nested within it
### findSafe(*$el*, *sel*)
Used to search for elements without false positives from nested
schemas in unrelated fieldsets
### findField(*$el*, *name*)
Used to search for simple elements that have a
"name" attribute, without false positives from nested
schemas in unrelated fieldsets.
### enhanceSelectiveWithSlugs(*$field*)

### newInstance(*schema*)

### enableTags(*$el*, *tags*, *field*)
Enable autocomplete of tags. Expects the fieldset element
(not the input element) and an array of existing tags already
assigned to this item. Exported for the convenience of
code that is not fully schema-based but wants to enhance
tag fields in the same way.
### enableSlug(*$title*, *$slug*)
Reusable utility to watch the title and use it to
suggest valid slugs.
If the initial slug contains slashes, only the last component
(after the last slash) is changed on title edits.
If the original slug (or its last component) is not in sync with the
title, it is assumed that the user already made deliberate changes to
the slug, and the slug is not automatically updated.
### enableShowFields(*data*, *name*, *$field*, *$el*, *field*)

