# How to update Apostrophe CMS documentation
========================

This project contains [the documentation site](https://docs.apostrophecms.com)
for [ApostropheCMS](https://apostrophecms.com).

You don't need to read this page to read the documentation! [Read the
actual documentation here.](https://docs.apostrophecms.com) This page
is about *contributing to* the documentation.

## Building the docs

### 1. Setup

Clone the repo.

```sh
$ git clone https://github.com/apostrophecms/apostrophe-documentation.git
$ cd apostrophe-documentation
```

Next, install the dependencies for the main Vuepress documentation as well as
for the module documentation generator (see below). The `install` script file
will do both with single command.

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

> First make sure you are not running anything locally on port 3000.

```
./generate
```

NOTE: this will `npm update` the version of `apostrophe` being documented first, so the docs are always for the **latest published release**.

Now commit the changes, as you would if you had made them manually.

### 3. Making edits to other pages

We make changes to other pages by hand and commit them to master.

**If you add a new page,** you will need to edit `docs/.vuepress/config.js` in the root of the project. Otherwise it will not appear in the sidebar navigation.

### 4. Submit for review

First, make sure you've run the documentations locally (`npm run dev`) and
confirmed that your links work properly. Submit your changes as a pull request
on the [apostrophe-documentation](https://github.com/apostrophecms/apostrophe-documentation/)
repository. Please include as much context for the change as is reasonable in
the PR description.

### Note on internal doc links

When creating links in the body of a documentation page that point to another
page of documentation, either make sure the link is relative and pointing to the
`.md` extension OR use the file path starting starting after the `docs`
directory. So you would link to `docs/devops/email.md` with
`[link text](/devops/email.md)`.
