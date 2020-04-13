# Fine-grained Permissions for Pieces

In our [Permissions section](/tutorials/core-concepts/users-and-permissions/README.md), you can learn more about managing permissions for pages with options like "Login Required," or to "Certain People", and so on. This feature is also available for pieces. By default, it is disabled because it is not used as often.

To enable it for your module, just set `permissionsFields: true` in `lib/modules/people/index.js`:

```javascript
// lib/modules/your-piece/index.js
module.exports = {
  extend: 'apostrophe-pieces',
  permissionsFields: true,
  // ... other settings ...
};
```
