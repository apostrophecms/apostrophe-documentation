---
title: "Creating Your First Project"
---

## Using the CLI to generate a boilerplate website

Now that you have installed Apostrophe's dependencies, you can install and use a command line tool to generate a boilerplate project.

```bash
npm install apostrophe-cli -g
apostrophe create-0.6 <project-name>
cd <project-name>
npm install
node app.js
```

You now have a boilerplate website! You should be able to visit `localhost:3000` and view your site. Since you aren't logged in, you'll just see a very simple home page. In order to take advantage of Apostrophe's editing capabilities, you'll want to create an admin user, which can be done initially through the command line. This task will prompt you for a password.

```
node app.js apostrophe-users:add <username> Admin
```

Now that we've created a user, we can login through your browser at `localhost:3000/login`. Once logged in, be redirected to the home page once again, but with two additional elements present: an admin bar floating over  the top left of the page and a page menu floating over the bottom left.

## Project Orientation
