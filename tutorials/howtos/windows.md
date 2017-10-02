---
title: Running Apostrophe on Windows
layout: tutorial
---

*Thanks to Andrew Brown for the original version of this HOWTO, which has been updated.*

## Step 1: Install Software

For Apostrophe 2 to work on Windows you need to install:

* Git
* Nodejs
* MongoDB
* Imagemagick (for image manipulation- required by Apostrophe)

## Where to get the software

To install git go to [Git - Downloads](http://git-scm.com/downloads) and download the appropriate version. **Be sure when asked about adjusting your path environment you select "Use Git from the Windows Command Prompt."**

To install Node go to [http://nodejs.org/](http://nodejs.org/) and click install. Keep all settings the same and it will also make sure node and npm are accessible at the command line.

To install MongoDB go to [Downloads - MongoDB](http://www.mongodb.org/downloads) and select the proper download for your computer. Be sure to select 32 or 64 bit depending on your system. Follow all of the prompts.

To install Imagemagick go to: [ImageMagick : Windows Downloads](http://www.imagemagick.org/script/binary-releases.php#windows) and download the latest version. Ensure that "add environmental variables to system path" is checked during the installation process. **Make sure you check the box to install legacy executables.**

## MongoDB setup

### Quick start

For a quick start, create a folder for your MongoDB database:

```
mkdir c:\mongo
```

Then run the MongoDB executable and leave that window open. *Paths below may vary slightly depending on the version you install, check the contents of the MongoDB folder.*

```
cd \Program Files\MongoDB\Server\3.2\bin
.\mongod.exe --dbpath=c:/mongo
```

*Use of a forward slash is intentional.*

### Long-term setup

Consider installing MongoDB as a "windows service." See the MongoDB documentation for more information.

## Step 2: You're good to go!

Be aware of the differences in syntax between Mac OS and Windows terminals. `cp` translates to `copy`, `rm` to `del`, etc.

Otherwise, the tutorial provided by [Apostrophe: Getting Started](http://apostrophenow.org/tutorials/getting-started/) can be followed.

NOTE: if you get permissions errors, you probably first created the site as Administrator. Make up your mind and stick to one user... which should not be Administrator. It is always a good security policy to avoid using an administrator account when you can.
