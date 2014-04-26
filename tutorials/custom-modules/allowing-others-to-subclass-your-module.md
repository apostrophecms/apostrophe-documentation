---
title: Allowing others to subclass your module
---

Some tips on writing modules that are friendly to subclassing:

* Don't cheat! [Follow the pattern.](a-simple-module.html) Your module must have a constructor, which should be attached to the function that your module exports as the `Construct` property.

* At the end of your constructor, always make sure `callback` exists before invoking it. When subclasses are present, they will pass you a null callback and invoke it themselves.

* Make sure you add defaults to the `options` object without crushing whatever is already there. Sometimes it's more appropriate to append.

