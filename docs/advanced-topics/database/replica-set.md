# Using MongoDB replica sets with Apostrophe

[MongoDB replica sets](https://docs.mongodb.com/manual/replication/) provide redundant, highly available storage. Their purpose is to enhance reliability, not speed. For more information, see the [MongoDB documentation](https://docs.mongodb.com/manual/replication/).

Once you have [created a MongoDB replica set](https://docs.mongodb.com/manual/replication/), you can connect to it by configuring Apostrophe to use the replica set's URI:

```javascript
modules: {
  // Other modules, then...
  'apostrophe-db': {
    uri: 'mongodb://host1,host2,host3/database-name?replicaSet=replica-set-name'
  }
}
```

`host1`, `host2` and `host3` are the hosts that make up your replica set. You should substitute the correct hostnames. This is just an example. If necessary you can specify nonstandard ports as well. See the MongoDB URI documentation.

`database-name` should be the database name for your site, typically the same as the shortname of the site.

`replica-set-name` should be the name that was given to the replica set while configuring it. Providing the `replicaSet` parameter in this way ensures that the MongoDB driver for Node.js understands that it is a replica set and can take advantage of a replica set's ability to change primary nodes if one of the servers goes down.

## Changing the read preference

We do not recommend changing the MongoDB "read preference," and generally speaking, [neither does MongoDB](https://docs.mongodb.com/manual/core/read-preference/). It does not enhance throughput significantly and Apostrophe expects data to be reliably readable as soon as it is written. The purpose of using a replica set with Apostrophe is to enhance reliability by providing failover in the event of a server failure.

## Performance improvements

If speed is your concern, replica sets are not the solution to that particular problem. The throughput of MongoDB is quite high, and you will often find that Apostrophe's node processes saturate the CPU before MongoDB does. If so, see the [multiple cores and/or servers](/tutorials/devops/multicore.md) HOWTO.
