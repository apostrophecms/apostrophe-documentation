---
title: Storing images and files in Google Cloud Storage (GCS)
layout: tutorial
---

You can store your images and files in Google Cloud Storage (GCS) if you wish. You don't have to use the local file system.

If you host in the Google cloud, this is essential to host an Apostrophe site in a multiserver configuration where the Node processes don't share the same filesystem (hint: they are on separate computers).

Just take advantage of the [uploadfs](https://github.com/punkave/uploadfs) module, which is built into Apostrophe.

First sign up for [Google Cloud Storage](https://cloud.google.com/storage/) and create a Google Cloud Storage bucket in which to store your files.

> When you create your bucket you must turn on support for Object ACLs.

Next, [go to "Credentials" in the Google Cloud Platform console](https://console.cloud.google.com/apis/credentials). Create a service account if you haven't already giving it the role "Cloud Storage Admin." Then create a "service account key under that account. The key will be downloaded to your computer. Move that file to your project.

Now add an `uploadfs` property to your configuration in `app.js`:

```javascript
modules: {
  'apostrophe-attachments': {
    uploadfs: {
      backend: 'gcs',
      bucket: 'yourownbucketnamefromgcs',
      region: 'us-east1'
    }
  }
}
```

Finally, **when you launch Apostrophe, make sure you set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable** to the location of the credentials file that you downloaded from the console. If you do not do this, you will get errors and it will not work.

> To distinguish dev from production, consider using
`process.env.GCS_BUCKET`, `process.env.GCS_REGION`, etc. to read
these values from environment variables as well.

With this configuration all file uploads are written to Google Cloud Storage instead of the local file system.

