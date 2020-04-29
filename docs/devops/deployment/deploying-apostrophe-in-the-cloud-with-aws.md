# Deploying Apostrophe with AWS and Elastic Beanstalk

Amazon AWS is hands down and far away the most popular cloud hosting solution, and for good reason. They have the best understanding of the problem and the largest infrastructure. But it can be confusing. Fortunately, Amazon offers Elastic Beanstalk, which provides much of the simplicity of options like Heroku without any added cost over configuring AWS directly.

We'll use Elastic Beanstalk to deliver:

* Multiple Node server processes
* Load-balancing
* Failover
* Automatic server management without extra "ops" work

We'll use MongoDB Atlas to provide:

* A MongoDB database...
* Replicated in several instances
* Failover for the database
* Durability for the database

And we'll use Amazon AWS S3 to provide:

* Uploaded media and asset storage
* ... On a pay-as-you-go basis
* With no hard limit on storage
* At a competitive price.

## Getting started

First, [install the Elastic Beanstalk command line tools following Amazon's directions.](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install.html) Make sure you can run `eb --version` after that. If not, review those steps.

Now, `cd` to your existing Apostrophe website project and initialize Beanstalk:

```
cd ~/Sites/my-project
eb init
```

Pick a region that suits your needs. Your application name should match your project's folder name and shortname, if possible. Node.js will be autodetected.

**If you are happy with github, gitlab or similar, say "no" when asked about using CodeCommit.**

Say yes to setting up ssh for your instances.

**If you are not already using the AWS CLI you will be prompted for credentials.** See ["understanding and getting your security credentials"](https://docs.aws.amazon.com/general/latest/gr/aws-sec-cred-types.html) in the AWS documentation.

You will be prompted for a keypair name. This is a name for an ssh public and private key to be used to make secure connections to your servers. We suggest one for each project but you could reuse one.

> You must have the `ssh-keygen` utility installed. It is standard in macOS and most Linux distributions. For Windows it is [possible to obtain it](https://stackoverflow.com/questions/11771378/ssh-keygen-is-not-recognized-as-an-internal-or-external-command). Or you could generate your keypair in a different way.

> Do not enter a passphrase unless you want to be required to provide it every time you enter a command.

Now ignore files that should not be deployed. Create a `.ebignore` file in the project folder:

```
# Server-specific data
data
# Server-specific temporary files
temp
# User-uploaded content in local test environment, we'll use S3 instead
public/uploads
# These are symlinks, we'll use asset bundles instead
public/modules
# We'll minify these assets separately during deployment
public/apos-minified
# git-related, not relevant to deploy
.git
.gitignore
# 'npm install' runs as part of deployment to get the right architecture
node_modules
```

## Deploying to an Elastic Beanstalk environment

Our next step is to use `eb create` to create our first Elastic Beanstalk environment:

```
eb create
Enter Environment Name
(default is my-project-dev): [press enter, or change suffix]
Enter DNS CNAME prefix
Enter Environment Name
(default is my-project-dev): [press enter, or change suffix]
Select a load balancer type
1) classic
2) application
3) network
(default is 1): [press enter]
2.0+ Platforms require a service role. We will attempt to create one for you. You can specify your own role using the --service-role option.
Type "view" to see the policy, or just press ENTER to continue: [press enter]
WARNING: You have uncommitted changes.
Creating application version archive "XYZABC".
```

Eventually you will see:

```
Printing Status:
INFO: createEnvironment is starting.
 -- Events -- (safe to Ctrl+C) Use "eb abort" to cancel the command.
 ```

 At this point, you may press control-C to get back to the terminal, or you can just wait for the environment to be live, which may take several minutes.

 If you do press control-C, you may type `eb status` to check the progress of the deployment.

 If you stay connected to the progress, you'll eventually see:

 ```
 INFO: Successfully launched environment: my-project-dev
 ```

> Elastic Beanstalk will automatically fire up more instances if necessary to handle the traffic. Since the scaling is automatic, be aware you could be on the hook for a variable monthly bill.

## We need a database!

Type `eb status` and you'll see:

```
eb status
...
Health: Red
```

Uh-oh. What's going on?

```
eb health
...
Following services are not running: applicati
```

We'd better check the logs.

```
eb logs
...
/var/log/nodejs/nodejs.log
-------------------------------------
ERROR: There was an issue connecting to the database. Is it running?
...
```

Elastic Beanstalk runs our node app, but it doesn't run MongoDB for us. So let's go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.

After you sign up, click "Build a New Cluster." Pick "AWS" as your cloud provider and the same region you chose for Beanstalk. Do not shard your cluster, sharding is not appropriate for CMS work.

We recommend you give your cluster the same name as your ELB environment.

You will need to set up an administrative user for your cluster. These will be part of your MongoDB database connection credentials. **Be sure to set a secure, separate username and password,** do not use your Atlas login credentials.

### IP address whitelisting

MongoDB Atlas requires us to whitelist the IP addresses that should be allowed to talk to the database. **Yes, it is secured by an encrypted password,** but this still helps cut down on potential DOS attacks.

This is a problem with Elastic Beanstalk because it may connect from many IP addresses.

If you are buying a larger Atlas plan you can use the "VPC Peering" option. For more information see [MongoDB's article on interfacing Elastic Beanstalk with Atlas](https://www.mongodb.com/blog/post/develop-and-deploy-a-nodejs-app-to-aws-elastic-beanstalk-and-mongodb-atlas).

If you are using a small or free plan, just click "Allow Access from Anywhere" or, if you don't see that option, use this IP address range:

`0.0.0.0/0`

### Configuring your database credentials for Elastic Beanstalk

So far we've been able to do everything with the CLI, which is nice. But to set environment variables just for this one environment, we'll use the Beanstalk website. That way we can set them separately for environments created for staging, production, etc.

1. Log into the AWS console if you aren't already.

2. Click on "Elastic Beanstalk."

3. Don't see your environment — just a welcome page? Use the region picker at upper right. Make sure you pick the same region you set up for your environment with the CLI.

4. Still don't see it? Look closely: at upper left there is now a small dropdown with environment names. Click yours (even if it is already picked) and the interface will appear.

5. Click "Configuration."

6. Under "Software," click "Modify."

7. Under "Environment properties," enter the name:

`APOS_MONGODB_URI`

And for "value," paste in the URI that the MongoDB Atlas interface recommends under "Connection" (use the one for the MongoDB driver 3.4 and below).

8. Click "Save."

9. Click "Apply Configuration."

Your configuration change will take time to apply. Once that is complete, the health of your application will change to "Green."

Your site is up... sort of! But, we still have a little more to do. So far we have an empty database, no admin user to log in as, and no permanent way to store uploads. Needs a little work, right?

### Copying in your existing database, or creating a user

You may want to use MongoDB's `db.copyDatabase` feature to copy an existing MongoDB database into Atlas from your computer. See the [MongoDB documentation](https://docs.mongodb.com/manual/reference/method/db.copyDatabase/). This can be one of the easiest ways to solve the chicken and egg problem of logging into your website.

Or, add a user remotely! Here we are connecting directly to the MongoDB Atlas database from a local instance of Apostrophe on your computer:

```
APOS_MONGODB_URI=mongodb://SAME-AS-ABOVE node app apostrophe-users:add admin admin
```

> This approach only works if you have preconfigured groups. If you have switched off preconfigured groups for the `apostrophe-users` module, copy in your existing database instead.

## Storing files with Amazon S3

**If you try to deploy with `eb deploy` now it will seem to work... but don't be fooled!** If you upload images, and then redeploy later, or even just wait a day or so... forget it. They are gone forever. That's because, with Elastic Beanstalk instances, local files are "written on water."

So we need to use Amazon S3 for persistent storage of uploads.

Return to the [Amazon Web Services console](https://aws.amazon.com/console/).

From the Amazon Web Services control panel, click on S3. Then click "Create Bucket."

Choose a bucket name (the same as your beanstalk environment is nice but not mandatory) and a region (definitelyu the same as your beanstalk environment). Then click "Create."

> **Regarding the `APOS_S3_REGION` setting:** you'll need to look this up in the [AWS regions table](http://docs.aws.amazon.com/general/latest/gr/rande.html) (it's halfway down the page, "Amazon API Gateway"). Use the value in the "Region" column corresponding to the "Region Name" you chose.

Now test it *without* Beanstalk, on your local machine, by setting the environment variables just for one run of your site (the trailing `\` characters are there to allow us to break one command line over multiple lines for readability in the `bash` shell):

```
APOS_S3_BUCKET=YOUR-bucket-name \
APOS_S3_SECRET=YOUR-s3-secret \
APOS_S3_KEY=YOUR-s3-key \
APOS_S3_REGION=YOUR-chosen-region \
node app
```

Upload an image to your site, then right-click it and inspect the image URL. It should be on an Amazon S3 server at this point, **not localhost**.

> "What if I want to use an S3-compatible service that isn't run by Amazon?" You can set the `APOS_S3_ENDPOINT` variable to a complete hostname. If you do, you should *not* set `APOS_S3_REGION`.

### Adding the S3 variables to Elastic Beanstalk

Return to the Elastic Beanstalk console. Once again, click on your environment, then "Software," then "Modify." Under "Environment Properties," add these name/value pairs:

```
APOS_S3_BUCKET YOUR-bucket-name
APOS_S3_SECRET YOUR-s3-secret
APOS_S3_KEY YOUR-s3-key
APOS_S3_REGION YOUR-chosen-region
```

From here on out, all of your media uploads will go to S3 and persist there.

If you have existing files for this website and are migrating them into S3, you can upload them to the appropriate path in your bucket. The [AWS CLI](https://docs.aws.amazon.com/cli/latest/reference/s3/cp.html) can do it:

```
aws s3 cp --recursive ./public/uploads/ s3://YOUR-bucket-name/
```

## Minifying assets

The site can work with Elastic Beanstalk at this point, but *performance will be poor because CSS and JavaScript files are not "minified"* (combined to save space). We need to generate minified files in our dev environment in such a way that ELastic Beanstalk's EC2 instances can access them after deployment.

Apostrophe generates minified files with the `apostrophe:generation` task. For simple single-server deployments we usually just run `apostrophe:generation` in production, but this doesn't work for Elastic Beanstalk because every instance gets its own, temporary local files and we want every instance to see copies of the same exact assets. You'll encounter the same issue with most other cloud hosting services.

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

> VERY IMPORTANT: check your `.gitignore` file. If it it contains `data` on a line by itself, *change this line* to `/data`. Otherwise, you will be unable to commit a complete bundle to git, and Elastic Beanstalk will not deploy it properly. We have fixed this in the latest version of our boilerplate project.

**It's OK to commit that folder to git** (after FIRST checking for the `.gitignore` problem mentioned above). And it's a good idea to have a record of what was last deployed.

### Telling Elastic Beanstalk to use the bundle

Let's set two more Elastic Beanstalk environment properties, via the Elastic Beanstalk console, following the same process we did earlier:

```
APOS_MINIFY 1
APOS_BUNDLE prod-bundle
```

The first will tell Apostrophe that we're using minified assets. The second tells Apostrophe what the bundle folder is called, so it can copy the assets from it just before starting up.

> "Why does Apostrophe need to unpack assets each time an instance starts up?" Remember, every instance gets its own completely temporary and separate set of local files. Elastic Beanstalk deploys from local files, but we don't want to use minified files all the time in dev. In dev we also benefit from using live symbolic links to the asset folders of modules; but in production we want copies, for speed. The bundle strategy lets us keep the production assets in git without actually cluttering up the dev environment.

We're ready to deploy to Elastic Beanstalk!

## Deploying to Elastic Beanstalk

Everything is in readiness! **Commit your code changes** so you don't lose track. Then type:

```
eb deploy
```

To push your latest code up to Elastic Beanstalk. You can follow the progress of the command.

At the end, you can access the URL of your environment and log in. The easiest way is to type `eb open`.

Victory!

## If it doesn't work

**If your deployment fails,** type `eb logs` to see what went wrong. You can check the logs on the console too.

**If your images don't "stick" between restarts,** you probably skipped the Amazon S3 steps.

**If you get no CSS and JavaScript**, you probably configured the `APOS_MINIFY` and `APOS_BUNDLE` variables but never built the bundle.

## Database migrations

One thing is not incorporated in our process so far: running database migrations. This is important since Apostrophe itself, as well as your own code, may add migrations from time to time that need to be executed to update the database structure.

Since Atlas allows access from any whitelisted IP with the right credentials, the simplest way to run a database migration is to execute it from your local dev environment, with an environment variable set to communicate with your remote database:

```
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app apostrophe-migrations:migrate
```

But naturally you don't want to forget this. And you don't want to forget the bundle-building step either.

So it's best to create your own `./scripts/deploy` command for your project:

```
#!/bin/bash
APOS_MINIFY=1 node app apostrophe:generation --create-bundle=prod-bundle &&
APOS_MONGODB_URI=mongodb://YOUR-uri-goes-here node app apostrophe-migrations:migrate &&
eb deploy
```

Be sure to use `chmod u+x ./scripts/deploy` to make that script executable.

Now just type:

```
./scripts/deploy
```

Whenever you wish to deploy to Elastic Beanstalk.

## Multiple environments: staging, production, etc.

You can create more than one Elastic Beanstalk environment, for instance if you wish to show clients prerelease versions of your site at a separate URL. To do that, just add an environment name to just about any `eb` command:

`eb deploy my-other-env-ends-in-prod`

Create each environment with `eb create` as described earlier.

The environment properties are separate for each environment, so be sure to set them. This allows you to have distinct databases and S3 buckets if you wish to have a "scratchpad testing" environment for your end users to safely try things out.

## Efficient asset delivery

In this setup, images are delivered efficiently via S3, but other static assets like CSS and JS are delivered via the node application. This is not the fastest way to deliver those static assets. Let's look at how to deliver the assets via S3 as well.

> For some, the best option is to set up a simplified CDN like [Cloudflare](https://www.cloudflare.com/lp/ddos-a/?_bt=157293179478&_bk=cloudflare&_bm=e&_bn=g&gclid=CKeuzI3VxtACFZBMDQodZhAMKg) to act as a "frontend reverse proxy" for your site, caching these static assets while leaving the traffic for pages alone so that logins still work normally. Cloudflare makes this easy, and they even offer a free plan, so we suggest giving it a try.

### Pushing assets to S3

Apostrophe can push your assets to S3 as part of the bundle-creation step:

```bash
APOS_MINIFY=1 node app apostrophe:generation --create-bundle=prod-bundle --sync-to-uploadfs
```

When the `--sync-to-uploadfs` option is used, Apostrophe will create the bundle in a folder by that name as usual, and will then upload the bundle's `public/` subdirectory to the `assets/XXXX` "folder" of your S3 bucket, where `XXXX` is a unique identifier for the current generation of assets. **You should still commit and push the `prod-bundle` folder.**

Your Elastic Beanstalk environment properties will look almost the same as before, with one extra setting:

```
APOS_BUNDLE_IN_UPLOADFS 1
```

To ensure the contents of the bundle's `data/` subdirectory are still available, and to provide backwards compatibility for any URLs you have hard-coded in your templates that are not aware that the relevant contents of `public/` have been copied to S3, the bundle is still extracted to the application's folder on Elastic Beanstalk. Apostrophe, however, will consistently reference the contents via S3 URLs instead.

> "When do the old assets get cleaned up?" Apostrophe will wait at least 5 minutes, allowing for old processes to shut down, then start cleaning up assets left over by old deployments.

### Fonts, other assets, and CORS errors in the browser console

To ensure there are no CORS (Cross-Origin Resource) errors, visit your amazon S3 bucket settings to adjust the CORS configuration:

`Amazon S3 --> [bucket] --> Permissions Tab --> CORS configuration button`

Verify the value of `AllowedOrigin`. It should match the Elastic Beanstalk URL and/or the production URL of your project:

```
<AllowedOrigin>https://example.com</AllowedOrigin>
```

```
<AllowedOrigin>https://your-elastic-beanstalk-url-here.aws.com</AllowedOrigin>
```

