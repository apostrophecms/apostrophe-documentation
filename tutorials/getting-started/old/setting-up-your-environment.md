---
title: Getting Started
layout: tutorial
---

# Getting Started

In this guide, we’ll cover quickly installing Apostrophe locally for testing and development and testing. First, you’ll need to get the various dependencies installed:

1. Homebrew (Linux and MacOS)
2. MongoDB
3. node.js
4. Imagemagick

After that you can get to the Apostrophe specific items:

1. Install Apostrophe CLI
2. Create your Apostrophe project.
3. Create an admin user.
4. Start Apostrophe for the first time.

Select your OS to get started:

[MacOS/Linux](tab)  [Windows](tab).


## MacOS/Linux Dependency Installation

1. First install Homebrew, by following the [official instructions](https://docs.brew.sh/Installation).

2. Install Node:

brew install node

3. Set up MongoDB:

    * Add the MongoDB “tap”: **brew tap mongodb/brew**
    * Install MongoDB: **brew install mongodb-community**
    * Start MongoDB: **brew services start mongodb-community**
4. Install Imagemagick 

    ```bash
        brew install imagemagick
    ```
{% hint style="working" %}
NOTE: Imagemagick is not strictly required, but it enables cropping and scaling images as well as providing performance improvements for image operations in general, so it is recommended for most installations. \
{% endhint %}

{% hint style="working" %}
### Troubleshooting

Depending on your exact configuration, you run into some issue related to file locations and paths.

#### I get a "not found" error when I try to run "npm"

Check if NPM was installed with Node by running "npm" from the command line. If you get a "not found" error, install it with this command:

````bash
curl -L https://npmjs.org/install.sh | sh
````

#### I get a "not found" error when I try to run "node"

Node may not have been added to the $PATH when it was installed, if you can't run the "node" command you need to add node's directory to our $PATH in order for it to work its magic.

1. Create a plaintext file called .profile in your home directory if you don't already have one.

2. Add these two lines to .profile: to add Node to the $PATH

```applescript
export NODE_PATH="/usr/local/lib/node"
export PATH="/usr/local/share/npm/bin:$PATH"
```

{% endhint %}


## Windows Dependency Installation

While Linux and macOS can use a package manager to conveniently install packages for a single location, Windows users will need to manually download and install everything.


#### Install MongoDB

1. Go to [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition) to download the installer.

2. Run the installer.

3. During the installation process, select a “Complete” installation, and choose to “Install MongoDB as a Service”

#### Install Node

1. Go to [https://nodejs.org/en/download/](https://nodejs.org/en/download/) to download the installer.

2. Run the installer, and Node will be installed.

#### Install Imagemagick

Imagemagick can help speed up image processing for Apostrophe, and adds additional cropping and scaling options for uploaded images. Download and install it [Imagemagick's site](http://www.imagemagick.org/script/download.php#windows).

## Apostrophe Installation (All OSes)

After you have all the dependencies set up, you can get down to setting up Apostrophe.

1. Install the [Apostrophe CLI](https://github.com/apostrophecms/apostrophe-cli/blob/master/README.md):

    ```bash
        npm install apostrophe-cli -g
    ```

2. Next, make sure you’re in the directory where you want your Apostrophe projects located and create your project:

    ```bash
        apostrophe create-project <your-project-name> && cd <your-project-name> && npm i
    ```

Running **npm-install** will install Apostrophe with the remaining dependencies. Before you can run Apostrophe you’ll want to create an administrative user.



1. To create the user, run

    ```bash
        node app.js apostrophe-users:add admin admin
    ```

2. When prompted, set a password – don’t forget it. You’ll need it in a minute.

This will create a user name **admin** as part of the Apostrophe group **admin** which provides full access to all the administrative features of the site.


## Apostrophe First Start

Now you’re ready to start Apostrophe.

1. From the Terminal/Command Prompt, run 
 
    ```bash
        node app.js 
    ```

2. You can access your home page at **localhost:3000**
3. To log in, go to **localhost:3000/login** and enter
    *   User name: **admin**
    *   Password: `<the password you set>`


Now you’re ready to start building something incredible with Apostrophe! 
