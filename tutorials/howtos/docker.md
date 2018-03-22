---
title: "Building Docker images for Apostrophe projects"
layout: tutorial
---

[Docker](http://www.docker.com/) is a containerization platform that lets developers build an image for their projects then run it anywhere.

This document will guide you through setting up Docker and using it to create an image for your Apostrophe project.

# Install Docker

First let's get Docker installed on your computer. Follow along on the Docker website to get everything set up: [Install Docker and run hello-world](https://docs.docker.com/engine/getstarted/step_one/).

This can be quite a bit to take in for a first-time user, so patience is key. The Docker documentation is extensive and will help you get through this step if you read it carefully. Please verify that your Docker install works before continuing.

# Apostrophe project setup

Here we will add Docker configuration to an Apostrophe project. We'll be using [apostrophe-sandbox](https://github.com/punkave/apostrophe-sandbox) as an example, but you can apply these steps to your own projects, too.

## Make a Dockerfile

Let's create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). This is a plain-text file named `Dockerfile` that exists in the root of your Apostrophe project. Below is an example Dockerfile that will work with basic Apostrophe projects. You can create a blank file named `Dockerfile` in the root of your project and then paste in the commands below.

```bash
FROM node:6.5.0

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY . /app
RUN npm install

# Mount persistent storage
VOLUME /app/data
VOLUME /app/public/uploads

EXPOSE 3000
CMD [ "npm", "start" ]
```

A Dockerfile contains a set of instructions for how Docker should build the app image for your project. In this case, we're telling Docker to pull in the [Node.js base image](https://hub.docker.com/_/node/) then copy our project files in and run the app server when the container starts.

You can [read more about Dockerfiles](https://docs.docker.com/engine/reference/builder/) if you'd like to customize your Dockerfile.

## Database configuration

Docker will create some environment variables when you link a container to a MongoDB container. We can make use of them by pulling them in when connecting to MongoDB in our `app.js`.

```javascript
    'apostrophe-db': {
      uri: 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/mydb'
    },
```

## Build the image

Now that we have a Dockerfile, it's time to build an image for your project. You can do this with `docker build`.

```bash
# Enter your project directory
$ cd ~/Projects/apostrophe-sandbox

# Build the image (replace the names)
$ docker build -t myname/apostrophe-sandbox .
```

Read more about [building an image from a Dockerfile](https://docs.docker.com/engine/tutorials/dockerimages/#/building-an-image-from-a-dockerfile) on the Docker website.

You can now run `docker images` and you should see your image listed.

## Run the image

We're almost ready to run the image, but we do need to set up a MongoDB container first so Apostrophe has something to connect to and store data.

### Run a MongoDB container

```bash
# Get the MongoDB image if you don't already have it
$ docker pull mongo

# Run a MongoDB container
$ docker run -d --name apostrophe-sandbox-db mongo
```

### Run your app

Now we'll run your project linked to the MongoDB container.

```bash
$ docker run -d --link=apostrophe-sandbox-db:mongodb -p 3000:3000 myname/apostrophe-sandbox
```

Viola! Visit `localhost:3000` in your web browser and the site should be up. Note that you can change the `-p 3000:3000` option to start the server on any port. See the [docker run](https://docs.docker.com/engine/reference/commandline/run/) docs for more details.

# Deploy

Great, so we have a working Apostrophe Docker image. How do we get it on the web? There are a many options. Here are a few.

* [Automated builds from GitHub](https://docs.docker.com/docker-hub/github/)
* Install [Dokku](http://dokku.viewdocs.io/dokku/) on the server then use [Dockerfile deployment](http://dokku.viewdocs.io/dokku/deployment/methods/dockerfiles/)
* Use `docker save` and `docker load` to [deploy without a private registry](https://realguess.net/2015/02/04/docker-save-load-and-deploy/)
* Build the image directly on the server
* Many more (use a web search!)
