# `time`

`time` adds an editable time field to the schema. No special time picker is presented, however Apostrophe is very tolerant of different time formats users may enter, such as "6p" or "6:37pm" or "17:45".

Times are stored in "HH:MM:SS" format \(hours, minutes, seconds, 24 hour time\). However they are converted back to the local time format if edited again in the future.

The default "local" time format, displayed to the user when editing, is American-style 12 hour time. You may change this by configuring the `apostrophe-ui` module and setting the `userTimeFormat` option to a different [moment](https://npmjs.org/packages/moment) format string, however for the field to understand it when saved it must be standard 24-hour or 12-hour time separated by colons \(`:`\).

**If you do not set** `def: null` **or** `required: true`**, the time defaults to the current time.**

## Settings

|  Property | Type   | Default | Description | 
|---|---|---|---|
| name | `string` | | Sets the name of the field in the database |
| label | `string` | | Sets the label of the field that the user sees |
| userTimeFormat |  |  | Allows configuration of the time format |
