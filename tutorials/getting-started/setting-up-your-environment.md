---
title: "Setting Up Your Environment"
layout: tutorial
---

## Setting up your environment

We're going to start from the very beginning by installing the software necessary to develop with Apostrophe.  In the next tutorial, we'll set up an empty Apostrophe site.

### Install the Software

**These instructions are for MacOS X,** which most developers use to test code that will eventually deploy to Linux. Also see this lovely [HOWTO for Windows](../howtos/windows.html) contributed by Michael Brown. Linux users can get going by installing the same operating system packages required by our [deployment HOWTO](../intermediate/deployment.html).

This tutorial will get you set up on a Mac running OSX 10.9 or better.

We're going to install the following software:

- XCode (required for all compilation on Macs)
- Homebrew (for easy installing)
- Git
- Node & NPM
- MongoDB
- Optional: Imagemagick (for fast image manipulation with animated GIF support)

##### Using the Terminal

Launch the "Terminal" app. From this point on, anything `formatted like this` is meant to be run at the terminal prompt. Basic familiarity with the terminal is very helpful for node and Apostrophe development.

##### XCode Command Line Tools

You will also need the Xcode Command Line Tools. You can install them
by typing this command in the terminal:

```
xcode-select --install
```

This installs the XCode command line tools directly from Apple.
You *do not* have to install the full XCode user interface.

##### Install Homebrew

[Homebrew](http://brew.sh/) is a convenient software manager that makes it easier to keep track of and update your software packages.

You can install Homebrew by copying and pasting this one-line command to the terminal:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

*Trouble? Visit the [Homebrew site](http://brew.sh/) for the latest instructions.*

##### Install Node

One command is all it takes:

```bash
brew install node
```

##### Adjust your PATH

The terminal prompt finds commands in folders listed in an environment variable called PATH. We'll need to add node's directory to our $PATH in order for it to work its magic.

Create a plaintext file called `.profile` in your home directory if you don't already have one and open it with your text editor (which will default to TextEdit on a Mac, which is fine):

```bash
touch ~/.profile && open ~/.profile
```

In this new file, add these two lines:

```bash
export NODE_PATH="/usr/local/lib/node"
export PATH="/usr/local/share/npm/bin:$PATH"
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

MongoDB is the database that Apostrophe uses. You can install it with homebrew. Also make sure to use `brew services` to set it up to launch automatically for you, so you don't have to fuss with restarting it manually. The two terminal commands you'll need are:

```bash
brew install mongodb
brew services start mongodb
```

Now open a **new terminal window** and try:

```bash
mongo
```

It should start an interactive mongo prompt. ctrl+c to exit.

> "Hey, I got a connection failed error!" Possibly you didn't run `brew services start mongodb`.

##### Install ImageMagick

```bash
brew install imagemagick
```

Now you have the `convert` and `identify` command line tools, which Apostrophe uses to scale and crop images quickly, with animated GIF support. *If you skip this step, Apostrophe can still handle image uploads more slowly, thanks to [Jimp](https://npmjs.org/package/jimp).*

## Build a website!

Now that you have your environment configured it's time to create our first Apostrophe project.
