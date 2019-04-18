

Ext.define('YZSoft.app.model.YZApp.AllAppInfo', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'GroupName',
        fields: [
            { name: 'GroupName' },
            { name: 'App' },
        ]
    }
});
