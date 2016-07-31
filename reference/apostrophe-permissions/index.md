---
title: "apostrophe-permissions (module)"
children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)

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

Actions begin with a verb, followed by a hyphen and an
object type. For example:

`edit-doc`, `view-doc`, `publish-doc`, `edit-file`

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
### apply(*req*, *data*, *doc*, *propagator*, *callback*) *[api]*
Given a request object for a user with suitable permissions, a data
object with loginRequired, loginRequiredPropagate and docPermissions
properties, and a doc object, this method will sanitize and apply
those permissions settings to the doc and also propagate them to
descendant docs if it is requested.

Propagation is only performed if a "propagator" function is passed.
This function will be called like the update method of a mongodb
collection, except without the first argument. You supply a
wrapper function that does the actual MongoDB update call with
criteria that match your descendant docs.

The entries in the data.docPermissions array may be strings such
as "view-xxx" where xxx is a user or group ID, or they may be
objects in which such a string is the "value" property, and the
"removed" and "propagate" properties may also be present.

This method does NOT actually save the doc object itself, although
it does update its properties, and it does directly modify
descendant docs if propagation is requested. It is your responsibility
to save the doc object itself afterwards.

"data" is usually req.body, however it may be convenient to call
this method from tasks as well.

This method is designed to work with the data property created
by apos.permissions.debrief on the browser side.
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
### add(*req*, *doc*, *permission*) *[api]*
Adds the given permission to the given doc for the
user associated with the given request. Does not update
the doc in the database; you need to do that.

Currently this only makes sense with things that use the "doc"
strategy (pretty much everything except files), and the
verbs that will work are `view`, `edit` and `publish`.

For things that use the "owner" strategy, just set ownerId.
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
