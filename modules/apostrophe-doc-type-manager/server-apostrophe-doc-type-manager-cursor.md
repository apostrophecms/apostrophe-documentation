Cursor for fetching docs of this specific type. The `afterConstruct`
method locks the results down to this type by calling the
`self.type` filter for us. Subclasses frequently add new filters.


