---
title: Running Apostrophe on Windows
layout: tutorial
---

## Step 1: Install Windows Subsystem for Linux

> Windows Subsystem for Linux is an official Microsoft solution to run Linux inside Windows, without any tricky business like partitioning your drive. Since your Apostrophe site will eventually run on Linux in production, this is the best way to get a test environment that works just like production.

First, [install the Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).  **Windows 10 is required.** Microsoft's official guide is thorough and accurate, but there are a few points to keep in mind:

* Your Windows 10 must be up to date, at least build 1909. Go to Windows Update and make sure you complete a system update. If you get an error trying to update your system, you probably have a very old build of Windows 10. You may need to install and run the [Windows 10 Update Assistant](https://support.microsoft.com/en-us/help/3159635/windows-10-update-assistant).
* When you open PowerShell to run the `Enable-WindowsOptionalFeature` command, **make sure you launch PowerShell as administrator.** To do that you will have to **right-click** and pick "as administrator." If you don't do this you will get an error.
* When you are ready to choose a Linux distribution, choose **Ubuntu 18.04** (the latest as of this writing).
* When you are asked to create a Linux user, you can pick any name you like, or `apostrophe`.

## Step 2: Install MongoDB for Windows

> "Wait, for Windows? Not for Linux?" Yes! Since Windows and Linux programs will be running on the same computer, Linux programs will be perfectly happy to talk to MongoDB for Windows, and it is officially supported and much easier to install.

To install MongoDB go to the [MongoDB download center community edition page](https://www.mongodb.com/download-center/community). Pick the current release (4.2 as of this writing) and your operating system (Windows x64). Then click Download. When the download completes, open the installer you just downloaded and accept the defaults for all of the prompts.

MongoDB Server is now installed on your computer and Apostrophe running inside WSL will happily talk to it. We'll want to install some command line MongoDB utilities on the Linux side though [OOPS: that is a pain to do, the mongo community edition install steps for Ubuntu are lengthy, TODO].

**Better TODO: consider recommending the `m` utility inside WSL instead, if it works, because that would give us CLI utilities and a MongoDB server without any scary "unsupported" warnings.**

## Step 3: Install Required Packages for Linux

> You may get a "Windows Firewall has blocked some features of this app" message when running various commands that follow. **You need to grant permission in that dialog box,** otherwise you will be unable to continue.

Next, open up an Ubuntu Linux terminal window if you haven't already. To do that, go to the Start menu and start typing "ubuntu", and click to launch the application. A terminal window will appear.

> This terminal is similar to the Windows command line prompt, but Linux commands are a little different. For more information, see the [Ubuntu Linux command line tutorial](https://ubuntu.com/tutorials/command-line-for-beginners#1-overview). Just keep in mind that you have already opened a terminal window, so you can skip past that part and learn about what to do with it.

You'll need to run the following commands successfully, one at a time, to install Apostrophe's requirements. If you get errors, stop to check your work and feel free to [ask questions of the community](https://apostrophecms.com/community).

We'll be using the `sudo` command a lot here. `sudo`, or "superuser do", means "run the following command 'as root,'" which is similar to Administrator in Windows. But in the future, it will be very rare for you to need to do anything with `sudo`. Resist the temptation to type it all the time. The less you use `sudo`, the less trouble you will have later.

We'll also be using the `apt` command. This tool installs software packages for Ubuntu Linux. It's like a command line version of the Windows app store.

Let's install the `imagemagick` utilitites for fast image uploads and the `build-essential` and `g++` tools to let Node.js use faster, native code for some tasks:

```
sudo apt install build-essential g++ imagemagick
```

Now, to check your work, type:

```
convert --version
```

The response should begin with:

```
Version: ImageMagick [et cetera...]
```

If not make sure you did not get any errors from the `apt install` command above.

## Step 4: Install `nvm`

> `nvm`, the Node Version Manager, is a great utility that lets you run any version of Node.js you want at any time. By using it we can avoid lots of hassles with old versions of Node.js and permissions for Node.js packages.

[You can install nvm by following the directions here](https://github.com/nvm-sh/nvm#installing-and-updating). It's just one command, but to get it right you'll want to copy and paste it into the Ubuntu terminal. To do that, click the Ubuntu icon in the upper left corner of the terminal window, then select Edit -> Paste from the dropdown menu.

Next, you must **install the version of Node you want**. As of this writing the stable version of Node.js is Node 12. So let's install that:

```
nvm install 12
```

Finally, **close your Ubuntu terminal window and open a new one.** If you don't do this, `node` will not work at the command line.

To check your work, type:

```
node --version
```

You should see a version number beginning with 12.

## Step 5: Install Visual Studio Code for Windows... with its WSL plugin

As you probably know, [Visual Studio Code](https://code.visualstudio.com/download) is the most popular source code editor by far on all operating systems. You may already be familiar with it.

For us, the neat thing about VSCode is that it automatically recognizes that you have WSL installed and invites you to add the WSL plugin for VSCode. Make sure you do that.

To check your work, try the following commands in the Ubuntu terminal:

```
mkdir test
cd test
touch emptyfile.js
code .
```

The `code .` command will open the `test` folder in Visual Studio Code for Windows, even though that folder belongs to WSL. Now you have a way to edit your Apostrophe projects.

## Step 6: You're good to go!

You're now ready to follow the tutorial provided by [Apostrophe: Getting Started](/tutorials/getting-started/setting-up-your-environment.md), with no changes, as long as you followed the above instructions, including using nvm rather than apt to install Node.js.

NOTE: if you get permissions errors, you probably first created the site as Administrator. Make up your mind and stick to one user... which should not be Administrator. It is always a good security policy to avoid using an administrator account when you can.


