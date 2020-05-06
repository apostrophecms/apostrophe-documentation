# `time`

`time` adds an editable time field to the schema. No special time picker is presented, however Apostrophe is very tolerant of different time formats users may enter, such as "6p" or "6:37pm" or "17:45".

Times are stored in 24 hour "HH:MM:SS" format.

The default "local" time format, displayed to the user when editing, is American-style 12 hour time. You may change this by configuring the [`apostrophe-ui`](/reference/modules/apostrophe-ui/README.md) module and setting the `userTimeFormat` option to a different [moment](https://npmjs.org/package/moment) format string.

::: warning NOTE
While "moment" supports many time formats, in Apostrophe you must use a standard 24-hour or 12-hour time separated by colons \(`:`\) for the field to be understood.
:::

## Settings

|  Property | Type   | Default | Description |
|---|---|---|---|
|name | `string` | | Sets the name of the field in the database |
|label | `string` | | Sets the label of the field that the user sees |
|required | `boolean` | false | If true, the field is mandatory |
|contextual | `boolean` | false | If true, it will prevent the field from appearing in a dialog box |
|type | `string` | | Specifies the field type |
|readOnly | `boolean` | false | If true, prevents the user from editing the field |
|help | `string` | | Help text for the field that will appear with the field's label |
|htmlHelp | `string` | | Help text with support for HTML markup |
|userTimeFormat |  |  | Allows configuration of the time format |
|def | | | Sets the default time that is displayed |

::: warning NOTE
If you do not set `def: null` or `required: true`, the time defaults to the current time.
:::