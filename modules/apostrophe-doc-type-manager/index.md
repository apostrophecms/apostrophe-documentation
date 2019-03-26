---
title: apostrophe-doc-type-manager (module)
layout: reference
module: true
namespaces:
  server: true
  browser: true
children:
  - server-apostrophe-doc-type-manager-cursor
  - browser-apostrophe-doc-type-manager
  - browser-apostrophe-doc-type-manager-chooser
  - browser-apostrophe-doc-type-manager-relationship-editor
  - browser-apostrophe-doc-type-manager-manager-modal
---

# index

## Inherits from: [apostrophe-module](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-module/index.html)

This module is the base class of `apostrophe-custom-pages`, `apostrophe-pieces`, `apostrophe-global` and any other module that serves as the manager for a doc type. You can introduce new fields to the schema of _all_ docs by extending this module at project level and modifying `addFields` in `beforeConstruct`.

The `name` option must be set to the doc type name, as found in the `type` property of each individual doc. Thus it is usually singular.

## Options

### `permissionsFields`

By default, fields for setting detailed permissions for users and groups to view and edit a particular doc are not displayed. If you turn on this flag, they are added to the schema.

\(Note that when a user who is not an admin for your doc type creates a new one, they are automatically given permission to edit it as an individual so they can continue to manage it.\)

### Schema options

The standard schema options, including `addFields`, `removeFields` and `arrangeFields`. See the [schema guide](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/getting-started/schema-guide.html).

## Methods

### addTrashPrefixFields\(_fields_\) _\[api\]_

### removeTrashPrefixFields\(_fields_\) _\[api\]_

### addTrashSuffixFields\(_fields_\) _\[api\]_

### removeTrashSuffixFields\(_fields_\) _\[api\]_

### deduplicateTrash\(_req_, _doc_, _callback_\) _\[api\]_

prefix any fields that have unique indexes so that other pieces are allowed to reuse those usernames, email addresses, etc.

### deduplicateRescue\(_req_, _doc_, _callback_\) _\[api\]_

When rescuing docs from the trash, attempt to un-prefix any fields that have unique indexes. However, if we then find it's been taken in the meanwhile, leave the prefix in place and leave it up to the user to resolve the issue.

### getEditPermissionName\(\) _\[api\]_

Returns the minimum permission name that should be checked for to determine if this user has some edit privileges for this doc type \(not necessarily every instance of it\), for example the ability to create one. Determines admin bar menu item visibility

### getAdminPermissionName\(\) _\[api\]_

Returns the minimum permission name that should be checked for to determine if this user has full admin privileges for this doc type

### defineCursor\(\) _\[api\]_

Define the related type "cursor", so that all of our subclasses automatically have a cursor type too, and it is autoloaded from ./lib/cursor.js if that exists, otherwise given an empty definition.

### find\(_req_, _criteria_, _projection_\) _\[api\]_

Returns a cursor that will only yield docs of the appropriate type as determined by the `name` option of the module. Returns a cursor of the appropriate type for the current module, even if it is a subclass. Returns a cursor for use in finding docs. See cursor.js for chainable filters, and also yielders that actually deliver the docs to you.

### newInstance\(\) _\[api\]_

Returns a new instance of the doc type, with the appropriate default values for each schema field.

### getAutocompleteProjection\(_query_\) _\[api\]_

Returns a MongoDB projection object to be used when querying for this type if all that is needed is a title for display in an autocomplete menu. Default behavior is to return only the `title`, `_id` and `slug` properties. Removing any of these three is not recommended.

`query.field` will contain the schema field definition for the join the user is attempting to match titles from.

### getAutocompleteTitle\(_doc_, _query_\) _\[api\]_

Returns a string to represent the given `doc` in an autocomplete menu. `doc` will contain only the fields returned by `getAutocompleteProjection`. `query.field` will contain the schema field definition for the join the user is attempting to match titles from. The default behavior is to return the `title` property. This is sometimes extended to include event start dates and similar information that helps the user distinguish between docs.

