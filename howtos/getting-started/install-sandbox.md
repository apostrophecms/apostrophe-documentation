# Install the sandbox

## Cloning the Sandbox Project

Clone our [sandbox project](https://github.com/punkave/apostrophe-sandbox) with `git`. Here I assume you have a folder called "Sites" where you like to keep your website projects:

```bash
cd Sites
git clone https://github.com/punkave/apostrophe-sandbox
cd apostrophe-sandbox
```

## Creating `local.js`

This file contains settings that distinguish your servers from one another... TL;DR: just copy the provided example!

```bash
mkdir data
cp local.example.js data/local.js
```

## Creating the Database

```bash
node app apostrophe:reset
```

You just ran an Apostrophe task that creates a new MongoDB database called `apostrophe-sandbox` and populates it with a home page. Congratulations.


## If you're working away from the Internet

Edit `data/local.js` and change `offline: false` to `offline: true` so we don't try to load fonts or maps.

## Launch!

```bash
node app
```

## Visit!

Visit `http://localhost:3000` to feast your eyes on your sandbox site.

*To log in, visit: `http://localhost:3000/login`* or use the provided login button. *You can get rid of the login button and Apostrophe admin bar* for logged-out users by setting `loginButton: false` in `data/locals.js`.

The test username is `admin` and the test password is `demo`.

You can create and remove pages in addition to editing their content and managing blog articles and other content types.

### Next Steps

[Create your own project, separate from the sandbox](create-your-own-project.html)
