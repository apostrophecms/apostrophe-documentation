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