### decorateChange\(_doc_, _change_\) _\[api\]_

Used by `apostrophe-versions` to label changes that are made to joins by ID. Set `change.text` to the desired text.

### isAdminOnly\(\) _\[api\]_

Returns true if only admins are allowed to edit this type. Respected by the pieces module when deciding whether to enumerate more specific permissions as choices for this module.

### allowedSchema\(_req_\) _\[api\]_

Return a new schema containing only fields for which the current user has the permission specified by the `permission` property of the schema field, or there is no `permission` property for the field.

### composeSchema\(\) _\[api\]_

### patchAdminPermissionInSchema\(\) _\[api\]_

In the schema, `_editUsers` and `_editGroups` are initially locked down to sitewide admins. Now that we've constructed the module completely, take advantage of `getAdminPermissionName` to specify a more nuanced permission, such as the admin permission for this piece type, or for pages

### autocomplete\(_req_, _query_, _callback_\) _\[api\]_

This method provides the back end of /autocomplete routes. For the implementation of the autocomplete\(\) filter see autocomplete.js.

"query" must contain a "field" property which is the schema join field that describes the relationship we're adding items to.

"query" must also contain a "term" property, which is a partial string to be autocompleted; otherwise an empty array is delivered to the callback.

We don't launder the input here, see the 'autocomplete' route.

### addSearchIndexListener\(\) _\[api\]_

Adds a listener for the `docSearchIndex` Apostrophe event, pointing to the `searchIndexListener` method.

### searchIndexListener\(_doc_, _texts_\) _\[api\]_

Invoked when a `docSearchIndex` event takes place, this method adds additional search texts to the `texts` array \(modify it in place by pushing new objects to it\). These texts influence search results. The default behavior is quite useful, so you won't often need to override this.

Each "text" is an _object_ and must have at least `weight` and `text` properties. If `weight` is &gt;= 10, the text will be included in autocomplete searches and given higher priority in full-text searches. Otherwise it will be included only in full-text searches.

If `silent` is `true`, the `searchSummary` property will not contain the text.

By default this method invokes `schemas.indexFields`, which will push texts for all of the schema fields that support this unless they are explicitly set `searchable: false`.

In any case, the text of rich text widgets is always included as lower-priority search text.

### getUrlFields\(\) _\[api\]_

Fields required to compute the `_url` property. Used to implement a "projection" for `_url` if requested by the developer

### beforeChooserModal\(_req_, _data_\) _\[api\]_

Override to modify `data` before it is passed to the `chooserModal.html` template

### addSortifyMigration\(_field_\) _\[api\]_

Most of the time, this is called for you. Any schema field with `sortify: true` will automatically get a migration to ensure that, if the field is named `lastName`, then `lastNameSortified` exists.

Adds a migration that takes the given field, such as `lastName`, and creates a parallel `lastNameSortified` field, formatted with `apos.utils.sortify` so that it sorts and compares in a more intuitive, case-insensitive way.

After adding such a migration, you can add `sortify: true` to the schema field declaration for `field`, and any calls to the `sort()` cursor filter for `lastName` will automatically use `lastNameSortified`. You can also do that explicitly of course.

Note that you want to do both things \(add the migration, and add `sortify: true`\) because `sortify: true` guarantees that `lastNameSortified` gets updated on all saves of a doc of this type. The migration is a one-time fix for existing data.

### addSlugPrefixMigration\(\) _\[api\]_

### pushAssets\(\) _\[browser\]_

### pushDefineSingleton\(\) _\[browser\]_

### pageBeforeSend\(_req_\) _\[browser\]_

Before sending any page, create the singleton for working with this type of piece, but only if there is an active user

### getCreateSingletonOptions\(_req_\) _\[browser\]_

## API Routes

### POST /modules/apostrophe-doc-type-manager/chooser

### POST /modules/apostrophe-doc-type-manager/chooser-choices

### POST /modules/apostrophe-doc-type-manager/relationship-editor

### POST /modules/apostrophe-doc-type-manager/autocomplete

