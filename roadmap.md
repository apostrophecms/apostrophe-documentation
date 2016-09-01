---
title: "Roadmap"
---

## Apostrophe roadmap and long term support policy

Apostrophe 2.x is a long-term support release. We intend to provide full support for Apostrophe 2.x for **a minimum of three years from release** (until September 1st, 2019, or longer).

Historically, P'unk Avenue has supported sites developed on older versions of Apostrophe for considerably longer. We are actively supporting over 70 sites built on version 0.5.x, for instance, and have no plans to stop doing so.

Our three-year minimum commitment to this specific release reflects our intention to actively improve and address defects in this version for the long term.

We have no immediate plans for changes that would require significant backwards compatibility breaks with 2.x. Our development process for 2.x has created an architecture we plan to stand behind for some time. Our focus will move to the addition of new features and the release of supporting modules.

However, see our semantic versioning guide below. It's possible that a truly minor but necessary bc break of some kind will force us to bump the major version number sooner than expected. This **does not** mean that we will be engaging in another full rewrite any time soon.

## Migrating from Apostrophe 0.5

We are committed to providing content migration tools for Apostrophe 0.5 projects. See our [0.5 to 2.0 migration guide](migration.html) for more information. We have always provided such tools, including from earlier PHP-based versions of Apostrophe.

An automated tool to migrate content from Apostrophe 0.5 is planned for the immediate future. Tools are already available to migrate to 0.5 from earlier releases.

## Apostrophe's semantic versioning policy

[Semantic versioning](http://semver.org/) is a philosophy that says that each backwards-incompatible change should trigger a new major version number. It's a good policy because it makes it safe to use npm dependencies to install Apostrophe.

We will be following semantic versioning, with the following caveats:

* We've begun with `2.0.0` to avoid confusion with an older PHP-based version of Apostrophe. In future we'll increment the major version number normally.
* The addition of new option properties to the `options` object of a core Apostrophe type or module will *not* trigger a new major version number, which may impact you when extending modules. If you are concerned about conflicts, use a unique prefix for your own options.
* The addition of new methods to a core Apostrophe type or module will *not* trigger a new major version number, which may impact you when extending modules. If you are concerned about conflicts, use a unique prefix for your own methods.
* The addition of new, optional arguments to existing methods of core Apostrophe types or modules will *not* trigger a new major version number.

Also, just to be clear: bugs are bugs and may be fixed in a "patchlevel" release, no matter how used to them you may be. But, we'll aim to be reasonable about this.

The following are examples of things that *would* trigger a new major version number:

* Changing the arguments of an existing Apostrophe core method such that existing calls will fail.
* Removal of a core module (an Apostrophe module that ships with the `apostrophe` npm module).

Semantic versioning means that we might release 3.0, or even 4.0, sooner than you expect. This does not mean we intend to introduce *significant* backwards compatibility breaks in the near future. Nevertheless, set your npm dependencies to `^2.0.0` and follow the above advice to be safe.

## Support for Apostrophe 0.5

Apostrophe 0.5 was the previous release of Apostrophe for the node.js platform. We intend to provide critical security fixes for Apostrophe 0.5 for a minimum of two years from this date (until September 1st, 2018). *In practice it is likely that we will do so for considerably longer due to our commitment to our own clients.*

