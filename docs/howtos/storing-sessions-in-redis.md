# Storing Sessions in Redis and Other Session Stores

By default, Apostrophe stores sessions in its MongoDB database. That makes it easier to install Apostrophe. But many developers prefer Redis for sessions. Here's how to configure that.

1. Add the `connect-redis` module to your project's npm dependencies:

```
npm install --save connect-redis
```

2. In `app.js`, configure the `apostrophe-express` module to use it:

```javascript
'apostrophe-express': {
  session: {
    secret: 'your-secret-here',
    store: {
      name: 'connect-redis',
      options: {
        // redis-specific options here. If you don't give any,
        // the redis server on localhost is used
      }
    }
  }
}
```

Notice that you don't have to use `require` because Apostrophe does it for you.

This technique is not limited to Redis. You can use any store that follows the standard conventions for connect/Express session store modules.

The `options` object you supply is passed on to the store when it is created. For more information about options for Redis, see the [connect-redis](https://www.npmjs.com/package/connect-redis) documentation.

## "What about caches?"

You can also remap Apostrophe's cache mechanism to Redis. Check out the optional  [apostrophe-caches-redis](https://npmjs.org/package/apostrophe-caches-redis) module.
