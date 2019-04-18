Ext.define('YZSoft.src.model.NotesBarcode', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'ItemID',
        fields: [
            { name: 'ItemID', type: 'int' },
            { name: 'Account', type: 'string' },
            { name: 'Barcode', type: 'string' },
            { name: 'Format', type: 'string' },
            { name: 'ProductName', type: 'string' },
            { name: 'Comments', type: 'string' },
            { name: 'CreateAt', type: 'date' }
        ]
    }
});