---
title: "Creating Your First Project"
layout: tutorial
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
apostrophe create-project test-project

# Alternatively, you can install a robust, themed, fully-baked project with
apostrophe create-project --boilerplate https://github.com/apostrophecms/apostrophe-open-museum test-project
```

**Important: rather than `test-project`, use your own project's "short name" containing only letters, digits, hyphens and/or underscores. It will be used by default as a MongoDB database name and a basis for cookie names, etc.** (Hyphens seem more popular than underscores for such purposes.)

With the project created, you just need to jump in, install the dependencies, and start the server.

```bash
# cd into the new project
cd test-project
# Install our dependencies (most notably, Apostrophe)
npm install
# Add an admin user to the admin group; prompts for password
node app.js apostrophe-users:add admin admin
# Go go go!
node app.js
```

You now have a test project up and running! You should be able to visit `http://localhost:3000` and view your site. You'll see a very simple home page... too simple! We'll fix that in a moment by adding more page types and some editable areas.

<img src="/docs/images/tutorials/developer/boilerplate_loggedout.png" class="shadow">

### Logging in

We can login through the browser at `http://localhost:3000/login`. **Use the password you chose a moment ago** when you ran the `apostrophe-users:add` task (see above) and **username `admin`**.

Once logged in, we are redirected to the home page once again, but with two additional elements present: an admin bar floating over the top left of the page and a page menu floating over the bottom left.

<img src="/docs/images/tutorials/developer/boilerplate_loggedin.png" class="shadow">

### Let's make it interesting

Now let's make it more interesting! Time to add an editable content area to the page.

Open up `lib/modules/apostrophe-pages/views/pages/home.html` in your text editor and just add an `apos.area` call:

```markup
{% extends "layout.html" %}

{% block title %}Home{% endblock %}
{% block main %}
  <div class="main-content">
    <h3>Hello world!
      {% if not data.user %}
        <a class="login-link" href="/login">Login</a>
      {% endif %}
    </h3>
    <p>This is a very barebones Apostrophe project. Now, get to work and make a real website!</p>
    {{ apos.area(data.page, 'body', {
      widgets: {
        'apostrophe-images': {
          size: 'full'
        },
        'apostrophe-rich-text': {
          toolbar: [ 'Styles', 'Bold', 'Italic', 'Link', 'Unlink' ],
          styles: [
            { name: 'Heading', element: 'h3' },
            { name: 'Subheading', element: 'h4' },
            { name: 'Paragraph', element: 'p' }
          ]
        }
      }
    }) }}
  </div>
{% endblock %}
```

### Restarting your site

**Now restart the site** so you can see the impact of the changes:

1. Press "control-C" in the terminal window where `node app.js` is running. (You need to leave it running as long as your site is up. In production, there are other ways, which we'll cover later.)

2. Run `node app.js` again (tip: just press the up arrow, then enter).

3. Refresh the browser.

### Use Nodemon to watch file changes

To avoid manual restarting in the future, you could use [Nodemon](https://nodemon.io) to watch project files.

1. Run `npm install -g nodemon` to install it globally.

2. Use `nodemon` in your project root folder. Nodemon will run `node app.js` by default.

Now, every time you make changes to a file in your project, Nodemon will restart your application.

If you installed Apostrophe using `apostrophe-cli` as described above, a basic Nodemon configuration is provided by the `package.json` file. Feel free to adjust these settings to your needs.

### Working with areas

Hey, what's this new button about?

<img src="/docs/images/tutorial-plus-button.png" class="shadow">

#### Adding rich text

Click the "+" sign and pick "rich text." You're presented with a friendly editor:

<img src="/docs/images/tutorial-rich-text-editor.png" class="shadow">

Edit as you see fit and try refreshing your page. Notice that your changes have already been saved. *There is no save button because saving is automatic.*

#### Adding a slideshow

Now let's add a slideshow. Click *outside* the rich text editor and you'll see two new "+" signs: one above the text and one below it. Click either one and pick "Image(s)".

You'll see the image library, which is initially empty:

<img src="/docs/images/tutorial-images-library.png" class="shadow">

Click the "New Image" button at upper right and you'll see:

<img src="/docs/images/tutorial-new-image.png" class="shadow">

Click "Upload File" to pick a GIF, JPEG or PNG file to upload from your computer. Also fill out the title field. Then click "Save Image."

Click "New Image" again and upload a second file. Then check the box next to each of them:

<img src="/docs/images/tutorial-select-images.png" class="shadow">

(As you check them off you'll see them appear at left in the "chosen items" area.)

Now click "Save Choices" and boom: slideshow!

<img src="/docs/images/tutorial-slideshow.gif" class="shadow">

## "Whoa, this is cool! But... what did I just do?"

Great question! Now that we've had our "whoa" moment, let's break it all down.
