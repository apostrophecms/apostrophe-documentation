# The Apostrophe CLI

As shown [in "Creating your first project,"](creating-your-first-project.md) ApostropheCMS
has a command line tool to help take care of potentially repetative tasks such
as creating projects and modules. Let's take a closer look at some of the
options. If you aren't interested in using the CLI, simply continue on to the
next section.

::: tip INFO
As a reminder, the CLI tool is installed as a global npm module.

```bash
npm install -g @apostrophecms/cli
```
:::

Let's review the commands.

## Create a project

To create a new project:
```bash
apos create <shortname-without-spaces>
```

This will create a local copy of our standard
[Apostrophe Boilerplate](https://github.com/apostrophecms/apostrophe-boilerplate). It will also `npm install` the dependencies for the project and run the `apostrophe-users:add` task to create an admin user for the CMS, resulting in a fully bootstrapped project. It will prompt you for a password for the `admin` user being created.

`<shortname-without-spaces>` represents the "shortname" of the application. It
will be used by default as a MongoDB database name and a basis for cookie names,
 etc. You will find this as the `shortName` property in `app.js`.

### options

**`--starter`**

Run `create` with a `--starter` flag to start from a Github
repository other than the standard `apostrophe-boilerplate` repo. For example,
to create a project using the
[Open Museum](https://github.com/apostrophecms/apostrophe-open-museum) demo:

```bash
apos create my-museum-clone --starter=https://github.com/apostrophecms/apostrophe-open-museum.git
```

## Create a piece type module
To create the necessary files and basic configuration for a new Apostrophe piece
type, run the following command from within your Apostrophe project's root
directory:

```bash
apos add piece vegetable
```

You must then register `'vegetables': {}` in `apps.js` in the `modules`
object for it to start with the application.

### options

**`--page`**

If you run the `add piece` command with the `--page` flag, the command will also set up a corresponding [pieces-pages module](/core-concepts/reusable-content-pieces/browsing-directory-of-pieces) with your new piece type.

```bash
apos add piece vegetable --page
```

**`--widget`**

Similarly, you can run the `add piece` command with the `--widget` flag,
which will also set up a corresponding [pieces-widgets module](/core-concepts/reusable-content-pieces/displaying-pieces-with-widgets.html#displaying-pieces-with-widgets) along with your new piece type. These flags can be used together or separately.

```bash
apos add piece vegetable --widget
```

So to create a piece type with both pages and widgets modules, you would run:

```bash
apos add piece vegetable --page --widget
```


::: tip NOTE
The new Apostrophe CLI tool (`@apostrophecms/cli`) does not attempt to make singular piece type names plural for the *module name* or plural label (`pluralLabel`) property. The previous CLI version did this.

The Apostrophe 2 convention is for the `type` property of piece documents in the database to be singular (because they are a singular thing) and for the `name` of the piece type *module* to be plural (because it is used to create all the pieces of that type). If you wish to use this convention (recommended for legacy projects), make the following two changes after creating a piece type:

1. **Change the directory name to the plural version of the piece type name.** For example, running `apos add piece dog` places the new module configuration at `lib/modules/dog/index.js`. Change the `dog` directory to `dogs` (`lib/modules/dogs/index.js`). Then in the `app.js` modules object you would instantiate the piece type as `dogs: {}` to reflect the module name.
2. **Update the `pluralLabel` property to be the correct plural version of the human-readable label.** In the dog example, the CLI would set `pluralLabel: 'Dog',`. Change that plural label to `'Dogs'`.

You can also choose to use the earlier CLI tool, which attempts to make these plural for you. See the [previous CLI tool documentation for more information](https://www.npmjs.com/package/apostrophe-cli).
:::

## Create a widget module
To generate the necessary files and basic configuration for a new Apostrophe
widget module, run the following command from within your Apostrophe project's
root directory:

```bash
apos add widget fancy-button
```

::: tip NOTE
The CLI will automatically append `-widgets` to the end of your module name for
you since Apostrophe expects widget modules to end with `-widgets`.
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
apos add module <module name>
```

Remember to register the module in `apps.js` as with the other module types.
