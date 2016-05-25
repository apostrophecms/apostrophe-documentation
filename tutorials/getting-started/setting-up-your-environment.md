---
title: "Getting Started with Apostrophe"
---

## Setting up your environment for Apostrophe

We're going to start from the very beginning by installing the software necessary to develop with Apostrophe.  In the next tutorial, we'll set up an empty Apostrophe site.

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

## Build a website!

Now that you have your environment configured it's time to create our first Apostrophe project.

[Next: Create your first project →](/)
