# `attachment`

An `attachment` field allows the user to upload a file to the server, or replace a file which was previously [uploaded](/api/apostrophe-attachments/README.md).

::: tip NOTE
The uploaded files are stored in a web-accessible folder, however their names are generated in a way which makes them mathematically impossible to guess.
:::

Once an attachment field has a value, you can obtain a URL to the file by calling `apos.attachments.url(attachment)`. If the file is an image, you can obtain images of any configured size by calling `apos.attachments.url(attachment, { size: 'one-half' })`, etc.

Attachments are most often used indirectly via [apostrophe-images-widgets](/api/apostrophe-images-widgets/README.md) or [apostrophe-files-widgets](/api/apostrophe-files-widgets/README.md), which are backed by the [apostrophe-images](/api/apostrophe-images/README.md) and [apostrophe-files](/api/apostrophe-files/README.md) subclasses of pieces. Each of those piece types contains an attachment field and some metadata fields, making them a convenient way to reuse files.

However, you may also use attachments directly in your own schemas. Doing so means that the file will not be available via a general-purpose "media library." It will only be readily accessible as a property of your object.

This is often appropriate for resumes, job applications and other attachments relating to a specific person.

## Example

```javascript
{
  type: 'attachment',
  name: 'resume',
  label: 'Resume',
  group: 'office'
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
|htmlHelp | `string` | | Help text with support for HTML markup | universal |
|group | `string` |  | Can be set to "image" or "office" to limit the file types that can be uploaded. Other groups can be configured via the `fileGroups` option of the [apostrophe-attachments](/api/apostrophe-attachments/README.md) module. |
|crop | boolean | false | If true, the user may crop the attachment. Only suitable if group is images. |
|aspectRatio | array | | if set to an array like \[ 2, 1 \], the image must have that aspect ratio and will be autocropped if the user does not manually crop. Only suitable if group is images. |
|minSize | array | | if set to an array like \[ 640, 480 \], the image must have at least the specified minimum width and height. Only suitable if group is images. |

