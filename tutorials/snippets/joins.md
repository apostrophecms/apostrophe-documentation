---
title: "Joins in Schemas"
---

TODO: 30,000ft overview of a join and what it allows you to do.

You may use the `join` type to automatically pull in related objects from this or another module. Typical examples include fetching events at a map location, or people in a group. This is very cool.

*"Aren't joins bad? I read that joins were bad in some NoSQL article."*

Short answer: no.

Long answer: sometimes. Mostly in so-called "webscale" projects, which have nothing to do with 99% of websites. If you are building the next Facebook you probably know that, and you'll denormalize your data instead and deal with all the fascinating bugs that come with maintaining two copies of everything.

Of course you have to be smart about how you use joins, and we've included options that help with that.

### One-To-One Joins

In your configuration for the events module, you might write this:

```javascript
'apostrophe-events': {
  addFields: [
    {
      name: '_location',
      type: 'joinByOne',
      withType: 'mapLocation',
      idField: 'locationId',
      label: 'Location'
    }
  ]
}
```

As with other schema fields, **we do not have to add them to `new.html`**. `snippetAllFields` will cover it. You can use the `placeholder` option when configuring the field to adjust the text displayed in the autocomplete text field.

However, *if you wish to output a join field directly yourself*, you should do it like this:

```twig
{{ snippetSelective('_location', 'Location') }}
```

Now the user can pick a map location for an event. And anywhere the event is used on the site, you'll be able to access the map location as the `_location` property. Here's an example of using it in a Nunjucks template:

```twig
{% if item._location %}
  <a href="{{ item._location.url | e }}">Location: {{ item._location.title | e }}</a>
{% endif %}
```

The id of the map location "lives" in the `location_id` property of each event, but you won't have to deal with that directly.

*Always give your joins a name starting with an underscore.* This warns Apostrophe not to store this information in the database permanently where it will just take up space, then get re-joined every time anyway.

### Reverse Joins

This is awesome. But what about the map module? Can we see all the events in a map location?

Yup:

```javascript
'apostrophe-map': {
  addFields: [
    {
      name: '_events',
      type: 'joinByOneReverse',
      withType: 'event',
      idField: 'locationId',
      label: 'Events'
    }
  ]
}
```

Now, in the `show` template for the map module, we can write:

```twig
{% for event in item._events %}
  <h4><a href="{{ event.url | e }}">{{ event.title | e }}</a></h4>
{% endfor %}
```

"Holy crap!" Yeah, it's pretty cool.

Note that the user always edits the relationship on the "owning" side, not the "reverse" side. The event has a `location_id` property pointing to the map, so users pick a map location when editing an event, not the other way around.

### Nested Joins: You Gotta Be Explicit

*"Won't this cause an infinite loop?"* When an event fetches a location and the location then fetches the event, you might expect an infinite loop to occur. However Apostrophe does not carry out any further joins on the fetched objects unless explicitly asked to.

*"What if my events are joined with promoters and I need to see their names on the location page?"* If you really want to join two levels deep, you can "opt in" to those joins:

```javascript
'apostrophe-map': {
  addFields: [
    {
      name: '_events',
      ...
      withJoins: [ '_promoters' ]
    }
  ]
}
```

This assumes that `_promoters` is a join you have already defined for events.

*"What if my joins are nested deeper than that and I need to reach down several levels?"*

You can use "dot notation," just like in MongoDB:

```javascript
withJoins: [ '_promoters._assistants' ]
```

This will allow events to be joined with their promoters, and promoters to be joiend with their assistants, and there the chain will stop.

You can specify more than one join to allow, and they may share a prefix:

```javascript
withJoins: [ '_promoters._assistants', '_promoters._bouncers' ]
```

Remember, each of these joins must be present in the configuration for the appropriate module.

### Many-To-Many Joins

Events can only be in one location, but stories can be in more than one book, and books also contain more than one story. How do we handle that?

Consider this configuration for a `books` module:

```javascript
'books': {
  ... other configuration, probably subclassing snippets ...
  addFields: [
    {
      name: '_stories',
      type: 'joinByArray',
      withType: 'story',
      idsField: 'storyIds',
      sortable: true,
      label: 'Stories'
    }
  ],
}
```

Now we can access all the stories from the show template for books (or the index template, or pretty much anywhere):

```twig
<h3>Stories</h3>
{% for story in item._stories %}
  <h4><a href="{{ story.url | e }}">{{ story.title | e }}</a></h4>
{% endfor %}
```

*Since we specified `sortable:true`*, the user can also drag the list of stories into a preferred order. The stories will always appear in that order in the `._stories` property when examinining a book object.

*"Many-to-many... sounds like a LOT of objects. Won't it be slow and use a lot of memory?"*

It's not as bad as you think. Apostrophe typically fetches only one page's worth of items at a time in the index view, with pagination links to view more. Add the objects those are joined to and it's still not bad, given the performance of v8.

But sometimes there really are too many related objects and performance suffers. So you may want to restrict the join to occur only if you have retrieved only *one* book, as on a "show" page for that book. Use the `ifOnlyOne` option:

