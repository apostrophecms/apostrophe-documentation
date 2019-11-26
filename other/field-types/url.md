# `url`

`url` adds an editable URL field to the schema.

{% hint style="info" %}
Apostrophe will detect common mistakes, like leaving off `http://`, and add them. Common XSS attack vectors are laundered and discarded. Only "safe" URL schemes, e.g. `http`, `https`, `ftp` and `mailto`, are permitted.
{% endhint %}

## Example

```javascript
{
  name: 'portfolio',
  label: 'Portfolio URL',
  type: 'url'
}
```

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
