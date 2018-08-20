---
title: "apostrophe-assets (module)"
layout: reference
module: true
namespaces:

children:

---
## Inherits from: [apostrophe-module](../apostrophe-module/index.html)
### `apos.assets`
This module provides minification and delivery of browser-side assets
such as stylesheets and javascript.

**You'll want to call the
`pushAsset` method of *your own* module**, which takes advantage
of the services provided by this module thanks to
the [apostrophe-module](../apostrophe-module/index.html) base class.

Apostrophe implements two "asset scenes," `anon` and `user`. When
you call `self.pushAsset('script', 'myfile', { when: 'user' })`, that
script is normally pushed only to logged-in users. When you call
`self.pushAsset('script', 'myfile', { when: 'always' })`, that script is
pushed to everyone, logged in or not.

If you want assets that are normally available only to logged-in users
for a particular page, set `req.scene = "user;"` and that particular
page will render with the full set of assets. This is useful if you wish
to use apostrophe schema-based forms on a page for anonymous site visitors.

This module also pushes most of Apostrophe's standard front-end assets,
notably `jQuery`, `lodash`, `async`, `moment`, `moog` and a polyfill for `setImmediate`.
You may assume all of these are available in the browser at all times.

Other assets are pushed by individual core modules that require them.

## Options:

### `minify`

If set to true, both stylesheets and scripts are combined into a single file
and unnecessary whitespace removed to speed delivery. It is strongly recommended
that you enable this option in production, and also in staging so you can see
any unexpected effects. If this option is undefined, the APOS_MINIFY
environment variable is consulted.

### `static`

Pass options to the [express.static](https://expressjs.com/en/4x/api.html#express.static)
middleware, such as `Cache-Control` and more. If no options are defined,
the default options from the middleware will be used. Please note you might want
to define different options depending on your environment. You could for example
set `max-age` only for production to ensure fresh files during development.
Example:

```js
{
  static: {
    maxAge: '1y',
    etag: false
  }
}
```


## Methods
### setDefaultStylesheets()

### setDefaultScripts()

### setAssetTypes()

### setTypeMap()

### determineGeneration()

### enableBundles()
Initialize services required for asset bundles. Obtains the
self.generations mongodb collection and extracts a bundle if
appropriate.
### extractBundleIfAppropriate()
Extract an asset bundle if appropriate. The default implementation
looks for an APOS_BUNDLE=XYZ environment variable and, if present, extracts
a bundle with the name XYZ
### uploadfsBundleCleanup()
Clean up old asset bundles in uploadfs, if any, after a
suitably safe interval allowing services such as Heroku to
shut down old instances that might be using them
### extractBundle(*name*)
Extract the named asset bundle, as created by the
apostrophe:generation task with the --create-bundle=NAME
option. An asset bundle is just a folder from which files are
recursively copied into the project root folder in a production
environment after deployment, allowing minified assets to be
provided to a server via a separate folder in git rather than
cluttering the dev environment with them
### push(*type*, *name*, *options*, *context*)
This method pushes assets to be delivered to the browser
on every page load.

You should be calling the pushAsset method of your module,
not this one. It is part of the implementation of the
pushAsset method of apostrophe-module, the base class
of all modules.

But if you really wanted to, you'd have to do this...

self.pushAsset('stylesheet', 'foo', {
  when: 'always'
},
{
  dirname: '/path/to/module',
  name: 'apostrophe-modulename',
})


Stylesheets are loaded from the module's public/css folder.

Scripts are loaded from the module's public/js folder.

Do not supply the file extension.

It is acceptable to push an asset more than once. Only one copy
is sent, at the earliest point requested.

Returns true if an acceptable source file or function for the asset
exists, otherwise false.
### purgeExcept(*pattern*, *exceptSubstring*)
Purge files from public folder matching the glob pattern
`pattern`, excepting those with names containing
`exceptSubstring`.
### afterInit(*callback*)
Wait until the last possible moment - after all modules
have been initialized, *and* notified of each other's
initialization - to symlink public/modules subdirectories,
build master LESS files, and minify (if desired). This
allows other modules to wait until they can talk to
each other (modulesReady) before pushing assets.
### ensureFolder(*root*)
Ensure that the standard asset folders exist at project level,
notably `public` (the web-accessible folder) and `public/modules`
(where symbolic links to the `public` subdirectories of Apostrophe modules are automatically
created by `symlinkModules`). If `root` is not set, the root
of the project is assumed.
### symlinkModules(*callback*)
Ensure that `public/modules/modulename` points to exactly the
same content as `lib/modules/modulename/public`. On platforms that
support symbolic links for non-administrators, use them. On platforms
that don't, make a recursive copy. (This poses no significant
performance problem for Apostrophe's assets, which are modest
in size. If you were hoping to push huge files as permanent
static assets this way, well... complain to Microsoft.)
### getAssetRoot()
Get the effective project root folder. This will be the actual
project root folder except when creating an asset bundle to be
unpacked later
### linkAssetFolder(*from*, *to*)
Create or refresh a symbolic link from
the path "from" to the existing, actual folder
"to". If symbolic linking is unavailable on this
platform (Windows), recursively copy instead.

