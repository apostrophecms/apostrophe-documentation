# `video`

A `video` field allows the user to embed video hosted by any [oembed](http://oembed.com/)—compatible video hosting site, or any site for which you have provided an [oembetter](https://github.com/punkave/oembetter) filter via the [apostrophe-oembed](../../modules/apostrophe-oembed/README.md) module.

The user pastes a URL and sees an immediate preview.

The value of the property on the object will have `url`, `title` and `thumbnail` properties. `title` and `thumbnail` are snapshots from the oembed response at the time the field was saved. `thumbnail` is the URL of a thumbnail image as provided by the oembed response.

[apostrophe-oembed](../../modules/apostrophe-oembed/README.md) provides browser-side methods to display the video. See the [apostrophe-video-widgets](../../modules/apostrophe-video-widgets/README.md) source code for an example of using these methods to play a video in a `div` element.

Example:

```text
{
  type: 'video',
  name: 'video',
  label: 'Video'
}
```
