---
title: "apostrophe-admin-bar (module)"
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-admin-bar
---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.adminBar`
The admin bar module implements Apostrophe's admin bar at the top of the screen. Any module
can register a button (or more than one) for this bar by calling the `add` method of this
module. Buttons can also be grouped into dropdown menus and restricted to those with
particular permissions. [apostrophe-pieces](../apostrophe-pieces/index.html) automatically
takes advantage of this module.

On the browser side there are also conveniences to implement jQuery handlers for these
menu items.

## Methods
### add(*name*, *label*, *permission*, *options*)
Add an item to the admin bar.

The name argument becomes the value of the `data-apos-admin-bar-item`
attribute of the admin bar item.

`permission` should be a permission name such as `admin`
(the user must be a full admin) or `edit-apostrophe-event`
(the user can create events and edit their own). If
`permission` is null then being logged in is
good enough to see the item. (Securing your actual routes that
respond to these items is up to you.)

Usually just one admin bar item per module makes sense, so it's
common to pass `self.__meta.name` (the module's name) as the name argument.

For example, the pieces module does this:

```javascript
self.apos.adminBar.add(self.__meta.name, self.pluralLabel, 'edit')
```

If you have an `events` module that subclasses pieces, then this
creates an admin bar item with a data-apos-admin-item="events" attribute.

Browser side, you can call `apos.adminBar.link('item-name', function() { ...})`
to conveniently set up an event handler that fires when this button is clicked.
Or, if you wish to create an ordinary link, you can pass the `href` option
as part of the `options` object (fourth argument).

You can use the `after` option to specify an admin bar item name
this item should appear immediately following.
### group(*items*)
Group several menu items together in the interface (currently
implemented as a dropdown menu). If `items` is an array of menu
item names, then the group's label is the same as the label of
the first item. If you wish the label to differ from the label
of the first item, instead pass an object with a `label` property
and an `items` property.
### afterInit()
Like the assets module, we wait as long as humanly possible
to lock down the list of admin bar items, so that other modules
can bicker amongst themselves even during the `modulesReady` stage.
When we get to `afterInit`, we can no longer wait! Order and
group the admin bar items.
### orderItems()
Implement the `order` option. This insertion sort results
in putting everything otherwise unspecified at the end, as desired.
Items with the `last: true` option are moved to the end before the
explicit order is applied.

Called by `afterInit`
### groupItems()
Marks items that have been grouped via the `groups` option — or via
`group` calls from modules, combined with the `addGroups` option —
with a `menuLeader` property and ensures that the items in a group
are consecutive in the order. We'll figure out the final menus at
render time so we can handle it properly if an individual
user only sees one of them, etc. Called by `afterInit`
### pushAssets()

### itemIsVisible(*req*, *item*)
Determine if the specified admin bar item object should
be rendered or not, for the given req; based on item.permission
if any. `req.user` is guaranteed to exist at this point.
## Nunjucks template helpers
### output()
Render the admin bar. If the user is not able to see any items,
nothing is rendered