Note that "to" is the EXISTING, REAL thing, so
the recursive copy actually duplicates "to"
in "from". Counterintuitive, but that's because
we're thinking in terms of a symbolic link.
### linkAssetFolderOnUnix(*from*, *to*)
Create or refresh a symbolic link from
the path "from" to the existing, actual folder
"to" on Unix-derived platforms (not Windows).

If we are creating an asset bundle to deploy
to production, we'll copy everything instead.
### linkAssetFolderOnWindows(*from*, *to*)

### removeThenRecursiveCopy(*from*, *to*)
Remove the existing folder or symlink `to` and then recursively copy
the contents of `from` to it, creating a new folder at `to`.
### recursiveCopy(*from*, *to*)
Copy the existing folder at `from` to the new folder `to`.
If `to` already exists files are added or overwritten as appropriate
and files not present in `from` are left intact.
### syncToUploadfs(*from*, *to*, *callback*)
Copy the existing local folder at `from` to the uploadfs folder `to`.
(uploadfs doesn't really have folders per se, so this just means
prefixing the filenames with "to" plus a slash.)

WARNING: if `to` already exists, any contents that don't also appear in `from`
are removed.
### enumerateCopies(*from*, *to*)
Given a local folder (the public/ subdir of an asset bundle)
and an uploadfs path (where it will later be web-accessible),
return an array of copies that must be performed, with `from`
and `to` properties
### buildLessMasters(*callback*)

### minify(*callback*)

### outputAndBless(*callback*)

### forAllAssetScenes(*each*, *callback*)
Iterate over all asset scenes. Right now just anon, user
### minifySceneAssetType(*scene*, *type*, *minifier*, *callback*)
Minify assets required for a particular scene and populate
self.minified appropriately. Supports dot notation in "scene"
for scene upgrades. Implements md5-based caching for the really
expensive javascript minification step.
### minifyStylesheet(*stylesheet*, *callback*)

### minifyScript(*script*, *callback*)
Minify a single JavaScript file (via the script.file property)
### compileStylesheet(*stylesheet*, *callback*)

### filterAssets(*assets*, *when*, *minifiable*)
Part of the implementation of self.afterInit, this method
returns only the assets that are suitable for the specified
scene (`user` or `anon`). Duplicates are suppressed automatically
for anything rendered from a file (we can't do that for things
rendered by a function).

If minifiable is true you get back the assets that can be minified;
if set false you get those that cannot; if it is not specified
you get both.
### getChain(*name*)
Fetch an asset chain by name. Note that the
name of the chain for a project-level override
of the "foo" module is "my-foo". Otherwise it
is the name of the module.
### pushDefaults()

### modulesReady()

### pushConfigured()

### splitWithBless(*filename*, *content*)

### enableCsrf()

### enableHtmlPageId()

### enablePrefix()

### enableLessMiddleware()

### prefixCssUrls(*css*)
Prefix all URLs in CSS with the global site prefix
### prefixCssUrlsWith(*css*, *prefix*)
Prefix all URLs in CSS with a particular string
### servePublicAssets()

### assetUrl(*web*)
Given the site-relative URL an asset would have when hosting assets locally,
return the asset URL to be used in script or link tags. Often the same, but
when APOS_S3_BUNDLE is in effect it can point elsewhere
### getCoreAposProperties(*when*)

### generationTask(*callback*)
This task is primarily implemented by the logic in afterInit, however
if we are sending a bundle to uploadfs this is a fine time to do
that part.
### stylesheetsHelper(*when*)
Implementation of stylesheeets helper, as a method for
easier use of super pattern to extend it. See the
documentation for the stylesheets helper. Name is
suffixed to avoid a conflict with a property.
### scriptsHelper(*when*)
Implementation of scripts helper, as a method for
easier use of super pattern to extend it. See the
documentation for the scripts helper. Name is
suffixed to avoid a conflict with a property.
## Nunjucks template helpers
### stylesheets(*when*)
apos.assets.stylesheets renders markup to load CSS that
is needed on any page that will use Apostrophe.

`when` can be set to either `user` or `anon` and signifies
whether a user is logged in or not; when users are
logged in editing-related stylesheets are sent,
otherwise not.

The `when` parameter is made available to your page templates, so typically you
just write this in your base layout template in the head element:

`{{ apos.assets.stylesheets(data.when) }}`

See `outerLayout.html` in the templates module.
### scripts(*when*)
apos.assets.scripts renders markup to load JS that
is needed on any page that will use Apostrophe.

`when` can be set to either `user` or `anon` and signifies
whether a user is logged in or not; when users are
logged in editing-related scripts are sent,
otherwise not.

The `when` parameter is made available to your page
templates, so typically you just write this in
outerLayout.html:

`{{ apos.assets.scripts(data.when) }}`

See `outerLayout.html` in the templates module.

apos.assets.scripts also creates the apos object,
with its prefix property, so that beforeCkeditor.js
and other third party loaders can see the prefix
even before our own javascript is loaded.
### templates(*when*)
Removed in 2.x, however a nonfunctional version
did appear at first in 2.x, so we provide
an empty function for bc in case someone calls it.
