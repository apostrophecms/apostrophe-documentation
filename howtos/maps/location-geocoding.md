---
title: "Location geocoding"
---

The map module will automatically geocode newly created or imported locations using [Geocoder](https://github.com/wyattdanger/geocoder) as long as they contain an address. When creating a single map location, the geocoding is fairly instantaneous. When dealing with a large number of locations simultaneously, the geocoder may hit rate limits, in which case it will continue geocoding as long as the node process continues to run.


If you are running in a multiple-process environment, like `cluster`, you should set the `startGeocoder` option to `false` and explicitly invoke the `startGeocoder` method from one and only one process to avoid hitting API rate limits.
