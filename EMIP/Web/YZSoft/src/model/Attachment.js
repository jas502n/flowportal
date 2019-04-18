Ext.define('YZSoft.src.model.Attachment', {
    extend: 'Ext.data.Model',
    config: {
        useCache:false,
        idProperty: 'FileID',
        fields: [
            { name: 'FileID', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'Ext', type: 'string' },
            { name: 'Size', type: 'int' },
            { name: 'LastUpdate', type: 'date' },
            { name: 'OwnerAccount', type: 'string' },
            { name: 'MimeType', type: 'string' },
            { name: 'LParam1', type: 'int' },
            { name: 'newadded', type: 'boolean' }
        ]
    },

    constructor: function (config) {
        var me = this;

        if (!config.url)
            config.url = me.getUrl(config.FileID);

        me.callParent(arguments);
    },

    getUrl: function (fileid) {
        var record = this;

        return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
            Method: 'Download',
            fileid: fileid
        }));
    }
});