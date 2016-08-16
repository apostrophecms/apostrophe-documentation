---
title: "apostrophe-users (module)"
layout: module
children:
  - server-apostrophe-users-cursor
  - browser-apostrophe-users
  - browser-apostrophe-users-editor-modal
  - browser-apostrophe-users-manager
  - browser-apostrophe-users-create-modal
  - browser-apostrophe-users-manager-modal
  - browser-apostrophe-users-chooser
  - browser-apostrophe-users-chooser-modal
  - browser-apostrophe-users-relationship-editor
---
## Inherits from: [apostrophe-pieces](../apostrophe-pieces/index.html)

## Methods
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

