# Modules in Apostrophe

Every Apostrophe site is made up of modules. You can browse the complete list at left.

## Overview

Each module provides a particular feature, often including both front and back end code, as well as templates and stylesheets. For instance, the [apostrophe-assets](apostrophe-assets/README.md) module provides core services relating to assets like stylesheets.

Modules are implemented as [moog types](/reference/glossary.md#moog-type), which provide a simple and clean way to write them in an object-oriented style while keeping async programming convenient and providing easy subclassing and overriding.

For convenience, the `apostrophe` npm module contains all of the "core" Apostrophe modules that are necessary for a functioning website.

Some of these, like [apostrophe-docs](apostrophe-docs/README.md), are initialized every time Apostrophe starts up; you can [see that list on github](https://github.com/apostrophecms/apostrophe/blob/2.0/defaults.js). Those modules are initialized first, followed by those you configure in `app.js`, in the order you configure them.

Others, like [apostrophe-pieces](apostrophe-pieces/README.md) and [apostrophe-widgets](apostrophe-widgets/README.md), are "abstract base classes" you can extend to create new modules that provide content types.

[apostrophe-module](apostrophe-module/README.md) is the base class of **all** modules; it provides features that are convenient in almost any module, like [rendering a template from its `views` folder](apostrophe-module/README.md#render), or [pushing assets from its `public` folder](apostrophe-module/README.md#push-asset).

Modules can also be installed via npm, and multiple Apostrophe modules can be [shipped as a single npm module via moog bundles](/core-concepts/modules/more-modules.md).

## Overriding, configuring and extending modules at "project level"

Any options you provide for a module via the `modules` property in `app.js` override the default configuration for a module, as described in the [technical overview](/core-concepts/technical-overview.html#project-level-overriding-and-extending-apostrophe-in-your-project). And any configuration provided via the `modules` property in `data/local.js` overrides that, allowing for server-specific settings like API keys.

You can also provide your own templates in the `lib/modules/module-name/views` folder of your project (**not** in `node_modules`) to override the templates of `module-name`, and provide your own code in `lib/modules/module-name/index.js` to override methods and add functionality. *If your project-level `lib/modules` folder has a module by the same name as a core or npm module, any code you provide automatically subclasses and improves that module.*

