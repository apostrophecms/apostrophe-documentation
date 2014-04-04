---
title: "Requirements"
---

## Installing the requirements on MacOS

This is the minimum necessary to get an apostrophe project up and running in OS X Mavericks, and possibly other versions of OS X. This was tested on a new Macbook Pro with no software on it. Here's what this covers:

- XCode (required for all compilation on Macs)
- Homebrew (for easy installing)
- Git
- Node (& npm)
- MongoDB
- Imagemagick (for image manipulation- required by Apostrophe)

### Install XCode

XCode is provided free of charge by Apple. Install it via the Mac App Store.

XCode Command Line Tools

You will also need the Xcode Command Line Tools, which can be installed by going to Xcode -> Preferences ... -> Downloads.

### Using the Terminal

Launch the "Terminal" app. From this point on, anything `formatted like this` is meant to be run at the terminal prompt. Basic familiarity with the terminal is very helpful for node and Apostrophe development.

### Install Homebrew

[Homebrew lets you install open source software like a Linux user might.](http://brew.sh/)

Installing Homebrew is easy:

```bash
ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

### Installing Node

One command is all it takes:

```bash
brew install node
```

### Adjusting your PATH

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

You should verify that this worked by opening a NEW Terminal tab and running:

```bash
echo $PATH
```

It should echo the current PATH setting as a set of colon-separated values,  beginning with your additions.

### Installing the npm package manager

NPM may or may not have been installed with Node. Try:

```bash
npm
```

If you get a "not found" error, run this:

```bash
curl https://npmjs.org/install.sh | sh
```

### Installing git

You'll need git to manage your source code. Macs come with it, but we suggest you get the latest via homebrew:

```bash
brew install git
```

### Installing MongoDB

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

### Installing ImageMagick

```bash
brew install imagemagick
```

Now you have the `convert` and `identify` command line tools, which Apostrophe uses to scale and crop images.

### Next Steps

[Install the sandbox](install-sandbox.html)


