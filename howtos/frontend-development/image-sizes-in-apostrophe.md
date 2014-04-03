# Image sizes in Apostrophe

When an image is uploaded to Apostrophe, via a slideshow or the media library, it is automatically scaled to a set of convenient sizes.

You can take advantage of these sizes when using the [slideshow widget](slideshow-options.html) and also when [accessing-images-and-files-directly](accessing images directly).

The standard sizes are:

```javascript
{
  name: 'full',
  width: 1140,
  height: 1140
},
{
  name: 'two-thirds',
  width: 760,
  height: 760
},
{
  name: 'one-half',
  width: 570,
  height: 700
},
{
  name: 'one-third',
  width: 380,
  height: 700
},
// Handy for thumbnailing
{
  name: 'one-sixth',
  width: 190,
  height: 350
}
```

*Images are scaled to fit within the dimensions given above for each size, without distortion.* So they will never exceed the given dimensions and, unless the aspect ratio happens to match exactly, they will be smaller on one axis or the other.

*Images never exceed their original size.* If the original image is only 100x100, then all of the scaled versions will be no larger than that.

