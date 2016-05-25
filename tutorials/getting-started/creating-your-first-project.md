---
title: "Creating Your First Project"
---

## Creating Your First Project

Now that you've got all the dependencies for Apostrophe installed, we can get you started creating your first project!

### Generating a boilerplate website

The first thing you will want to do is grab the `apostrophe-cli` tool, which makes bootstrapping a new project a breeze!

```bash
# Install the apostrophe-cli module
npm install apostrophe-cli -g
```

Now you can use it to create a new project.

```bash
# Create a project
apostrophe create-0.6 testProject
```

With the project created, you just need to jump in, install the dependencies, and start the server.

```bash
# cd into the new project
cd testProject
# Install our dependencies (most notably, Apostrophe)
npm install
# Go go go!
node app.js
```

You now have a boilerplate website up and running! You should be able to visit `localhost:3000` and view your site. You'll see a very simple home page.

<img src="/images/tutorials/developer/boilerplate_loggedout.png" class="shadow">

In order to take advantage of Apostrophe's editing capabilities, you'll want to create an admin user, which can be done  through the command line. This task will prompt you to create a password.

```bash
node app.js apostrophe-users:add <username> Admin
```

This creates a user in the `Admin` group. Now that we've created a user, we can login through your browser at `localhost:3000/login`.

Once logged in, be redirected to the home page once again, but with two additional elements present: an admin bar floating over the top left of the page and a page menu floating over the bottom left.

<img src="/images/tutorials/developer/boilerplate_loggedin.png" class="shadow">

### Project Orientation

#### File Structure

##### app.js

Apostrophe's main configuration file. This is the file that fires up Apostrophe with a given configuration, and is where you can specify what modules you want to be present in your project. Additionally, you can pass module-level configuration in this file. More on modules in a second...

##### lib/modules

Apostrophe is a modular content management system: each meaningful component is broken into it's own module, which can then be interacted with or subclassed by other parts of the system. This modules are declared and constructed via [Moog](https://github.com/punkave/moog).

The `lib/modules` folder is where these modules live. This is where you can create custom project-level modules, or extend the functionality of existing modules within Apostrophe, whether core or packaged separately.

You'll notice two modules present in the boilerplate's `lib/modules` folder, `apostrophe-assets` and `apostrophe-pages`.

###### apostrophe-assets

This module is responsible for pushing front-end assets to the website. In the boilerplate, you'll notice there is a `public/css/site.less`. This is where you can write custom front-end styles for your site.

###### apostrophe-pages

Where the sausage really gets made. GL HF
