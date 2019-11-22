# `url`

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |

`url` adds an editable URL field to the schema. Apostrophe will detect common mistakes, like leaving off `http://`, and add those things. Common XSS attack vectors are laundered and discarded. Only "safe" URL schemes, e.g. `http`, `https`, `ftp` and `mailto`, are permitted.

Example:

```javascript
{
  name: 'portfolio',
  label: 'Portfolio URL',
  type: 'url'
}
```