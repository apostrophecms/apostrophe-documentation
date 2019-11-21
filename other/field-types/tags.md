# `tags`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| limit | int | | Sets the number of tags that can be deinfed in a given field |  
| lock | boolean | false | If true, users cannot create their own tags. |

`tags` adds a field allowing the user to enter one or more tags. The interface will suggest completions for each tag, based on those that already exist in the `tags` properties of docs on the site.

Usually a doc has only one `tags` field, called `tags`. You may create more than one, but the autocomplete feature will not currently be aware of values that only exist in others.

The `limit` property can be set to limit how many tags can be set for this field.

If the `lock` option of the `apostrophe-tags` module has been set to `true`, users cannot create brand-new tags when filling out a `tags` field. In this case never-before-seen tags must be created via the "Tags" admin bar button.

By default, tags are converted to lowercase and leading and trailing whitespace is trimmed. Consistent case for tags greatly reduces the risk of duplicate tags.

This behavior can be overridden by configuring the `apostrophe-launder` module's `filterTag` option to a function that accepts a string, filters it as desired, and returns a new string.