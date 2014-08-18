---
title: Pushing data to the browser
---

Sometimes code on the server side needs to pass data to JavaScript code in the browser.

People solve it all sorts of ways, but Apostrophe provides really convenient solutions.

## Passing data with the "json" filter in nunjucks

It is possible to send data from a Nunjucks template directly into a `script` tag without the risk of broken markup. For simple cases this is often the best way. Just use the `json` filter:

```javascript
<script type="text/javascript">
var myData = {{ data | json }};
</script>
```

This will correctly stuff your data into `myData`, no matter how complex it is, as long as it is JSON-friendly (just about anything except functions, `Date` objects and regular expressions).

The JSON filter is smart enough to escape characters that are technically valid in JSON but would break your `script` tag.

## Pushing data for every request

Sometimes data is important enough that you want the browser to see it on every single page request. For that, use `apos.pushGlobalData`.

When I do this on the server side:

```javascript
apos.pushGlobalData({
  shoeBrands: [ 'nike', 'adidas' ]
});
```

I can see that data on the browser side:

```javascript
console.log(apos.data.shoeBrands);
```

Always pass an object to `pushGlobalData`. That object will be merged with the `apos.data` object on the browser side.

You can make as many calls as you need to. You may pass objects with properties that are objects, and so on. If it's compatible with JSON, it will work.

`pushGlobalData` will *always escape your data correctly*, so you don't have to worry about a double-quote in your data breaking a quoted string in your inline JavaScript, etc.

## Pushing data for one request

Other times, data is only relevant to the current request. For that, use `req.pushData`:

```javascript
req.pushData({
  myShoeSize: 5
});
```

This works just like `pushGlobalData`, merging into the `apos.data` object in the browser:

```javascript
console.log(apos.data.myShoeSize);
```

The only difference is that the data is only pushed for the current request.

### A warning

The `pushGlobalData` and `pushData` techniques work out of the box when you're preparing to render an entire page. If you're writing a page loader function, overriding `index` or `show` in a snippet subclass, or doing something similar, then they will work great for you. They also work great with the `renderPage` method provided by `mixinModuleAssets`, which is available in most modules.

If you are returning an HTML fragment as an AJAX response, you'll want to call `apos.getGlobalData()` and `apos.getData(req)` to obtain JavaScript source code ready to insert in your own `script` tag to do the work. or, just use the `json` filter.

