
| Field | Description | Properties |
|-------|-------------|------------|
|[area](/other/field-types/area.md) | An editable content area | `options(array)` |
|[singleton](/other/field-types/singleton.md) | A single widget | `widgetType(string), options(array)` |
|[string](/other/field-types/string.md) | accepts text entry from a user | `textarea(bool), min(int), max(int)` |
|[email](/other/field-types/email.md) | accepts a valid email address as input from a user	| |
|[slug](/other/field-types/slug.md) | provides an entry for the canonical URL for a page. not needed if extending an existing page or piece. all entries are sanitized | `page(bool)` |
|[tags](/other/field-types/tags.md) | accepts text entry from a user to define "tags" | `limit(int)` |
|[boolean](/other/field-types/boolean.md) | provides a "Yes" or "No" input from a user | `choices(array), mandatory(bool)` |
|[checkboxes](/other/field-types/checkbox.md) | provides an array of checkboxes which a user can select | `choices(array)` | 
|[select](/other/field-types/select.md) | provides a single-select dropdown menu | `choices(array),` |
|[integer](/other/field-types/integer.md) | accepts input of an integer from a user | `min(int), max(int)` |
|[float](/other/field-types/float.md) | accepts input of a floating point number | `min(int), max(int)` |
|[url](/other/field-types/url.md) | provides an editable URL field | |
|[date](/other/field-types/date.md) |	provides a date picker | `pikadayOptions` |
|[time](/other/field-types/time.md) |	provides entry for a time, which is stored in HH:MM:SS format | `userTimeFormat` |
|[password](/other/field-types/password.md) |	accepts text entry from the user, but hides that entry | |
|[object](/other/field-types/object.md) | A field which can store a single object	| `schema(schema)` |
|[array](/other/field-types/array.md) | A field which can store one of more objects as an array | `limit(int), titleField(string), listItemTemplate(string), schema(schema)` |
|[attachment](/other/field-types/attachment.md) | allows the user to upload a file to the server | `group('images' or 'office)` |
|[video](/other/field-types/video.md) | allows the user to embed a video with an oembed compatible link | |
|[color](/other/field-types/color.md) | provides a color picker for the user | |
|[range](/other/field-types/range.md) | "provides an input for seleting a range of numbers" | `min(int), max(int), step(int)` |
|[joinByOne](/other/field-types/joinByOne.md) | expresses a one-to-one relationship between two types of objects | |
|[joinByArray](/other/field-types/joinByArray.md) | expresses a one-to-many relationship between an object and an array | |
|[joinByOneReverse](/other/field-types/joinByOneReverse.md) | allows the user to see the "other side" of a joinByOne relationship	| |
|[joinByArrayReverse](/other/field-types/joinByArrayReverse.md) | allows the user to see the "other side" of a joinByArray relationship	| |