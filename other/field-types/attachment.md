# `attachment`

An `attachment` field allows the user to upload a file to the server, or replace a file which was previously [uploaded](../modules/apostrophe-attachments/README.md).

{% hint style='info' %}
The uploaded files are stored in a web-accessible folder, however their names are generated in a way which makes them mathematically impossible to guess.
{% endhint %}

Once an attachment field has a value, you can obtain a URL to the file by calling `apos.attachments.url(attachment)`. If the file is an image, you can obtain images of any configured size by calling `apos.attachments.url(attachment, { size: 'one-half' })`, etc.

Attachments are most often used indirectly via [apostrophe-images-widgets](../../modules/apostrophe-images-widgets/README.md) or [apostrophe-files-widgets](../../modules/apostrophe-files-widgets/README.md), which are backed by the [apostrophe-images](../../modules/apostrophe-images/README.md) and [apostrophe-files](../../modules/apostrophe-files/README.md) subclasses of pieces. Each of those piece types contains an attachment field and some metadata fields, making them a convenient way to reuse files.

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
| type | `string` | | Specifies the field type |
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| group | `string` |  | Can be set to "image" or "office" to limit the file types that can be uploaded. Other groups can be configured via the `fileGroups` option of the [apostrophe-attachments](../../modules/apostrophe-attachments/README.md) module. |

