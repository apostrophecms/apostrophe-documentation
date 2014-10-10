### areaImage

Find an image referenced within an area, such as an image in a slideshow widget.
Returns the first image matching the criteria. Only GIF, JPEG and PNG images
will ever be returned.


#### areaImage(page, 'areaName', [options])

`page` (object)  A page or snippet object that contains the area
`'areaName'` (string) The name of the area
`options` (object) An object containing additional options


##### Example

```javascript
apos.areaImage(page1, 'coolArea');

//with options object
apos.areaImage(page1, 'coolArea', {extension: 'gif'});
```

##### options

###### extension

Specifies the file extension

Syntax example

```javascript
{ extension: 'jpg' }
```

######  extensions

Specifies the file extensions

Syntax example

```javascript
{ extension: ['jpg', 'gif']}
```


#### areaImage({ area: page.body }) *alternate syntax*

`{ area: page.body }` (object) An object containing all options. The `area` property is requiered.

### areaImages

Find images referenced within an area, such as images in a slideshow widget.
Returns all the files matching the criteria unless the "limit" option is used.


#### areaImages(page, 'areaName', [options])

`page` (object)  A page or snippet object that contains the area
`'areaName'` (string) The name of the area
`options` (object) An object containing additional options


##### Example

```javascript
apos.areaImages(page1, 'coolArea');

//with options object
apos.areaImages(page1, 'coolArea', {extension: 'gif', limit: 3});
```

##### options

###### extension 

Specifies the file extension

Syntax example 

```javascript
{ extension: 'jpg' }
```

######  extensions

Specifies the file extensions

Syntax example

```javascript
{ extension: ['jpg', 'gif']}
```
######  limit

Specifies the number of images to be returned. Note that
`areaImage` is more convenient than `areaImages` if limit is 1.

Syntax example

```javascript
{ limit: 3}
```

#### areaImages({ area: page.body }) *alternate syntax*

`{ area: page.body }` (object) An object containing all options. The `area` property is requiered.

### browseFiles

Fetch files according to the parameters specified by the
`options` object. These properties are sanitized to ensure they are in the proper format.  
Wrapper for `getFiles` which always sets the
`browsing` option to restrict permissions to files this user is allowed to browse even 
if they are not already on a page.


#### browseFiles(req, options, callback)

`req` (object) the current Express request object [TODO: link to tutorial re: req objects], for permissions.
`options` (object) An object containing additional options
`callback` (function) called on completion, with error if any.


##### Example

```javascript
apos.browseFiles(req, options, callback);
```
##### options

###### owners


###### group (string)

Specifies the file group 

```javascript
{ group: 'groupName'}
```

###### owner (string)

Specifies either current users files of all users files using `user` or `all`

```javascript
{ owner: 'all'}
```

###### extension

Specifies the file extensions

Syntax example

```javascript
{ extension: ['jpg', 'gif']}
```

###### ids

###### q

###### skip

###### minSize (array)

Specifies the minSize of the file with array `[width, height]`. Note: using this option will only return images.

######  limit

Specifies the number of images to be returned. Note that
`areaImage` is more convenient than `areaImages` if limit is 1.

Syntax example

```javascript
{ limit: 3}
```

#### areaImages({ area: page.body }) *alternate syntax*

`{ area: page.body }` (object) An object containing all options. The `area` property is requiered.










