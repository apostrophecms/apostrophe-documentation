# Filters for the "manage" modal

In the "manage" modal, enabling a "tags" filter for admins is often handy:

```javascript
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags'
    }
  ]
};
```

You can also allow multiple tags to be selected, in which case pieces with at least one of those tags are displayed:

```javascript
module.exports = {
  // Other configuration options, then...
  addFilters: [
    {
      name: 'tags',
      label: 'Tags',
      multiple: true
    }
  ]
};
```

The same approach works for most types of schema fields, including joins. We do not recommend using it if the number of items in the dropdown will be very large. However, adding options to support filters that employ typeahead and avoid sending a large list of options to the browser is on our roadmap for the future.
