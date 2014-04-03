TODO: is there a theme here?

### Showing Custom Fields In The "Manage" View

By default the "manage" view shows only the title, the tags, and whether the item is currently in the trash or not.

You can extend this by setting the `manage: true` property on your fields and overriding the `manage.html` template. You'll need to copy that template from the `views/manage.html` file of the `apostrophe-snippets` module to the corresponding location for your module, which might be `lib/modules/myThing/views/manage.html`.

In the `manage.html` template, just include additional table cells for each row, like this one:

        <td><span data-key>Sample Key</span></td>

If there is a schema field named `key`, then its value will be displayed in this span.

The data attribute name `always-uses-hyphens`, `neverEverIntercap` `or_underscores`.

This feature is currently available for fields that correspond to simple form elements, like `boolean`, `string`, `date`, `time` and `select`. It is not currently available for joins, areas or singletons. It may become available for certain singletons (like thumbnails) and one-to-one joins in the future.

### Blocking Search

By default your content type is searchable. This is great, but sometimes you won't want it to be. To achieve that, set the `searchable: false` option when configuring your module.

### Restricting Edits To Admins Only

Sometimes your content type is too important to allow anyone except a site-wide admin permission to edit it. In such cases, just set the `adminOnly: true` option.
