---
title: Facebook open graph tags in Apostrophe
---

Facebook open graph tags can improve the way your pages appear when shared on Facebook, provided you use them correctly. The most frequently requested tag is `og:image`, followed by `og:title`, `og:description` and `og:type`. Often you can get away with just setting `og:image`. We'll look at how to do that.


However, any URLs you do set must be absolute URLs.

## Absolute URLs in Apostrophe

For reasons unknown to the rest of the Internet, Facebook has never implemented support for parsing relative URLs, even if they start with a `/`. They consider it an error. Why? Who knows.

On 2016-04-04 we made it easier to get absolute URLs by implementing a straightforward `absoluteUrls` option for use in `app.js`:

```
var site = require('apostrophe-site')({
  // Other options, then...
  shortName: 'mycompany.com',
  absoluteUrls: true,
  // Then other options...
});
```

The `shortName` option sets the hostname of the production site, and the `absoluteUrls` option indicates that `page.url`, `snippet.url`, the URLs of images in slideshows, etc. should always be absolute URLs pointing to the `hostName` that you configured.

## What about secure sites?

`shortname` isn't enough information to figure out if the site requires `https`. Here's an alternative:

```
var site = require('apostrophe-site')({
  // Other options, then...
  shortName: 'mycompany.com',
  baseUrl: 'https://mycompany.com',
  absoluteUrls: true,
  // Then other options...
});
```

## But what about URLs in development?

This is great, but you don't want your development URLs to point at your production server.

So use a `data/local.js` file on your production server. Everything here is *merged* with the object you pass to `apostrophe-site` in `app.js`. And `data/local.js` is never deployed. You set it up directly on the server. So you can set `absoluteUrls` differently in production. For instance, here's a typical production `data/local.js` file:

```
{
  // minify css and js files in production
  minify: true,
  // production hostname and baseUrl
  hostName: 'mycompany.com',
  baseUrl: 'https://mycompany.com',
  // absolute URLs in production
  absoluteUrls: true
}
```

You typically don't want to turn on `absoluteUrls` in your development environment.

## Great, I have absolute URLs. How do I generate my og:meta tags?

It's pretty easy, since `page.url` is now absolute, and so are your image URLs. Here's a classy example:

```
{% set firstImage = aposAreaImage(page, 'thumbnail') or aposAreaImage(page, 'body') %}
{% set fbImage = aposAreaImage(page, 'facebookImage') %}
{% set description = aposAreaPlaintext(page, 'body', {}) %}
{% block extraHead %}
  {% if fbImage %}
    <meta property="og:image" content="{{ aposFilePath(fbImage, { size: 'full' }) }}" />
  {% elif firstImage %}
    <meta property="og:image" content="{{ aposFilePath(firstImage, { size: 'full' }) }}" />
  {% endif %}
  {% if description %}
  <meta name="description" property="og:description" content="{{description | e | truncate(200)}}" />
  {% endif %}
  <meta property="og:url" content="{{page.url}}">
  <meta property="og:title" content="{{page.title}}">
{% endblock %}
```

If there is a singleton named `facebookImage`, we use that for `og:url`. If not we use the first image we find in the `thumbnail` or `body` areas. This allows for custom Facebook images, if you want to include them in your page or snippet schema, and also allows for Apostrophe to track something down to use instead.

`aposFilePath` takes an image object and generates a path to it. We take care to specify the `size` we want. `full` is a good choice. Facebook will reject large originals.

You could choose to have a Facebook-specific description field in your schema as well. The code here pulls plaintext from the `body` area for that purpose.

