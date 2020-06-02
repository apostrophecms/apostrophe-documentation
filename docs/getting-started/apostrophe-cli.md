# The Apostrophe CLI

As shown [in "Creating your first project,"](creating-your-first-project.md) ApostropheCMS
has a command line tool to help take care of potentially repetative tasks such
as creating projects and modules. Let's take a closer look at some of the
options. If you aren't interested in using the CLI, simply continue on to the
next section.

::: tip INFO
As a reminder, the CLI tool is installed as a global npm module.

```bash
npm install -g apostrophe-cli
```
:::

Let's review the commands.

## Create a project

To create a new project:
```bash
apos create-project <shortname-without-spaces>
```

This will create a local copy of our standard
[Apostrophe Boilerplate](https://github.com/apostrophecms/apostrophe-boilerplate).

`<shortname-without-spaces>` represents the "shortname" of the application. It
will be used by default as a MongoDB database name and a basis for cookie names,
 etc. You will find this as the `shortName` property in `app.js`.

### options

**`--boilerplate`**

Run `create-project` with a `--boilerplate` flag to start from a Github
repository other than the standard `apostrophe-boilerplate` repo. For example,
to create a project using the
[Open Museum](https://github.com/apostrophecms/apostrophe-open-museum) demo:

```bash
apos create-project my-museum-clone --boilerplate=https://github.com/apostrophecms/apostrophe-open-museum.git
```

If you run the `create-project` command with the `--setup` flag, the command
will also `npm install` the dependencies for the project and run
`apostrophe-users:add` to create an admin user for the CMS, resulting in a fully
 bootstrapped project. This command will prompt you for a password for the admin
  user being created.

## Create a piece type module
To create the necessary files and basic configuration for a new Apostrophe piece
type, run the following command from within your Apostrophe project's root
directory:

```bash
apos create-piece vegetable
```

You must then register `'vegetables': {}` in `apps.js` in the `modules`
object for it to start with the application.

### options

**`--pages`**

If you run the `create-piece` command with the `--pages` flag, the command will
also set up a corresponding [pieces-pages module](/core-concepts/reusable-content-pieces/browsing-directory-of-pieces) with your new piece type.

```bash
apos create-piece vegetable --pages
```

**`--widgets`**

Similarly, you can run the `create-piece` command with the `--widgets` flag,
which will also set up a corresponding [pieces-widgets module](/core-concepts/reusable-content-pieces/displaying-pieces-with-widgets.html#displaying-pieces-with-widgets) along with your new
piece type. These flags can be used together or separately.

```bash
apos create-piece vegetable --widgets
```

So to create a piece type with both pages and widgets modules, you would run:

```bash
apos create-piece vegetable --pages --widgets
```


::: tip NOTE
Be sure to use the *singular* version of the name of your content type. That
will let the CLI attempt to set the piece type's `name`, `label`, and
`pluralLabel` properties appropriately. The Apostrophe convention is for the
`type` property of piece documents in the database to be singular (because they
are a singular thing) and for the `name` of the piece *type* module to be plural
(because it is used to create all the pieces of that type).

As an example, this command:
```bash
apos create-piece dog
```
would generate this metadata:
```javascript
// lib/modules/index.js
module.exports = {
  name: 'dog',
  extend: 'apostrophe-pieces',
  label: 'Dog',
  pluralLabel: 'Dogs',
  addFields: []
};
```

Do some words not pluralize using "s"? Yes, that's true. This
function of the CLI is meant to help speed up your process in most cases, but in
some cases it won't make sense. You can always manually change the module
directory and those initial properties yourself.

The CLI is continually in development and these will be considerations for
future work on it.
:::

## Create a widget module
To generate the necessary files and basic configuration for a new Apostrophe
widget module, run the following command from within your Apostrophe project's
root directory:

```bash
apos create-widget fancy-button
```

::: tip NOTE
The CLI will automatically append `-widgets` to the end of your module name for
you. Apostrophe expects widget modules to end with `-widgets` when they are used
in templates.
:::

You will then need to register this widget module in `app.js` so it is
available to your project. The same is true for all commands that generate
specific or general module types.

```javascript
// app.js
module.exports = {
  modules:
    // ...
    'fancy-button-widgets': {},
    // ...
  }
}
```

## Create a basic Apostrophe module
Sometimes you may want a module that isn't strictly related to displaying
content in a template. To generate the necessary files and basic configuration
for a brand-new Apostrophe module that doesn't extend one of the base types,
such as pieces or widgets):
```bash
apos create-module <module name>
```

Remember to register the module in `apps.js` as with the other module types.
