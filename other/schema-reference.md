# Schema Field Type Reference

Below you can find each of the schema field types available in Apostrophe with links to a complete description of its function, properties, and refence code to help you use them in your project. For more general information on using schemas in Apostrophe, see the [Schema Guide](/tutorials/schema-guide/schema-guide.md). For more information on the usage of specific properties, see the [Schema Field Properties reference](property-reference.md).

| Field | Description |
|-------|-------------|
|[area](/other/field-types/area.md) | an editable content area |
|[array](/other/field-types/array.md) | A field which can store one of more objects as an array |
|[attachment](/other/field-types/attachment.md) | provides access to upload a file to the server |
|[boolean](/other/field-types/boolean.md) | provides a "True" or "False" input |
|[checkboxes](/other/field-types/checkbox.md) | provides an array of checkboxes |
|[color](/other/field-types/color.md) | provides a color picker | 
|[date](/other/field-types/date.md) | provides a date picker |
|[email](/other/field-types/email.md) | accepts a valid email address  |
|[float](/other/field-types/float.md) | accepts input of a decimal number with stepped parameters |
|[integer](/other/field-types/integer.md) | accepts input of an whole number |
|[joinByArray](/other/field-types/joinByArray.md) | expresses a one-to-many relationship between an object and an array |
|[joinByArrayReverse](/other/field-types/joinByArrayReverse.md) | allows the user to see the "other side" of a joinByArray relationship |
|[joinByOne](/other/field-types/joinByOne.md) | expresses a one-to-one relationship between two types of objects | 
|[joinByOneReverse](/other/field-types/joinByOneReverse.md) | allows the user to see the "other side" of a joinByOne relationship |
|[object](/other/field-types/object.md) | A field which can store a single object | 
|[password](/other/field-types/password.md) | hidden text entry |
|[range](/other/field-types/range.md) | "provides an input for selecting a range of numbers" |
|[select](/other/field-types/select.md) | provides a single-select dropdown menu |
|[singleton](/other/field-types/singleton.md) | displays a single widget |
|[slug](/other/field-types/slug.md) | provides an entry for the URL for a page. not needed if extending an existing page or piece. all entries are sanitized |
|[string](/other/field-types/string.md) | accepts text entry |
|[tags](/other/field-types/tags.md) | accepts text entry to define "tags" as a label for content |
|[time](/other/field-types/time.md) | provides entry for a time, which is stored in HH:MM:SS format |
|[url](/other/field-types/url.md) | provides an editable URL field | 
|[video](/other/field-types/video.md) | allows the user to embed a video with an oembed compatible link |

{% hint style='info' %}
You can also add more field types to the system; check out the source code of the [`apostrophe-attachments`](https://github.com/apostrophecms/apostrophe/tree/master/lib/modules/apostrophe-attachments) module for a good example.
{% endhint %}

