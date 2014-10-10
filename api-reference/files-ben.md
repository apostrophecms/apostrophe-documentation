
### areaFile

Find a file referenced within an area, such as an image in a slideshow widget,
or a PDF in a file widget.

Returns the first file matching the criteria.

#### areaFile(page, name, [options])

`page` (object) A page or snippet object that contains the area

`name` (string) Name of the area

`options` (object) *optional*. An object containing additional options

##### Example

```javascript
apos.areaFile(page, 'body');

// with options object
apos.areaFile(page, 'body', { extension: 'jpg' });
```
##### options

###### extension (string)

An extension to use for filtering the results.

Example

```javascript
{ extension: 'jpg' }
```

###### extentions (array)

Extensions to use for filtering the results.

Example

```javascript
{ extensions: ['jpg','png'] }
```

###### group (string)

A group to use for filtering the results. By default the `images` and `office` groups
are available.

```javascript
{ group: 'office' }
```

*Note:* If you are using `group: "images"` consider calling apos.areaImage instead.
This is convenient and protects you from accidentally getting a PDF file.

#### apos.areaFile(options) *Alternative Syntax*

*options* (object): An object containing all options. The `area` property is required.

This alternative syntax takes a direct reference to the area that refernces a file. 

##### Example

```javascript
apos.areaFile({ area: page.body })
```


* * * 



### apos.areaFiles

Find a file referenced within an area, such as an image in a slideshow widget,
or a PDF in a file widget.

Returns all the files matching the criteria unless the "limit" option is used.

#### areaFiles(page, name, [options])

`page` (object) A page or snippet object that contains the area

`name` (string) Name of the area

`options` (object) *optional*. An object containing additional options

##### Example

```javascript
apos.areaFiles(page, 'body');

// with options object
apos.areaFiles(page, 'body', { extension: 'jpg' });
```
##### options

All options available in [areaFile](#area-file) are available in _areaFiles_.

###### limit (integer)

Limits the number of files returned.

Example

```javascript
{ limit: 3 }
```

#### apos.areaFiles(options) *Alternative Syntax*

*options* (object): An object containing all options. The `area` property is required.

This alternative syntax takes a direct reference to the area that refernces a file. 

##### Example

```javascript
apos.areaFiles({ area: page.body })
```

### apos.areaFindFile


