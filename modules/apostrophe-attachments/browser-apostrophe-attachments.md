---
title: apostrophe-attachments (browser)
layout: reference
namespace: browser
---

# browser-apostrophe-attachments

## Inherits from: [apostrophe-context](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-utils/browser-apostrophe-context.html)

## Methods

### url\(_file_, _options_\)

Given an attachment field value, return the file URL. If options.size is set, return the URL for that size \(one-third, one-half, two-thirds, full\). full is "full width" \(1140px\), not the original.

If you don't pass the options object, or options does not have a size property, you'll get the URL of the original.

You can also pass a crop object \(the crop must already exist\).

### crop\(_attachment_, _options_, _callback_\)

Invoke with an attachment, options \(such as minSize\), and a callback. Callback receives \(err, crop\). If no err, crop has coordinates and can be stored as the crop property of the attachment \(when there is one and only one crop ever for this attachment\), or stored as part of a relationship to the doc containing the attachment; that part is up to you.

### focalPoint\(_attachment_, _options_, _callback_\)

Invoke with an attachment, options \(such as minSize\), and a callback. Callback receives \(err, focalPoint\). If no err, focalPoint has x and y properties and can be stored as the focalPoint property of the attachment \(when there is one and only one focal point ever for this attachment\), or stored as part of a relationship to the doc containing the attachment; that part is up to you.

### addFieldType\(\)

### populate\(_object_, _name_, _$field_, _$el_, _field_, _callback_\)

### convert\(_data_, _name_, _$field_, _$el_, _field_, _callback_\)

### addHandlers\(\)

### updateExisting\(_$fieldset_, _info_, _field_\)

