# Managing Access Control

In most cases, you essentially have three levels of permissions:

* The administrator (`admin`), who can do anything

* The editor or writer (`edit`), who can create content of all piece types (other than users and groups) and edit pages where specifically granted permission to do so

* The guest (`guest`), who can look at all the cool stuff that everyone else makes

Apostrophe makes it easy to set this up with minimal configuration, but if that isn't enough, you have have the option to create custom permissions schemes with more control over exactly who has access to what.

## Standard Permissions

`apostrophe-boilerplate`, which is the basis for projects created with the CLI, ships with two user groups enabled: `admin` and `guest`. These are configured in the `index.js` for `apostrophe-user`. For some deployments, this might be all you need, but if you need just a little bit more, you can easily add `edit`. To add it, create a new configuration in `index.js` for `apostrophe-users` that overrides the default.

### Example: Creating Group Permissions

1. Open `index.js`

2. Find the `modules` section and add an the `editor` group to the groups block like the one below:


```javascript
  // lib/modules/apostrophe-users/index.js
  module.exports: {
  	...
      groups: [
        {
          title: 'guest',
          permissions: [ ]
        },
        {
          title: 'admin',
          permissions: [ 'admin' ]
        },
        //Add this section for the editor group
        {
          title: 'editor',
          permissions: [ 'edit' ]
        }
      ]
    ...
  }
```

![](/images/assets/user-add-editor.png)

Now you can create new users in the *editor* group, which will have the ability to create new content and manage the content they create, but will lack the great power -- and great responsibility -- of the admin role.

{% hint style='info' %}
An admin can lock any piece type as `adminOnly` which will remove the ability of users with the `edit` permission (or otherwise customized permissions) to create or edit pieces of that type. Users and Groups are automatically locked so that they are only editable by admins.
{% endhint %}


## Advanced permissions: creating custom groups, assigning permissions for pieces

So far we've covered two cases:

* The very basic situation where you really only need administrators and guests

* The only slightly less simple situation where you need to add an universal editor group as well.

Next, you'll learn how to create more specific groups with more granular permissions.

In addition to the default groups, Apostrophe has a convention for permissions that supplies prefixes like `edit-` and `admin-` for modules. Using these you can create "editors" and "administrators" for specific modules and tools without providing any privileges for anything else.

So, for example, if you have an HR coordinator who needs access to upload important documents to an employee portal, but doesn't need any further access, you could provide the "Upload & Crop" permission (which is `edit-attachment` under the hood) to give them permission to upload files.

{% hint style='info' %}

[`apostrophe-worklow`](https://github.com/apostrophecms/apostrophe-workflow) is an optional module which adds workflow features to your site. In order to provide these features, the module modifies aspects of the existing groups, and adds more options for configuring groups. You can learn more about permissions in the [Workflow with permissions section](https://github.com/apostrophecms/apostrophe-workflow#user-content-workflow-with-permissions-limiting-who-can-do-what).

{% endhint %}

### Configuring advanced permissions

To manage these permissions, you'll use the *Groups* menu which is currently hidden from the admin bar. To make the menu option visible, you need to disable `groups` in the `apostrophe-users` module.

1. Open `lib/modules/apostrophe-users/index.js`

2. Remove the `groups [ ]` section.

Now the graphical group management interface is available, and you can create groups, just like any other kind of piece (although you must be an `admin` already to do so). To test this out, let's create the group for HR that we described above:

### Example: Advanced Groups

1. Click the new *Groups* option on the admin bar.

    ![](/images/assets/user-group-bar.png)

2. Click *Add Group*.

3. Name the group "HR Coordinator".

4. Select the "Permissions" tab on the left.

5. Scroll down and check the box for *Upload and Crop*

    ![](/images/assets/user-group-permissions.png)

6. Click *Save Group*.

Now the "HR Coordinator" group will be available when creating a user!

{% hint style='info' %}
#### Creating groups with the CLI
You don't have to use the `groups` option of `apostrophe-users` at all, not even when you first create your site. If you choose not to use that option, you can "bootstrap" your first group with this command:

```bash
node app apostrophe-groups:add admin admin
```

This will create a group called `admin` (the first argument), with the `admin` permission (the second argument). You may list as many permissions as you wish, separated by spaces. If a group has the `admin` permission, all other permissions are implied, so don't bother declaring them separately.
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