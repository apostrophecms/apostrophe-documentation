---
title: CSV Import
---

Apostrophe's [snippets](../tutorials/snippets/index.html) support import from spreadsheets in CSV format. This is very useful for kick-starting a project or adding many events at once, etc.

All snippet subclasses, like people, events, "classic" blog posts and custom subclasses you create in your project, support CSV import. You can find the feature on the dropdown menu for the type in question. All the user has to do is choose a file to upload, and the import takes place.

The only rule is that your column names in your file must match the column names in the schema: `title`, `tags`, `body`, etc.

For convenience, the import dialog will even tell you what column names you need.

Apostrophe is very tolerant regarding the column names and whitespace, capitalization and punctuation. A "close enough" match will work.

Tags must be separated by commas within that particular field (modern spreadsheets can escape commas properly when exporting CSV).

## Slideshows and FIles

Currently there is no support for connecting snippets to slideshows and files as part of a CSV import.

## Areas

If your spreadsheet contains a column name matching an area name, like `body`, it will be imported as an area with a single text item. In other words, you can import plain text into areas.

## One-to-One Joins

If your schema includes a [join](../tutorials/snippets/joins.html) with the `joinByOne` type, you can import it via a column with the *same name as the join* (not the `idField` option). The leading `_` is optional in the column name.

The value in that column should be the `title` property (i.e. the full name) of an object of the type you're joining with.

## Array Joins

If you are using the `joinByArray` type, you can import that too. Again, the column name matches the name of the join. The value of the field should be a comma-separated list of full names (`title` properties) of items to join with. *You must leave out any internal commas in those names.* They will still match without the commas.

## Joining by _id instead of title

You can, if you wish, provide a value matching the `_id` of the object you wish to join with. This may be useful if you are a developer and the `title` field is not unique enough for your needs.
