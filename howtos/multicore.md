---
title: Running Apostrophe on multiple cores and/or servers
---

Although Apostrophe runs very well as a single process, and we often deploy production sites that way, if your traffic levels are high enough you may need multiple cores or servers to keep up. Here's how to do that.

## Requirements

I'll assume you are deploying your site with [stagecoach](https://github.com/punkave/stagecoach). It's a solid deployment system, and the Apostrophe sandbox comes with ready-to-use recipes for it in the `deployment` folder.

I'll also assume you are using `nginx` as your reverse proxy server. If you're not, you should be. It's simple, effective, reliable and has built-in load balancing and fault tolerance.

Finally, I'll assume your server actually has more than one CPU core. If you have a dirt-cheap VPS plan, it might not. Running more processes than you have cores available generally doesn't help in nodejs apps. So check what is included in your plan.

**Tip:** You might want to reserve one core for `mongodb`. Take that into account when you decide how many processes to run.

## Multiple ports, multiple cores, multiple processes

Let's say your site is called `mysite`. On your server, check out the text file  `/opt/stagecoach/apps/mysite/current/data/port`. This will contain a single port number, probably `3000` unless you are deploying multiple sites to the same server.

Edit that file and add multiple ports, like this:

```
3000 3001 3002 3003
```

Now restart the site the stagecoach way:

```
[log in as the non-root user]
cd /opt/stagecoach/apps/mysite/current
sh deployment/stop && sh deployment/start
```

You'll note that stagecoach launches *four* "forever" processes instead of just one. Each one is listening on a separate port.

Now we need to configure nginx to balance the load over the four ports. Here's our recommended configuration:

```
upstream upstream-EXAMPLE  { 
  server localhost:3000; 
  server localhost:3001; 
  server localhost:3002; 
  server localhost:3003; 
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

The `upstream` block lists all four back-end ports that node is listening on. When we configure nginx this way, it automatically balances the load via the "round-robin" algorithm. In addition, it automatically "fails over" to another port if one of the four stops responding, for instance because it has just encountered a bug and `forever` is busy restarting it.

The above configuration also includes smart settings to take advantage of compression and to deliver static files directly from nginx.

Now restart `nginx` and you're ready to go. Use the `siege` utility to test your site, and watch `top` to see that all four node processes are consuming CPU.

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

A single instance of mongodb is smart enough to use multiple cores. But depending on your needs you might need to set up a [mongodb replica set](http://docs.mongodb.org/manual/replication/).

### Sharing one set of uploaded media files

By default Apostrophe writes uploaded files to the server's local hard drive. This is no good if you are load balancing across multiple servers.

Fortunately Apostrophe uses [uploadfs](https://github.com/punkave/uploadfs), which also supports using Amazon S3 as a back end for file storage.

To do that, [check out our separate HOWTO on using Amazon S3 with apostrophe](http://apostrophenow.org/howtos/storing-images-and-files-in-amazon-s3.html).

Alternatively, you could use NFS to make the same filesystem visible to more than one server. Or you could write a custom `uploadfs` back end; see the uploadfs documentation for more information about that strategy.
