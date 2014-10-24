---
title: Manipulating files
---

Something about files being stored in a the aposFiles collection, and how using these methods on the apos object will allow you to get or create or manipulate these files.

Some details on the file objects that are returned from most of these functions

```javascript
{
	_id: 9913834171,
	group: 'image',
	extention: 'jpg',
	// ...incomplete?
}
```

## Finding Files

Use these methods to search across all files in your Apostrophe website. Because they are going to the database to find files, they are asyncronous.

### `getFiles(req, options, callback)` `(object)`

Fetch files according to the parameters specified by the `options` object.

`req` (object) the current Express request object [TODO: link to tutorial re: req objects], for permissions.
`options` (object) An object containing all options.
`callback` (function) called on completion, with error if any.

The returned object contains the following information

```javascript
{
	// count of files that match criteria
	total: 1
	// array of file object
	result: [{...}],
	// distinct set of tags for all of the files returned
	tags: ['cool', 'awesome'],
	// ...incomplete?
}
```

#### Example

```javascript
// in context
	// TODO

// with all available options, with defaults if applicable
apos.getFiles(req, {
	// Populates a ._owner propery on each file object that is the Person object of the owner if set to true
	// This is set to false by default for performance reasons
	owners: false,
	// Specifies the file type group, by default 'images' and 'office' are available, pass as string
	group: null,
	// Specifies to only returns images owned by current user if set to 'user'
	owner: 'all',
	// Specifies ids to match, pass as array
	ids: null,
	// Specifies the owner id to filter on, pass as string
	ownerId: null,
	// Specifies the tags to filter on, pass as array
	tags: null,
	// Specifies to exclude images that contain the tags, pass as array
	notTags: null,
	// Specifies the extenion to filter on, pass as array
	extension: null,
	// Specifies to filter base on if the file is in the trash or not
	trash: 0,
	// Specifies minimum width and height for photos, pass as array [width, height]
	minSize: null,
	//
	browsing: ,
	q: ,
	skip: ,
	limit: ,

}, function(err, files){
	// ... do sometthing with the files ...
});
```

### `getFiles(req, options, callback)` `(object)`

Fetch files according to the parameters specified by the
`options` object. These properties are sanitized to ensure they are in the proper format. A sanitizing wrapper for [getFiles](#getFiles), which also always sets the `browsing` option to ensure that we only receive files we are entitled to add to our pages.


## Finding Files In Areas

Use these methods to find files that live in areas that belong to a page or snippet. Because they are referencing an area we already have in memory, they are syncronous.

### `areaFiles(page, 'body'[, options])` `(array)`

Find files referenced within an area, such as an image in a slideshow widget,
or a PDF in a file widget.

Returns all the files matching the criteria.

`page` (object) A page or snippet object that contains the area

`name` (string) Name of the area

`options` (object) *optional*. An object containing additional options

#### Example

```javascript
// in context
var superBeforeShow = self.beforeShow;
self.beforeShow = function(req, snippet, callback) {

	// pass all of the files from my snippet body to the template
	req.extras.bodyFiles = options.apos.areaFiles(snippet, 'body');

	return superBeforeShow(req, snippet, callback);
}


// with all available options
var files = apos.areaFiles(page, 'myArea', {
	// Specifies the acceptable file extension
	extension: 'gif',
	// Specifies multiple acceptable file extensions
	extensions: ['gif', 'png'],
	// Specifies the file type group, by default 'images' and 'office' are available
	group: 'office',
	// Specifies the limit for amount of returned files
	limit: 3
});


// alternative syntax using only an options object
// The area option is required, and it is a direct reference to your area
var files = apos.areaFiles({area: snippet.body});
```

### `areaFile(page, 'body' [, options])` `(object)`

This is a convenience method that returns the first file referenced within an area (an option of `limit: 1`), and takes all of the same parameters as [areaFiles](#area-files). It also allows for the alternative syntax.

### `areaImages(page, 'body' [, options])` `(array)`

This is a convenience method that returns files with a `group: 'image'` property referenced within an area, and takes all of the same parameters as [areaFiles](#area-files). It also allows for the alternative syntax.

### `areaImage(page, 'body' [, options])` `(object)`

This is a convenience method that returns the first file with a `group: 'image'` property referenced within an area (an option of `limit: 1`), and takes all of the same parameters as [areaFiles](#area-files). It also allows for the alternative syntax.