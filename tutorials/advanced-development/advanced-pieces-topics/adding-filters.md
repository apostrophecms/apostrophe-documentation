# Filters for the "manage" modal

In the "manage" modal, enabling a "tags" filter for admins is often handy:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

You can also allow multiple tags to be selected, in which case pieces with at least one of those tags are displayed:

{% code-tabs %}
{% code-tabs-item title="lib/modules/people/index.js" %}
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
{% endcode-tabs-item %}
{% endcode-tabs %}

The same approach works for most types of schema fields, including joins. We do not recommend using it if the number of items in the dropdown will be very large. However, adding options to support filters that employ typeahead and avoid sending a large list of options to the browser is on our roadmap for the future.
