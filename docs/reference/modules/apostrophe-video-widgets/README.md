# apostrophe-video-widgets
## Inherits from: [apostrophe-widgets](../apostrophe-widgets/README.md)
Provides the `apostrophe-video` widget, which displays videos, powered
by [apostrophe-video-field](/modules/apostrophe-video-fields) and
[apostrophe-oembed](/modules/apostrophe-oembed). The video
widget accepts the URL of a video on any website that supports the
[oembed](http://oembed.com/) standard, including vimeo, YouTube, etc.
In some cases the results are refined by oembetter filters configured
by the `apostrophe-oembed` module. It is possible to configure new filters
for that module to handle video sites that don't natively support oembed.

Videos are not actually hosted or stored by Apostrophe.

## Options

### player: true

If you have set `lean: true` for the `apostrophe-assets` module,
the standard oembed-based video player does not get pushed to the
browser, as it is part of the legacy jQuery-based frontend.

However, you may opt in to a similar player that uses only a
few lines of lean JavaScript by setting the `player` option
of this module to `true`. You may of course skip this and
write your own.


