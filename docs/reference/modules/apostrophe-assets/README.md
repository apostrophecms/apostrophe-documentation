# apostrophe-assets
## Inherits from: [apostrophe-module](../apostrophe-module/README.md)
### `apos.assets`
This module provides minification and delivery of browser-side assets
such as stylesheets and javascript.

**You'll want to call the
`pushAsset` method of *your own* module**, which takes advantage
of the services provided by this module thanks to
the [apostrophe-module](../apostrophe-module/README.md) base class.

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

Set for you automatically if `APOS_BUNDLE=1` or `APOS_MINIFY=1` in the environment.

If set to true, both stylesheets and scripts are combined into a single file
and unnecessary whitespace removed to speed delivery. It is strongly recommended
that you enable this option in production, and also in staging so you can see
any unexpected effects.

It never makes sense to run with no minified assets in production.

### `lean`

If this option is set to `true`, Apostrophe will *not* push any assets to an anonymous, logged-out site visitor, except for those pushed with `{ when: 'lean' }`. By default this includes only a tiny subset of the `apos.utils` library with necessary services to make widget players possible, with no library dependencies.

Note that this means assets pushed with `{ when: 'always' }` will *not* be received, except by logged-in users.

There are also no widget players, except for modules that allow you to opt in to a lean widget player by passing the `player: true` option when configuring those modules. This is currently supported by `apostrophe-video-widgets`.

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

### `uploadfsBundleCleanup`

If explicitly set to `false`, the mechanism that otherwise removes stale
uploadfs static asset bundles five minutes after launch is disabled.
See [Deploying Apostrophe in the Cloud with Heroku](/devops/deployment/deploying-apostrophe-in-the-cloud-with-heroku.md)
for more information.

## Additional Environment Variables

### `APOS_BUNDLE`

Set APOS_BUNDLE=1 for a simple way to handle copying static assets to the cloud in production.

First run this task in a production environment:

`APOS_BUNDLE=1 node app apostrophe:generation`

Then make sure the variable is also set when running actual production instances of the site:

`APOS_BUNDLE=1 node app`

If in your environment the bundle has already been extracted and the
root directory is now read-only, you can use this additional environment
variable to avoid an error from `tar`:

`APOS_BUNDLE=1 APOS_EXTRACT_BUNDLE=0 node app`

Alternatively, if you specified an explicit bundle name to `--create-bundle` when using `apostrophe:generation`,
stored it to git and deployed it, you can specify that bundle name as the value of APOS_BUNDLE. But this is
more work; we recommend the easy way.

### `APOS_BUNDLE_IN_UPLOADFS`

Legacy. For use when `APOS_BUNDLE` is set to an explicit bundle name but you still wish static asset URLs to be
generated to reference those files via uploadfs. But this is the hard way; just run `apostrophe:generation` with
APOS_BUNDLE=1, and also set `APOS_BUNDLE=1` in the environment when launching Apostrophe. That's really all you
have to do.
See [Deploying Apostrophe in the Cloud with Heroku](/devops/deployment/deploying-apostrophe-in-the-cloud-with-heroku.md) for more information.

### `APOS_BUNDLE_CLEANUP_DELAY`

If set to a number of milliseconds, Apostrophe delays that long before
cleaning up obsolete static asset bundles in uploadfs. The default
is 5 minutes. The assumption is that all production servers have received
the new deployment and finished serving any straggler HTTP requests 5 minutes after
a new version is first launched.
See [Deploying Apostrophe in the Cloud with Heroku](/devops/deployment/deploying-apostrophe-in-the-cloud-with-heroku.md)
for more information.


## Methods
### setDefaultStylesheets()

### setDefaultScripts()

### setAssetTypes()

### setTypeMap()

### determineGenerationFromDb()
If self.simpleBundle is true, determine the current asset generation via the database and
set `self.generation` accordingly. If we are running the generation task in that situation,
set the generation id in the database. In all other cases, determine the generation via legacy methods.
### determineGeneration()
Determine the current asset generation identifier (self.generation) and prep the
bundle folder, if any is needed.
### determineDevGeneration()
Return an asset generation identifier for dev use only.
By default the pid (which is constant just for the lifetime
of this process) is used.
### mkdirp(*path*)

### enableBundles()
Initialize services required for asset bundles. Obtains the
self.generations mongodb collection and extracts a bundle if
appropriate.
### extractBundleFromGenerationCollection()
Extracts the appropriate asset bundle from uploadfs if we are using simple bundles
and this is not a command line task.

Returns a promise. Called on the modulesReady event.

If the APOS_EXTRACT_BUNDLE environment variable is set to the string "0" this
does not take place. That is useful when the bundle has already been extracted
by other means and the filesystem is no longer writable (for instance, platform.sh).
### extractBundleIfAppropriate()
This method supports the less common case where an explicit bundle name
is in APOS_BUNDLE and it should be extracted from the filesystem. The
more common case, APOS_BUNDLE=1, is implemented elsewhere. The name of
this method is kept for bc reasons.
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
### ensureNamespace(*folder*)
Namespaced npm package names look like @foo/bar,
so we might need to create @foo before we can create bar.
This method's job is to abstract this detail away from the
symlink and recursive copy methods.
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

### getStylesheetsMasterBase()

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

If `options: lean` is true, "always" is treated as "user".
This maintains bc in the logged-in experience without pushing anything
unnecessary to the lean logged-out experience.

Regardless of the `lean` module-level option, anything pushed as
"lean" is delivered to both the "anon" and "user" scenes. This
provides an upgrade path for gradual migration to `lean: true`.
### pushConfigured()
Override pushConfigured so that self configured assets are always served,
unless specified otherwise
### setWhenIfNotConfigured(*item*, *defaultWhen*)
If "when" is not specified, specify a default
### getChain(*name*)
Fetch an asset chain by name. Note that the
name of the chain for a project-level override
of the "foo" module is "my-foo". If namespaced
and a project level override, it is "@namespace/my-foo".
Otherwise it is the name of the module.
### pushDefaults()

### modulesReady()

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
when APOS_BUNDLE is in effect it can point elsewhere
### getCoreAposProperties(*when*)

### generationTask(*callback*)
This task is primarily implemented by the logic in afterInit, however
if we are sending a bundle to uploadfs this is a fine time to do
that part.
### getUploadfsBundleTempName()

### getUploadfsBundlePath()

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
### uploadfs()
Override point to use a separate uploadfs instance, for
instance in a multisite project with shared assets
### pushCreateSingleton()

### getGenerationPath()

### getThemedGeneration()

### getThemed(*s*)

### getThemeName()
Can be overridden by modules like apostrophe-multisite
to namespace minified asset bundles and LESS masters.
Env var option is for unit testing only
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

```markup
{{ apos.assets.stylesheets(data.when) }}
```

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

```markup
{{ apos.assets.scripts(data.when) }}
```

See `outerLayout.html` in the templates module.

apos.assets.scripts also creates the apos object,
with its prefix property, so that beforeCkeditor.js
and other third party loaders can see the prefix
even before our own javascript is loaded.
### templates(*when*)
Removed in 2.x, however a nonfunctional version
did appear at first in 2.x, so we provide
an empty function for bc in case someone calls it.
