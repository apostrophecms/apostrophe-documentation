---
title: "apostrophe-users (module)"
layout: module
children:
  - server-apostrophe-users-cursor
  - browser-apostrophe-users-editor-modal
  - browser-apostrophe-users
  - browser-apostrophe-users-chooser
  - browser-apostrophe-users-relationship-editor
  - browser-apostrophe-users-manager-modal
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)
The `apostrophe-users` module provides user accounts. It is **not** intended to
be extended with new subclass modules. The `apostrophe-login` module only
looks for instances of `apostrophe-user`. Of course you may implicitly subclass
it at project level (not changing the name) in order to alter its behavior.

A user's permissions are determined by their membership in groups. See the
join with `apostrophe-group` in the schema.

Groups are managed by the `apostrophe-groups` module.

There is also a simplified permissions model in which you just specify
an array of `groups` as an option to `apostrophe-users`, and a single-select
dropdown menu allows you to pick one and only one of those groups for each user.
The properties of each group in the array are `name`, `label` and
`permissions`, which is an array of permission names such as `guest`, `edit` and
`admin`. If you specify the `groups` option when configuring
`apostrophe-users`, the admin interface for `apostrophe-groups` will hide itself.

### Public "staff directories" vs. users

In our experience, combing the concept of a "user" who can log in and do things
with the concept of a "staff member" who appears in a staff directory is more
trouble than it is worth. That's why the `published` field is not present in
`apostrophe-users`. You can add it back in, but then you have to deal with
the confusing concept of "users" who shouldn't actually be allowed to log in.

So for a staff directory, we suggest you create a separate `employee` module
or similar, extending `apostrophe-pieces`, unless it's true that basically
everyone should be allowed to log in.


## Methods
### addOurTrashPrefixFields()
Add `username` and `email` to the list of fields that automatically get uniquely prefixed
when a user is in the trash, so that they can be reused by another piece. When
the piece is rescued from the trash the prefix is removed again, unless the username
or email address has been claimed by another user in the meanwhile.
### ensureSafe(*callback*)
Index and obtain access to the `aposUsersSafe` MongoDB collection as `self.safe`.
### ensureSafeCollection(*callback*)
Obtain the `aposUsersSafe` MongoDB collection as `self.safe`.
### ensureSafeIndexes(*callback*)
Index the safe.
### afterConvert(*req*, *piece*, *callback*)
After a user is updated, check to see if the `groups` option is configured for
simplified user management. If it is, convert the single-select choice made
via `piece.group` to an array stored in `groupIds`, so that all other code
can find groups in a consistent way.
### docBeforeInsert(*req*, *doc*, *callback*)
For security, on **ANY** insert of a doc, we check to see if it is
an `apostrophe-user` and, if so, hash the password, remove it from the doc
and store the hash in the safe instead.
### docBeforeUpdate(*req*, *doc*, *callback*)
For security, on **ANY** update of a doc, we check to see if it is
an `apostrophe-user` and, if so, hash the password, remove it from the doc
and store the hash in the safe instead.
### insertOrUpdateSafe(*req*, *doc*, *action*, *callback*)
Insert or update a user's record in the safe, which stores the
password hash completely outside of the `aposDocs` collection.
First checks to be sure this is an `apostrophe-user` and invokes
its callback immediately if not. Invoked by `docBeforeInsert`
and `docBeforeSave`.
### hashPassword(*doc*, *safeUser*, *callback*)
Hash the `password` property of `doc`, then delete that property
and update the `passwordHash` property of `safeUser`. This method is
called by the `docBeforeSave` handler of this module.
### verifyPassword(*user*, *password*, *callback*)
Verify the given password by checking it against the
hash in the safe. `user` is an `apostrophe-user` doc.
### deduplicateTrash(*req*, *piece*, *callback*)
Reflect email and username changes in the safe after deduplicating in the piece
### deduplicateRescue(*req*, *piece*, *callback*)
Reflect email and username changes in the safe after deduplicating in the piece
### ensureGroups(*callback*)
Ensure the existence of the groups configured via the `groups` option,
if any, and refresh their permissions.
### ensureGroup(*group*, *callback*)
Create and/or refresh a group as specified by the
`groups` option.
### requirePiece(*req*, *res*, *next*)
Extend the standard middleware for the piece-editing routes
so that the `group` single-select property is automatically set
to the id of the first group in `groupIds`. This allows the single-select
dropdown element to work with data that actually lives in an array.
### initializeCredential()
Initialize the [credential](https://npmjs.org/package/credential) module.
### addFromTask(*callback*)
Implement the `apostrophe-users:add` command line task.
### changePasswordFromTask(*callback*)
Implement the `apostrophe-users:change-password` task.
## API Routes
### POST /modules/apostrophe-users/unique-username
A route which accepts a `username` POST parameter and responds
with `{ status: 'ok', available: true}` if that username is
NOT TAKEN, otherwise `{ status: 'ok', available: false }`.
If `status` is not `ok` then an error occurred. Used to help
users discover available usernames when creating accounts.
