---
title: "Deploying Apostrophe to the Amazon Web Services (AWS) Cloud"
layout: tutorial
---

Amazon AWS is the most widely used cloud hosting service. In this HOWTO we'll explore how to run Apostrophe effectively on AWS in a way that properly leverages the advantages of the cloud: availability, durability and scalable storage.

All cloud hosting services present the same challenges. You want multiple webservers, but separate servers don't share a single filesystem. The database usually needs its own scalable cloud hosting. And performing tasks like minifying assets is often best done in your development environment, minimizing what has to be done in production.

> The cloud is the right answer for high-traffic, high-value websites. But for sites with lower traffic, there are alternatives worth considering. See our [Linode HOWTO](linode.html) for a low-cost approach some may find simpler.

## Deploying Apostrophe to AWS

[AWS](http://aws.amazon.com) is a great solution for cloud hosting because of Amazon's long experience in providing cloud services. Of course, what we learn by deploying to AWS can generally be applied to Amazon EC2, Microsoft Azure and other cloud hosting services as well.

For this HOWTO, we'll stick to services available in the AWS "free tier," as well as MongoDB's official [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) database service, which is hosted in AWS and also has a free tier. But keep in mind you can choose paid plans as well with much higher capacity and performance. Everything we've done here is designed to scale smoothly to those paid offerings.

> **Important: the AWS free offerings are for evaluation purposes only.** There are [limits on how long you can use free AWS services](https://aws.amazon.com/free) and they are subject to change. **Operating two load-balanced webservers as suggested here will use up your free EC2 instance time for the month in just two weeks.** Most other services are only free for one year — as of this writing.
>
> So please do not make long-term plans to rely on the free tier — just use it to check out what's possible in the cloud.

## Before you begin

First, build an Apostrophe site! See the [getting started tutorial](../getting-started/index.html).

Make sure you commit it to a git repository. There's no sense worrying about scale if you haven't adopted a sustainable development process yet.

## First steps with AWS

Next, create an account at [AWS](http://aws.amazon.com).

You will need to add a method of payment, but keep in mind you can use resources available in the free tier to complete this tutorial, at the time of this writing.

Now, install the [AWS CLI](https://aws.amazon.com/cli/). While most things we are about to do can be done via the [AWS Console](http://console.aws.amazon.com), starting with the CLI will help you script your tasks more efficiently in the future.

The remaining steps assume you have successfully installed the `awscli` package with `pip`, as described on the [AWS CLI page](https://aws.amazon.com/cli/). See also their [MacOS install page](https://docs.aws.amazon.com/cli/latest/userguide/cli-install-macos.html).

### Configuring the AWS CLI

Next, you'll need to configure the AWS CLI:

```
aws configure
```

You will be prompted for your access key id and secret. You will obtain these while creating your account, or you can generate new ones at any time via the [AWS Console](http://console.aws.amazon.com).

> Due to a [bug in the AWS CLI](https://github.com/aws/aws-cli/issues/602), you may have trouble if your secret contains `/`, `+` or `%` characters. Currently the standard advice is to generate new secrets via the console until you obtain one without these characters.

### Creating a key pair

We will need ssh public and private keys, for making connections to our webservers. The CLI helps us create those:

```
aws ec2 create-key-pair --key-name apostrophe-test --query 'KeyMaterial' --output text > apostrophe-test.pem
# Set permissions so others cannot snoop on this private key
chmod 400 apostrophe-test.pem
```

### Creating your EC2 instances (webservers)

Our next step is to create two "EC2 instances." EC2 instances are virtual computers. To achieve **high availability**, we create two rather than one. We'll set up a load balancer later.

These commands will create two very small EC2 instances in the free tier, in two separate **availability zones**, for durability in the event of a major incident at Amazon. You will need to use the correct `image-id` for the current version of Amazon Linux. As of this writing, that is `ami-1853ac65`, but that will become outdated, so [try the Launch Instance wizard](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LaunchInstanceWizard) just to discover the ID.

TODO TEST THIS WITH THE AVAILABILITY ZONE STUFF

```
aws ec2 run-instances --image-id ami-xxxxxxxx --instance-type t2.micro --key-name apostrophe-test
--placement AvailabilityZone=us-east-1a
aws ec2 run-instances --image-id ami-xxxxxxxx --instance-type t2.micro --key-name apostrophe-test
--placement AvailabilityZone=us-east-1b
```

Note the 

> For simplicity, this command will create your instances using your default [security group](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-network-security.html) and [subnet](https://docs.aws.amazon.com/AmazonVPC/latest/UserGuide/VPC_Subnets.html). In production, you'll want to use a bigger instance that isn't free. See the official list of [EC2 instance types](https://aws.amazon.com/ec2/instance-types/).

Soon we'll configure these webservers to run Apostrophe. But first, let's take care of the rest of our cloud infrastructure.

### Creating your load balancer

TODO THIS DOES NOT USE THE CLI, FIX THAT

We have two webservers, to share the load and stay responsive if one goes down. But that only works if there is a "load balancer" to actually distribute traffic to them. Let's set that up:

1. In the [AWS Console](https://console.aws.amazon.com), click "EC2" again under "Compute."
2. In the menu at left, scroll down to "Load Balancers."
3. Click "Create Load Balancer."
4. Click "Create" under "Application Load Balancer."
5. Give your load balancer a name. We suggest the same name as your project's `shortname`.
6. Under "Listeners," make sure "HTTP" is selected, with port `80`.
7. Under "availability zone," 

### Creating your MongoDB replica set (database)

Now we'll need a database. We could run MongoDB directly on a webserver, but since durability is the entire point of the cloud, we should use a "replica set" — a group of at least three servers configured to automatically take over from each other. 

We could set that up ourselves, and [there are HOWTOs for that on the web](https://eladnava.com/deploy-a-highly-available-mongodb-replica-set-on-aws/). But we don't recommend it. Another big win of the cloud is outsourcing "ops," and administering MongoDB database servers is best left to the professionals [at MongoDB](https://www.mongodb.com/cloud/atlas). Specifically, the [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hosting service.

To get started, [create an account on MongoDB Atlas](https://www.mongodb.com/cloud/atlas). You'll be invited to create an organization, and then a project. Then click "Build a New Cluster."

When you build your cluster, make sure that:

* You give it a name that will make sense to you later. We suggest the same "shortname" you gave your Apostrophe project.
* You choose "Amazon Web Services" as the cloud provider. You want MongoDB to host your database close to your webservers, to minimize latency.
* You choose the same AWS "region" as you chose when configuring the AWS CLI, for the same reason. If you don't recall making a choice, go with `us-east-1`.

> Later you might create a cross-region cluster, for very high durability. For now, in the free tier, we'll keep it simple.

* For "Instance Size," choose "M0", the free tier (512MB of storage). Later you'll want something bigger and better.
* For the free tier, do **not** pick sharding, backup, or other optional services. Note that sharding is unsuitable for CMS work.
* Create a database username and password. Use a secure password or let them generate one!
* Click "Confirm & Deploy."

Once you have clicked "Confirm & Deploy," you have a few more steps to take care of:

* Click "Security," then "IP Whitelist." Add the IP addresses of your EC2 webservers.
* If you don't know what they are, go back to the AWS Console, click "EC2," and scroll right to find the "IPv4 Public IP" column.
* You must whitelist both servers.
* Wait until the "Overview" no longer indicates the database is still being set up.

### Creating your uploaded file storage (Amazon S3)

Next, we'll need a place to store our uploaded files.

For that, we'll use the Amazon S3 storage service. Amazon S3 is designed to provide high availability and eliminate fixed limits on how many files you can be or how much space they can take up. You pay only for the space and bandwidth you use.

> **"Hey wait, don't our webservers have file storage built right in?"** Yes, they each have 30GB of local disk storage. However, they cannot "see" each other's storage... which is a problem since we're load-balancing the site between them. And, their storage is only backed up within a single AWS "availability zone." Again, high durability is part of why we're in the cloud in the first place. So let's do this right.

Here's how to set up S3:

* In the [AWS Console](https://console.aws.amazon.com), under "Storage," click "S3."
* Click "Create Bucket."
* Name the bucket. We suggest you give it the same name as your project's "shortname" but it's up to you.
* Do not activate any of the optional services for now.
* On the "Manage Users" page, accept the defaults for now.
* Click "Create Bucket."

LEFT OFF HERE

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

> You can of course pick a replica set cluster and various non-free plans instead if you wish. Do not use sharding, it is not appropriate to our use case. Do not change the default read preference. See [replica sets](replica-set.html) for more information.

If you can, give your database the same name as your app, just for simplicity, but it's not mandatory.

After you create the database, click on it to reveal the connection information. You want the MongoDB URI. It will look like this:

```
mongodb://<dbuser>:<dbpassword>@dsxxxxx.mlab.com:xxxxx/YOUR-database-name
```

You'll need to create a database user. Click on the "Users" tab, then click "Add database user" and create a user.

> Stick to alphanumeric characters or be careful to escape symbols when creating a user.

Now you can create the complete URI, by inserting the username and password you just created in place of the `<dbuser>` and `<dbpassword>` fields.

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

7. Press Control-C after you successfully test the site. Startup may take an extra moment because of the remote connection to MongoDB.

> At a small scale, "the cloud" is always slower than a single-server configuration. When things have to talk to each other, running them farther apart doesn't speed things up. However, after you reach a certain scale, a single server is impractical. And of course a single server is a single point of failure.

> If you do not `node app` with the environment variable correctly, it'll seem to work because it will connect to your own mongodb. You can shut down your local mongodb server temporarily if you want to be really, really sure.

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

> IMPORTANT: the APOS_MINIFY environment variable is OVERRIDDEN by any setting
> you may have made for the `minify` option when configuring
> the `apostrophe-assets` module. If you want to use the environment
> variable, DO NOT set the option in your code.

We're specifying `APOS_MINIFY=1` as an environment variable to override the **default** behavior in a development environment, which is not to minify. As noted, if the option has been set explicitly in your code, the environment variable is ignored. So don't do that.

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

In this setup, images are delivered efficiently via S3, but other static assets like CSS and JS are delivered via the node application. This is not the fastest way to deliver those static assets. Let's look at how to deliver the assets via S3 as well.

> For some, the best option is to set up a simplified CDN like [Cloudflare](https://www.cloudflare.com/lp/ddos-a/?_bt=157293179478&_bk=cloudflare&_bm=e&_bn=g&gclid=CKeuzI3VxtACFZBMDQodZhAMKg) to act as a "frontend reverse proxy" for your site, caching these static assets while leaving the traffic for pages alone so that logins still work normally. Cloudflare makes this easy, and they even offer a free plan, so we suggest giving it a try.

### Pushing assets to S3

Apostrophe can push your assets to S3 as part of the bundle-creation step:

```bash
APOS_MINIFY=1 node app apostrophe:generation --create-bundle=prod-bundle --sync-to-uploadfs
```

When the `--sync-to-uploadfs` option is used, Apostrophe will create the bundle in a folder by that name as usual, and will then upload the bundle's `public/` subdirectory to the `assets/XXXX` "folder" of your S3 bucket, where `XXXX` is a unique identifier for the current generation of assets. **You should still commit and push the `prod-bundle` folder.**

Your Heroku configuration will look almost the same as before, with one addition:

```bash
heroku config:set APOS_MINIFY=1
heroku config:set APOS_BUNDLE=prod-bundle
heroku config:set APOS_BUNDLE_IN_UPLOADFS=1
```

To ensure the contents of the bundle's `data/` subdirectory are still available, and to provide backwards compatibility for any URLs you have hard-coded in your templates that are not aware that the relevant contents of `public/` have been copied to S3, the bundle is still extracted to the application's folder on Heroku. Apostrophe, however, will consistently reference the contents via S3 URLs instead.

> "When do the old assets get cleaned up?" Apostrophe will wait at least 5 minutes, allowing for old dynos to shut down, then start cleaning up assets left over by old deployments.

## Taking advantage of the "release phase"

Now in beta on Heroku is a feature called "release phase" in which you can execute commands on a Heroku "one-off dyno" just before your app goes live in a new release. This solves a chicken and egg problem by allowing you to run your latest code before the website actually goes live with the new code. This is another potential solution for running database migrations which doesn't require a database connection from your dev environment. For more information, see [Release Phase (beta)](https://devcenter.heroku.com/articles/release-phase) on Heroku.
