---
title: "Reusable Content With Pieces"
layout: reference
children:
  - reusable-content-with-pieces
  - displaying-pieces-with-widgets
  - browsing-directory-of-pieces
  - joins
---

When you build a website, you could look at it like a puzzle. Each element of the site needs to fit together so you can see the whole picture. In Apostrophe, any kind of structured content is a “piece” and that content becomes pieces of the puzzle that you’re putting together as you build your site. You can use pieces for things ranging from defining a standard format for a blog post to creating a new entity type like “bikes” for a bike shop. Apostrophe uses pieces internally to define different content out of the box – and many other things like users, that you might not think of as “content” – and you can harness that same power to put the pieces of your own puzzle together.

Take a bike shop as an example: you could create individual pages for everything you sell – each type of bike, each type of helmet, and each repair service that you offer – but you’d up with a messy site that would quickly become unmanageable. So instead, you take a step back, and think about the components that you need to build your content, and create a piece type for each one: bikes, helmets, accessories, services, etc.. Each individual item is created as a piece. When you get a new model bike in stock, you create a new piece from the bike piece type, and the associated page and entry is automatically created. In Apostrophe, pieces are the key to designing, building, and maintaining your site.

* [Pieces](/tutorials/core-concepts/pieces/pieces.md)
* [Example: Creating a Content Type with Pieces](/tutorials/core-concepts/pieces/pieces-example.md)
* [Example: Pieces with Joins](/tutorials/core-concepts/pieces/joins.md)
