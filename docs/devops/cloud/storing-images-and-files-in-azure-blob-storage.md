# Storing images and files in Azure Blob Storage

You can store your images and files in Azure Blob Storage if you wish. You don't have to use the local file system.

If you host your servers on Azure virtual machines, this is essential to host your Apostrophe site in a multiserver configuration where the Node processes don't share the same filesystem (hint: they are separate virtual computers).

Just take advantage of the [uploadfs](https://github.com/punkave/uploadfs) module, which is built into Apostrophe.

First sign up for [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) and create a blob storage container. Also obtain an API key.

Now add an `uploadfs` property to your configuration in `app.js`:

```javascript
modules: {
  'apostrophe-attachments': {
    uploadfs: {
      storage: 'azure',
      account: 'myaccountname',
      container: 'mycontainername',
      key: 'YOUR-key-goes-here',
      disabledFileKey: 'YOU-set-this-random-string'
    }
  }
}
```

> To distinguish dev from production, consider using
`process.env.AZURE_BLOB_ACCOUNT`, `process.env.AZURE_BLOB_KEY`, etc. to read
these values from environment variables as well.

With this configuration all file uploads are written to the Azure Blob Storage service instead of the local file system.

