Ext.define('YZSoft.app.model.YZApp.AppInfo', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'AppName',
        fields: [
            { name: 'AppName' },
            { name: 'value', mapping: 'AppName' },
            { name: 'IconColor' },
            { name: 'IconSize' },
            { name: 'Icon' },
            { name: 'BADGE' },
            { name: 'Json' },
            { name: 'Type' },
              { name: 'AppUrl' }
        ]
    }
});