Ext.define('YZSoft.src.model.ScanQRCode', {
    extend: 'Ext.data.Model',
    config: {
        useCache:false,
        idProperty: 'FileID',
        fields: [
            { name: 'FileID', type: 'string' }
        ]
    }
});