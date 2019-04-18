Ext.define('YZSoft.src.model.ImageAttachment', {
    extend: 'Ext.data.Model',
    config: {
        useCache:false,
        idProperty: 'FileID',
        fields: [
            { name: 'FileID', type: 'string' },
            { name: 'url', type: 'string' }
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
            Method: 'ImageStreamFromFileID',
            fileid: fileid,
            scale: 'Fit',
            width: 64,
            height: 64
        }));
    }
});