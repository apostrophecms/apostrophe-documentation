---
title: Users and Groups
layout: tutorial
---

# Users and Groups

One of the biggest questions you need to answer in your design is, "Who's going to be doing what?" And separating concerns so that each user only has access to what they need is vital from a security perspective.

## Really basic permissions

In the getting started tutorials, you saw this in `app.js`:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
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
{% endcode-tabs-item %}
{% endcode-tabs %}

This is Apostrophe's "simplified permissions model." Rather than asking the end user who owns the site to manage groups of people and grant permissions to them, we configure two groups as "standard equipment" for this site, and a simple dropdown menu appears in the settings for each user. Everyone is either a "guest" or an "admin."

A guest can view pages that aren't marked as "Login required" via "Page Settings," because they have the `guest` permission.

And an admin can do... well, everything.

For a surprising number of projects this is all you need.

## Intermediate permissions: adding an "editor" group

When things get a little more complicated, you'll want to add an `editor` group that has the `edit` permission:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

Now members of the editor group are allowed to:

* Create all types of pieces, except those locked down to site-wide admins only with the `adminOnly` option (users and groups, because of the security implications).
* Edit the pieces that they themselves created.
* Edit pages if and when an admin grants them permission to edit that particular page via "Page Settings."

## Advanced permissions: creating custom groups, assigning permissions for pieces

There are also separate `edit` permissions for individual pieces: `edit-blog-post`, `edit-event`, etc. The name of the permission is `edit-` followed by the `name` option of the piece module.

And you can give a group `admin` rights over one specific kind of piece too, by using the `admin-` prefix instead.

However, since groups in the dropdown menu are mutually exclusive, you need a more flexible way to manage groups and their permissions.

Here's how to do it: just remove the `groups` property!

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
`apostrophe-users': {}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

*Well, that was easy.*

Once you do this, the `apostrophe-groups` module, which has been politely working in the background until now, appears in its own right on the admin bar.

Now you can create groups, just like any other kind of piece (although you must be an `admin` already to do so). You can check off boxes to add permissions to those groups. And you can add people to those groups, by editing the user and typing the names of groups — it's exactly like adding individual pieces to a pieces widget.

## Creating a site with custom groups from the very beginning

You don't have to use the `groups` option of `apostrophe-users` at all, not even when you first create your site. If you choose not to use that option, you can "bootstrap" your first group with this command:

```bash
node app apostrophe-groups:add admin admin
```

This will create a group called `admin` (the first argument), with the `admin` permission (the second argument). You may list as many permissions as you wish, separated by spaces. If a group has the `admin` permission, all other permissions are implied, so don't bother to give them out separately.

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