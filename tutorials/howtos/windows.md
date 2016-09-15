---
title: Running Apostrophe on Windows
---

*Thanks to Andrew Brown for this HOWTO.*

## Step 1: Install Software

For Apostrophe 2 to work on Windows you need to install:

* Git
* Node & NPM
* MongoDB
* Imagemagick (for image manipulation- required by Apostrophe)

To install git go to [Git - Downloads](http://git-scm.com/downloads) and download the appropriate version. Be sure when asked about adjusting your path environment you select "Use Git from the Windows Command Prompt."

To install Node go to [http://nodejs.org/](http://nodejs.org/) and click install. Keep all settings the same and it will also put node and npm into your environmental variables.

To install MongoDB go to [Downloads - MongoDB](http://www.mongodb.org/downloads) and select the proper download for your computer. Be sure to select 32 or 64 bit depending on your system. Follow all of the prompts.

In your C: drive folder create a folder called "data". You can do that from the command prompt:

```
mkdir c:\data
```

This is where mongodb will store its database. Also be sure to place mongodb into your environmental variables.

Environmental variables are accessible by clicking:

Start Menu > right click "computer" > select "properties" > select "advanced system settings" from the left menu > select "environmental variables" from the bottom of the advanced tab > in the system variables section scroll down until you see the path variable > select path and click edit > add the location of the bin folder in your mongodb installation (i.e. mine is `C:\Program Files\MongoDB 2.6 Standard\bin`)

Click OK and close out of all windows.

NOTE: Ensure you separate distinct folders in the PATH with a semicolon.

Now when you type `mongod` at the command prompt you will start up your mongodb database. Be sure to leave that running.

To install Imagemagick go to: [ImageMagick : Windows Downloads](http://www.imagemagick.org/script/binary-releases.php#windows) and download the latest version. Ensure that add environmental variables to system path is checked during the installation process.

## Step 2

NOTE: Be aware of the differences in syntax between Mac OS and Windows terminals. `cp` translates to `copy`, `rm` to `del`, etc.

Otherwise, the tutorial provided by [Apostrophe: Getting Started](http://apostrophenow.org/tutorials/getting-started/getting-started.html) can be followed in Step 2.

NOTE: before you reset your database ensure that it is running by entering the command `mongod` at a shell prompt and leaving it running, if you have not already done this.

NOTE: If running node app gives you an error that relates to `EPERM` and permissions, a quick fix is to run the cmd prompt as an admin user and these should go away.

## Step 3

This can also be closely follows as stated in the getting started guide but note that `rm -rf .git` means `del .git` for windows users.

Hope this helps and gets you started with Apostrophe development on windows.
