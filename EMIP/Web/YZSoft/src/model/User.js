Ext.define('YZSoft.src.model.User', {
    extend: 'Ext.data.Model',
    config: {
        idProperty: 'Account',
        fields: [
            { name: 'Account', type: 'string' },
            { name: 'DisplayName', type: 'string' },
            { name: 'Description', type: 'string' },
            { name: 'Birthday', type: 'date' },
            { name: 'HRID', type: 'string' },
            { name: 'DateHired', type: 'date' },
            { name: 'Office', type: 'string' },
            { name: 'CostCenter', type: 'string' },
            { name: 'OfficePhone', type: 'string' },
            { name: 'HomePhone', type: 'string' },
            { name: 'Mobile', type: 'string' },
            { name: 'EMail', type: 'string' },
            { name: 'WWWHomePage', type: 'string' },
            { name: 'ExtAttributes', type: 'object' },
            { name: 'Name', type: 'string' },
            { name: 'ShortName', type: 'string' },
            { name: 'group', type: 'string' },
            { name: 'positions', type: 'object' },
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