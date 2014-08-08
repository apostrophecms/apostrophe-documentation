---
title: "Beautiful URLs with Greedy Pages"
---

When you use the `apostrophe-fancy-page` module, you have the option of making your pages "greedy". Greedy pages can be used to make nice URLs with custom functionality, while avoiding things like URL query parameters.

For example, let's assume there's a page with the slug `/xyz`. If we access `/xyz/hello-world` and `/hello-world` is NOT a subpage of `/xyz`, we'll normally get a 404. If we set our module to `greedy: true` and write a `dispatch` method, the remaining portion of the slug (in this case, `/hello-world`) will be available in `req.remainder`. This is useful for allowing custom template rendering or database calls without relying on query parameters.

