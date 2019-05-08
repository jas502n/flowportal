

Ext.define('YZSoft.newpost.Model', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'text',
        fields: [
            { name: 'text' },
            { name: 'children' },
        ]
    }
});
