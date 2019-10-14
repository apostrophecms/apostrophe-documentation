---
title: Setting Up Your Environment
layout: tutorial
---
# Setting Up Your Environment

First you need to get your environment set up. You may already have some of the tools described below installed and configured, but make sure that you read carefully to make sure that you don't miss anything.

{% hint style='info' %}
MacOS X is the most popular platform for Apostrophe CMS development, but there are plenty of developers using Linux or Windows.  For MacOS 10.9 or newer, continue with the instructions below. Windows users can use this lovely [HOWTO for Windows](../howtos/windows.md) contributed by Michael Brown to get everything set up, and Linux users can get going by installing the same operating system packages required by our [deployment HOWTO](../intermediate/deployment.md).
{% endhint %}

Here's what you need to install:

* XCode \(required for all compilation on Macs\)
* Homebrew \(for easy installing\)
* Git
* Node & NPM
* MongoDB
* Optional: Imagemagick \(for fast image manipulation with animated GIF support\)

## Install XCode and Command Line Tools

First, you need to install the Xcode Command Line Tools.

1. Open XCode (Download it from the App Store if you don't currently have it installed.)

2. Go to Xcode &rarr; Preferences &rarr; Locations and set the version for the Command Line Tools Option.

{% hint style='info' %}
Starting with XCode 6.1 the Command Line tools are automatically installed, and just need to be configured. For older versions of XCode, go to the Downloads tab under Preferences. From there you can select _Install_ for the Command Line Tools options. 
{% endhint %}

## Install Homebrew

Next, you need to install [Homebrew](http://brew.sh/), a convenient software manager that makes it easier to manage and update your software packages.

{% hint style="tip" %}
Anything `formatted like this` is meant to be run at the terminal prompt. Basic familiarity with the terminal is very helpful for node and Apostrophe development.
{% endhint %}


1. Launch the "Terminal" app.

2. Copy and Paste this one-line command to the terminal to install Homebrew:

    ```bash
    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
    ```

## Install Node

Now that you have Homebrew installed it only takes one command to install Node:

```bash
brew install node
```

## Adjust your PATH

The terminal prompt finds commands in folders listed in an environment variable called PATH. We'll need to add node's directory to our $PATH in order for it to work its magic.

1. Create a plaintext file called `.profile` in your home directory if you don't already have one. You can use the `touch` command from the command line to create a new file:

    ```bash
    touch ~/.profile
    ```
2. Open it with your favorite text editor, or use the following command to open it with the default editor:

    ```bash
    open ~/.profile
    ```

3. Add these two lines to the file and save it:
 
{% code-tabs %}
{% code-tabs-item title="\~/.profile" %}
    ```bash
    export NODE_PATH="/usr/local/lib/node"
    export PATH="/usr/local/share/npm/bin:$PATH"
    ```
{% endcode-tabs-item %}
{% endcode-tabs %}

Verify that this worked by opening a _new_ Terminal tab and running:

```bash
echo $PATH
```

If it worked, it will echo the current PATH setting as a set of colon-separated values, beginning with your additions.

## Install NPM \(Node Package Manager\)

NPM may or may not have been installed with Node. Try:

```bash
npm
```

If you get a "not found" error, run this:

```bash
curl -L https://npmjs.org/install.sh | sh
```

## Install git

You'll need git to manage your source code. Macs come with it, but we suggest you get the latest via Homebrew. From the command line:

```bash
brew install git
```

## Install MongoDB

Apostrophe uses MongoDB as its database. You can install it with Homebrew. In addition, you can configure `brew services` to launch it automatically for you, so you don't have to fuss with restarting it manually. 

1. First you need to install the "tap" for Mongo DB:

    ```bash
    brew tap mongodb/brew
    ```

2. Next install MongoDB:

    ```bash
    brew install mongodb-community
    ```

3. After it is installed, start the MongoDB service:

    ```bash
    brew services start mongodb-community
    ```

4. Now open a **new terminal window** and try:

    ```bash
    mongo
    ```

An interactive mongo prompt will start. Press `control+c` to exit.

{% hint style="working" %}
"Hey, I got a connection failed error!" Make sure you ran `brew services start mongodb-community`.
{% endhint %}

## Install ImageMagick

Like most of what you've done so far, installing ImageMagick is just a matter of one command:

```bash
brew install imagemagick
```

This provides the `convert` and `identify` command line tools, which Apostrophe uses to scale and crop images quickly, with animated GIF support. _If you skip this step, Apostrophe can still handle image uploads more slowly, thanks to_ [_Jimp_](https://npmjs.org/package/jimp)_._

# Build a website!

Now your environment is configured you're ready to create your first Apostrophe project.

