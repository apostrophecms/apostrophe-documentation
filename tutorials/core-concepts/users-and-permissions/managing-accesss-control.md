---
title: Managing Access Control
layout: tutorial
---

# Managing Access Control

In most cases, you'll have essentially three levels of permissions: the administrator, who can do anything; the editor or writer, who can create content, but doesn't have access to configuration or management of the site; and the guest, who can look at all the cool stuff that everyone else makes  ––– sometimes you might even skip the editor. However, if that isn't enough, you have have the option to create custom permissions schemes with more control over exactly who has access to what.

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

Groups are defined in `app.js` inside of the `apostrophe-users` module. To demonstrate this, we'll define three groups: `guest`, with no permissions; `editor`, with the `edit` permission; and `admin` with the `admin` permission.

Note that we're duplicating the two existing groups because we're extending the current configuration of `apostrophe-user`. If you only defined the editor group here, then you would only have an editor group available .

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

So far we've covered two cases: the very basic situation where you really only need admins and guests, and the only slightly less simple situation where you need to add an universal editor group as well. Next, you'll see how to create more specific groups with more granular permissions. 

In addition to the default groups, Apostrophe has a convention for permissions that supplies prefixes like `edit-` and `admin-` for modules. Using these you can create "editors" and "administrators" for specific modules and tools without providing any privileges for anything else..

So, for example, if you have an HR coordinator who needs access to upload important documents to an employee portal, but doesn't need any further access, you could provide the `edit-` and `submit-` permission for files to a group with no other permissions.

### Configuring advanced permissions

To manage these permissions, you'll use the *Groups* menu which is currently hidden from the admin bar. To make the menu option visible, you need to disable `groups` in the `apostrophe-users` module in both `app.js` and in `index.js` for `apostrophe-users`.

1. Open `lib/modules/apostrophe-users/index.js`

2. Remove the `groups [ ]` section.

3. Open `app.js`

4. Remove the `groups [ ]` section from `apostrophe-users`.

Now the graphical group management interface is available, and you can create groups, just like any other kind of piece (although you must be an `admin` already to do so). To test this out, let's create the group for HR that we described above:

### Example: Advanced Groups

1. Click the new *Groups* option on the admin bar.

    ![](/.gitbook/assets/user-group-bar.png)

2. Click *Add Group*.

3. Name the group "HR Coordinator".

4. Select the "Permissions" tab on the left.

5. Scroll down and check the boxes for *Edit: File* and *Submit: File*

    ![](/.gitbook/assets/user-group-permissions.png)

6. Click *Save Group*.

Now the "HR Coordinator" group will be available when creating a user!

{% hint style='info' %}
#### Creating groups with the CLI
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