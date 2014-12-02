---
title: "Exporting Snippets"
---

To enable the ability for admins to export snippets add `enableExport: true` to the app.js configuration of a specific snippet.

CSV and TSV formats are available.  Additionally, you can add  XLSX (Excel 2007) format by adding the [apostrophe-xlsx](www.github.com/punkave/apostrophe-xlsx) module to your project.

Certain fields are ommited by default, including `id`, `password`, `groupIds`, and search related fields.  To fit other needs, you can configure the exported fields by using these options:  

`exportIncludeFields`<br>
An array of all the fields you want to include in the exported data.  All other fields will be ommited.

`exportExcludeFields`<br>
An array of all the fields you want to exlude in the exported data.  All other fields will be included.

### Example
```javascript
schools: {
  extend: 'apostrophe-snippets',
  name: 'schools'
  enableExport: true,
  exportIncludeFields: ['title', 'address', 'tuition'],
  // OR
  exportExcludeFields: ['_id', 'published'],
  ...
}
```