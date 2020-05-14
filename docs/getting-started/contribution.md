# Contributing

We really appreciate your interest and value your time. ApostropheCMS is free,
open-source software, so community contributions are crucial to making it great.
The guidelines below are meant to make the most of your time and work.

::: tip NOTE
This is a condensed version of our contribution guide. You can find the full
guide at [in the `@apostrophecms` organization on Github](https://github.com/apostrophecms/.github/blob/master/CONTRIBUTING.md).
:::

In addition to contributing to the project, you can also join the growing
community on [Discord](https://chat.apostrophecms.org/) for discussion, core
development updates, and help as you build with Apostrophe. There are also the
[forum](https://forum.apostrophecms.org/) and
[Stack Overflow](https://stackoverflow.com/questions/tagged/apostrophe-cms).

- [Code of Conduct](#code-of-conduct)
- [How can I contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting a Feature or Enhancement](#suggesting-a-feature-or-enhancement)
  - [Fixing Bugs or Submitting Enhancements](#fixing-bugs-or-submitting-enhancements)
  - [Improving documentation](#improving-documentation)
  - [Share the Love](#share-the-love)
- [Should I make a new npm module?](#should-i-make-a-new-npm-module)

## Code of Conduct

All contributors and community members are expected to abide by the
[Code of Conduct](https://github.com/apostrophecms/.github/blob/master/CODE_OF_CONDUCT.md).
In short, be excellent to one another, respect everyone's contribution, and
never harrass anyone for any reason. Alert the core team at
[security@apostrophecms.com](mailto:security@apostrophecms.com) if you find
someone failing to abide by the Code of Conduct.

## How can I contribute?

### Reporting Bugs

If you come across a bug, please submit an issue in the GitHub repo. Be sure to
search the existing issues first and make sure it hasn’t already been logged.
If it has, add a comment with any information you think might help resolve it.

If it hasn’t, check:

- Are you on the lastest minor version of the Apostrophe modules you're using?
- Is your dev environment up to date? Primarily this means a LTS version of
Node.js and MongoDB 2.x or 3.x.
- Is this related to project code? Can you reproduce it in a minimal test case,
without the rest of your project code? If it might be specific to your project,
asking a question is a better first step (see below).

If the answer to those is "yes," please submit a bug issue. There is a bug issue
template when you create one in Github to help with that.

### Suggesting a Feature or Enhancement

We track feature requests and larger scale enhancements within the GitHub
repository. After you search existing issues to confirm your idea is new,
please submit your idea as a new issue. Remember to include details
that articulate the current functionality and how this enhancement will improve
or build upon that. Again, there's an issue template to help you.

### Fixing Bugs or Submitting Enhancements

PRs to resolve existing issues are fantastic. Two good places to start are the
["help wanted"](https://github.com/apostrophecms/apostrophe/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)
and ["good first issue"](https://github.com/apostrophecms/apostrophe/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) issues.

### Improving documentation

The [documentation repo](https://github.com/apostrophecms/apostrophe-documentation)
is public and we appreciate contributions. The core maintainers know Apostrophe
very well, but that can make it hard to see where the gaps in documentation are.

**Please open issues there** letting us know (nicely, please). Even better, submit a
pull request documenting something and you'll be helping many developers going
forward. Even typo fixes are great!

### Share the Love

Authoring blog posts, giving talks at a meet-up, or otherwise sharing
experiences using ApostropheCMS help spread the word. When you launch a site on
ApostropheCMS, contact us in [Discord](https://chat.apostrophecms.org) or on
[Twitter](https://twitter.com/apostrophecms). We love a good success story.

## Should I make a new npm module?

Great question. If it's not a bug fix or an improvement to the core UI, it often
doesn't belong in the core `apostrophe` npm module. For instance, our blogging
functionality is in the separate `apostrophe-blog` npm module.

**Some tips:**

- You can take any Apostrophe project module (`lib/modules/my-module`), move
that to the root of its own repository and package it up as an npm module. It
should just work, as long as all of your dependencies are part of the module.
Set `peerDependencies` if this will rely on a module that isn't directly used in
your code.
- **Please do not use the** `apostrophe-` **prefix for your module, or the**
`apos-` **prefix for your styles** without consulting the core team. By
reserving these for the official Apostrophe modules (which you are welcome to
collaborate on), we can maintain clarity for new Apostrophe developers regarding
which modules the core team is committed to maintaining.
  - To avoid confusion, you can pick your own prefix. It's good practice to use
  a prefix so that you don't conflict with project-level modules.
- Add `apostrophe`, `apostrophecms` and `apostrophe-cms` to your keywords in
`package.json` to help people find your module.

See [publishing your own npm modules for Apostrophe](/core-concepts/modules/more-modules.md#publishing-your-own-npm-modules-for-apostrophe) for more information.
