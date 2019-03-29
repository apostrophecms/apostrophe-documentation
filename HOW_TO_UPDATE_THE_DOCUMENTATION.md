Apostrophe Documentation
========================

This project contains [the documentation site](http://apostrophecms.org/docs/index.html) for [Apostrophe](http://apostrophecms.org/).

You don't need to read this page just to read the documentation! [Read the actual documentation here.](http://apostrophecms.org/docs/) This page is about *contributing* to the documentation.

Building the docs
-----------------

### 1. Setup

Clone the repo.

```sh
$ git clone https://github.com/punkave/apostrophe-documentation.git
$ cd apostrophe-documentation
```

Next, install the dependencies.

```
./install
```

### 2. Updating the `modules/` docs from the source code

The reference docs for the modules are based on comments inline in the code, which makes writing reference documentation easy and encourages us to do so. Comments above the module's source go into the `README.md` for the module's folder; comments above each method document that method. Helpers, routes and regular methods (`self.something = function()...`) are all automatically discovered. Frontend moog classes and methods, too.

Here's how to generate the docs:

> First make sure you are not running a live Apostrophe site locally on port 3000.

```
./generate
```

NOTE: this will `npm update` the version of `apostrophe` being documented first, so the docs are always for the **latest published release**.

Now commit the changes, as you would if you had made them manually.

### 3. Deploying

[TODO: Stuart, update here re: how this all gets into getbook]

