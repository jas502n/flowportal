Ext.define('YZSoft.src.model.Device', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'Account', type: 'string' },
            { name: 'UUID', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Disabled', type: 'boolean' },
            { name: 'LastLogin', type: 'date' }
        ]
    }
});