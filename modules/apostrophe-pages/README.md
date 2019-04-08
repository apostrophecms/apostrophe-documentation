## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
### `apos.pages`
This module manages the page tree and contains the wildcard
Express route that actually serves pages. That route is installed
at the very end of the process, in an `afterInit` callback,
which is late enough to allow all other modules to add routes first.

Also implements parked pages, "plain old page types" (those that aren't
powered by a module), the context menu (big gear menu) and the publish menu.

## Options

### `types`

Specifies the page types that can be chosen for a page.** This list must
include all page types that will be present in the tree (not piece types).

The default setting is:

```javascript
 types: [
   {
     name: 'home',
     label: 'Home'
   },
   {
     name: 'default',
     label: 'Default'
   }
 ]
```

The `home` page type is required.

### `allowedHomepageTypes`

An array of page type names that are permitted for
the homepage. This should be a subset of the types that appear in the
`types` option. Example:

```javascript
allowedHomepageTypes: [ 'home' ]
```

If this option is not specified, the homepage may be switched to any type
present in `types`.

### `allowedSubpageTypes`

An array of page type names that are allowed
**when adding a subpage of a page of each type.** If this array is empty,
you **cannot** add a subpage to a page of that type. Example:

```javascript
allowedSubpageTypes: {
  home: [ 'default', 'blog-page' ],
  default: [ 'grandchild' ],
  grandchild: []
}
```

If subpages are not specified for a type, then it may have subpages
of **any type** present in `types`.

### `contextMenu`

Specifies the default offerings on the context menu.** These
can also be overridden for any request by setting `req.contextMenu` to an array
in the same format.

The default setting is:

```javascript
contextMenu: [
  {
    action: 'insert-page',
    label: 'New Page'
  },
  {
    action: 'update-page',
    label: 'Page Settings'
  },
  {
    action: 'versions-page',
    label: 'Page Versions'
  },
  {
    action: 'trash-page',
    label: 'Move to Trash'
  },
  {
    action: 'reorganize-page',
    label: 'Reorganize',
    // Until we port the provisions for non-admins to reorganize
    // over from 0.5
    permission: 'admin'
  }
]
```

The `action` becomes a `data-apos-ACTIONGOESHERE` attribute on the
menu item. If `permission` is set, the item is only shown to users
with that permission (this is NOT sufficient protection for the
backend routes it may access, they must also be secured).

### `publishMenu`

Configures the publication menu,** which appears
only if the current page is unpublished or `data.pieces` is present
and is unpublished. Syntax is identical to `contextMenu`. The default
setting is:

```javascript
publishMenu: [
  {
    action: 'publish-page',
    label: 'Publish Page'
  }
]
```

Again, you can override it by setting `req.publishMenu`.

