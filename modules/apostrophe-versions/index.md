---
title: apostrophe-versions (module)
layout: reference
module: true
namespaces:
  browser: true
children:
  - browser-apostrophe-versions
  - browser-apostrophe-versions-editor
---

# index

## Inherits from: [apostrophe-module](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/modules/apostrophe-module/index.html)

### `apos.versions`

Provides versioning for all docs in Apostrophe. Every time a doc is updated, a new version of it is created in the `aposVersions` collection. A UI is provided for viewing past versions and rolling back to them.

Versions contain only properties that are not marked as unsafe for rollback.

For space reasons, older versions are gradually pruned to be more sparse \(infrequent\) as you go back in time, however an attempt is made to preserve most transitions between different individuals editing content.

## Methods

### enableCollection\(_callback_\) _\[api\]_

### ensureIndexes\(_callback_\) _\[api\]_

### docAfterSave\(_req_, _doc_, _options_, _callback_\) _\[api\]_

### pruneOldVersions\(_doc_, _callback_\) _\[api\]_

Prune old versions so that the database is not choked with them. If a version's time difference relative to the previous version is less than 1/24th the time difference from the newest version, that version can be removed. Thus versions become more sparse as we move back through time. However if two consecutive versions have different authors we never discard them because we don't want to create a false audit trail. -Tom

### revert\(_req_, _version_, _callback_\) _\[api\]_

Revert to the specified version. The doc need not be passed because it is already in version.\_doc.

### find\(_req_, _criteria_, _options_, _callback_\) _\[api\]_

Searches for versions.

The callback is invoked like this:

callback\(null, versions\)

The most recent version is first in the array.

options.skip and options.limit may be used to paginate. If options.compare is set, then for each version .\_changes will be set to an array of changes since the preceding version in the result set.

Permissions for the document associated with the returned versions are checked. Any attempt to retrieve multiple versions from different documents will result in an error.

The .\_doc property of each version is set to the document.

### compare\(_req_, _doc_, _version1_, _version2_, _callback_\) _\[api\]_

Compares two versions and returns a description of the differences between them. The description is an array of objects, which may contain nested `changes` arrays when changed properties are areas or schema arrays. version2 is assumed to be the newer version. The doc is examined to determine what schema to use.

## API Routes

### POST /modules/apostrophe-versions/versions-editor

### POST /modules/apostrophe-versions/compare

### POST /modules/apostrophe-versions/revert

