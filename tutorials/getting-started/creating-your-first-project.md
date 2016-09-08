---
title: "Creating Your First Project"
---

## Creating Your First Project

Now that you've got all the dependencies for Apostrophe installed, we can get you started creating your first project!

### Generating a test project

The first thing you will want to do is grab the `apostrophe-cli` tool, which makes bootstrapping a new project a breeze!

```bash
# Install the apostrophe-cli module
npm install apostrophe-cli -g
```

Now you can use it to create a new project.

```bash
# Create a project
apostrophe create test-project
```

**Important: rather than `test-project`, use your own project's "short name" containing only letters, digits, hyphens and/or underscores. It will be used by default as a MongoDB database name and a basis for cookie names, etc.** We suggest the name of your github project, which will typically follow those same constraints. (Hyphens seem more popular than underscores for such purposes.)

With the project created, you just need to jump in, install the dependencies, and start the server.

```bash
# cd into the new project
cd test-project
# Install our dependencies (most notably, Apostrophe)
npm install
# Go go go!
node app.js
```

You now have a test project up and running! You should be able to visit `localhost:3000` and view your site. You'll see a very simple home page... too simple! We'll fix that in a moment by adding more page types and some editable areas.

<img src="/images/tutorials/developer/boilerplate_loggedout.png" class="shadow">

In order to take advantage of Apostrophe's editing capabilities, you'll want to create an admin user, which can be done  through the command line. This task will prompt you to create a password.

```bash
node app.js apostrophe-users:add admin admin
```

This creates a user named `admin` in the `admin` group. Now that we've created a user, we can login through your browser at `localhost:3000/login`.

Once logged in, be redirected to the home page once again, but with two additional elements present: an admin bar floating over the top left of the page and a page menu floating over the bottom left.

<img src="/images/tutorials/developer/boilerplate_loggedin.png" class="shadow">

### Project Orientation

#### app.js

Apostrophe's main configuration file. This is the file that fires up Apostrophe with a given configuration, and is where you can specify what modules you want to be present in your project. Additionally, you can configure individual modules in this file.

Some modules are always a part of Apostrophe whether you configure them or not. You may create more to meet the needs of your project.

More on modules in a second...

#### lib/modules: modules in Apostrophe

Apostrophe is a modular content management system: each meaningful component is broken into its own module, which can then be interacted with or subclassed (extended) by other modules in the system. Under the hood, modules are powered by [moog](https://github.com/punkave/moog) and [moog-require](https://github.com/punkave/moog-require), but you don't have to understand that just to build a great website.

The `lib/modules` folder is where modules created for your own project live. And it is also where you can "subclass" (i.e. configure or improve upon) Apostrophe's own modules, whether part of the apostrophe npm module's core or packaged in separate npm modules.

You'll notice two modules that are extended in your test project's `lib/modules` folder, `apostrophe-assets` and `apostrophe-pages`. `apostrophe-assets` gets some custom [LESS CSS](http://lesscss.org/features/) files, while `apostrophe-pages` contains page templates. We'll look at those in a minute.

**Apostrophe modules and npm modules are not the same thing.** One npm module might package several Apostrophe modules that are maintained together as a "bundle." You'll see this later when you install the `apostrophe-blog` npm module.

##### lib/modules/apostrophe-assets

This module is responsible for pushing front-end assets to the website. In `app.js` we configure the module:

```javascript
    // This configures the apostrophe-assets module to push a 'site.less'
    // stylesheet by default
    'apostrophe-assets': {
      stylesheets: [
        {
          name: 'site'
        }
      ]
    }
```

This asks Apostrophe to include the [LESS CSS](http://lesscss.org/features/) file:

`lib/modules/apostrophe-assets/public/css/site.less`

In your project's frontend build.

If you want more LESS files, you could add them to the `stylesheets` array above. But most developers prefer to use `@import` in their `site.less`:

```css
// Import a reset stylesheet
@import 'reset.less';
```

### Moving On

We'll cover more configuration in a moment. First let's look at how to edit page templates and add editable content.
