---
title: Apostrophe in a subdirectory
---

## Hang on... are you sure this is a good idea?

Most of the time, your Apostrophe site should be just that: a site. It shouldn't be a subdirectory of "some other" site. Doing that leads to design problems, security problems (you can see their cookies and they can see yours), and technical hassles.

**If you can, use a subdomain.** That is, use "http://newsite.mycompany.com", not "http://mycompany.com/newsite". It's much easier and cleaner all around.

However, sometimes you'll face an iron-clad customer requirement to use a subdirectory. This HOWTO explains how to do that. And Apostrophe will help make it easier.

## Serving sites in subdirectories: reverse proxy configuration

First, you'll need a way to deliver one or more Apostrophe sites that live in separate subdirectories as if they were one site. To do that you'll need to convince your frontend production server to proxy requests to separate ports depending on the URL.

Here's a simple example for nginx:

```
server {
   listen       80;
   server_name  example.com;

   access_log  /var/log/nginx/funguide.access.log;

   error_log  /var/log/nginx/funguide.error.log;

   location / {
     # Normal configuration for the root of the site
     # unrelated to our Apostrophe site
   }

   location /test {
    proxy_pass  http://localhost:3000;
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    proxy_redirect off;
    proxy_buffering off;
    proxy_set_header        Host            $host;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

You can do similar tricks with the `ProxyPass` directive in Apache.

## Configuring Apostrophe: the prefix option

The next step is to configure Apostrophe to respond only to requests that start with a certain prefix on the URL.

Just set the `prefix` option in your `app.js` file:

```javascript
{
  // ... other configuration
  prefix: '/test'
  modules: {
    // ... all the usual stuff
  }
}
```

Start up your site and visit the root (`/`) in your browser. You'll get an error. That's a good thing: the site isn't there.

Now visit `/test`. You'll see the homepage of your Apostrophe site.

## Adjusting your code

Short answer: you don't have to, and you shouldn't. Mostly.

Long answer: everything in Apostrophe's core is designed to be compatible with the prefix option. **The `url` properties of pages, snippets, etc. are pre-baked to include the prefix.** The paths of images are also adjusted similarly. And so on. You don't have to worry about it.

Even AJAX calls made in our jQuery code are automatically adjusted. So an API call to `/apos-blog/get` automatically talks to `/test/apos-blog/get`.

Similarly, Express routes are automatically fixed too. `app.get('/foo')` will respond at `/test/foo`.

The exceptions are:

**1. Any URLs you are building directly in templates, without Apostrophe's help.** Just use the `aposPrefix` variable, which is available in all Nunjucks templates, and your code will automatically work whether the site has the prefix option set or not:

```
{{ aposPrefix }}/my/own/special/link
```

**Don't** use `aposPrefix` with the `url` property of objects that come from Apostrophe. They come out of the oven with the prefix baked in.

**2. Any URLs you are accessing in your JavaScript *without* using jQuery's AJAX functions.** If you are writing:

```javascript
window.location.href = '/foo';
```

You can replace this with:

```javascript
window.location.href = apos.data.prefix + '/foo';
```

But it is even easier to write this:

```javascript
apos.redirect('/foo')
```

Which will automatically respect the prefix.

**3. Turning slugs into URLs**

**Make your life simple: use the `url` property, not the `slug` property.** Apostrophe provides a dynamically updated `url` property that points to the right place for each page, snippet, etc.

But if you have a good reason to use the `slug` property to create a URL, be aware you must prepend the prefix to it. Use `aposPrefix` (in Nunjucks), `apos.data.prefix` (in browser-side JavaScript), or `apos.prefix` (in server-side Apostrophe modules).

**4. We missed something**

The `prefix` option has a lot of plumbing, and most sites don't use it. It is entirely possible that we have missed something. Your [bug reports and pull requests on this feature](https://github.com/punkave/apostrophe/issues) are much appreciated.

## Don't hardcode your prefix!

One last note: please don't hard-code your prefix in links all over your site. You'll regret it when you decide to move it to a subdomain or its own domain later. Always use `{{ aposPrefix }}` (in Nunjucks), `apos.data.prefix` (in browser-side JavaScript), and `apos.prefix` (in server-side code).
