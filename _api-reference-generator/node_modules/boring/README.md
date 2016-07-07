# boring

<a href="http://apostrophenow.org/"><img src="https://raw.github.com/punkave/boring/master/logos/logo-box-madefor.png" align="right" /></a>

A command line argument parser without pirates

## what you get

When someone types:

```
node app jump sideways --foo --bar=whee --super-cool=totally
```

You get:

```javascript
{
  _: [ "jump", "sideways"],
  foo: true,
  bar: "whee",
  "super-cool": "totally"
}
```

Notice that parameters without `--`, if any, go into the `_` array. Parameters with `--` become properties in their own right.

## How you get it

```javascript
var argv = require('boring')();
```

## What you don't get

### Single hyphens: nope

There is no support for old-fashioned "single-hyphen" options, like:

```
-x 50
```

Or:

```
-h
```

You can't tell which are boolean and which take arguments unless a specification is passed in. And that's not boring enough for me.

### Usage messages, strictness, etc.: nope

These are very simple to implement, and if you're like me, you'd rather do it yourself.

## Philosophy

I have nothing against full-featured, pirate-themed option parsers, which are very nice if you're into that sort of thing. I just find myself walking the plank when my options don't follow the pattern of what's easy to validate with piracy.

This simple module is too dumb to break.

## About P'unk Avenue and Apostrophe

`boring` was created at [P'unk Avenue](http://punkave.com) for use in Apostrophe, an open-source content management system built on node.js. If you like `boring` you should definitely [check out apostrophenow.org](http://apostrophenow.org). Also be sure to visit us on [github](http://github.com/punkave).

## Support

Feel free to open issues on [github](http://github.com/punkave/boring).

<a href="http://punkave.com/"><img src="https://raw.github.com/punkave/boring/master/logos/logo-box-builtby.png" /></a>
