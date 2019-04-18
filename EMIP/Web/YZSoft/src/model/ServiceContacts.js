Ext.define('YZSoft.src.model.ServiceContacts', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'ServiceCenter', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Tel', type: 'string' },
            { name: 'OrderIndex', type: 'int' }
        ]
    }
});