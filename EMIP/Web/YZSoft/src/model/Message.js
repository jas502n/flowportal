Ext.define('YZSoft.src.model.Message', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'id',
        fields: [
            { name: 'id', type: 'int' },
            { name: 'uid', type: 'string' },
            { name: 'date', type: 'date' },
            { name: 'replyto', type: 'int' },
            { name: 'message', type: 'string' },
            { name: 'duration', type: 'int' },
            { name: 'UserDisplayName', type: 'string' },
            { name: 'headsort', convert: function (v, record) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: record.data.uid,
                    thumbnail: 'S'
                }));
            }
            }
        ]
    }
});
