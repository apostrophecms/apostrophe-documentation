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
looks for instances of `apostrophe-user`.

A user's permissions are determined by their membership in groups. See the
join with `apostrophe-group` in the schema.

Groups are managed by the `apostrophe-groups` module.

There is also a simplified permissions model in which you just specify
an array of `groups` as an option to `apostrophe-users`, and a single-select
dropdown menu allows you to pick one and only one of those groups for each user.
The properties of each group in the array are `name`, `label` and
`permissions`, which is an array of permission names such as `guest`, `editor` and
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

### ensureSafeCollection(*callback*)

### ensureSafeIndexes(*callback*)

### afterConvert(*req*, *piece*, *callback*)

### docBeforeInsert(*req*, *doc*, *callback*)

### docBeforeUpdate(*req*, *doc*, *callback*)

### insertOrUpdateSafe(*req*, *doc*, *action*, *callback*)

### hashPassword(*doc*, *safeUser*, *callback*)

### verifyPassword(*user*, *password*, *callback*)
when do you look for an orphan in the safe?
TO DO:  we write a task to find orphans which runs periodically
and checks for large discrepencies between updatesAts of docs
and corresponding users in the safe
### deduplicateTrash(*req*, *piece*, *callback*)
Reflect email and username changes in the safe after deduplicating in the piece
### deduplicateRescue(*req*, *piece*, *callback*)
Reflect email and username changes in the safe after deduplicating in the piece
### ensureGroups(*callback*)
Since users are never piublished,
if you are deliberately fetching users,
we assume you don't care if they are published.
### ensureGroup(*group*, *callback*)

### requirePiece(*req*, *res*, *next*)

### initializeCredential()

### addFromTask(*callback*)

### changePasswordFromTask(*callback*)

## API Routes
### POST /modules/apostrophe-users/unique-username

