---
title: Migrating from A2 Version 0.4
---

Migrating version 0.4 isn't that hard, but there are some changes you'll need to make, otherwise your content will seem to vanish. Which is very distressing, I'm sure you'll agree.

* In `package.json`, change all dependencies on modules with names starting with `apostrophe` from `0.4.x` to 0.5.x`. Change any dependency on `uploadfs` or `sanitize-html` to `1.x`.

* Run `npm update`.

* Back up your database if there is no other copy (you should test this entire process in a dev environment, never with your live production site).

* Migrate your data:

```
    node app apostrophe:migrate
```

**Without the migration step you'll wonder where your content went.**

* In your templates, replace all occurrences of `.areas` with the empty string. Be thorough. This one will dog you if you don't catch them all.

* In your templates, replace all occurrences of `.typeSettings.tags` with `.withTags`.

* Replace all other occurrences of `.typeSettings` with the empty string.

* In your project level .js files (NOT the Apostrophe core modules), carry out the same replacements.

* In `outerLayout.html`, calls like this:

```
aposSnippetsMenu({ edit: edit })
```

Should become simply:

```
aposSnippetsMenu(permissions)
```

IMPORTANT: this change applies to the modules based on snippets, like `blog`, `events` and your custom subclasses. It DOES NOT apply to `aposMediaMenu` and other things unrelated to snippets.

* In `outerLayout.html`, *after* the `apos-admin-bar` div, add the new context menu:

```
{{ aposPagesMenu({ contextMenu: contextMenu, page: page, bottom: true }) }}
```

You can also tuck it inside the admin bar div and pass `bottom: false`. We recommend letting it appear in the lower left corner as it will with `bottom: true`.

That should do it! For much less common issues, see the [official bc break notices in the Apostrophe google group](https://groups.google.com/forum/#!searchin/apostrophenow/bc$20break).
