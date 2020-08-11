# Data Available in Templates

Apostrophe makes different data available for you in templates depending on the context. Most of this is covered in other sections as well, but this page serves to collect that information in one place, as well as highlight options not covered elsewhere.

::: tip
Anything attached to the `req.data` object becomes visible as the `data` object in Nunjucks templates when rendering pages and other templates. Before a page is rendered, you can add properties onto `req.data` to make any new information that you need available in a template. The [`apostrophe-pages:beforeSend` promise event handler](/advanced-topics/promise-events/promise-events.md#apostrophe-pages-beforesend-req) is a good place to do this before the page is rendered.
:::

## `data.global`

`data.global` is available everywhere and always represents the same `apostrophe-global` document with the same information everywhere. Read more about this on the [global doc reference page](/core-concepts/global-settings/global.html#the-global-doc-sharing-content-across-pages).

## `data.page`

The `data.page` object is available in any template rendered in response to loading a page in Apostrophe. This includes [piece show page templates](/core-concepts/reusable-content-pieces/browsing-directory-of-pieces.md#creating-custom-templates-for-individual-people). It contains information about the current page's document (e.g., title, areas). There is a bit more to think about if you are using it on show page or widget templates, but most of the time you will probably be using this directly on a normal page or index page template.

In `show.html` templates it references the index page that the show "page" belongs to at a given URL (a piece's show page could be a child of different index pages based on the URL).

`data.page` may be available in widget templates if they are rendered as part of a page. However, as a rule, widgets should only rely on information passed to them as options or contained in the widget itself.

## `data.piece`

This is available in show page template for a piece as well as any widgets that belong to a piece document. Similar to `data.page`, it contains information about a piece and its properties.

## `data.widget`

Only available in a widget template! This object includes information about that widget and its properties. It's not its own document in the database, but is a small piece of a document.

## `data.user`

The currently active user. This is especially useful as a quick way to see if the active user is logged out (it will be `undefined`) or not.

## `data.query`

This is used less, but can be very useful. `data.query` contains the contents of `req.query`. So if someone reaches the page at a url with query parameters such as `https://example.com?color=blue`, `data.query` would be `{ color: 'blue' }` in that the page template.

## Other properties

Other useful properties that are usually or always present include:

- `data.url`: The current URL.
- `data.baseUrl`: The `baseUrl` set on the application. Usually the domain of the website.
- `data.home`: The home page document, typically with a populated `._children` property.
- `data.permissions`: This will be the contents of `req.user._permissions`, an object, with boolean properties for permissions (e.g., `admin: true` or simply `{}` if there is no user).
- `data.when`: The active "scene." In brief, this is a general context for a user, which is used primarily to identify [which front end assets should be served](/api/apostrophe-assets/#nunjucks-template-helpers).
- `data.refreshing`: `true` if an AJAX refresh of the main content area is taking place.
- `data.outerLayout`: This will be either `apostrophe-templates:outerLayout.html` (for normal page rendering) or `apostrophe-templates:refreshLayout.html` (when refreshing the main content area via AJAX).
