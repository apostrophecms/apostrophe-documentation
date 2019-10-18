---
title: "How do I add an Intranet to my site?"
layout: tutorial
---

Many websites feature an "Intranet" section which is exclusively for employees. ApostropheCMS offers ways to accomplish this.

Let's say you want to lock down the `/intranet` page **and all of its child pages** to require an account for viewing. Follow these steps:

1. Log in, with editing privileges (as an admin for example).
2. Go to `/intranet`.
3. Click "Page Menu" in the lower left corner.
4. Click "Page Settings."
5. Click "Permissions," the last tab in the list at left.
6. Change the "Who can view this?" dropdown from "Public" to "Login Required."
7. Change the "Apply permissions to subpages now" dropdown from "No" to "Yes."
8. Click "Save."

When you click "Save," the permissions of the `/intranet` page will be locked down to require an account for viewing, and these permissions will *also be copied at this time to all subpages.*

Now, if you haven't already, you can add user accounts that can view the pages. Accounts that can edit content can already view the pages.

You can also add users whose privileges *only* extend to viewing these pages. To do that, select "Users" from the admin bar. *In our demo site, it is grouped under "Meta." Your admin bar grouping may vary.*

Here in the "Users" dialog box, click "Add User."

Be sure to set the first name, last name, username and password for the user. For the "Permission Group" field, choose "Guest." A "guest" user can view pages that have the "login required" setting, but can't do anything else.

> If you don't see "Permission Group" as a field when editing a user, your site may be configured with editable groups rather than a hardcoded, simplified dropdown list of groups. If your site is set up with editable groups, edit the list of groups associated with the user and select the "Guest" group. If you do not have a "Guest" group yet, create one, and give it the "guest" permission. Then you can add users to that group. For more information, see the [permissions tutorial](../intermediate/permissions.md).

Once you save the user, they can log in and browse the `/intranet` pages.

## What if only certain users should be able to view certain pages?

In this case, you will need to take two steps:

1. You must transition to editable groups, if you have not done so already. Remove the `groups` option from your project-level `apostrophe-users` module configuration. For more
information about this, see the [permissions tutorial](../intermediate/permissions.md).

2. Add users to groups intended to provide access to specific parts of the site, naming the groups to suit your needs. Give each of these groups the "guest" permission.  

3. Edit the Page Settings of the relevant pages. Click on the "Permissions" tab, then change "Login REquired" to "Certain People."

4. You will now be able to browse and select specific groups that are allowed to view these pages.

You may use the "copy these permissions to subpages now" option to copy that setting to all subpages *on a one-time basis.* After that you may change the settings of the individual pages to be more nuanced if you wish.

## Giving users a chance to log in if they try to access `/intranet`

By default, users who attempt to visit `/intranet` without logging in first will see a "404 Not Found" error. This is a security feature. ApostropheCMS *shares as little information as possible about things users are not supposed to know about.* Some would consider revealing the existence of the Intranet to be a security issue.

However, you can loosen this rule if you want to. Just install and configure the [second chance login module](redirecting-after-login.md). When you do that, ApostropheCMS will offer a login prompt to the user when they try to access a locked-down page without logging in. After logging in, they will immediately see the page they wanted. If the user still does not have the right permissions after logging in, then they will see the "Page Not Found" message.

## How can we suppress the admin bar for "guest" users?

The admin bar contains the "Logout" button, and users must have a way to log out. So by default, Apostrophe gives them a way to access that. However, you can provide your own logout link and remove the admin bar by following this technique:

* In your layout, provide your own link to log out.

```
{% if data.user %}
  <a href="/logout">Log Out</a>
{% endif %}
```

* In `lib/modules/apostrophe-login/index.js`, at **project level** (NEVER alter `node_modules/apostrophe`, that is NOT necessary), override the single method that adds the logout button to the admin bar. Do NOT copy and paste the entire file:

```javascript
// in lib/modules/apostrophe-login/index.js
module.exports = {
  construct: function(self, options) {
    self.addAdminBarItems = function() {};
  }
}
```
