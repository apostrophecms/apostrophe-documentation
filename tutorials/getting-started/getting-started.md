---
title: "Getting Started with Apostrophe"
---

## Getting Started with Apostrophe

We're going to start from the very beginning by installing the software necessary to develop with Apostrophe and setting up an empty project to work with. At the end of this tutorial you will have all the tools you need to start building a website.

### Step 1: Install the Software

**These instructions are for MacOS X,** which most developers use to test code that will eventually deploy to Linux. Also see this lovely [HOWTO for Windows](../../howtos/windows.html) contributed by Michael Brown.

This will get you set up on a Mac running OSX 10.9 or better.

We're going to install the following software:

- XCode (required for all compilation on Macs)
- Homebrew (for easy installing)
- Git
- Node & NPM
- MongoDB
- Imagemagick (for image manipulation- required by Apostrophe)

##### Install XCode

XCode is provided free of charge by Apple. Install it via the [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12).

##### XCode Command Line Tools

You will also need the Xcode Command Line Tools, which can be installed by going to Xcode -> Preferences ... -> Downloads.

##### Using the Terminal

Launch the "Terminal" app. From this point on, anything `formatted like this` is meant to be run at the terminal prompt. Basic familiarity with the terminal is very helpful for node and Apostrophe development.

##### Install Homebrew

[Homebrew](http://brew.sh/) is a convenient software manager that makes it easier to keep track of and update your software packages.

Installing Homebrew is easy:

```bash
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

##### Install Node

One command is all it takes:

```bash
brew install node
```

##### Adjust your PATH

The terminal prompt finds commands in folders listed in an environment variable called PATH. We'll need to add node's directory to our $PATH in order for it to work its magic.

Create a plaintext file called `.profile` in your home directory if you don't already have one and open it with your text editor (if you haven't used one before, you'll get TextEdit):

```bash
touch ~/.profile && open ~/.profile
```

In this new file, add these two lines:

```bash
export NODE_PATH="/usr/local/lib/node"
export PATH="/usr/local/share/npm/bin:$PATH”
```

You should verify that this worked by opening a _new_ Terminal tab and running:

```bash
echo $PATH
```

It should echo the current PATH setting as a set of colon-separated values,  beginning with your additions.

##### Install NPM (Node Package Manager)

NPM may or may not have been installed with Node. Try:

```bash
npm
```

If you get a "not found" error, run this:

```bash
curl -L https://npmjs.org/install.sh | sh
```

##### Install git

You'll need git to manage your source code. Macs come with it, but we suggest you get the latest via homebrew:

```bash
brew install git
```

##### Install MongoDB

MongoDB is the database that Apostrophe uses. You can install it with homebrew:

```bash
brew install mongo
```

During the mongo install, it will print out instructions for starting mongo on login (recommended for developers), which should look like this:

```bash
==> Caveats
To have launchd start mongodb at login:
    ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
Then to load mongodb now:
    launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
Or, if you don't want/need launchctl, you can just run:
    mongod
```

Run those, open a new tab and try:

```bash
mongo
```

It should start an interactive mongo prompt. ctrl+c to exit.

##### Install ImageMagick

```bash
brew install imagemagick
```

Now you have the `convert` and `identify` command line tools, which Apostrophe uses to scale and crop images.

----------

### Step 2: Clone the Apostrophe Sandbox Project

The Apostrophe Sandbox is a great starting point for new projects. It has all of the files we'll need to get started and it can easily be "gutted" to create an empty site.

Clone the [sandbox](https://github.com/punkave/apostrophe-sandbox) with `git`. You'll have to `cd` into the directory where you keep your projects (`Sites` in this example).

```bash
cd Sites
git clone https://github.com/punkave/apostrophe-sandbox
cd apostrophe-sandbox
```

##### Install the dependencies

Node's package manager to the rescue! Just type:

```bash
npm install
```

##### Create `local.js`

This file contains settings that distinguish your servers from one another... TL;DR: just copy the provided example!

```bash
mkdir data
cp local.example.js data/local.js
```


##### Create the Database

```bash
node app apostrophe:reset
```

Use this task carefully! This creates a new database with a homepage in it. If there's already a database it will overwrite it.

This task creates a mongo database called `apostrophe-sandbox`. When configuring your project you can provide a `shortName` which it will use as the real database name.

##### Launch the site

```bash
node app
```

##### Visit the site

Visit `http://localhost:3000` to see your sandbox site.

*To log in, visit: `http://localhost:3000/login`* or use the provided login button. *You can get rid of the login button and Apostrophe admin bar* for logged-out users by setting `loginButton: false` in `data/locals.js`.

The test username is `admin` and the test password is `demo`. If you've never used the Apostrophe interface before, now would be a good time to play around, add some pages, and use the editing tools!

----------

### Step 3: Create your own project

Now that you have the Apostrophe Sandbox there are a few steps you can take to turn it into your own project with a dedicated git repo.

Start by editing `package.json` to reflect your project. You should also change the `shortName` variable in `app.js`– this is what your database will be called.

Remove the `apostrophe-demo-login` module from `app.js` and from your `package.json`.

##### Start a new Git repo

You probably don't want the Sandbox's git history associated with your project. To remove it we have to run the following command within your project folder in the terminal, which will remove the existing git repo and create a new one (watch out for typos!):

```bash
rm -rf .git && git init
```

At this point you could create an initial commit to get your new git repo started:

```bash
git add -A && git commit -m 'initial commit'
```

##### Point to a repo on GitHub

If you're adding your project to GitHub, follow these instructions. If not, skip this step!

Create an empty repo on GitHub, BitBucket, or whatever git service you are using. Grab the remote url, which should look something like `git@github.com:myaccount/myproject.git`.

To point your local git repo to your remote repo, run the following command using your remote URL:

```bash
git remote set-url origin git@github.com:myaccount/myproject.git
```

If you've made an initial commit you can now push your repo to the remote server:

```bash
git push origin master
```

## Build a website!

Now that you have your own project set up it's time to dig in and learn how to navigate an Apostrophe project. The next tutorial will give you a sense of the file structure and how to create your own page templates.
