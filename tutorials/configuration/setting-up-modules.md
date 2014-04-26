---
title: "Setting up Modules"
---

## Adding Modules to the Admin Bar

Adding a module to the `modules` property in the `apostrophe-site` configuration of `app.js` does most of the work, but you usually need to add a menu to the admin bar as well. For instance, you'll want the "blog" menu to be added at the top of the page when the blog module is installed.

In our sandbox site or a project cloned from it, you would do that in `outerLayout.html`. Just look for calls like this one:

```
{{ aposBlogMenu({ permissions }) }}
```

... And add the appropriate call for the module you're introducing, as described in its documentation. (Tip: if you're [subclassing snippets](../snippets/subclassing-snippets.html) to add a new data type, and your module is named "stories", the menu name will be `aposStoriesMenu`.)

Conversely, if you choose to remove a module but haven't removed it from the admin bar, don't be surprised when you get a template error.

## Overriding the templates of a module

Most modules allow you to override their templates by following a simple pattern. Let's take the blog as an example.

First `npm install` and configure `apostrophe-blog`. Then create a `lib/modules/apostrophe-blog/views` folder in your project.

Copy any templates you wish to customize from the npm module's views folder to `lib/modules/apostrophe-blog/views` and start editing them.

Boom! Apostrophe will automatically look first at your "project level" module folder. Any files you don't have there will be found in the original module.

## Subclassing a module

You can override a module more than once, for instance to set up two things that are similar in spirit to a blog. Just create folders in `lib/modules`, with your `views` overrides, and configure them in `app.js` via the `modules` option as shown above. Then use the `extend` property to tell Apostrophe what module you're extending.

You'll want to set the `name` and `instance` options so the database can distinguish between your stories and regular blog posts:
```javascript
    stories: {
      extend: 'apostrophe-blog',
      name: 'stories',
      instance: 'story',
      addFields: [
        {
          name: 'storyteller',
          type: 'string'
        }
      ]
    }
```
Note that you will need to copy the `new`, `edit` and `manage` templates to your `views` folder and fix any references to `blog` and `blog-post` to refer to `stories` and `story`.

## Advanced subclassing

This is only the tip of the iceberg when it comes to what you can do by subclassing modules. The blog, events, and map modules, and others based on the snippets module, all offer extensive possibilities to override behavior and add fields in the database without reinventing the wheel. Even if you're not creating a distinct data type you can still add fields to blog posts, let's say, or the way the events module sorts events. For more information, check out [snippets](../snippets/index.html).

## Limitations of subclassing

Currently `extend` does not check `lib/modules`, so the module you are extending must be published in npm, not another module in your own project. Most of the time we extend modules like `apostrophe-blog` and `apostrophe-snippets` in simple project-specific ways, so this isn't much of a problem so far.
