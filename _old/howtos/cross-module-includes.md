---
title: Cross-module includes in Nunjucks
---

It is possible to include Nunjucks macros and template files from one module in a template that resides in another, or in a project-level page template, layout template, etc.

The syntax looks like this:

For example, the `apostrophe-schemas` module relies on this feature to allow you to include its macros for use in other modules:

```nunjucks
{% include "schemas:schemaMacros.html" %}
```

Notice we say "schemas" rather than "apostrophe-schemas". This is the "asset name" of the module.

## Asset Names

Each module registers itself for this purpose when it calls `apos.mixinModuleAssets`. By convention, the name of an official Apostrophe module for this purpose is the same as the name of the module, minus the "apostrophe-" prefix if any. The name is always lower-case, with hyphens if necessary.

## Asset names for project-level overrides

If you override the blog module's templates at the project level, the asset name for your override is `my-blog`. If you want to make sure your overrides are respected while using cross-module includes, always use the `my-` prefix. And don't worry: if it doesn't exist, you'll get the original.

