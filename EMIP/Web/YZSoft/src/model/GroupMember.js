Ext.define('YZSoft.src.model.User', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'ItemID',
        fields: [
            { name: 'ItemID', type: 'int' },
            { name: 'GroupID', type: 'int' },
            { name: 'UID', type: 'string' },
            { name: 'Role', type: 'string' },
            { name: 'User', type: 'object' },
            { name: 'headsort', convert: function (v, record) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: record.data.User.Account,
                    thumbnail: 'M'
                }));
            }}
        ]
    }
});