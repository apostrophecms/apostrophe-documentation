---
title: "apostrophe-permissions (module)"
layout: reference
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.permissions`
This module manages the permissions of docs in Apostrophe.


## Methods
### can(*req*, *action*, *object*) *[api]*
Determines whether the active user "can" carry out the
action specified by "action". Returns true if the action
is permitted, false if not permitted.
This object emits a `can` event that provides an easy way to
extend permissions. The `can` event receives the request object, the
action, the object, and a `result` object with a `response` property
which is what will be returned by `can` if no changes are made.
To alter the result, just change `result.response`.

Actions begin with a verb, followed by a hyphen and a
doc type name.

If there is no third argument, the question is whether this user can
perform the action in question to create a new object.

If there is a third argument, this method checks whether the user can
carry out the specified action on that particular object.
### criteria(*req*, *action*) *[api]*
Returns a MongoDB criteria object which will match only objects
on which the current user is permitted to perform the
specified action.
### addPublic(*permission*) *[api]*
Add a permission everyone gets in the generic case, even if
not logged in. It is useful to add edit-files, for instance, to
allow file uploads by anonymous users for apostrophe-moderator.

View permissions are handled separately.
### setPublic(*permissions*) *[api]*
Set all the public permissions at once. Pass an array of
actions, like this: [ 'edit-file' ]

View permissions are handled separately.
### annotate(*req*, *action*, *objects*) *[api]*
For each object in the array, if the user is able to
carry out the specified action, a property is added
to the object. For instance, if the action is "edit-doc",
each doc the user can edit gets a "._edit = true" property.

Note the underscore.

This is most often used when an array of objects the user
can view have been retrieved and we wish to know which ones
the user can also edit.
### getEffectiveUserId(*req*) *[api]*
Returns a user ID which is unique for this logged-in user, or if the user
is not logged in, an ID based on their session which will continue to be
available for as long as their session lasts
### add(*permission*) *[api]*
Register a new permission, so that it can be selected for
groups and so on. Call any time before `modulesReady`
(it's fine to call in your module's `afterConstruct`).

The argument should be an object with `value` and `label` properties.
`value` is the permission name, such as `edit-attachment`.
`label` is a short label such as `Edit Attachment`.
### _check(*req*, *action*, *event*, *_true*, *_false*, *object*, *then*) *[api]*

### userPermissionNames(*user*, *names*) *[api]*
Given a permission name, this method appends the user ID and
the user's group IDs to each one and returns the resulting
array. For instance, if the user's ID is xyz and the user
is in groups with IDs abc and def, and this method is invoked
for the permission name "edit", the return value will be:

[ "edit-xyz", "edit-abc", "edit-def" ]

Permissions with such names are stored in the .docPermissions
property of each doc.

Permission names that imply "edit" are also included,
for instance "publish-xyz" is also good enough.

Used internally to implement self.apos.permissions.criteria().
### getChoices() *[api]*
Return an array of permissions, as objects with `value` and `label`
properties. Suitable for creating a UI to select permissions for
a group, for instance. Do NOT call before `modulesReady` (hint:
patch your schema field in `modulesReady`).
