### Starting an A2 Project from the Sandbox

This tutorial will cover starting your own Apostrophe 2 project using the [Apostrophe Sandbox](https://github.com/punkave/apostrophe-sandbox). You can check out a live version of the Sandbox at http://demo2.apostrophenow.com/.

In this tutorial we will start a new project based on the Apostrophe Sandbox, since it lays the groundwork for a new project. If you want to get up and running quickly, this is your best option. If you need an in-depth (and more technical) look at starting an Apostrophe 2 project from scratch, have a look at [Starting an A2 Project from Scratch]().

This tutorial is written for beginner developers without previous git or Node.js experience. You'll need an Apostrophe 2 development environment to do this. If you don't have one yet, check out the [Installing an A2 Development Environment](https://github.com/punkave/apostrophe-documentation/wiki/Installing-an-A2-Development-Environment) tutorial.

### Step 1: Copy the Sandbox project

Let's start by opening a Terminal window and navigating to the folder within which we will place the project. We recommend making a `Sites` folder in your user home directory (the folder named after your username). If you don't have one yet, you can run this in Terminal: `mkdir ~/Sites`

Change directory to your `Sites` folder:
```
cd ~/Sites
```

Now we'll clone the Sandbox project. Replace `<projectname>` with whatever you want to name your project folder:
```unix
git clone git@github.com:punkave/apostrophe-sandbox.git <projectname>
```

Move into your new directory: `cd <projectname>`

### Step 2: Make a new Git repo

There's already a git repo with its own history in your new project, so unless you are planning on contributing to it you probably want to get rid of it and make your own!

```
rm -rf .git
git init
```

