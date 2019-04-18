Ext.define('YZSoft.src.model.OU', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'FullName',
        fields: [
            { name: 'Name', type: 'string' },
            { name: 'Code', type: 'string' },
            { name: 'FullName', type: 'string' },
            { name: 'Level', type: 'date' },
            { name: 'isLeaf', type: 'boolean' },
            { name: 'ExtAttrs', type: 'object' }
        ]
    }
});