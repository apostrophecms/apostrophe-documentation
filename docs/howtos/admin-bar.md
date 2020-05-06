# Building combined menus and custom buttons with the admin bar

## Grouping admin bar items into dropdown menus

Apostrophe's admin bar automatically contains buttons to manage every subclass of pieces in your project, among other things. It's nice, but it can quickly become too wide.

Here's an example from the `app.js` file of one of our projects in which the buttons to manage several types of pieces are merged together into a dropdown menu or "group" labeled "Content:"

```javascript
// app.js
modules: {
  'apostrophe-admin-bar': {
    addGroups: [
      {
        label: 'Content',
        items: [
          'programs',
          'apostrophe-events',
          'apostrophe-blog',
          'locations',
          'shareholders',
          'success-stories'
        ]
      }
    ]
  }
}
```

*The name of each item is usually the same as the name of the module it came from.* This is always the case for everything derived from `apostrophe-pieces`.

Of course you can put more than one "group" in that array if you wish.

If you're happy using the label of the first item as the label of the dropdown menu, there's a simpler syntax:

```javascript
// app.js
modules: {
  'apostrophe-admin-bar': {
    addGroups: [
      [
        'apostrophe-users',
        'apostrophe-groups'
      ]
    ]
  }
}
```

This merges the `Users` and `Groups` buttons into a single dropdown labeled `Users`.

## Overriding existing groups

Sometimes modules suggest groupings of their own. If you want to override those groupings entirely and specify exactly the groups you want, ignoring all others, just use the `groups` option rather than `addGroups`.

## Adding new admin bar items in your code

If you are subclassing `apostrophe-pieces`, you will automatically get an admin bar item for your type. But what if you're creating a custom module, or you want an extra admin bar item?

It's easy to add one from your module's code:

```javascript
self.apos.adminBar.add(self.__meta.name, 'Monkeys')
```

*`self.__meta.name` is always the name of the current module. This is helpful if someone might subclass your module later, so it's a good habit to use it.*

## Restricting admin bar items based on permissions

We can limit visibility of an admin bar item to people who have a certain permission using the third argument:

```javascript
self.apos.adminBar.add(self.__meta.name, 'Monkeys', 'edit-monkeys')
```

Our module would also need to register the `edit-monkeys` permission so it can be given out to groups:

```javascript
self.apos.permissions.add({ value: 'edit-monkeys', label: 'Edit Monkeys' });
```

*This is done for you if you're subclassing pieces. Registering new permissions is useful if you want to check for custom permissions.*

**Requiring a permission to see an admin bar item doesn't actually secure anything.** You need to secure the routes that power the back end of your features, too.

## Implementing browser-side JavaScript to respond to an admin bar item

This is very easy. If our module has a singleton on the browser side with the same name as the module, we can write:

```javascript
apos.adminBar.link(self.__meta.name, function() {
  // Take action
});
```

Or you could hard-code the name of the admin bar item:

```javascript
apos.adminBar.link('apostrophe-monkeys', function() {
  // Take action
});
```
