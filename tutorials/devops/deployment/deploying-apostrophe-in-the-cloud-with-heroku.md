---
title: "Deploying Apostrophe in the Cloud with Heroku"
layout: tutorial
---

There are many cloud hosting services, but they all present the same challenges. Separate servers often don't share a single filesystem. The database usually needs its own scalable cloud hosting. And performing tasks like minifying assets is often best done in your development environment, minimizing what has to be done in production.

> "The cloud" isn't always the easiest solution to your problem. Take a look at our [Linode HOWTO](/tutorials/devops/deployment/linode.md) for a quicker way that is suitable for all but the highest-traffic sites.

## Deploying Apostrophe to Heroku

[Heroku](http://heroku.com) is a great starting point for cloud hosting because it is simple to set up, but all of the cloud's challenges come into play. What we learn by deploying to Heroku can be applied equally to Amazon EC2, Microsoft Azure and other cloud hosting services.

So for this how-to, we'll stick to free services from Amazon Web Services, Heroku and MongoDB Atlas, a MongoDB cloud hosting service from the creators of MongoDB. But keep in mind you can choose paid plans as well with much higher capacity and performance. Everything we've done here is designed to scale smoothly to those paid offerings.

## Before you begin

First, build an Apostrophe site! See the [getting started tutorial](/tutorials/getting-started/setting-up-your-environment.md).

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

Heroku runs our node app, but it doesn't run MongoDB for us. So let's go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.

After you sign up, click "Build a New Cluster." Pick "AWS" as your cloud provider and the same region you chose for Beanstalk. Do not shard your cluster, sharding is not appropriate for CMS work.

We recommend you give your cluster the same name as your project.

You will need to set up an administrative MongoDB user for your cluster. These will be part of your MongoDB database connection credentials. **Be sure to set a secure, separate username and password,** do not use your Atlas login credentials.

### IP address whitelisting

MongoDB Atlas requires us to whitelist the IP addresses that should be allowed to talk to the database. **Yes, it is secured by an encrypted password,** but this still helps cut down on potential DOS attacks.

This is a problem with Heroku because it may connect from many IP addresses.

If you are buying a larger Atlas plan you may be able to use the "VPC Peering" option, the details of which are beyond the scope of this HOWTO. Otherwise, just click "Allow Access from Anywhere" or, if you don't see that option, use this IP address range:

`0.0.0.0/0`

### Telling Heroku about your database

You will need to set an environment variable in Heroku so that your dynos understand where the datbase is. There's a UI for this, but the command line is much easier in the long run:

```
heroku config:set 'APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here'
```

We use the single quotes to avoid problems with most special characters in the URI. If you used the `'` character in the URI, you'll need to escape that with `\'`.

From here, you can test your site locally. This is typically done with:

```
npm install
npm run start
```

You should be able to view your website at the designated local port.

You can also test it *without* Heroku, on your local machine, by setting the environment variable just for one local run of your site:

```
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app
```

Press Control-C after you successfully test the site. Startup may take an extra moment because of the remote connection to MongoDB.

> At a small scale, "the cloud" is always slower than a single-server configuration. When things have to talk to each other, running them farther apart doesn't speed things up. However, after you reach a certain scale, a single server is impractical. And of course a single server is a single point of failure.

> If you do not run `node app` with the environment variable set correctly, it'll seem to work because it will connect to your own mongodb. You can shut down your local mongodb server temporarily if you want to be really, really sure.

8. Your database exists now on MongoDB, but it contains no users, so you won't be able to log in. Let's use the command line to connect again to fix that:

```
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app apostrophe-users:add admin admin
```

*This is the same user-creation command you saw in our getting-started tutorial.* We're just talking to a different database.

> You could also create your database locally and then copy it to MongoDB using the `mongodump` and `mongorestore` commands.

## Storing files with Amazon S3

**If you try to deploy now it might seem to work... but don't be fooled!** If you upload images, and then redeploy later, or even just wait a day or so... forget it. They are gone forever. That's because, with Heroku, local files are "written on water." What's more, on any given page load you might not even hit the same dyno where the files were uploaded. And similar issues will break your static assets, like CSS and JS.

So we need to use Amazon S3 for persistent storage of both uploads and static assets.

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

So we'll build an "asset bundle" and store it temporarily in the database, where all dynos will be able to see it.

To do that, first, **you must set `APOS_BUNDLE=1`** in your Heroku environment settings:

```
heroku config:set 'APOS_BUNDLE=1'
```

And, you need to turn on minification of assets:

```
heroku config:set 'APOS_MINIFY=1'
```

> IMPORTANT: the APOS_MINIFY environment variable is OVERRIDDEN by any setting
> you may have made for the `minify` option when configuring
> the `apostrophe-assets` module. If you want to use the environment
> variable, DO NOT also set the option in your code.

Third, you must create a **release tasks script** in your project, and a **Heroku Procfile** telling Heroku to run it.

Here is a sample `Procfile`, which should be in the home directory of your project:

```
web: node app
release: ./scripts/heroku-release-tasks
```

And in the `./scripts` subdirectory of your project, here is a sample `heroku-release-tasks` script:

```bash
#!/bin/bash

node app apostrophe:generation || exit 1
node app apostrophe-migrations:migrate || exit 1
```

Be sure to make that script executable before committing it in your project:

```bash
chmod u+x ./scripts/release-tasks
```

This script will take care of *both* static asset generation and database migrations just before Heroku starts launching dynos with the latest version of your code.

With these things in place, Apostrophe will minify assets and copy them to its database just before it launches dynos. Each dyno will be able to see the asset bundle and copy its contents to its temporary filesystem, so everyone sees the same files.

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

**If you get no CSS and JavaScript**, you probably configured the `APOS_MINIFY` and `APOS_BUNDLE` variables but never created the `Procfile` or the release tasks script. Also check the heroku logs for errors from the release tasks script.

### Fonts, other assets, and CORS errors in the browser console

To ensure there are no CORS (Cross-Origin Resource) errors, visit your amazon S3 bucket settings to adjust the CORS configuration:

`Amazon S3 --> [bucket] --> Permissions Tab --> CORS configuration button`

Verify the value of `AllowedOrigin`. It should match the heroku url and/or the production URL of your project:

```
<AllowedOrigin>https://example.com</AllowedOrigin>
```

```
<AllowedOrigin>https://example.herokuapp.com</AllowedOrigin>
```

## Efficient asset delivery

In this setup, images are delivered efficiently via S3, and everyone can see all of the assets. And so are static assets like CSS and JS. Those are copied to S3 during the release task. Old assets are cleaned up one hour after each new deployment, allowing a very generous period of time for any old Heroku dynos to shut down automatically.

> To ensure the contents of the bundle's `data/` subdirectory are still available, and to provide backwards compatibility for any URLs you have hard-coded in your templates that are not aware that the relevant contents of `public/` have been copied to S3, the assets are also extracted to the application's folder on Heroku. Apostrophe, however, will consistently reference the contents via S3 URLs instead.

