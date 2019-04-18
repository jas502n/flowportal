Ext.define('YZSoft.src.model.ProcessInfo', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'ProcessName',
        fields: [
            { name: 'ProcessName' },
            { name: 'value', mapping: 'ProcessName' },
            { name: 'ProcessVersion' },
            { name: 'Description' },
            { name: 'ShortName' },
            { name: 'Color' },
            { name: 'Favorited'}
        ]
    }
});