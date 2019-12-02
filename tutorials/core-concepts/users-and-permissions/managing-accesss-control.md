---
title: Managing Access Control
layout: tutorial
---

# Managing Access Control

Next you'll learn about several models for using permissions in Apostrophe with three different levels of complexity.

In most cases, you'll have essentially three levels of permissions: the administrator, the editor, and the guest ––– sometimes you might even skip the editor. However, if that isn't enough, you have have the option to create custom permissions schemes with more control over exactly who has access to what.

## Standard Permissions

Out of the box, you have two user groups: guest and admin. For some deployments, with a small team working on a simple site, this might be all you need, but usually you're going to want at least one more role in between. For these cases, you can use the `edit` permission.

To review, before we create a new group, these are the three permissions you have out of the box:

**`guest`** the user can sign into the site, but has no editing or management ability.

**`edit`** gives a group the ability to create all types of pieces, edit any content they create, and they can be assigned as page editors for specific pages by an admin.

**`admin`** gives a group the ability to manage all aspects of the site that can be managed through the UI.

{% hint style='info' %}
An admin can lock any piece type as `adminOnly` which will remove the ability of users with the `edit` permission (or otherwise customized permissions) to create or edit pieces of that type.
{% endhint %}

Now, let's add an editor role in `app.js`.

### Example: Creating Group Permissions

Groups in Apostrophe are define in `app.js` inside of the `apostrophe-users` module. To demonstrate this, let's define three groups: `guest`, with no permissions; `editor`, with the `edit` permission; and `admin` with the `admin` permission.

{% hint style='info' %}
In this example, we're using group names that match or coincide pretty closely with the permission names, but you can name the groups anything you want, so long as you provide the appropriate permissions.
{% endhint %}

1. Open `app.js`

2. Find the `modules` section and add an `apostrophe-users` block like the one below:

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
  modules: {
  	...
    'apostrophe-users': {
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
    }
    ...
  }
```
{% endcode-tabs-item %}
{% endcode-tabs %}

![](/.gitbook/assets/user-add-editor.png)

Now you can create new users in the *editor* group, which will have the ability to create new content and mange the content they create, but will lack the great power --- and subsequent responsibility --- of the admin role.

## Advanced permissions: creating custom groups, assigning permissions for pieces

{% code-tabs %}
{% code-tabs-item title="app.js" %}
```javascript
`apostrophe-users': {}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

*Well, that was easy.*


For these situations, Apostrophe has a convention for permissions that supplies `edit-` and `admin-` prefixes for modules. Using these you can create "editors" and "administrators" for different modules and tools.

So, for example, you can create a group, and provide it with the `edit-apostrophe-rich-text-widgets` permission, which lets them create, edit, and delete content in the rich text editor, and create another group with the `admin-apostrophe-rich-text-widgets` permission, which provides full access to all users accessible aspects of the `apostrophe-rich-text` module.



However, since groups in the dropdown menu are mutually exclusive, you need a more flexible way to manage groups and their permissions.

Here's how to do it: just remove the `groups` property!

You don't have to use the `groups` option of `apostrophe-users` at all, not even when you first create your site. If you choose not to use that option, you can "bootstrap" your first group with this command:

```bash
node app apostrophe-groups:add admin admin
```

This will create a group called `admin` (the first argument), with the `admin` permission (the second argument). You may list as many permissions as you wish, separated by spaces. If a group has the `admin` permission, all other permissions are implied, so don't bother to give them out separately.

Once you do this, the `apostrophe-groups` module, which has been politely working in the background until now, appears in its own right on the admin bar.

Now you can create groups, just like any other kind of piece (although you must be an `admin` already to do so). You can check off boxes to add permissions to those groups. And you can add people to those groups, by editing the user and typing the names of groups — it's exactly like adding individual pieces to a pieces widget.

{% hint style='info' %}
#### Creating a site with custom groups from the very beginning

You don't have to use the `groups` option of `apostrophe-users` at all, not even when you first create your site. If you choose not to use that option, you can "bootstrap" your first group with this command:

```bash
node app apostrophe-groups:add admin admin
```

This will create a group called `admin` (the first argument), with the `admin` permission (the second argument). You may list as many permissions as you wish, separated by spaces. If a group has the `admin` permission, all other permissions are implied, so don't bother to give them out separately.
{% endhint %}

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