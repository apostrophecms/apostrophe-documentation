---
title: Hosting Apostrophe in production
---

## Configuring your Linux server for Apostrophe

You will need (STOP: use the package manager of your operating system! Do NOT install everything from source code!)

* [nodejs](https://nodejs.org/en/) version 0.10 or better
* [mongodb](http://www.mongodb.org/) (version 2.6 or better required)
* [imagemagick](http://www.imagemagick.org/script/index.php) (the command line utilities `convert` and `identify`)
* [nginx](https://www.nginx.com/) (or another frontend proxy server)
* [mechanic](https://npmjs.org/package/mechanic) (recommended; manages nginx)

You may also want:

* postfix, or another email delivery agent

For CentOS 7 or Red Hat Enterprise 7 Linux, these commands will get you there:

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

## Multicore and multiserver configurations

Because node is asynchronous, these single-server, single-core instructions are quite adequate for most clients, including many sites with high traffic at the city scale. However, if performance does become an issue, you may want to check out [running Apostrophe on multiple cores and/or servers](multicore.html) as well. Just be sure to master the above material first.
