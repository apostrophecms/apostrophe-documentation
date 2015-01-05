---
title: Storing images and files in Amazon S3
---

You can store your images and files in Amazon S3 if you wish. You don't have to use the local file system.

This is essential to host an Apostrophe site on Heroku, or an Amazon EC2 instance without persistent storage.

Just take advantage of the [uploadfs](https://github.com/punkave/uploadfs) module, which is built into Apostrophe.

First sign up for [Amazon Web Services](http://aws.amazon.com/s3/) and create an S3 bucket in which to store your files. **Do not use the us-east region** for reasons explained below.

During the signup process you will obtain an AWS secret and key which are needed as part of the configuration.

Here's a working Amazon S3 configuration. Just add an `uploadfs` property to your configuration in `app.js`:

```javascript
uploadfs: {
  backend: 's3',
  secret: 'YOUR AMAZON SECRET',
  key: 'YOUR AMAZON KEY',
  bucket: 'your-bucket-name',
  region: 'us-west-2'
}
```

With this configuration all file uploads are written to S3 instead of the local file system.

## Why not US-East?

The US-East region is misnamed; it is really "US Standard," and it serves files from both Oregon and Virginia.

As a consequence, it does not offer "read after write" consistency. This means that a file that `uploadfs` just stored will **not necessarily be available to view right away.** This is **not a good user experience** for users who are uploading images to Apostrophe and expecting to see them right away.

[See this article for a detailed description of how long "eventual" consistency can really take.](http://www.stackdriver.com/eventual-consistency-really-eventual/)

So, just use a bucket in any other region, such as `us-west-2`.
