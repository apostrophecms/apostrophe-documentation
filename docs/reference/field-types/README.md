# Schema Field Type Reference

Below you can find each of the schema field types available in Apostrophe with links to a complete description of its function, properties, and reference code to help you use them in your project. For more general information on using schemas in Apostrophe, see the [Schema Guide](/advanced-topics/schema-guide.md). For more information on the usage of specific properties, see the [Schema Field Properties reference](../field-properties).

| Field | Description |
|-------|-------------|
|[area](/reference/field-types/area.md) | an editable content area |
|[array](/reference/field-types/array.md) | A field which can store one or more objects as an array. Has its own schema |
|[attachment](/reference/field-types/attachment.md) | provides access to upload a file to the server |
|[boolean](/reference/field-types/boolean.md) | provides a "True" or "False" input |
|[checkboxes](/reference/field-types/checkbox.md) | provides an array of checkboxes |
|[color](/reference/field-types/color.md) | provides a color picker |
|[date](/reference/field-types/date.md) | provides a date picker |
|[email](/reference/field-types/email.md) | accepts a valid email address  |
|[float](/reference/field-types/float.md) | accepts input of a decimal number with stepped parameters |
|[integer](/reference/field-types/integer.md) | accepts input of an integer |
|[joinByArray](/reference/field-types/joinByArray.md) | expresses a one-to-many relationship between this document and one or more pieces or pages |
|[joinByArrayReverse](/reference/field-types/joinByArrayReverse.md) | allows the user to see the "other side" of a joinByArray relationship |
|[joinByOne](/reference/field-types/joinByOne.md) | expresses a one-to-one relationship between this document and another type of document |
|[joinByOneReverse](/reference/field-types/joinByOneReverse.md) | allows the user to see the "other side" of a joinByOne relationship |
|[object](/reference/field-types/object.md) | A field which can store a single object with its own schema |
|[password](/reference/field-types/password.md) | hidden text entry |
|[range](/reference/field-types/range.md) | "provides an input for selecting a range of numbers" |
|[select](/reference/field-types/select.md) | provides a single-select dropdown menu |
|[singleton](/reference/field-types/singleton.md) | displays a single widget |
|[slug](/reference/field-types/slug.md) | A string which, when saved, is simplified to lowercase, hyphens, etc. suitable for use as part of a URL. All docs in Apostrophe have at least a field of this type named slug, but you may have more. |
|[string](/reference/field-types/string.md) | accepts text entry |
|[tags](/reference/field-types/tags.md) | accepts text entry to define "tags" as a label for content |
|[time](/reference/field-types/time.md) | provides entry for a time, which is stored in HH:MM:SS format |
|[url](/reference/field-types/url.md) | provides an editable URL field |
|[video](/reference/field-types/video.md) | allows the user to embed a video by pasting a link |

::: tip
You can also add more field types to the system; check out the source code of the [`apostrophe-attachments`](https://github.com/apostrophecms/apostrophe/tree/master/lib/modules/apostrophe-attachments) module for a good example.
:::

