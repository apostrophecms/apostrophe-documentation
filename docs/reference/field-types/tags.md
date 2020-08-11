# `tags`

`tags` adds a field allowing the user to enter one or more tags. The interface will suggest completions for each tag, based on existing `tags`  for the site.

Usually a doc has only one `tags` field, called `tags`. You may create an additional field for storing tags, but the autocomplete feature only uses the original `tags` field.

If the `lock` option of the [`apostrophe-tags`](/api/apostrophe-tags/README.md) module has been set to `true`, users cannot create brand-new tags when filling out a `tags` field. In this case never-before-seen tags must be created via the "Tags" admin bar button.

By default, tags are converted to lowercase and leading and trailing whitespace is trimmed. This behavior can be overridden by configuring the [`apostrophe-launder`](/api/apostrophe-launder.md) module's `filterTag` option to a function that accepts a string, filters it as desired, and returns a new string.

## Settings

|  Property | Type   | Default | Description |
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|limit | `int` | | Sets the number of tags that can be defined in a given field |
