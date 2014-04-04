---
title: "RSS Feed Options"
---

The RSS feed feature can be configured via the `feed` option when configuring the module.

To shut off the feed entirely for snippets or any subclass of snippets, set `feed` to `false`.

The following RSS-related options are supported and can be passed to any module derived from snippets. Note that the title of the feed is normally set quite well already based on the title of your site (if you are using `apostrophe-site`) and the title of the index page.

```javascript
modules: {
  'apostrophe-blog': {
    feed: {
      // Separates the site title and the page title to autogenerate a feed title
      titleSeparator: ' - ',

      // Hard code the title of the feed
      title: 'This is the title of the feed, no matter what',

      // Change the prefix but still append the page title after that
      titlePrefix: 'Prepend this to the title of the page to title the feed: ',

      // By default we show the thumbnail, if the snippet has one
      thumbnail: true,

      // By default we show the first image in the body, if the snippet has no thumbnail
      alternateThumbnail: true,

      // By default we show the rich text of a snippet in its entirety, although only one
      // image if any. If you set this true you'll get plaintext only
      summary: true,

      // By default we show the entire plaintext when summary is true. Use this option
      // to limit the character count
      characters: 1000
    }
  }
}
```

### Supporting More Feed Types, Customizing the Feed

TODO: expand!

The following methods of the snippets module are involved. They are easy to subclass and extend to support more types of feeds:

`feedContentType`, `renderFeed`, `renderFeedItem`, `renderFeedItemDescription`

All of these receive the `req` object, so you can inspect `req.query.feed` to figure out what type of feed was asked for. THe standard templates that ship with the snippets module provide links to generate RSS feeds (`feed=rss`).