If you are looking for the schema fields common to all pages in the tree,
check out the [apostrophe-custom-pages](https://docs.apostrophecms.org/apostrophe/modules/apostrophe-custom-pages)
module, which all page types extend, including "ordinary" pages.

### `park`

Configures certain pages to be automatically created and refreshed
whenever the site starts up.** The parked pages you get are actually the
concatenation of the `minimumPark` and `park` options.

`minimumPark` has a default, which you will typically leave unchanged:

```javascript
[
  {
    slug: '/',
    published: true,
    _defaults: {
      title: 'Home',
      type: 'home'
    },
    _children: [
      {
        slug: '/trash',
        type: 'trash',
        trash: true,
        published: false,
        orphan: true,
        _defaults: {
          title: 'Trash'
        },
      }
    ]
  },
]
```

* The `park` and `minimumPark` options are arrays. Each array is a
page to be created or recreated on startup.

* If a page has a `parent` property, it is created as a child
of the page whose `slug` property equals `parent`. If a page has no
`parent` property and it is not the home page itself, it is created as a
child of the home page.

* Any other properties that do not begin with a `_` are automatically
refreshed on the page object in the database at startup time.

* RECOMMENDED: give every parked page a `parkedId` property which
is unique among your parked pages. If you do this, you will be
able to change the slug property later. If you don't, changing
the slug property will result in two pages, because it is being
used to identify the existing parked page. You MAY add this property
later, but you MUST DO IT BEFORE you change `slug` (not at
the same time).

* If a page has a `_children` array property, these are additional parked pages,
created as children of the page.

* The properties of the `_default` option are applied to the page object *only
at creation time*, meaning that changes users make to them later will stick.

* `orphan: true` prevents a page from appearing in standard navigation links based
on parent-child relationships
(as opposed to hand-built navigation widgets powered by joins and the like).

* The "page settings" UI is evolving toward not allowing users to
modify properties that are explicitly set via `park` (rather than being set once
via `_defaults`). In any case such properties are reset by restarts.

### `filters`

Apostrophe cursor filters applied when fetching the current page.**
The default settings ensure that `req.data.page` has a `_children` property
and an `_ancestors` property:

```javascript
{
  // Get the kids of the ancestors too so we can do tabs and accordion nav
  ancestors: { children: true },
  // Get our own kids
  children: true
};
```

See the [apostrophe-pages-cursor](https://docs.apostrophecms.org/apostrophe/modules/apostrophe-pages/server-apostrophe-pages-cursor) type for additional
cursor filters and options you might wish to configure, such as adding
a `depth` option to `children`.

### `home`

Apostrophe populates the home page from `req.page._ancestors[0]` if possible.
If not, Apostrophe fetches the home page separately, using the same filters configured for
ancestors. You can shut this extra query off:

```javascript
{
  home: false
}
```

In addition, if ancestors are not configured, Apostrophe assumes you want the children
of the home page. You can shut that off, and still get the home page:

```javascript
{
  home: {
    children: false
  }
}
```

### `deleteFromTrash`

If set to `true`, Apostrophe offers a button in the
"reorganize" view to permanently delete pages that are already in the trash.**
This option defaults to `false` because, in our experience, customers usually
ask for a way to "un-empty the trash," and of course there isn't one. We don't
recommend enabling the feature on a permanent basis but it can be useful during
the early stages of site population.


## Methods
### pushAssets() *[browser]*

### getCreateSingletonOptions(*req*) *[browser]*

### find(*req*, *criteria*, *projection*) *[api]*
Obtain a cursor for finding pages. Adds filters useful for
including ancestors, descendants, etc.
### findForBatch(*req*, *criteria*, *projection*) *[api]*
Returns a cursor that finds pages the current user can edit
in a batch operation, including unpublished and trashed pages.
### insert(*req*, *parentOrId*, *page*, *options*, *callback*) *[api]*
Insert a page as a child of the specified page or page ID.

The `options` argument may be omitted completely. If
`options.permissions` is set to false, permissions checks
are bypassed.

If no callback is supplied, a promise is returned.
### withLock(*req*, *fn*) *[api]*
Takes a function, `fn`, which expects a callback and performs
some operation on the page tree. Returns a new function that
does exactly the same thing, but obtains a lock first and
releases it afterwards.

Nested locks for the same `req` are permitted, in order to allow
inserts or moves that are triggered by `afterMove`, `beforeInsert`, etc.

If fn passes a second argument to its callback, that argument
is passed on.
### lock(*req*, *callback*) *[api]*
Lock the page tree.

The lock must be released by calling the `unlock` method.
It is usually best to use the `withLock` method instead, to
invoke a function of your own while the lock is in your
possession, so you don't have to keep track of it.

Nested locks are permitted for the same `req`.
### unlock(*req*, *callback*) *[api]*
Release a page tree lock obtained with the `lock` method.
Note that it is safest to use the `withLock` method to avoid
the bookkeeping of calling either `lock` or `unlock` yourself.
### docAfterDenormalizePermissions(*req*, *page*, *options*, *callback*) *[api]*
This method pushes a page's permissions to its subpages selectively based on
whether the applyToSubpages action was selected. It also copies
the `loginRequired` property to subpages in that situation.

Both additions and deletions from the permissions list can be propagated
in this way.

This requires some tricky mongo work to do it efficiently, especially since we
need to update both the join ids and the denormalized docPermissions array.

The applyToSubpages choice is actually a one-time action, not a permanently
remembered setting, so the setting itself is cleared afterwards by this
method.

This method is called for us by the apostrophe-docs module on update
operations, so we first make sure it's a page. We also make sure it's
not a new page (no kids to propagate anything to).
### newChild(*parentPage*) *[api]*
This method creates a new object suitable to be inserted
as a child of the specified parent via insert(). It DOES NOT
insert it at this time. If the parent page is locked down
such that no child page types are permitted, this method
returns null. The permissions of the new child page match
the permissions of the parent.
### allowedChildTypes(*page*) *[api]*
Return an array of child page type names permitted
given the specified parent page. If page is null,
allowable type names for the home page are returned.
### isAllowedChildType(*page*, *type*) *[api]*
Return true if the given type name is allowable for a child
of the given page. If page is null, this method returns true
if the given type name is allowable for the home page.
### move(*req*, *movedId*, *targetId*, *position*, *options*, *callback*) *[api]*
Move a page already in the page tree to another location.

position can be 'before', 'after' or 'inside' and
determines the moved page's new relationship to
the target page.

The callback receives an error and, if there is no
error, also an array of objects with _id and slug
properties, indicating the new slugs of all
modified pages.

*Less commonly used features*

These are mainly for use by modules that extend Apostrophe's model layer,
such as `apostrophe-workflow`.

The `options` argument may be omitted entirely.

If `options.criteria` is present, it is merged with
all MongoDB criteria used to read and write the database in `self.move`.
If `options.filters` is present, those filters are invoked
on any Apostrophe cursor find() calls used to read and write the database in `self.move`.

In addition, `options` is passed back to the callback as a third argument,
which is useful to detect recursive scenarios that come up in the
workflow module.

`options` is also passed back to the `movePermissions` method,
and passed as the `options` property of the `info` parameter of `afterMove`.

After the moved and target pages are fetched, the `beforeMove` method is invoked with
`req, moved, target, position, options` and an optional callback.

`beforeMove` may safely modify top-level properties of `options` without an impact
beyond the exit of the current `self.move` call. If modifying deeper properties, clone them.

If `callback` is omitted, returns a promise.
### movePermissions(*req*, *moved*, *data*, *options*, *callback*) *[api]*
Based on `req`, `moved`, `data.moved`, `data.oldParent` and `data.parent`, decide whether
this move should be permitted. If it should not be, throw an error.
This is invoked with `callAll`, so other methods may implement it and
may optionally take a callback as a second argument, in which case errors
should be passed to the callback rather than thrown.

`options` is the same options object that was passed to `self.move`, or an empty object
if none was passed.
### beforeMove(*req*, *moved*, *target*, *position*, *options*, *callback*) *[api]*
Override this method to alter the `options` object before
the `move` method carries out a move in the page tree
### afterMove(*req*, *moved*, *info*, *callback*) *[api]*
Invoked after a page is moved. Override to carry out
aditional actions
### moveToTrash(*req*, *_id*, *callback*) *[api]*
Accepts `req`, `_id` and `callback`.

Delivers `err`, `parentSlug` (the slug of the page's
former parent), and `changed` (an array of objects with
_id and slug properties, including all subpages that
had to move too). If the `trashInSchema: true` option was
set for the module, `parentSlug` is still provided
although the parent does not change, and `changed` is
still provided although the slugs of the descendants
do not change.
### trashInSchema(*req*, *_id*, *toTrash*, *callback*) *[api]*
"Move" a page to the trash by just setting its trash flag
and keeping it under the same parent. Called by `moveToTrash`
when the `trashInSchema` flag is in effect. The home page
still cannot be moved to the trash even in this mode.
Trashes descendant pages as well.

See `moveToTrash` for what the callback receives.
### deduplicatePages(*req*, *pages*, *toTrash*, *callback*) *[api]*

### rescueInTree(*req*, *_id*, *callback*) *[api]*
Rescue a page previously trashed via `trashInSchema`. This is an operation that only
makes sense when the `trashInSchema` option flag is set for the module.
Rescues descendants as well. Invokes its callback with `(null, parentSlug, changed)`,
where:

`parentSlug` is the slug of the parent of the page rescued, for consistency
with the `moveToTrash` method, although the parent does not change;

`changed` is an array of descendant pages whose trash status also changed,
with `_id` and `slug` properties.
### moveToSharedTrash(*req*, *_id*, *callback*) *[api]*
Implements `moveToTrash` when `trashInSchema` is false (the default),
by moving the page inside the trashcan page. See `moveToTrash`
for what the callback receives.
### deleteFromTrash(*req*, *_id*, *callback*) *[api]*
Empty the trash (destroy a page in the trash permanently).

Currently you must specify the _id of a single
page, however if it has descendants they are also destroyed.

If the page does not exist or is not in the trash an error is reported.

Delivers (err, parentSlug) to the callback.
### update(*req*, *page*, *options*, *callback*) *[api]*
Update a page. The `options` argument may be omitted entirely.
if it is present and `options.permissions` is set to `false`,
permissions are not checked.
### park(*pageOrPages*) *[api]*
Ensure the existence of a page or array of pages and
lock them in place in the page tree.

The `slug` property must be set. The `parent`
property may be set to the slug of the intended
parent page, which must also be parked. If you
do not set `parent`, the page is assumed to be a
child of the home page, which is always parked.
See also the `park` option; typically invoked via
that option when configuring the module.
### serve(*req*, *res*) *[api]*
Route that serves pages. See afterInit in
index.js for the wildcard argument and the app.get call
### serveGetPage(*req*, *callback*) *[api]*

### removeTrailingSlugSlashes(*req*, *slug*) *[api]*
Remove trailing slashes from a slug. This is factored out
so that it can be overridden, for instance by the
apostrophe-workflow module.
### serveLoaders(*req*, *callback*) *[api]*

### serveNotFound(*req*, *callback*) *[api]*

### serveDeliver(*req*, *err*) *[api]*

### pageBeforeSend(*req*, *callback*) *[api]*
This method invokes `pushCreateSingleton` to create the `apostrophe-pages`
browser-side object with information about the current page, and also
sets `req.data.home`. It is called automatically every
time `self.sendPage` is called in any module, which includes normal CMS pages,
404 pages, the login page, etc.

This allows non-CMS pages like `/login` to "see" `data.home` and `data.home._children`
in their templates.

For performance, if req.data.page is already set and it contains a
`req.data._ancestors[0]._children` property, that information
is leveraged to avoid redundant queries. If not, a query is made.

For consistency, the home page is always retrieved using the same filters that
are configured for `ancestors`. Normally that includes children of each
ancestor. If that is explicitly reconfigured without the `children` option,
you will not get `data.home._children`.
### isFound(*req*) *[api]*
A request is "found" if it should not be
treated as a "404 not found" situation
### getServePageFilters() *[api]*

### matchPageAndPrefixes(*cursor*, *slug*) *[api]*

### evaluatePageMatch(*req*) *[api]*

### ensureIndexes(*callback*) *[api]*

### ensurePathIndex(*callback*) *[api]*

### getPathIndexParams() *[api]*

### ensureLevelRankIndex(*callback*) *[api]*

### getLevelRankIndexParams() *[api]*

### pruneCurrentPageForBrowser(*page*) *[api]*
A limited subset of page properties is pushed to
browser-side JavaScript. If you want more you
should make your own req.browserCalls or override
this method. Don't push gigantic joins if you don't
want slow pages
### docFixUniqueError(*req*, *doc*) *[api]*
Invoked via callForAll in the docs module
### updateDescendantsAfterMove(*req*, *page*, *originalPath*, *originalSlug*, *options*, *callback*) *[api]*
Update the paths and slugs of descendant pages,
changing slugs only if they were
compatible with the original slug. Also update
the level of descendants.

On success, invokes callback with
null and an array of objects with _id and slug properties, indicating
the new slugs for any objects that were modified.
### manageOrphans(*callback*) *[api]*

### implementParkAll(*callback*) *[api]*

### implementParkOne(*req*, *item*, *callback*) *[api]*

### unparkTask(*callback*) *[api]*

### mapMongoIdToJqtreeId(*changed*) *[api]*
Routes use this to convert _id to id for the
convenience of jqtree
### docUnversionedFields(*req*, *doc*, *fields*) *[api]*
Invoked by the apostrophe-versions module.

Your module can add additional doc properties that should never be rolled back by pushing
them onto the `fields` array.
### isPage(*doc*) *[api]*
Returns true if the doc is a page in the tree
(it has a slug with a leading /).
### matchDescendants(*page*) *[api]*
Returns a regular expression to match the `path` property of the descendants of the given page,
but not itself
### isAncestorOf(*possibleAncestorPage*, *ofPage*) *[api]*
Returns true if `possibleAncestorPage` is an ancestor of `ofPage`.
A page is not its own ancestor. If either object is missing or
has no path property, false is returned.
### beforeSave(*req*, *page*, *options*, *callback*) *[api]*
Invoked just before a save operation (either insert or update)
on a page is actually pushed to the database. Initially empty for your
overriding convenience.
### beforeInsert(*req*, *page*, *options*, *callback*) *[api]*
Invoked just before an insert operation on a page
is actually pushed to the database. Initially empty for your
overriding convenience.
### beforeUpdate(*req*, *page*, *options*, *callback*) *[api]*
Invoked just before an update operation on a page (not an insert)
is actually pushed to the database. Initially empty for your
overriding convenience.
### addApplyToSubpagesToSchema(*schema*) *[api]*
While it's a good thing that all docs now can have nuanced permissions,
only pages care about "apply to subpages" as a concept when editing
permissions. This method adds those nuances to the permissions-related
schema fields. Called by the update routes (for new pages, there are
no subpages to apply things to yet). Returns a new schema
### registerGenericPageTypes(*callback*) *[api]*
Registers a manager for every page type that doesn't already have one via `apostrophe-custom-pages`,
`apostrophe-pieces-pages`, etc. Invoked by `modulesReady`
### getParkedTypes() *[api]*
Get the page type names for all the parked pages, including parked children, recursively.
### registerGenericPageType(*type*, *callback*) *[api]*
Registers a manager for a specific page type that doesn't already have one via `apostrophe-custom-pages`,
`apostrophe-pieces-pages`, etc. Invoked by `modulesReady` via `registerGenericPageTypes` and
`manageOrphans`
### registerTrashPageType(*callback*) *[api]*

### validateTypeChoices() *[api]*

### addAfterContextMenu(*helper*) *[api]*
bc wrapper for `apos.templates.append('contextMenu', helper)`.
### finalizeControls() *[api]*

### addPermissions() *[api]*

### removeParkedPropertiesFromSchema(*page*, *schema*) *[api]*

### removeSlugFromHomepageSchema(*page*, *schema*) *[api]*
any `slug` field named `slug`. If not, return the schema unmodified.
### getCreateControls(*req*) *[api]*

### getEditControls(*req*) *[api]*

### addToAdminBar() *[api]*

### getBaseUrl(*req*) *[api]*
Returns the effective base URL for the given request.
If Apostrophe's top-level `baseUrl` option is set, it is returned,
otherwise the empty string. This makes it easier to build absolute
URLs (when `baseUrl` is configured), or to harmlessly prepend
the empty string (when it is not configured). The
Apostrophe cursors used to fetch Apostrophe pages
consult this method, and it is extended by the optional
`apostrophe-workflow` module to create correct absolute URLs
for specific locales.
### batchSimpleRoute(*req*, *name*, *change*) *[api]*
Implements a simple batch operation like publish or unpublish.
Pass `req`, the `name` of a configured batch operation, and
and a function that accepts (req, page, data, callback),
performs the modification on that one page (including calling
`update` if appropriate), and invokes its callback.

`data` is an object containing any schema fields specified
for the batch operation. If there is no schema it will be
an empty object.

If `req.body.job` is truthy, replies immediately to the request with
`{ status: 'ok', jobId: 'cxxxx' }`. The `jobId` can then
be passed to `apos.modules['apostrophe-jobs'].start()` on the rowser side to
monitor progress.

Otherwise, replies to the request with { status: 'ok', data: page }
on success. If `ids` rather than `_id` were specified,
`data` is an empty object.

To avoid RAM issues with very large selections and ensure that
lifecycle callbacks like beforeUpdate, etc. are invoked, the current
implementation processes the pages in series.
### allowedSchema(*req*, *page*, *parentPage*) *[api]*
Given a page and its parent (if any), returns a schema that
is filtered appropriately to that page's type, taking into
account whether the page is new and the parent's allowed
subpage types
### modulesReady(*callback*)
When all modules are ready, invoke `registerGenericPageTypes` to register a manager
for any page type that doesn't already have one via `apostrophe-custom-pages`,
`apostrophe-pieces-pages`, etc.
### afterInit(*callback*)
Wait until the last possible moment to add
the wildcard route for serving pages, so that
other routes are not blocked
## Nunjucks template helpers
### menu(*options*)

### publishMenu(*options*)

### isAncestorOf(*possibleAncestorPage*, *ofPage*)

### afterContextMenu()

### createControls()
Emit controls section of page create modal: the cancel/save buttons, etc.
### editControls()
Emit controls section of page editor modal: the cancel/save buttons, etc.
## API Routes
### POST /modules/apostrophe-pages/editor
Render the editor for page settings
### POST /modules/apostrophe-pages/fetch-to-insert
Fetch data needed to edit and ultimately insert a page
### POST /modules/apostrophe-pages/insert

### POST /modules/apostrophe-pages/fetch-to-update
Fetch data needed to edit and ultimately update a page
### POST /modules/apostrophe-pages/update

### POST /modules/apostrophe-pages/fetch-to-copy
Fetch data needed to copy a page.
### POST /modules/apostrophe-pages/copy
Fetch data needed to insert a copied page. Currently identical to insert
except that the parent page id is determined differently
### POST /modules/apostrophe-pages/move

### POST /modules/apostrophe-pages/move-to-trash

### POST /modules/apostrophe-pages/rescue-from-trash

### POST /modules/apostrophe-pages/delete-from-trash

### POST /modules/apostrophe-pages/get-jqtree

### POST /modules/apostrophe-pages/reorganize

### POST /modules/apostrophe-pages/chooser-modal

### POST /modules/apostrophe-pages/info

### POST /modules/apostrophe-pages/publish
Implement the publish route, which can publish
one page (via req.body._id) or many (via req.body.ids).
The `data` property of the API response will contain the page
only for the `req.body._id` case.
### POST /modules/apostrophe-pages/unpublish
Implement the unpublish route, which can publish
one page (via req.body._id) or many (via req.body.ids).
The `data` property of the API response will contain the page
only for the `req.body._id` case.
### POST /modules/apostrophe-pages/tag
Implement the tag route, which can tag
one page (via `req.body._id`) or many (via `req.body.ids`).
The tags to be added are in the `req.body.tags` array.
### POST /modules/apostrophe-pages/untag
Implement the untag route, which can untag
one page (via `req.body._id`) or many (via `req.body.ids`).
The tags to be removed are in `req.body.tags`.
### POST /modules/apostrophe-pages/trash
Implement the batch trash route, which can trash
many pages (via req.body.ids) and responds with a job id.
### POST /modules/apostrophe-pages/rescue
Implement the batch rescue route, which can rescue
many pages (via req.body.ids) and responds with a job id.
Cannot be invoked when trashInSchema is false, as there
is no sensible way to place them when they return to
the tree - better to drag them out of the trash.
