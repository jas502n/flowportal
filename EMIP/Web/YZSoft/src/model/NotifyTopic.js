Ext.define('YZSoft.src.model.NotifyTopic', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'string' },
            { name: 'resType', type: 'string' },
            { name: 'resId', type: 'string' },
            { name: 'newmessage', type: 'int' },
            { name: 'total', type: 'int' },
            { name: 'lastMsgId', type: 'int' },
            { name: 'uid', type: 'string' },
            { name: 'date', type: 'date' },
            { name: 'message', type: 'string' },
            { name: 'replyto', type: 'int' },
            { name: 'duration', type: 'int' },
            { name: 'resName', type: 'string' },
            { name: 'ext', type: 'object' },
            {
                name: 'headsort',
                convert: function (v, rec) {
                    return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                        Method: 'GetHeadshot',
                        account: rec.data.uid,
                        thumbnail: 'S'
                    }));
                }
            }
        ]
    }
});