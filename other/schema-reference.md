| Field | Description | Properties |
|-------|-------------|------------|
|[area](field-types/area.md) | An editable content area | `options(array)` |
|[singleton](field-types/singleton.md) | A single widget | `widgetType(string), options(array)` |
|[string](field-types/string.md) | accepts text entry from a user | `textArea(bool), min(int), max(int)` |
|[email](field-types/email.md) | accepts a valid email address as input from a user	| |
|[slug](field-types/slug.md) | provides an entry for the canonical URL for a page. not needed if extending an existing page or piece. all entries are sanitized | `page(bool)` |
|[tags](field-types/tags.md) | accepts text entry from a user to define "tags" | `limit(int), lock(bool)` |
|[boolean](field-types/boolean.md) | provides a "Yes" or "No" input from a user | `choices(array), mandatory(bool), showFields(array)` |
|[checkboxes](field-types/checkbox.md) | provides an array of checkboxes which a user can select | `choices(array), showFields(array)` | 
|[select](field-types/select.md) | provides a single-select dropdown menu | `choices(array),` |
|[integer](field-types/integer.md) | accepts input of an integer from a user | `min(int), max(int)` |
|[float](field-types/float.md) | accepts input of a floating point number | `min(int), max(int)` |
|[url](field-types/url.md) | provides an editable URL field | |
|[date](field-types/date.md) |	provides a date picker | `pikadayOptions` |
|[time](field-types/time.md) |	provides entry for a time, which is stored in HH:MM:SS format | `userTimeFormat` |
|[password](field-types/password.md) |	accepts text entry from the user, but hides that entry | |
|[object](field-types/object.md) | A field which can store a single object	| |
|[array](field-types/array.md) | A field which can store one of more objects as an array | `limit(int), titleField(string), listItemTemplate(string)` |
|[attachment](field-types/attachment.md) | allows the user to upload a file to the server | `group('images' or 'office)` |
|[video](field-types/video.md) | allows the user to embed a video with an oembed compatible link | |
|[color](field-types/color.md) | provides a color picker for the user | |
|[range](field-types/range.md) | "provides an input for seleting a range of numbers" | `min(int), max(int), step(int)` |
|joinByOne | expresses a one-to-one relationship between two types of objects | |
|joinByArray | expresses a one-to-many relationship between an object and an array | |
|joinByOneReverse | allows the user to see the "other side" of a joinByOne relationship	| |
|joinByArrayReverse | allows the user to see the "other side" of a joinByArray relationship	| |