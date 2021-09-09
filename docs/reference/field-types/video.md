# `video`

A `video` field allows the user to embed video hosted by any [oembed](http://oembed.com/)—compatible video hosting site, or any site for which you have provided an [oembetter](https://github.com/apostrophecms/oembetter) filter via the [apostrophe-oembed](/reference/modules/apostrophe-oembed/README.md) module.

The user pastes a URL and sees an immediate preview.

The value of the property on the object will have `url`, `title` and `thumbnail` properties. `title` and `thumbnail` are snapshots from the oembed response at the time the field was saved. `thumbnail` is the URL of a thumbnail image as provided by the oembed response.

**The video field is primarily intended to be used as part of the core video widget**, however [apostrophe-oembed](/reference/modules/apostrophe-oembed/README.md) provides browser-side methods to display the video via client-side JavaScript. See the [apostrophe-video-widgets](/reference/modules/apostrophe-video-widgets/README.md) source code for an example of using these methods to play a video in a `div` element.

## Example

```javascript
{
  type: 'video',
  name: 'video',
  label: 'Video'
}
```

## Settings

|  Property | Type   | Default | Description |
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
