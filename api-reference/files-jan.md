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

