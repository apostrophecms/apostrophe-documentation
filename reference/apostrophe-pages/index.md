---
title: "apostrophe-pages (module)"
layout: module
children:
  - server-apostrophe-pages-cursor
  - browser-apostrophe-pages
  - browser-apostrophe-pages-editor
  - browser-apostrophe-pages-editor-update
  - browser-apostrophe-pages-reorganize
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.pages`
This module manages the page tree and contains the wildcard
Express route that actually serves pages. That route is installed
at the very end of the process, in an `afterInit` callback,
which is late enough to allow all other modules to add routes first.

Also implements parked pages, "plain old page types" (those that aren't
powered by a module), the context menu (big gear menu) and the publish menu.

## Options

**`types`: specifies the page types that can be chosen for a page.** This list must
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

**`contextMenu`: specifies the default offerings on the context menu.** These
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

**`publishMenu`: configures the publication menu,** which appears
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
check out the [apostrophe-custom-pages](../apostrophe-custom-pages/index.html)
module, which all page types extend, including "ordinary" pages.

**`park`: configures certain pages to be automatically created and refreshed
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

**`filters`: Apostrophe cursor filters applied when fetching the current page.**
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

See the [apostrophe-pages-cursor](server-apostrophe-pages-cursor.html) type for additional
cursor filters and options you might wish to configure, such as adding
a `depth` option to `children`.


## Methods
### pushAssets() *[browser]*

### getCreateSingletonOptions(*req*) *[browser]*

### find(*req*, *criteria*, *projection*) *[api]*
Obtain a cursor for finding pages. Adds filters useful for
including ancestors, descendants, etc.
### insert(*req*, *parentOrId*, *page*, *options*, *callback*) *[api]*
Insert a page as a child of the specified page or page ID.

The `options` argument may be omitted completely. If
`options.permissions` is set to false, permissions checks
are bypassed.
### docAfterDenormalizePermissions(*req*, *page*, *options*, *callback*) *[api]*
This method pushes a page's permissions to its subpages selectively based on
whether the applyToSubpages choice was selected for each one. It also copies
the `loginRequired` property to subpages if the `applyLoginRequiredToSubpages`
choice was selected.

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

### move(*req*, *movedId*, *targetId*, *position*, *callback*) *[api]*
Move a page already in the page tree to another location.
position can be 'before', 'after' or 'inside' and
determines the moved page's new relationship to
the target page.

The callback receives an error and, if there is no
error, also an array of objects with _id and slug
properties, indicating the new slugs of all
modified pages.
### moveToTrash(*req*, *_id*, *callback*) *[api]*
Accepts `req`, `_id` and `callback`.

Delivers `err`, `parentSlug` (the slug of the page's
former parent), and `changed` (an array of objects with
_id and slug properties, including all subpages that
had to move too).
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
self.pageAfterMove = function(req, moved, info, callback) {
  // eventually invoke callback
};
Route that serves pages. See afterInit in
index.js for the wildcard argument and the app.get call
### serveGetPage(*req*, *callback*) *[api]*

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

### pruneCurrentPageForBrowser(*page*) *[api]*
A limited subset of page properties is pushed to
browser-side JavaScript. If you want more you
should make your own req.browserCalls
### docFixUniqueError(*req*, *doc*) *[api]*
Invoked via callForAll in the docs module
### updateDescendantsAfterMove(*req*, *page*, *originalPath*, *originalSlug*, *callback*) *[api]*

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

## API Routes
### POST /modules/apostrophe-pages/editor
Render the editor for page settings
### POST /modules/apostrophe-pages/fetch-to-insert
Fetch data needed to edit and ultimately insert a page
### POST /modules/apostrophe-pages/insert

### POST /modules/apostrophe-pages/fetch-to-update
Fetch data needed to edit and ultimately update a page
### POST /modules/apostrophe-pages/update

### POST /modules/apostrophe-pages/move

### POST /modules/apostrophe-pages/move-to-trash

### POST /modules/apostrophe-pages/get-jqtree

### POST /modules/apostrophe-pages/reorganize

### POST /modules/apostrophe-pages/info

