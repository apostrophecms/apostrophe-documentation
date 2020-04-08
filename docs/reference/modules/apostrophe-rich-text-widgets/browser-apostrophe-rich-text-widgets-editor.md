
## Methods
### start()
Start contextual editing (on click for instance)
### stop()
End contextual editing (on blur for instance)
### setActive(*state*)
Trigger `aposRichTextActive` or `aposRichTextInactive`
on the widget's DOM element and set or clear the
`apos-active` CSS class. Reflects what has already happened
at the ckeditor level, called on blur and focus events.
Does not start and stop editing, not to be called directly.
### beforeCkeditorInline()
A convenient override point just before
`self.id` and `self.config` are passed to
`CKEDITOR.inline` to launch editing
