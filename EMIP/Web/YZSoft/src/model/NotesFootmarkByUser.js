Ext.define('YZSoft.src.model.NotesFootmarkByUser', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'Account',
        fields: [
            { name: 'Account', type: 'string' },
            { name: 'Name', type: 'string' },
            { name: 'Count', type: 'string' },
            { name: 'Items', type: 'object' },
            { name: 'headsort', convert: function (v, record) {
                return Ext.String.urlAppend(YZSoft.$url('YZSoft.Services.REST/Attachment/Download.ashx'), Ext.Object.toQueryString({
                    Method: 'GetHeadshot',
                    account: record.data.Account,
                    thumbnail: 'M'
                }));
            }}
        ]
    }
});