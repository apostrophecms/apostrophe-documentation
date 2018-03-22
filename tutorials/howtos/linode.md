---
title: Deploying Apostrophe to a Linode linux server quickly
layout: tutorial
---

[Linode](https://www.linode.com) is a popular provider of Linux VPSes (Virtual Private Servers). A VPS is a great fit for most Apostrophe sites because it can easily accommodate MongoDB, Apostrophe and your content at a fixed, low monthly price. Setting it up is usually much simpler than using a "cloud provider" like AWS or Heroku, unless you have a true need to operate at a very large scale.

You can [follow our deployment tutorial on Linode](../intermediate/deployment.html) — in fact, we tested it on Linode, although it works fine with any Linux server. And we recommend skimming that tutorial first to get the general idea. But, you can skip most of the steps by using our Linode "Stackscript."

To do that, just follow along:

* Log into your [Linode](https://www.linode.com) account, or create one if you're new to Linode.

* Create a new Linode (a new VPS). Make sure your "instance type" has at least 2gb of RAM ("Linode 2048" or bigger). As of this writing this is priced at $10/month.

* Click on the new Linode in your dashboard. (Tip: it'll be the one that says "Being Created.")

* Click "Deploy an Image."

* Click "Deploying using StackScripts."

* Under "Community StackScripts," search for Apostrophe.

* The correct StackScript will identify itself as "punkave / Apostrophe CMS"./ Click that entry.

* Supply a secure, unique password for the "nodeapps" Linux user. You'll need this password for deployment; write it down. *Do not use your Linode password.*

* Supply a secure, unique password for the "root" user too, and write that down. *Do not use the same password.*

* Leave the other fields as-is.

* Click "Deploy."

* When the "Disk Create" step finishes, click "Boot."

* When "Boot" completes, click "Remote Access." Under "SSH Access," you'll see a suggested command to access the server as root. Write down the IP address.

e packages. And of course you could choose to deploy in another way, or to use another frontend proxy other than nginx.

* In the `deployment` folder of your Apostrophe site on your computer,copy `settings.example` to `settings`. Then change the `PROJECT=apostrophe` setting to match your `shortName` setting from `app.js`.

* In the `deployment` folder, also copy `settings.production.example` to `settings.production`. Change `USER=myuser` to `USER=nodeapps`. Change `SERVER=myserver.com` to `SERVER=a.b.c.d`, where `a.b.c.d` is the IP address of your new VPS (check the "Remote Access" tab in Linode).

* [`git clone` stagecoach on your own computer](https://github.com/punkave/stagecoach) if you haven't already. [Make sure its `bin` folder becomes part of your `PATH` in your MacOS or Linux terminal window.](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux-unix)

> Windows users: stagecoach can be run under the [Linux subsystem for Windows.](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

* Deploy your site for the first time:

```bash
sc-deploy production
```

At the end of the run, you should see:

```bash
First startup, chose port 3000 for this site
```

* Your site is up, but it can't be reached at the usual HTTP port yet. Let's fix that with `mechanic`.

First `ssh` to your server as root. We can do this conveniently with the `sc-shell` command, but you could also do it manually:

```bash
sc-shell root@production
```

Now use `mechanic add` to configure nginx to proxy traffic from port 80 to port 3000, taking care of caching and serving static files quickly along the way:

```bash
mechanic add myshortname --host=example.com --aliases=www.example.com --static=/opt/stagecoach/apps/myshortname/current/public --backends=3000 --default=true
```

As long as you specify `--default=true`, you should be able to access your site right away at its IP address:

http://a.b.c.d/

* Change the DNS "A" records for `example.com` and `www.example.com` to point to your IP address, `a.b.c.d`. Be aware DNS changes can take time to propagate, hours or days depending on your DNS configuration.

* That's it! Your site is up at your own domain name:

`http://example.com`

* In the future, to deploy updated code, just run `sc-deploy production` again. This will not disturb your website's content; Stagecoach makes sure the `public/uploads` and `data/` folders survive each new deployment.
