---
title: "Deploying Apostrophe in the Cloud"
layout: tutorial
---

There are many cloud hosting services, but they all present the same challenges. Separate servers often don't share a single filesystem. The database usually needs its own scalable cloud hosting. And performing tasks like minifying assets is often best done in your development environment, minimizing what has to be done in production.

## Deploying Apostrophe to Heroku

[Heroku](http://heroku.com) is a great starting point for cloud hosting because it is simple to set up, but all of the cloud's challenges come into play. What we learn by deploying to Heroku can be applied equally to Amazon EC2, Microsoft Azure and other cloud hosting services.

So for this how-to, we'll stick to free services from Heroku and mlab, a MongoDB cloud hosting service. But keep in mind you can choose paid plans as well with much higher capacity and performance. Everything we've done here is designed to scale smoothly to those paid offerings.

## Before you begin

First, build an Apostrophe site! See the [getting started tutorial](../getting-started/index.html).

Make sure you commit it to a git repository. git is a big part of how Heroku deploys websites.

## First steps with Heroku

Next, create an account at [heroku.com](http://heroku.com).

Then create a Heroku app, choosing any app name and runtime location (US, Europe, etc.) you wish.

Now, following the instructions on the Heroku site, install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line) if you haven't already.

To enable deployment, add Heroku as a "git remote" to which your code can be pushed:

```
heroku git:remote -a apostrophetest (use YOUR app name)
```

Now we're almost ready to deploy. But, we need a database.

## Using mlab with Apostrophe and Heroku

Apostrophe requires a `mongodb` database, which Heroku doesn't offer. Fortunately, mlab (formerly mongolab) has you covered. So [create a database with mlab](https://mlab.com/signup/) to get started.

When you're finished verifying your account with mlab, click "Create New," then "Single-node" and "Sandbox."

> You can of course pick a replica set cluster and various non-free plans instead if you wish. Do not use sharding, it is not appropriate to our use case.

If you can, give your database the same name as your app, just for simplicity, but it's not mandatory.

After you create the database, click on it to reveal the connection information. You want the MongoDB URI. It will look like this:

```
mongodb://<dbuser>:<dbpassword>@dsxxxxx.mlab.com:xxxxx/YOUR-database-name
```

You'll need to create a database user. Click on the "Users" tab, then click "Add database user" and create a user.

Now you can create the complete URI, which will have the database user and password you just created.

## Making your app aware of your mlab database

By default, Apostrophe connects to MongoDB on your local machine:

```
mongodb://localhost:27017/YOUR-SHORTNAME-HERE
```

This is great for development, but now we need the app to know what the mlab URI is.

The right database name is *server dependent*: it differs between your computer and your production Heroku environment. In Heroku, the right way to pass that kind of information is through *environment variables*. 

> This is NOT the same as your mlab account credentials. DO NOT check the read-only box.

### Setting heroku configuration variables

There's a UI for this too, but the command line is much easier to script later:

```
heroku config:set 'APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here'
```

We use the single quotes to avoid problems with most special characters in the URI. If you used the `'` character in the URI, you'll need to escape that with `\'`.

You can also test it *without* Heroku, on your local machine, by setting the environment variable just for one local run of your site:

```
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app
```

7. Press Control-C after you successfully test the site. Startup may take an extra moment because of the remote connection to MongoDB.

> At a small scale, "the cloud" is always slower than a single-server configuration. When things have to talk to each other, running them farther apart doesn't speed things up. However, after you reach a certain scale, a single server is impractical. And of course a single server is a single point of failure.

> Tip: if you forgot to configure the `apostrophe-db` module, it'll seem to work because it will connect to your own mongodb. You can shut down your local mongodb server if you want to be really, really sure.

8. Your database exists now on mlab, but it contains no users, so you won't be able to log in. Let's use the command line to connect again to fix that:

```
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app apostrophe-users:add admin admin
```

*This is the same user-creation command you saw in our getting-started tutorial.* We're just talking to a different database.

> You could also create your database locally and then copy it to mlab using the mongodb shell.

## Storing files with Amazon S3

**If you try to deploy now it will seem to work... but don't be fooled!** If you upload images, and then redeploy later, or even just wait a day or so... forget it. They are gone forever. That's because, with Heroku, local files are "written on water."
 
So we need to use Amazon S3 for persistent storage of uploads.

First, [log into the Amazon Web Services console](https://aws.amazon.com/console/). Create an account if you haven't already. *You may have to provide a credit card but as of this writing, you can complete this how-to using their free service tier.*

From the Amazon Web Services control panel, click on S3. Then click "Create Bucket."

Choose a bucket name (the same as your app is nice but not mandatory) and a region (we recommend you not use "US Standard" because it does not have read-after-write semantics). Then click "Create."

Now test it *without* Heroku, on your local machine, by setting the environment variables just for one run of your site (the trailing `\` characters are there to allow us to break one command line over multiple lines for readability in the `bash` shell):

```
APOS_S3_BUCKET=YOUR-bucket-name \
APOS_S3_SECRET=YOUR-s3-secret \
APOS_S3_KEY=YOUR-s3-key \
APOS_S3_REGION=YOUR-chosen-region \
node app
```

**Regarding the `APOS_S3_REGION` setting:** you'll need to look this up in the [AWS regions table](http://docs.aws.amazon.com/general/latest/gr/rande.html) (it's halfway down the page, "Amazon API Gateway"). Use the value in the "Region" column corresponding to the "Region Name" you chose.

Upload an image to your site, then right-click it and inspect the image URL. It should be on an Amazon S3 server at this point, **not localhost**.

> "What if I want to use an S3-compatible service that isn't run by Amazon?" You can set the `APOS_S3_ENDPOINT` variable to a complete hostname. If you do, you should *not* set `APOS_S3_REGION`.

### Adding the S3 variables to Heroku

Just use `heroku config:set` again:

```
heroku config:set APOS_S3_BUCKET=YOUR-bucket-name
heroku config:set APOS_S3_SECRET=YOUR-s3-secret
heroku config:set APOS_S3_KEY=YOUR-s3-key
heroku config:set APOS_S3_REGION=YOUR-chosen-region
```

## Minifying assets

The site can work with Heroku at this point, but *performance will be poor because CSS and JavaScript files are not "minified"* (combined to save space). We need to generate minified files in our dev environment in such a way that Heroku can access them after deployment.

Apostrophe generates minified files with the `apostrophe:generation` task. For simple single-server deployments we usually just run `apostrophe:generation` in production, but this doesn't work for Heroku because every "dyno" in Heroku gets its own, temporary local files and we want every dyno to see copies of the same exact assets. You'll encounter the same issue with most other cloud hosting services.

So we'll build an "asset bundle" *on our dev machine*:

```bash
APOS_MINIFY=1 node app apostrophe:generation --create-bundle=prod-bundle
```

*We're specifying `APOS_MINIFY=1` as an environment variable to override the default behavior in a development environment, which is not to minify.*

After a minute or so (especially the first time), you'll have a `prod-bundle` folder in your project.

**Commit that folder to git.** Heroku uses git for deployment, so we do want it there!

### Telling Heroku to use the bundle

Let's set two more Heroku variables:

```
heroku config:set APOS_MINIFY=1
heroku config:set APOS_BUNDLE=prod-bundle
```

The first will tell Apostrophe that we're using minified assets. The second tells Apostrophe what the bundle folder is called, so it can copy the assets from it just before starting up.

> "Why does Apostrophe need to unpack assets each time a dyno starts up?" Remember, every dyno in Heroku gets its own completely temporary and separate set of local files. Heroku deploys from git, but we don't want to use minified files all the time in dev. In dev we also benefit from using live symbolic links to the asset folders of modules; but in production we want copies, for speed. The bundle strategy lets us keep the production assets in git without actually cluttering up the dev environment.

We're ready to deploy to Heroku!

## Deploying to Heroku

Everything is in readiness! **Commit your code changes,** then type:

```
git push heroku
```

To push your latest code from your active git branch up to heroku. Heroku will then start installing your dependencies via `npm install`, and you'll see the progress right in the output of the `git push heroku` command.

At the end you'll see a message like this:

```
remote: -----> Launching...
remote:        Released v3
remote:        https://apostrophetest.herokuapp.com/ deployed to Heroku
```

Now just visit:

https://YOUR-app-name-here.herokuapp.com/

And log in.

Victory!

## If it doesn't work

**If your deployment fails,** type `heroku logs` to see what went wrong.

**If your images don't "stick" between restarts,** you probably skipped the Amazon S3 steps.

**If you get no CSS and JavaScript**, you probably configured the `APOS_MINIFY` and `APOS_BUNDLE` variables but never built the bundle or never committed it to git before pushing to heroku.

## Database migrations

One thing is not incorporated in our process so far: running database migrations. This is important since Apostrophe itself, as well as your own code, may add migrations from time to time that need to be executed to update the database structure.

Since `mlab` allows access from anywhere with the right credentials, the simplest way to run a database migration is to execute it from your local dev environment, with an environment variable set to communicate with your remote database:

```
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app apostrophe:migrate
```

But naturally you don't want to forget this. And you don't want to forget the bundle-building step either.

So it's best to create your own `./scripts/deploy` command for your project:

```
#!/bin/bash
APOS_MINIFY=1 node app apostrophe:generation --create-bundle=prod-bundle &&
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app apostrophe:migrate &&
git push heroku &&
heroku run bash ./deployment/migrate
```

Be sure to use `chmod u+x ./scripts/deploy` to make that script executable.

Now just type:

```
./scripts/deploy
```

Whenever you wish to deploy to Heroku.

## Efficient asset delivery

In this setup, images are delivered efficiently via S3, but other static assets like CSS and JS are delivered via the node application. This is not the fastest way to deliver those static assets. However, it is straightforward to set up a CDN like [Cloudflare](https://www.cloudflare.com/lp/ddos-a/?_bt=157293179478&_bk=cloudflare&_bm=e&_bn=g&gclid=CKeuzI3VxtACFZBMDQodZhAMKg) to act as a "frontend reverse proxy" for your site, caching these static assets while leaving the traffic for pages alone so that logins still work normally. Cloudflare makes this easy, and they even offer a free plan, so we suggest giving it a try.

## Taking advantage of the "release phase"

Now in beta on Heroku is a feature called "release phase" in which you can execute commands on a Heroku "one-off dyno" just before your app goes live in a new release. This solves a chicken and egg problem by allowing you to run your latest code before the website actually goes live with the new code. This is another potential solution for running database migrations which doesn't require a database connection from your dev environment. For more information, see [Release Phase (beta)](https://devcenter.heroku.com/articles/release-phase) on Heroku.
