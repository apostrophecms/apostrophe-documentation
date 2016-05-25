---
title: "Custom image sizes"
previous: image-sizes-in-apostrophe
---

Although Apostrophe [provides standard image sizes to cover almost any situation](image-sizes-in-apostrophe.html), sometimes you'll want images that are larger or smaller than our standard options. In those cases, just add the `addImageSizes` option to your `apostrophe-site` configuration in `app.js`, like this:

```javascript
  addImageSizes: [
    {
      name: 'max',
      width: 1600,
      height: 1280
    }
  ],
```

With this configuration, the new `max` size can be up to 1600 pixels wide, and up to 1280 pixels tall. Now you can use `max` as a value for the `size` option when setting up slideshows or accessing images directly.

## Generating new sizes for old images

If your site already contains images, you'll need to run the following command line task:

```bash
node app apostrophe:rescale
```

If you have a lot of images, you should expect this task to take a long time.

We suggest adding the new size and running the task before you start actually using the new size in your templates.
