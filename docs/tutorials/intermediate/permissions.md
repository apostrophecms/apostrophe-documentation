---
title: "Managing permissions for your site"
layout: tutorial
---

So far our tutorials have skimmed over the issue of permissions. Let's take a closer look.

## Really basic permissions

In the getting started tutorials, we saw this in `app.js`:

```javascript
// in app.js
  modules: {
    // This configures the apostrophe-users module to add an admin-level
    // group by default
    'apostrophe-users': {
      groups: [
        {
          title: 'guest',
          permissions: [ 'guest' ]
        },
        {
          title: 'admin',
          permissions: [ 'admin' ]
        }
      ]
    }
  }
```

This is Apostrophe's "simplified permissions model." Rather than asking the end user who owns the site to manage groups of people and grant permissions to them, we configure two groups as "standard equipment" for this site, and a simple dropdown menu appears in the settings for each user. Everyone is either a "guest" or an "admin."

A guest can view pages that are marked as "Login required" via "Page Settings," because they have the `guest` permission.

And an admin can do... well, everything.

For a surprising number of projects this is all you need.

## Intermediate permissions: adding an "editor" group

When things get a little more complicated, you'll want to add an `editor` group that has the `edit` permission:

```javascript
      groups: [
        {
          title: 'guest',
          permissions: [ ]
        },
        {
          title: 'editor',
          permissions: [ 'edit' ]
        },
        {
          title: 'admin',
          permissions: [ 'admin' ]
        }
      ]
```

Now members of the editor group are allowed to:

* Create all types of pieces, except those locked down to site-wide admins only with the `adminOnly` option (users and groups, because of the security implications).
* Edit the pieces that they themselves created.
* Edit pages if and when an admin grants them permission to edit that particular page via "Page Settings."

## Advanced permissions: creating custom groups, assigning permissions for pieces

There are also separate `edit` permissions for individual pieces: `edit-blog-post`, `edit-event`, etc. The name of the permission is `edit-` followed by the `name` option of the piece module.

And you can give a group `admin` rights over one specific kind of piece too, by using the `admin-` prefix instead.

However, since groups in the dropdown menu are mutually exclusive, we need a more flexible way to manage groups and their permissions.

Here's how we do it: just remove the `groups` property!

```javascript
// in app.js
`apostrophe-users': {}
```

*Well, that was easy.*

Once we do this, the `apostrophe-groups` module, which has been politely working in the background until now, appears in its own right on the admin bar.

Now we can create groups, just like any other kind of piece (although we must be an `admin` already to do so). We can check off boxes to add permissions to those groups. And we can add people to those groups, by editing the user and typing the names of groups — it's exactly like adding individual pieces to a pieces widget.

## Checking permissions in your own code

Pieces automatically check for permissions when performing all sorts of operations. But you can check for permissions yourself:

```javascript
if (apos.permissions.can(req, 'download-granola')) {
  // Oh good, this user can download some granola.
}
```

To add `download-granola` to the list of permissions available for groups, you'll want to write:

```javascript
  self.apos.permissions.add({
    value: 'download-granola',
    label: 'Download Granola'
  });
```

As long as you do this in `construct` or `afterConstruct` of your own module, it'll happen soon enough.

If you want those who have the general-purpose `edit` permission to automatically get your permission too, prefix its name with `edit-`.
