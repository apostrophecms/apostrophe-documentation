---
title: "Exporting Snippets"
---

To enable the ability for admins to export snippets add `enableExport: true` to the app.js configuration of a specific snippet.

CSV and TSV formats are available.  Additionally, you can add  XLSX (Excel 2007) format by adding the [apostrophe-xlsx](www.github.com/punkave/apostrophe-xlsx) module to your project.

All schema fields are included by default.  However, you can set individual fields to `exportable: false` to exclude them.

### Example
```javascript
schools: {
  extend: 'apostrophe-snippets',
  name: 'schools'
  // Enable export functionality for admins
  enableExport: true,
  addFields: [
  	...
	// Don't export this field
	{
		name: 'secret',
		label: 'Secret',
		exportable: false
	}
	...
  ]
  ...
}
```