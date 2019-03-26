---
title: Hosting Apostrophe in production
layout: tutorial
---

# deployment

## Configuring your Linux server for Apostrophe

### System requirements

In our experience a virtual machine with 2GB of RAM and at least 20GB of free storage space is appropriate to comfortably run most Apostrophe sites. MongoDB requires that a minimum of 5GB of free disk space be maintained at all times. Apostrophe's node process and MongoDB will complete for scarce memory on a server with 1GB of RAM.

_RAM requirements may be a bit lower with Apostrophe 2.0.0 because it has fewer large npm dependencies._

Disk space requirements will increase if users routinely upload large files to the media library.

Sites running in a [multicore](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/howtos/multicore.html) configuration will require additional RAM and, of course, CPU cores.

### Packages you'll need

You will need \(STOP: use the package manager of your operating system! Do NOT install everything from source code!\)

* [nodejs](https://nodejs.org/en/) version 4.x or better
* [mongodb](http://www.mongodb.org/) version 2.6 or better
* [imagemagick](http://www.imagemagick.org/script/index.php) \(the command line utilities `convert` and `identify`\)
* [nginx](https://www.nginx.com/) \(or another frontend proxy server\)
* [mechanic](https://npmjs.org/package/mechanic) \(recommended; manages nginx\)

You may also want:

* postfix, or another email delivery agent

For CentOS 7 or Red Hat Enterprise 7 Linux, these commands will get you there:

> You can skip most of these steps and set up a Linux server with Stagecoach, ready to deploy, with hardly any effort if you use our [Linode stackscript](https://www.linode.com/stackscripts/view/239217-punkave-Apostrophe+CMS). For more information check out our [Linode HOWTO](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/howtos/linode.html).

```bash
# Grab some command line basics
yum install wget rsync perl git nano
# Allow the use of the EPEL ("Extra Packages for Enterprise Linux") repository
yum install epel-release
# Front end proxy webserver
yum install nginx
# Install imagemagick, and compiler tools so
# an efficient mongo driver can be compiled by npm
yum install -y gcc gcc-c++ automake autoconf libtool make ImageMagick
# Configure the nodesource repository, which provides easy installation of
# a modern version of nodejs
( curl -sL https://rpm.nodesource.com/setup_8.x | bash - )
# Install nodejs (and npm)
yum install -y nodejs
# Install MongoDB 3.6.x from the official MongoDB repository
cat > /etc/yum.repos.d/mongodb-org-3.6.repo <<EOF
[mongodb-org-3.6]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/\$releasever/mongodb-org/3.6/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc
EOF
yum install -y mongodb-org
systemctl restart mongod.service
# Make sure mongod starts on each boot
systemctl enable mongod.service
# Allow non-root users to run command line applications installed with
# "npm install -g", otherwise it is not very useful
chmod -R a+r /usr/lib/node_modules/
# Used to run things indefinitely restarting as needed.
# --unsafe-perm simply allows the installed package to actually be used
# by non-root users, which is an improvement over everything running as root
npm install -g --unsafe-perm forever
# Used to manage nginx
npm install -g --unsafe-perm mechanic
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

**Everything you put in this file gets merged with the object you pass to Apostrophe in** `app.js`**, and this file is never deployed** if you are following our Stagecoach deployment recipes \(see below\). So it is safe to put settings here that vary from server to server.

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

If you are using our Stagecoach recipes, the `deployment/dependencies` script will run _before_ Apostrophe starts up, and it will run this Apostrophe command line task:

```text
node app apostrophe:generation
```

This will carry out the minifying operation and save the fingerprint of the minified files in `data/generation`. The existence of that fingerprint file prevents Apostrophe from running the minification task when it starts up. This is important when running multiple Apostrophe server processes at once, since we run into a race condition if they all attempt to minify the CSS/JS simultaneously.

If you are not using Stagecoach, just make sure you run this command line task as part of your own deployment recipe.

## Multicore and multiserver configurations

Because node is asynchronous, these single-server, single-core instructions are quite adequate for most clients, including many sites with high traffic at the city scale. However, if performance does become an issue, you may want to check out [running Apostrophe on multiple cores and/or servers](https://github.com/apostrophecms/apostrophe-documentation/tree/e71017392b54a258d8d72811456c862139150a96/tutorials/howtos/multicore.html) as well. Just be sure to master the above material first.

