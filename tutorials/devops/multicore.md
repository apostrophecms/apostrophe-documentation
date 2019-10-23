---
title: Running Apostrophe on multiple cores and/or servers
layout: tutorial
---

Although Apostrophe runs very well as a single process, and you can deploy production sites that way, you should run at least two processes to provide reliability when one process is restarting. And for higher traffic levels you'll want to take advantage of multiple cores, or even multiple servers. Here's how to do that.

## Requirements

I'll assume you are deploying your site with [stagecoach](https://github.com/punkave/stagecoach). It's a solid deployment system, and the Apostrophe sandbox comes with ready-to-use recipes for it in the `deployment` folder.

I'll also assume you are using `nginx` as your reverse proxy server. If you're not, you should be. It's simple, effective, reliable and has built-in load balancing and fault tolerance.

We recommend using [mechanic](http://npmjs.org/mechanic) to manage nginx. It's soooo much easier. But I'll give an example without mechanic too.

You should run at least two processes for reliability. Beyond that, don't run more processes than you actually have CPU cores according to your hosting plan. It doesn't help much in nodejs apps.

**Tip:** You might want to reserve one core for `mongodb`. Take that into account when you decide how many processes to run. But, don't go below two node processes.

## Multicore: multiple ports, multiple processes

Let's say your site is called `mysite`. On your server, check out the text file  `/opt/stagecoach/apps/mysite/current/data/port`. This will contain a single port number, probably `3000` unless you are deploying multiple sites to the same server.

Edit that file and add multiple ports, like this:

```
3000 3001
```

Now restart the site the stagecoach way:

```
[log in as the non-root user]
cd /opt/stagecoach/apps/mysite/current
bash deployment/stop && bash deployment/start
```

You'll note that stagecoach launches *two* "forever" processes instead of just one. Each one is listening on a separate port.

Now we need to configure nginx to balance the load over the two ports.

## If you are using mechanic

Good for you! Configuring nginx is so much easier with [mechanic](https://npmjs.org/mechanic).

Let's check our current setup:

```
mechanic list
```

We'll get back something like this:

```
mechanic add EXAMPLE '--backends=localhost:3000' '--canonical=true' '--host=www.EXAMPLE.com' '--static=/opt/stagecoach/apps/EXAMPLE/current/public/' '--default=true'
```

Let's update mechanic to add port 3001 as a second backend:

```
mechanic update EXAMPLE --backends=localhost:3000,localhost:3001
```

Boom! That's it... you're done.

Use the `siege` utility to test your site, and watch `top` to make sure that both node processes are consuming CPU.

## If you're not using mechanic

That's OK. Here's a sample configuration without it.

You should be able to find your site configuration in ```/etc/nginx/sites-enabled/```. Here's our recommended configuration with two processes:

```
upstream upstream-EXAMPLE  {
  server localhost:3000;
  server localhost:3001;
}

server {
  listen       80;
  server_name  localhost EXAMPLE.com www.EXAMPLE.com;

  client_max_body_size 32M;

  access_log  /var/log/nginx/EXAMPLE.access.log;
  error_log  /var/log/nginx/EXAMPLE.error.log;

  location / {
    gzip_types text/css text/javascript image/svg+xml
application/vnd.ms-fontobject application/x-font-ttf text/html;
    root /opt/stagecoach/apps/EXAMPLE/current/public;
    try_files $uri @proxy-EXAMPLE;
  }

  location @proxy-EXAMPLE {
    proxy_pass  http://upstream-EXAMPLE;

    proxy_next_upstream error timeout invalid_header http_500 http_502
http_503 http_504;
    proxy_redirect off;
    proxy_buffering off;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

The `upstream` block lists both back-end ports that node is listening on. When we configure nginx this way, it automatically balances the load via the "round-robin" algorithm. In addition, it automatically "fails over" to another port if one of the two stops responding, for instance because it has just encountered a bug and `forever` is busy restarting it.

The above configuration also includes smart settings to take advantage of compression and to deliver static files directly from nginx.

Now restart `nginx` and you're ready to go. If you're on an Ubuntu server, use the command ```service nginx restart``` as the root user. If you're on CentOS 7, use ```systemctl restart nginx.service``` as the root user.

Use the `siege` utility to test your site, and watch `top` to see that both node processes are consuming CPU.

## Multiple servers

If your traffic is truly epic, or you're just interested in raising reliability, you may want to run Apostrophe on multiple servers.

You can do that following the same technique as above, with a few tweaks.

### Load balancing multiple servers

You'll need an nginx configuration that balances the load across multiple backend servers, like this:

```
upstream upstream-EXAMPLE  {
  server backend-one.mydomain.com:3000;
  server backend-one.mydomain.com:3001;
  server backend-two.mydomain.com:3000;
  server backend-two.mydomain.com:3001;
}
```

### Sharing one mongodb database

You will also need to configure each backend to talk to the same instance of mongodb.

In `/opt/stagecoach/mysite/current/data/local.js` you might have:

```javascript
module.exports = {
  // Other things, then...
  db: {
    uri: 'mongodb://username:password@mymongoserver:27017/mydatabase?authSource=admin'
  }
};
```

Here I assume you're using passwords with mongodb, since your `mongodb` server must be set up to allow connections from other servers.

A single instance of mongodb is smart enough to use multiple cores. For reliability, however, you may wish to set up a [mongodb replica set](/tutorials/advanced-development/06-database/replica-set.md).

If you are doing that in order to achieve high availability, great! It will make sure your mongodb database remains available if one of the servers goes down.

But if you are doing it for performance reasons, be aware that *Apostrophe needs to be able to immediately read what it has written.* And this means that, by default, it always reads from the primary node (the default behavior in MongoDB replica sets).

At a future date we may relax this behavior so that, if configured, database reads for logged-out users who have no session data so far are permitted to read from secondary nodes. This would yield a performance benefit without compromising the consistency of what users experience.

Another possible solution is to use alternative session middleware. You may pass the `express-session`-compatible session store object of your choice to Apostrophe's `apostrophe-express` module as the `session.store` option. See [this list](https://www.npmjs.com/package/express-session#compatible-session-stores) of compatible stores.

```
modules: {
  'apostrophe-express': {
    session: {
      store: require(something-else)(arguments-it-needs)
    }
  }
}
```


### Sharing one set of uploaded media files

By default Apostrophe writes uploaded files to the server's local hard drive. This is no good if you are load balancing across multiple servers.

Fortunately Apostrophe uses [uploadfs](https://github.com/punkave/uploadfs), which also supports using Amazon S3 as a back end for file storage.

To do that, [check out our separate HOWTO on using Amazon S3 with apostrophe](storing-images-and-files-in-amazon-s3.md).

Alternatively, you could use NFS to make the same filesystem visible to more than one server. Or you could write a custom `uploadfs` back end; see the uploadfs documentation for more information about that strategy.
