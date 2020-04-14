# `sortify`

Any field type which has its value stored as a string can have a "Sortified" version which will make sorting case-insensitive and ignore punctuation.

## Case-insensitive, intuitive sorting

Setting `sortify: true` creates a parallel `Sortified` version of the field that is more intuitive for sorting purposes. Apostrophe will automatically use it if a request is made to sort on the original field.

For instance, if your field's `name` is `lastName` and you set `sortify: true`, `lastNameSortified` will automatically be created and used when sorting on the `lastName` field. This provides case-insensitive sorting that also ignores punctuation differences.

{% hint style='info' %}
Note: If you add `sortify: true` to an existing field, existing objects will get the sortified version of the field on the next deployment via the `apostrophe-migrations:migrate` command line task, or at the next startup when in development on your computer. Migrations like this only need to be run once because on future updates or inserts of a document the sortified property is automatically set.
{% endhint %}
