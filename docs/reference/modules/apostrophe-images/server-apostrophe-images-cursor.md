# apostrophe-images-cursor (server)

## Methods
### minSize(*value*)

### orientation(*value*)
Filter. Get images depending on the
orientation of their attachments. This orientation
is computed during import, comparing width and height.
Accessible programmatically using self.find(req).orientation('square')`.
Available options are: `landscape`, `portrait`, `square`.
### fileType(*value*)
Filter. Get images depending on their
type, the available images extensions come from
`self.fileGroups` in `apostrophe-attachments`.
Accessible programmatically using self.find(req).fileType('jpg')`.
Available options are: `jpg`, `png`, `gif` and `svg` if `svgImages` is enabled.
