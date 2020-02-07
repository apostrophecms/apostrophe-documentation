module.exports = {
    extend: 'apostrophe-pieces',
    name: 'foods',
    label: 'Food',
    pluralLabel: 'Food',
    addFields: [
    {
            name: 'title',
        label: 'Name',
        type: 'string',
        required: true
    },
    {
        name: 'price',
        label: 'Price',
        type: 'float',
        required: true
    },
    {
        name: 'image',
        label: 'Image',
        type: 'singleton',
        widgetType: 'apostrophe-images',
        options: {
        limit: 1,
        minSize: [ 200, 200 ],
        aspectRatio: [ 1, 1 ]
        }
    }
    ]
};
