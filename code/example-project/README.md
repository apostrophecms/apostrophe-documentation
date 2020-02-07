# Apostrophe Boilerplate v2.x

Apostrophe Boilerplate is a minimal starting point for [Apostrophe 2](https://github.com/punkave/apostrophe) projects.

To get started, we recommend taking a look at [our guide to creating your first project](http://apostrophecms.org/docs/tutorials/getting-started/creating-your-first-project.html). You could also take a look at [Apostrophe's CLI](https://github.com/punkave/apostrophe) or simply fork this repository.

Once you have a local copy of this project to work from, make sure to install its dependencies with `npm install`. With Apostrophe installed, the first thing to do create an admin user account so you're able to log into the CMS. Run the following command (this will prompt you for a password).

```bash
node app.js apostrophe-users:add admin admin
```

Now you're all set! Just run `node app.js` to start up the local server and head to `localhost:3000` in your web browser.

---------------

For more documentation on Apostrophe, visit the [A2 documentation site](http://apostrophecms.com).

## Getting started with Docker

If you prefer, you can run Apostrophe inside a Docker container with the provided configuration in `Dockerfile` and `docker-compose.yml`.

**These aren't meant to be perfect for all situations.** As written, they are well-suited to running Apostrophe and MongoDB under docker in a single-server environment. For a development environment, you would probably want the entire folder to be in a mounted volume so that your code changes are visible as you go along, and you would probably want to work `nodemon`, `webpack` or `apostrophe-monitor` into the mix for automatic reloading.

1. Install Docker on your computer, of course. On MacOS you must install the official Docker Desktop, not homebrew, as the latter relies on virtualbox and virtualbox file sharing is not compatible with persisting a MongoDB database in a container. If this is your first time, **Be sure to actually launch Docker Desktop** before running the commands that follow.

2. Type:

```bash
docker-compose up
```

3. When you see:

```
Listening at http://localhost:3000
```

You can connect normally in your browser by going to that address.

4. You will note there is no `admin` account in the database yet. Let's fix that. We'll execute an Apostrophe command line task inside the container:

```
docker-compose exec apostrophe node app apostrophe-users:add admin admin
```

You can shut Apostrophe down at any time with:

```bash
docker-compose stop
```

When you start it up again, your uploaded files and your database will still be there.