```javascript
'stories': {
  addFields: [
    {
      name: '_books',
      withType: 'book',
      ifOnlyOne: true,
      label: 'Books'
    }
  ]
}
```

Now any call to fetch books that retrieves only one object will carry out the join with stories. Any call that returns more than one object won't. You don't have to specifically call `books.getOne` rather than `books.get`.

Hint: in index views of many objects, consider using AJAX to load related objects when the user indicates interest if you don't want to navigate to a new URL in the browser.

### Reverse Many-To-Many Joins

We can also access the books from the story if we set the join up in the stories module as well:

```javascript
'stories': {
  ... other needed configuration, probably subclassing snippets ...
  addFields: [
    {
      name: '_books',
      type: 'joinByArrayReverse',
      withType: 'book',
      idsField: 'storyIds',
      label: 'Books'
    }
  ]
}
```

Now we can access the `._books` property for any story. But users still must select stories when editing books, not the other way around.

### When Relationships Get Complicated

What if each story comes with an author's note that is specific to each book? That's not a property of the book, or the story. It's a property of *the relationship between the book and the story*.

If the author's note for every each appearance of each story has to be super-fancy, with rich text and images, then you should make a new module that subclasses snippets in its own right and just join both books and stories to that new module.

But if the relationship just has a few simple attributes, there is an easier way:

```javascript
'books': {
  ... other needed configuration, probably subclassing snippets ...
  addFields: [
    {
      name: '_stories',
      label: 'Stories',
      type: 'joinByArray',
      withType: 'story',
      idsField: 'storyIds',
      relationshipField: 'storyRelationships',
      relationship: [
        {
          name: 'authorsNote',
          type: 'string'
        }
      ],
      sortable: true
    }
  ]
}
```

Currently "relationship" properties can only be of type `string` (for text), `select` or `boolean` (for checkboxes). Otherwise they behave like regular schema properties.

*Warning: the relationship field names `label` and `value` must not be used.* These names are reserved for internal implementation details.

Form elements to edit relationship fields appear next to each entry in the list when adding stories to a book. So immediately after adding a story, you can edit its author's note.

Once we introduce the `relationship` option, our templates have to change a little bit. The `show` page for a book now looks like:

```twig
{% for story in item._stories %}
  <h4>Story: {{ story.item.title | e }}</h4>
  <h5>Author's Note: {{ story.relationship.authorsNote | e }}</h5>
{% endfor %}
```

Two important changes here: *the actual story is `story.item`*, not just `story`, and `relationship fields can be accessed via `story.relationship`*. This change kicks in when you use the `relationship` option.

Doing it this way saves a lot of memory because we can still share book objects between stories and vice versa.

### Accessing Relationship Properties in a Reverse Join

You can do this in a reverse join too:

```javascript
'stories': {
  ... other needed configuration, probably subclassing snippets ...
  addFields: [
    {
      name: '_books',
      type: 'joinByArrayReverse',
      withType: 'book',
      idsField: 'storyIds',
      relationshipField: 'storyRelationships',
      relationship: [
        {
          name: 'authorsNote',
          type: 'string'
        }
      ]
    }
  ]
}
```

Now you can write:

```twig
{% for book in item._books %}
  <h4>Book: {{ book.item.title | e }}</h4>
  <h5>Author's Note: {{ book.relationship.authorsNote | e }}</h5>
{% endfor %}
```

As always, the relationship fields are edited only on the "owning" side (that is, when editing a book).

*"What is the `relationshipField` option for? I don't see `story_relationships` in the templates anywhere."*

Apostrophe stores the actual data for the relationship fields in `story_relationships`. But since it's not intuitive to write this in a template:

```twig
{# THIS IS THE HARD WAY #}
{% for story in book._stories %}
  {{ story.item.title | e }}
  {{ book.story_relationships[story._id].authorsNote | e }}
{% endif %}
```

Apostrophe instead lets us write this:

```twig
{# THIS IS THE EASY WAY #}
{% for story in book._stories %}
  {{ story.item.title | e }}
  {{ story.relationship.authorsNote | e }}
{% endif %}
```

*Much better.*

## Custom Properties and Joins for Index Pages

So far we've added properties to snippets themselves... such as blog posts and events.

But what about the "blog" and "events" index pages that display them? It is sometimes useful to add properties to these too.

You can do that by passing the `indexSchema` option when you configure the module in `app.js`. You can pass `addFields`, `removeFields`, `orderFields` and `alterFields` properties, exactly as you would when adding properties to snippets.

You may use joins as well. In fact, there is no reason you can't join "index" types with "instance" types and vice versa.

Index pages carry out their joins when the page is visited, so if you decide to join an events page with mapLocations, you can display your chosen locations on the events page.

It is also possible to fetch all the index pages of a particular index type programmatically:

```javascript
    snippets.getIndexes(req, criteria, options, callback)
```

Your callback receives an error if any, and if no error, an array of index pages. Joins are carried out according to the schema.
