# How to update Apostrophe CMS documentation
========================

This project contains [the documentation site](https://docs.apostrophecms.org)
for [ApostropheCMS](https://apostrophecms.com).

You don't need to read this page just to read the documentation! [Read the
actual documentation here.](https://docs.apostrophecms.org/apostrophe) This page
is about *contributing* to the documentation.

## Building the docs

### 1. Setup

Clone the repo.

```sh
$ git clone https://github.com/apostrophecms/apostrophe-documentation.git
$ cd apostrophe-documentation
```

Next, install the dependencies for the main Vuepress documentation as well as
for the module documentation generator (see below).

```
./install
```

### 2. Updating the modules documentation from the source code

The reference docs for the modules are based on comments inline in the code,
which makes writing reference documentation easy and encourages us to do so.
Comments above the module's source go into the `README.md` for the module's
folder; comments above each method document that method. Helpers, routes and
regular methods (`self.something = function()...`) are all automatically
discovered. Frontend moog classes and methods, too.

Here's how to generate the docs:

> First make sure you are not running anything locally on port 8080.

```
./generate
```

NOTE: this will `npm update` the version of `apostrophe` being documented first, so the docs are always for the **latest published release**.

Now commit the changes, as you would if you had made them manually.

### 3. Making edits to other docs

@TODO: Update this before merging Vuepress work into `master`. Remove other refs
to Gitbook

Right now we're making all edits by hand and committing them to master.

**If you add a new tutorial,** you will need to edit `SUMMARY.md` in the root of the project to add it to the tree structure. Otherwise it will not be discoverable in the navigation.

### 4. Deploying

After generation or manual edits to the documentation, simply commit the changes to `apostrophe-documentation#master` and check http://docs.apostrophecms.org for the changes. Give Gitbook a minute or so to rebuild the site.

*Note on internal doc links* When creating links in the body of a documentation page that point to another page of documentation, make sure the link is relative and pointing to the `.md` extension. After committing, check the gitbook build to make sure it is correctly linking to the gitbook page and not a file in the `apostrophe-documentation` github repo

