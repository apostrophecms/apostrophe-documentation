---
title: Building Docker images for Apostrophe projects
layout: tutorial
---

# docker

[Docker](http://www.docker.com/) is a containerization platform that lets developers build an image for their projects then run it anywhere.

This document will guide you through setting up Docker and using it to create an image for your Apostrophe project.

## Install Docker

First let's get Docker installed on your computer. Follow along on the Docker website to get everything set up: [Install Docker and run hello-world](https://docs.docker.com/engine/getstarted/step_one/).

This can be quite a bit to take in for a first-time user, so patience is key. The Docker documentation is extensive and will help you get through this step if you read it carefully. Please verify that your Docker install works before continuing.

## Apostrophe project setup

Here we will add Docker configuration to an Apostrophe project. We'll be using [apostrophe-sandbox](https://github.com/punkave/apostrophe-sandbox) as an example, but you can apply these steps to your own projects, too.

### Make a Dockerfile

Let's create a [Dockerfile](https://docs.docker.com/engine/reference/builder/). This is a plain-text file named `Dockerfile` that exists in the root of your Apostrophe project. Below is an example Dockerfile that will work with basic Apostrophe projects. You can create a blank file named `Dockerfile` in the root of your project and then paste in the commands below.

```text
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

# Add the environment variable 
# to copy files rather than use symlinks
ENV APOS_ALWAYS_COPY_ASSETS=1

EXPOSE 3000
CMD [ "npm", "start" ]
```

### Make a .dockerignore file to exclude files and folders from the container

```text
.git
Dockerfile
.dockerignore
.gitignore
data
public/uploads
```

A Dockerfile contains a set of instructions for how Docker should build the app image for your project. In this case, we're telling Docker to pull in the [Node.js base image](https://hub.docker.com/_/node/) then copy our project files in and run the app server when the container starts.

A Docker Compose file is another way of running docker containers and starting multiple services at the same time. Here is a simple example of a docker-compose.yml file that runs a mongodb container and Apostrophe, this would be used in addition the the above Dockerfile that builds the container. Note that docker-compose files are YAML format so space indentation is important [Read more about YAML](https://yaml.org/start.html)

### Example docker-compose.yml

```text
version: '3'

services:
  mongo:
    image: 'mongo:latest'
    volumes:
      - 'mongo:/data/db'
    ports:
      - '127.0.0.1:27017:27017'
    restart: always  

  aposcms:
    image: "aposDockerImageFileName:latest"
    ports:
      - '3000:3000'
    volumes:
      - /app/data:/app/data
      - /app/public/uploads:/app/public/uploads
    links:
      - mongo:mongo
    depends_on:
      - mongo
    environment:
      MONGODB_PORT_27017_TCP_ADDR: 'mongodb://mongo'
      MONGODB_PORT_27017_TCP_PORT: '27017'
      APOS_ALWAYS_COPY_ASSETS: '1'
    restart: always

volumes:
  mongo:
```

The above compose file will first bring the mongodb service online and expose the service on port `27017` to all processes on the server. When the database is running Apostrophe will then start as the `depends_on` instruction will pause execution until the mongodb process has signalled it has started, this is no guarantee it is ready to except connections. The `restart: always` instruction will start the processes on system boot as part of the docker-compose.service and also perform a keep alive function \(remove any keep alive monitors your `package.json` file\).

You can [read more about Dockerfiles](https://docs.docker.com/engine/reference/builder/) if you'd like to customize your Dockerfile.

### Database configuration

We created some environment variables in our `dockerfile` and/or `docker-compose.yml` file. We can make use of them by pulling them in when connecting to MongoDB in our `app.js`.

```javascript
    'apostrophe-db': {
      uri: 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':' + process.env.MONGODB_PORT_27017_TCP_PORT + '/mydb'
    },
```

### Build the image

Now that we have a Dockerfile, it's time to build an image for your project. You can do this with `docker build`.

```text
# Enter your project directory
$ cd ~/Projects/apostrophe-sandbox

# Build the image (replace the names)
$ docker build -t myname/apostrophe-sandbox .
```

Read more about [building an image from a Dockerfile](https://docs.docker.com/engine/tutorials/dockerimages/#/building-an-image-from-a-dockerfile) on the Docker website.

You can now run `docker images` and you should see your image listed.

### Run the image

We're almost ready to run the image, but we do need to set up a MongoDB container first so Apostrophe has something to connect to and store data.

#### Run a MongoDB container

```text
# Get the MongoDB image if you don't already have it
$ docker pull mongo

# Run a MongoDB container
$ docker run -d --name apostrophe-sandbox-db mongo
```

#### Run your app

Now we'll run your project linked to the MongoDB container.

```text
$ docker run -d --link=apostrophe-sandbox-db:mongodb -p 3000:3000 myname/apostrophe-sandbox
```

### Run as a Docker Compose service

#### Start services

From the folder that contains your docker-compose.yaml file run the following to start both MongoDB and Apostrophe

```text
docker-compose up
```

Once run for the first time and 'restart: always' instruction is present in the service configuration - that service will always be run on boot

#### Stop services

To stop the docker-compose services

```text
docker-compose down
```

### Add your first Admin user if you have an empty Apostrophe database

Your MongoDB container needs to be running, your Apostrophe container can also be running but is not a requirement.

```text
docker run --network="host" -it <YourApostropheContainer:latest> /bin/bash
```

The above command creates an interactive session in your Apostrophe container where you can issue the following command to add an Apostrophe user. The /bin/bash part may differ depending on your OS

```text
node app.js apostrophe-users:add admin "admin"
```

You'll be prompted to enter the password at the bottom of the log information

Viola! Visit `localhost:3000` in your web browser and the site should be up. Note that you can change the `-p 3000:3000` option to start the server on any port. See the [docker run](https://docs.docker.com/engine/reference/commandline/run/) docs for more details.

## Deploy

Great, so we have a working Apostrophe Docker image. How do we get it on the web? There are a many options. Here are a few.

* [Automated builds from GitHub](https://docs.docker.com/docker-hub/github/)
* Install [Dokku](http://dokku.viewdocs.io/dokku/) on the server then use [Dockerfile deployment](http://dokku.viewdocs.io/dokku/deployment/methods/dockerfiles/)
* Use `docker save` and `docker load` to [deploy without a private registry](https://realguess.net/2015/02/04/docker-save-load-and-deploy/)
* Build the image directly on the server
* Many more \(use a web search!\)

