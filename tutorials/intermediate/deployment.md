---
title: Hosting Apostrophe in production
layout: tutorial
---

## Configuring your Linux server for Apostrophe

### System requirements

In our experience a virtual machine with 2GB of RAM and at least 20GB of free storage space is appropriate to comfortably run most Apostrophe sites. MongoDB requires that a minimum of 5GB of free disk space be maintained at all times. Apostrophe's node process and MongoDB will complete for scarce memory on a server with 1GB of RAM.

*RAM requirements may be a bit lower with Apostrophe 2.0.0 because it has fewer large npm dependencies.*

Disk space requirements will increase if users routinely upload large files to the media library.

Sites running in a [multicore](../howtos/multicore.html) configuration will require additional RAM and, of course, CPU cores.

### Packages you'll need

You will need (STOP: use the package manager of your operating system! Do NOT install everything from source code!)

* [nodejs](https://nodejs.org/en/) version 4.x or better
* [mongodb](http://www.mongodb.org/) version 2.6 or better
* [imagemagick](http://www.imagemagick.org/script/index.php) (the command line utilities `convert` and `identify`)
* [nginx](https://www.nginx.com/) (or another frontend proxy server)
* [mechanic](https://npmjs.org/package/mechanic) (recommended; manages nginx)

You may also want:

* postfix, or another email delivery agent

For CentOS 7 or Red Hat Enterprise 7 Linux, these commands will get you there:

> You can skip most of these steps and set up a Linux server with Stagecoach, ready to deploy, with hardly any effort if you use our [Linode stackscript](https://www.linode.com/stackscripts/view/239217-punkave-Apostrophe+CMS). For more information check out our [Linode HOWTO](../howtos/linode.html).

```bash
# Grab some command line basics
yum install wget rsync perl git nano
# Allow the use of the EPEL ("Extra Packages for Enterprise Linux") repository
yum install epel-release
# Front end proxy webserver
yum install nginx
# Install node, imagemagick, npm, and compiler tools so an efficient
# mongo driver can be compiled by npm
yum install gcc automake autoconf libtool make nodejs ImageMagick npm
# Install mongodb
yum install mongodb-server mongodb
# Allow non-root users to run command line applications installed with
# "npm install -g", otherwise it is not very useful
chmod -R a+r /usr/lib/node_modules/
# Used to run things indefinitely restarting as needed
npm install -g forever
# Used to manage nginx
npm install -g mechanic
```

Now you're ready to install the stagecoach deployment system and deploy your Apostrophe site. [Continue by reading the stagecoach documentation.](https://github.com/punkave/stagecoach)

Once deployment is complete, you're ready to start welcoming traffic to your website. [See the mechanic documentation](https://github.com/punkave/mechanic) for how to painlessly configure nginx as your reverse proxy. Or, if you wish, you can configure any reverse proxy of your choice to forward traffic on port 3000 to your Apostrophe site. You can support multiple sites on a single server; stagecoach assigns each one a distinct port. See the text file `/opt/stagecoach/apps/MYAPPNAME/current/data/port` for the port number.

## Minifying assets

You really don't want Apostrophe to insert tags to separately load dozens of JavaScript files. Instead, turn on Apostrophe's support for "minifying" files to bundle them together.

This is an option to the `apostrophe-assets` module:

```javascript
// in app.js
modules: {
  // other modules, then...
  apostrophe-assets: {
    minify: true
  }
}
```

But, you don't want to do this in a development environment! So how do we make production behave differently?

One great way is to use a `data/local.js` file on the production server. It looks much the same:

```javascript
  module.exports = {
    // in app.js
    modules: {
      // other modules, then...
      apostrophe-assets: {
        minify: true
      }
    }
  };
```

**Everything you put in this file gets merged with the object you pass to Apostrophe in `app.js`, and this file is never deployed** if you are following our Stagecoach deployment recipes (see below). So it is safe to put settings here that vary from server to server.

If you are not using Stagecoach, but you can set environment variables when running Apostrophe, then you might use an approach like this:

```javascript
// in app.js
modules: {
  // other modules, then...
  apostrophe-assets: {
    minify: (process.env.ENV === 'prod')
  }
}
```

Here `minify` kicks in only if the `ENV` environment variable is set to `prod`. You can set environment variables when using hosts like Heroku and it is a popular technique for do-it-yourself admins as well.

## Always minify before startup!

If you are using our Stagecoach recipes, the `deployment/dependencies` script will run *before* Apostrophe starts up, and it will run this Apostrophe command line task:

```bash
node app apostrophe:generation
```

This will carry out the minifying operation without race conditions or other problems that can occur if you just launch lots of Apostrophe server processes at once without minifying first.

If you are not using Stagecoach, just make sure you run this command line task as part of your own deployment recipe.

## Multicore and multiserver configurations

Because node is asynchronous, these single-server, single-core instructions are quite adequate for most clients, including many sites with high traffic at the city scale. However, if performance does become an issue, you may want to check out [running Apostrophe on multiple cores and/or servers](../howtos/multicore.html) as well. Just be sure to master the above material first.
